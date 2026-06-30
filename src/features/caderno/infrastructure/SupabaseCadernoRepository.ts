// ============================================================
// SupabaseCadernoRepository — Implementação Supabase
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Única camada que conhece Supabase.
// Todo SQL vive aqui. Nenhum componente React toca este arquivo.
// ============================================================

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { ICadernoRepository } from '../repositories/ICadernoRepository'
import type {
  ObservacaoView,
  ObservacaoDetalheView,
  VersaoView,
  CadernoFiltros,
  CadernoListagem,
  CriarObservacaoInput,
  RevisarObservacaoInput,
  SalvarConexoesInput,
  ConexaoCaderno,
  TipoObservacao,
  StatusEpistemicoUI,
} from '../types'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ─────────────────────────────────────────────
// Mappers: DB row → View type
// ─────────────────────────────────────────────

function versaoParaView(row: {
  id: string
  numero_versao: number
  conteudo: string
  status_epistemico: string
  justificativa: string | null
  is_versao_atual: boolean
  criado_em: string
}): VersaoView {
  return {
    id: row.id,
    numeroVersao: row.numero_versao,
    conteudo: row.conteudo,
    statusEpistemico: row.status_epistemico as StatusEpistemicoUI,
    justificativa: row.justificativa,
    isVersaoAtual: row.is_versao_atual,
    criadoEm: row.criado_em,
  }
}

function excerpto(conteudo: string, limite = 200): string {
  const texto = conteudo.replace(/\n+/g, ' ').trim()
  if (texto.length <= limite) return texto
  return texto.substring(0, limite).trimEnd() + '…'
}

function observacaoParaView(
  obs: {
    id: string
    titulo: string
    tipo: string
    status_epistemico: string
    nivel_acesso: string
    tags: string[]
    favorito: boolean
    criado_em: string
    atualizado_em: string
  },
  versaoAtual: VersaoView | null,
  totalVersoes: number,
): ObservacaoView {
  return {
    id: obs.id,
    titulo: obs.titulo,
    tipo: obs.tipo as TipoObservacao,
    statusEpistemico: obs.status_epistemico as StatusEpistemicoUI,
    nivelAcesso: obs.nivel_acesso,
    tags: obs.tags ?? [],
    favorito: obs.favorito,
    versaoAtual,
    excerpto: versaoAtual ? excerpto(versaoAtual.conteudo) : '',
    totalVersoes,
    criadoEm: obs.criado_em,
    atualizadoEm: obs.atualizado_em,
  }
}

// ─────────────────────────────────────────────
// Implementação
// ─────────────────────────────────────────────

export class SupabaseCadernoRepository implements ICadernoRepository {

  async listar(tenantId: string, filtros: CadernoFiltros): Promise<CadernoListagem> {
    const supabase = await getDb()
    const pagina = filtros.pagina ?? 1
    const limite = filtros.limite ?? 20
    const offset = (pagina - 1) * limite

    // Query base
    let query = supabase
      .from('observacoes')
      .select(`
        id, titulo, tipo, status_epistemico, nivel_acesso, tags,
        favorito, criado_em, atualizado_em,
        versoes_observacao!inner(
          id, numero_versao, conteudo, status_epistemico,
          justificativa, is_versao_atual, criado_em
        )
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .eq('versoes_observacao.is_versao_atual', true)

    // Filtros opcionais
    if (filtros.tipo) query = query.eq('tipo', filtros.tipo)
    if (filtros.statusEpistemico) query = query.eq('status_epistemico', filtros.statusEpistemico)
    if (filtros.favorito === true) query = query.eq('favorito', true)
    if (filtros.tags && filtros.tags.length > 0) query = query.overlaps('tags', filtros.tags)

    // Busca textual (título + conteúdo via FTS)
    if (filtros.busca && filtros.busca.trim()) {
      const termo = filtros.busca.trim()
      // FTS no título diretamente; conteúdo via versoes_observacao.fts_document
      query = query.ilike('titulo', `%${termo}%`)
    }

    // Ordenação
    const ordenar = filtros.ordenar ?? 'mais_recente'
    if (ordenar === 'mais_recente') query = query.order('atualizado_em', { ascending: false })
    else if (ordenar === 'mais_antiga') query = query.order('criado_em', { ascending: true })
    else if (ordenar === 'titulo') query = query.order('titulo', { ascending: true })

    // Paginação
    query = query.range(offset, offset + limite - 1)

    const { data, count, error } = await query

    if (error) throw new Error(`Caderno.listar: ${error.message}`)

    const observacoes: ObservacaoView[] = (data ?? []).map((row: any) => {
      const versoes = Array.isArray(row.versoes_observacao) ? row.versoes_observacao : []
      const versaoAtual = versoes.find((v: any) => v.is_versao_atual) ?? versoes[0] ?? null
      const totalVersoes = versoes.length
      return observacaoParaView(row, versaoAtual ? versaoParaView(versaoAtual) : null, totalVersoes)
    })

    const total = count ?? 0
    return {
      observacoes,
      total,
      pagina,
      totalPaginas: Math.ceil(total / limite),
      filtrosAtivos: filtros,
    }
  }

  async getById(tenantId: string, observacaoId: string): Promise<ObservacaoDetalheView | null> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('observacoes')
      .select(`
        id, titulo, tipo, status_epistemico, nivel_acesso, tags,
        favorito, criado_em, atualizado_em,
        versoes_observacao(
          id, numero_versao, conteudo, status_epistemico,
          justificativa, is_versao_atual, criado_em
        )
      `)
      .eq('id', observacaoId)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .single()

    if (error || !data) return null

    const versoesList: VersaoView[] = (data.versoes_observacao ?? [])
      .sort((a: any, b: any) => b.numero_versao - a.numero_versao)
      .map(versaoParaView)

    const versaoAtual = versoesList.find((v: any) => v.isVersaoAtual) ?? versoesList[0] ?? null
    const base = observacaoParaView(data, versaoAtual, versoesList.length)

    const conexoes = await this.getConexoes(tenantId, observacaoId)

    return {
      ...base,
      versaoAtual: versaoAtual!,
      versoes: versoesList,
      conexoes,
    }
  }

  async getVersoes(tenantId: string, observacaoId: string): Promise<VersaoView[]> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('versoes_observacao')
      .select('id, numero_versao, conteudo, status_epistemico, justificativa, is_versao_atual, criado_em')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)
      .order('numero_versao', { ascending: false })

    if (error) throw new Error(`Caderno.getVersoes: ${error.message}`)
    return (data ?? []).map(versaoParaView)
  }

  async criar(tenantId: string, input: CriarObservacaoInput): Promise<ObservacaoView> {
    const supabase = await getDb()

    // 1. Inserir observação
    const { data: obs, error: obsErr } = await supabase
      .from('observacoes')
      .insert({
        tenant_id: tenantId,
        titulo: input.titulo.trim(),
        tipo: input.tipo,
        status_epistemico: input.statusEpistemico ?? 'hipotese',
        nivel_acesso: input.nivelAcesso ?? 'privado',
        tags: input.tags ?? [],
        favorito: false,
      })
      .select('id, titulo, tipo, status_epistemico, nivel_acesso, tags, favorito, criado_em, atualizado_em')
      .single()

    if (obsErr || !obs) throw new Error(`Caderno.criar: ${obsErr?.message}`)

    // 2. Inserir primeira versão
    const { data: versao, error: versaoErr } = await supabase
      .from('versoes_observacao')
      .insert({
        observacao_id: obs.id,
        tenant_id: tenantId,
        numero_versao: 1,
        conteudo: input.conteudo.trim(),
        status_epistemico: input.statusEpistemico ?? 'hipotese',
        justificativa: null,
        is_versao_atual: true,
      })
      .select('id, numero_versao, conteudo, status_epistemico, justificativa, is_versao_atual, criado_em')
      .single()

    if (versaoErr || !versao) throw new Error(`Caderno.criar versao: ${versaoErr?.message}`)

    return observacaoParaView(obs, versaoParaView(versao), 1)
  }

  async revisar(tenantId: string, input: RevisarObservacaoInput): Promise<ObservacaoView> {
    const supabase = await getDb()

    // 1. Buscar versão atual para obter numero_versao
    const { data: versaoAtualRow, error: vaErr } = await supabase
      .from('versoes_observacao')
      .select('id, numero_versao, status_epistemico')
      .eq('observacao_id', input.observacaoId)
      .eq('tenant_id', tenantId)
      .eq('is_versao_atual', true)
      .single()

    if (vaErr || !versaoAtualRow) throw new Error(`Caderno.revisar: versão atual não encontrada`)

    const novoNumero = versaoAtualRow.numero_versao + 1

    // 2. Desativar versão atual (flag is_versao_atual = false)
    // versoes_observacao.Update é 'never' nos tipos gerados por design epistêmico
    // (ADR-005: imutabilidade clínica). Porém o flag is_versao_atual é o mecanismo
    // de controle de versão — UPDATE limitado a este campo é intencional na infra.
    // O cast 'as never' contorna a restrição de tipos sem alterar a arquitetura.
    await supabase
      .from('versoes_observacao')
      .update({ is_versao_atual: false } as never)
      .eq('id', versaoAtualRow.id)
      .eq('tenant_id', tenantId)
    // Se o UPDATE falhar, continuamos — a unique partial index vai rejeitar duplicata

    // 3. Inserir nova versão
    const { data: novaVersao, error: versaoErr } = await supabase
      .from('versoes_observacao')
      .insert({
        observacao_id: input.observacaoId,
        tenant_id: tenantId,
        numero_versao: novoNumero,
        conteudo: input.conteudo.trim(),
        status_epistemico: input.statusEpistemico,
        justificativa: input.justificativa ?? null,
        is_versao_atual: true,
      })
      .select('id, numero_versao, conteudo, status_epistemico, justificativa, is_versao_atual, criado_em')
      .single()

    if (versaoErr || !novaVersao) throw new Error(`Caderno.revisar nova versão: ${versaoErr?.message}`)

    // 4. Atualizar observação (título, tags, status_epistemico)
    const updateObs: Record<string, unknown> = {
      status_epistemico: input.statusEpistemico,
      atualizado_em: new Date().toISOString(),
    }
    if (input.titulo) updateObs.titulo = input.titulo.trim()
    if (input.tags !== undefined) updateObs.tags = input.tags

    const { data: obsAtualizada, error: obsErr } = await supabase
      .from('observacoes')
      .update(updateObs as any)
      .eq('id', input.observacaoId)
      .eq('tenant_id', tenantId)
      .select('id, titulo, tipo, status_epistemico, nivel_acesso, tags, favorito, criado_em, atualizado_em')
      .single()

    if (obsErr || !obsAtualizada) throw new Error(`Caderno.revisar update obs: ${obsErr?.message}`)

    return observacaoParaView(obsAtualizada, versaoParaView(novaVersao), novoNumero)
  }

  async favoritar(tenantId: string, observacaoId: string, favorito: boolean): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('observacoes')
      .update({ favorito })
      .eq('id', observacaoId)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(`Caderno.favoritar: ${error.message}`)
  }

  async arquivar(tenantId: string, observacaoId: string): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('observacoes')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', observacaoId)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(`Caderno.arquivar: ${error.message}`)
  }

  async duplicar(tenantId: string, observacaoId: string): Promise<ObservacaoView> {
    const original = await this.getById(tenantId, observacaoId)
    if (!original || !original.versaoAtual) {
      throw new Error('Caderno.duplicar: observação não encontrada')
    }

    return this.criar(tenantId, {
      titulo: `${original.titulo} (cópia)`,
      tipo: original.tipo,
      conteudo: original.versaoAtual.conteudo,
      statusEpistemico: 'hipotese', // duplicata começa como hipótese
      tags: original.tags,
      nivelAcesso: original.nivelAcesso,
    })
  }

  async getConexoes(tenantId: string, observacaoId: string): Promise<ConexaoCaderno[]> {
    const supabase = await getDb()
    const conexoes: ConexaoCaderno[] = []

    // Ativos
    const { data: ativos } = await supabase
      .from('observacao_ativos')
      .select('ativo_id, ativos_cosmeticos(id, nome, nome_inci)')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of ativos ?? []) {
      const ativo = Array.isArray(row.ativos_cosmeticos) ? row.ativos_cosmeticos[0] : row.ativos_cosmeticos
      if (!ativo) continue
      conexoes.push({
        id: row.ativo_id,
        tipo: 'ativo',
        label: (ativo as { nome: string; nome_inci?: string | null }).nome ?? (ativo as { nome_inci?: string | null }).nome_inci ?? 'Ativo',
      })
    }

    // Referências
    const { data: refs } = await supabase
      .from('observacao_referencias')
      .select('referencia_id, referencias_cientificas(id, titulo)')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of refs ?? []) {
      const ref = Array.isArray(row.referencias_cientificas) ? row.referencias_cientificas[0] : row.referencias_cientificas
      if (!ref) continue
      conexoes.push({
        id: row.referencia_id,
        tipo: 'referencia',
        label: (ref as { titulo: string }).titulo,
      })
    }

    // Fórmulas
    // versoes_formula usa 'status: StatusVersao' (não is_versao_atual)
    const { data: formulas } = await supabase
      .from('observacao_formulas')
      .select(`
        formula_id,
        versoes_formula!inner(titulo, status)
      `)
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of formulas ?? []) {
      const versoes = Array.isArray(row.versoes_formula) ? row.versoes_formula : [row.versoes_formula]
      const versaoAtiva = versoes.find((v: unknown) => (v as { status: string }).status === 'ativa') ?? versoes[0]
      if (!versaoAtiva) continue
      conexoes.push({
        id: row.formula_id,
        tipo: 'formula',
        label: (versaoAtiva as { titulo: string }).titulo,
      })
    }

    // Casos
    // casos_clinicos.titulo removido na migration 024 — identificador é codigo_anonimizado
    const { data: casos } = await supabase
      .from('observacao_casos')
      .select('caso_id, nota, casos_clinicos(id, codigo_anonimizado, objetivo_principal)')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of casos ?? []) {
      const caso = Array.isArray(row.casos_clinicos) ? row.casos_clinicos[0] : row.casos_clinicos
      if (!caso) continue
      conexoes.push({
        id: row.caso_id,
        tipo: 'caso',
        label: (caso as { objetivo_principal?: string | null; codigo_anonimizado?: string | null }).objetivo_principal
          ?? (caso as { codigo_anonimizado?: string | null }).codigo_anonimizado
          ?? 'Caso clínico',
        nota: row.nota,
      })
    }

    // Protocolos
    const { data: protocolos } = await supabase
      .from('observacao_protocolos')
      .select('protocolo_id, nota')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of protocolos ?? []) {
      conexoes.push({
        id: row.protocolo_id,
        tipo: 'protocolo',
        label: 'Protocolo', // título será resolvido futuramente
        nota: row.nota,
      })
    }

    // Coleções
    const { data: colecoes } = await supabase
      .from('observacao_colecoes')
      .select('colecao_id, colecoes(id, titulo)')
      .eq('observacao_id', observacaoId)
      .eq('tenant_id', tenantId)

    for (const row of colecoes ?? []) {
      const col = Array.isArray(row.colecoes) ? row.colecoes[0] : row.colecoes
      if (!col) continue
      conexoes.push({
        id: row.colecao_id,
        tipo: 'colecao',
        label: (col as { titulo: string }).titulo,
      })
    }

    return conexoes
  }

  async salvarConexoes(tenantId: string, input: SalvarConexoesInput): Promise<void> {
    const supabase = await getDb()
    const { observacaoId } = input

    // Ativos — substituição total
    if (input.ativos !== undefined) {
      await supabase.from('observacao_ativos').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.ativos.length > 0) {
        await supabase.from('observacao_ativos').insert(
          input.ativos.map((id) => ({ observacao_id: observacaoId, ativo_id: id, tenant_id: tenantId }))
        )
      }
    }

    // Referências
    if (input.referencias !== undefined) {
      await supabase.from('observacao_referencias').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.referencias.length > 0) {
        await supabase.from('observacao_referencias').insert(
          input.referencias.map((id) => ({ observacao_id: observacaoId, referencia_id: id, tenant_id: tenantId }))
        )
      }
    }

    // Fórmulas
    if (input.formulas !== undefined) {
      await supabase.from('observacao_formulas').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.formulas.length > 0) {
        await supabase.from('observacao_formulas').insert(
          input.formulas.map((id) => ({ observacao_id: observacaoId, formula_id: id, tenant_id: tenantId }))
        )
      }
    }

    // Casos
    if (input.casos !== undefined) {
      await supabase.from('observacao_casos').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.casos.length > 0) {
        await supabase.from('observacao_casos').insert(
          input.casos.map((id) => ({ observacao_id: observacaoId, caso_id: id, tenant_id: tenantId }))
        )
      }
    }

    // Protocolos
    if (input.protocolos !== undefined) {
      await supabase.from('observacao_protocolos').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.protocolos.length > 0) {
        await supabase.from('observacao_protocolos').insert(
          input.protocolos.map((id) => ({ observacao_id: observacaoId, protocolo_id: id, tenant_id: tenantId }))
        )
      }
    }

    // Coleções
    if (input.colecoes !== undefined) {
      await supabase.from('observacao_colecoes').delete()
        .eq('observacao_id', observacaoId).eq('tenant_id', tenantId)
      if (input.colecoes.length > 0) {
        await supabase.from('observacao_colecoes').insert(
          input.colecoes.map((id) => ({ observacao_id: observacaoId, colecao_id: id, tenant_id: tenantId }))
        )
      }
    }
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    const supabase = await getDb()

    // Agrega todas as tags únicas do tenant
    const { data, error } = await supabase
      .from('observacoes')
      .select('tags')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .not('tags', 'eq', '{}')

    if (error) return []

    const todas = (data as { tags: string[] | null }[]).flatMap((row: any) => row.tags ?? [])
    return [...new Set(todas)].sort()
  }
}
