// ============================================================
// SupabaseProtocoloRepository — Implementação Supabase
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// import 'server-only' garante que este módulo nunca chegue ao cliente.
// Todo SQL da feature Protocolos vive SOMENTE aqui.
// ============================================================

import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { IProtocoloRepository } from './IProtocoloRepository'
import type {
  ProtocoloView,
  ProtocoloDetalheView,
  VersaoProtocoloView,
  FaseProtocoloView,
  ConexaoProtocolo,
  ProtocoloFiltros,
  CriarProtocoloInput,
  NovaVersaoProtocoloInput,
  SalvarConexoesProtocoloInput,
  MaturidadeProtocolo,
} from '../types'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ─────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────

function mapFase(f: any): FaseProtocoloView {
  return {
    id: f.id,
    versaoProtocoloId: f.versao_protocolo_id,
    nome: f.nome,
    descricao: f.descricao ?? null,
    duracaoSemanas: f.duracao_semanas ?? null,
    ordem: f.ordem ?? 0,
    instrucoes: f.instrucoes ?? null,
    formulasIndicadas: f.formulas_indicadas ?? [],
  }
}

function mapVersao(v: any, fases: FaseProtocoloView[] = []): VersaoProtocoloView {
  return {
    id: v.id,
    protocoloId: v.protocolo_id,
    numeroVersao: v.numero_versao,
    titulo: v.titulo,
    objetivo: v.objetivo ?? null,
    descricao: v.descricao ?? null,
    indicacoes: v.indicacoes ?? null,
    contraindicacoes: v.contraindicacoes ?? null,
    maturidade: (v.maturidade as MaturidadeProtocolo) ?? 'hipotese',
    duracaoSemanas: v.duracao_semanas ?? null,
    frequenciaSessoes: v.frequencia_sessoes ?? null,
    observacoesImportantes: v.observacoes_importantes ?? null,
    autor: v.autor ?? null,
    motivoAlteracao: v.motivo_alteracao ?? null,
    status: v.status,
    criadoEm: new Date(v.criado_em),
    fases,
  }
}

function mapProtocoloView(p: any, v: any): ProtocoloView {
  return {
    id: p.id,
    tenantId: p.tenant_id,
    codigoInterno: p.codigo_interno ?? null,
    titulo: v?.titulo ?? '(sem título)',
    objetivo: v?.objetivo ?? null,
    indicacoes: v?.indicacoes ?? null,
    maturidade: (p.maturidade as MaturidadeProtocolo) ?? 'hipotese',
    tags: p.tags ?? [],
    favorito: p.favorito ?? false,
    totalVersoes: 0,
    totalCasos: 0,
    totalConexoes: 0,
    criadoEm: new Date(p.criado_em),
    atualizadoEm: new Date(p.atualizado_em),
  }
}

// ─────────────────────────────────────────────
// Implementação
// ─────────────────────────────────────────────

export class SupabaseProtocoloRepository implements IProtocoloRepository {

  // ── Listagem ──────────────────────────────

  async listar(tenantId: string, filtros: Partial<ProtocoloFiltros> = {}): Promise<ProtocoloView[]> {
    const supabase = await getDb()
    const limite = filtros.limite ?? 20
    const offset = filtros.offset ?? 0

    // Estratégia: começar pela versão ativa e trazer o protocolo pai
    let query = supabase
      .from('versoes_protocolo')
      .select(`
        id,
        protocolo_id,
        titulo,
        objetivo,
        indicacoes,
        maturidade,
        status,
        criado_em,
        protocolos!inner(
          id,
          tenant_id,
          codigo_interno,
          tags,
          favorito,
          maturidade,
          criado_em,
          atualizado_em,
          archived_at
        )
      `)
      .eq('tenant_id', tenantId)
      .eq('status', 'ativa')
      .is('protocolos.archived_at', null)
      .range(offset, offset + limite - 1)

    if (filtros.busca) {
      const t = `%${filtros.busca}%`
      query = query.or(`titulo.ilike.${t},objetivo.ilike.${t},indicacoes.ilike.${t}`)
    }
    if (filtros.maturidade) {
      query = query.eq('protocolos.maturidade', filtros.maturidade)
    }
    if (filtros.favorito) {
      query = query.eq('protocolos.favorito', true)
    }

    switch (filtros.ordenar) {
      case 'antigo':    query = query.order('protocolos.criado_em', { ascending: true }); break
      case 'titulo':    query = query.order('titulo', { ascending: true }); break
      case 'maturidade': query = query.order('maturidade', { ascending: false }); break
      default:          query = query.order('protocolos.atualizado_em', { ascending: false }); break
    }

    const { data, error } = await query
    if (error) throw error

    return (data ?? []).map((row: any) => mapProtocoloView(row.protocolos, row))
  }

  // ── Detalhe ───────────────────────────────

  async getById(tenantId: string, protocoloId: string): Promise<ProtocoloDetalheView | null> {
    const supabase = await getDb()

    // 1. Protocolo pai
    const { data: proto, error: protoErr } = await supabase
      .from('protocolos')
      .select('*')
      .eq('id', protocoloId)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .single()

    if (protoErr || !proto) return null

    // 2. Todas as versões (histório completo) ordenadas por numero_versao ASC
    const { data: versoes, error: versErr } = await supabase
      .from('versoes_protocolo')
      .select('*')
      .eq('protocolo_id', protocoloId)
      .eq('tenant_id', tenantId)
      .order('numero_versao', { ascending: true })

    if (versErr) throw versErr

    const versoesList: any[] = versoes ?? []

    // 3. Fases da versão ativa
    const versaoAtiva = versoesList.find((v: any) => v.status === 'ativa')
    let fasesAtivas: FaseProtocoloView[] = []

    if (versaoAtiva) {
      const { data: fases, error: fasesErr } = await supabase
        .from('fases_protocolo')
        .select('*')
        .eq('versao_protocolo_id', versaoAtiva.id)
        .eq('tenant_id', tenantId)
        .order('ordem', { ascending: true })

      if (fasesErr) throw fasesErr
      fasesAtivas = (fases ?? []).map(mapFase)
    }

    // 4. Conexões
    const conexoes = await this.getConexoes(tenantId, protocoloId, versoesList.map((v: any) => v.id))

    // 5. Mapear versões (somente versão ativa recebe fases; histórico sem fases por performance)
    const versoesView: VersaoProtocoloView[] = versoesList.map((v: any) =>
      v.id === versaoAtiva?.id
        ? mapVersao(v, fasesAtivas)
        : mapVersao(v, [])
    )

    const versaoAtivaView = versoesView.find((v: any) => v.status === 'ativa')
    const historicoView = versoesView.filter((v: any) => v.status !== 'ativa')

    if (!versaoAtivaView) return null

    const base = mapProtocoloView(proto, versaoAtiva)
    return {
      ...base,
      totalVersoes: versoesView.length,
      totalCasos: conexoes.filter((c: any) => c.tipo === 'caso').length,
      totalConexoes: conexoes.length,
      versaoAtiva: versaoAtivaView,
      historicoVersoes: historicoView,
      conexoes,
    }
  }

  // ── Conexões ──────────────────────────────

  async getConexoes(
    tenantId: string,
    protocoloId: string,
    versaoIds: string[] = [],
  ): Promise<ConexaoProtocolo[]> {
    const supabase = await getDb()
    const conexoes: ConexaoProtocolo[] = []

    // Referências (via referencia_protocolos — migration 022)
    const { data: refs } = await supabase
      .from('referencia_protocolos')
      .select('referencia_id, referencias_cientificas(titulo)')
      .eq('protocolo_id', protocoloId)
      .eq('tenant_id', tenantId)
    ;(refs ?? []).forEach((r: any) => {
      if (r.referencias_cientificas?.titulo) {
        conexoes.push({
          tipo: 'referencia',
          id: r.referencia_id,
          titulo: r.referencias_cientificas.titulo,
          href: `/acervo/${r.referencia_id}`,
        })
      }
    })

    // Observações (via observacao_protocolos — migration 021)
    const { data: obs } = await supabase
      .from('observacao_protocolos')
      .select('observacao_id, observacoes(titulo)')
      .eq('protocolo_id', protocoloId)
    ;(obs ?? []).forEach((o: any) => {
      if (o.observacoes?.titulo) {
        conexoes.push({
          tipo: 'observacao',
          id: o.observacao_id,
          titulo: o.observacoes.titulo,
          href: `/caderno/${o.observacao_id}`,
        })
      }
    })

    // Ativos (via protocolo_ativos — migration 023)
    const { data: ativos } = await supabase
      .from('protocolo_ativos')
      .select('ativo_id, funcao, ativos_cosmeticos(nome)')
      .eq('protocolo_id', protocoloId)
      .eq('tenant_id', tenantId)
    ;(ativos ?? []).forEach((a: any) => {
      if (a.ativos_cosmeticos?.nome) {
        conexoes.push({
          tipo: 'ativo',
          id: a.ativo_id,
          titulo: a.ativos_cosmeticos.nome,
          subtitulo: a.funcao ?? undefined,
          href: `/ativos/${a.ativo_id}`,
        })
      }
    })

    // Casos Clínicos (via casos_clinicos.versao_protocolo_id)
    if (versaoIds.length > 0) {
      const { data: casos } = await supabase
        .from('casos_clinicos')
        .select('id, codigo_anonimizado')
        .in('versao_protocolo_id', versaoIds)
        .eq('tenant_id', tenantId)
      ;(casos ?? []).forEach((c: any) => {
        conexoes.push({
          tipo: 'caso',
          id: c.id,
          titulo: c.codigo_anonimizado ?? 'Caso clínico',
          href: `/casos/${c.id}`,
        })
      })
    }

    // Fórmulas (via fases_protocolo.formulas_indicadas — arrays de versoes_formula.id)
    if (versaoIds.length > 0) {
      const { data: fases } = await supabase
        .from('fases_protocolo')
        .select('formulas_indicadas')
        .in('versao_protocolo_id', versaoIds)

      const formulaIds = [...new Set(
        (fases ?? []).flatMap((f: any) => f.formulas_indicadas ?? [])
      )] as string[]

      if (formulaIds.length > 0) {
        const { data: vfs } = await supabase
          .from('versoes_formula')
          .select('id, titulo, formula_id')
          .in('id', formulaIds)
        ;(vfs ?? []).forEach((vf: any) => {
          conexoes.push({
            tipo: 'formula',
            id: vf.formula_id,
            titulo: vf.titulo,
            href: `/formulas/${vf.formula_id}`,
          })
        })
      }
    }

    return conexoes
  }

  // ── Criação ───────────────────────────────

  async criar(
    tenantId: string,
    userId: string,
    input: CriarProtocoloInput,
  ): Promise<{ protocoloId: string }> {
    const supabase = await getDb()

    // 1. Protocolo pai
    const { data: proto, error: protoErr } = await supabase
      .from('protocolos')
      .insert({
        tenant_id: tenantId,
        codigo_interno: input.codigoInterno?.trim() || null,
        nivel_acesso: 'privado',
        tags: input.tags ?? [],
        favorito: false,
        maturidade: input.maturidade,
        metadados: {},
      })
      .select('id')
      .single()

    if (protoErr || !proto) throw protoErr ?? new Error('Falha ao criar protocolo')

    // 2. Versão 1 (ativa)
    const { data: versao, error: versErr } = await supabase
      .from('versoes_protocolo')
      .insert({
        protocolo_id: proto.id,
        tenant_id: tenantId,
        numero_versao: 1,
        titulo: input.titulo.trim(),
        objetivo: input.objetivo?.trim() || null,
        descricao: input.descricao?.trim() || null,
        indicacoes: input.indicacoes?.trim() || null,
        contraindicacoes: input.contraindicacoes?.trim() || null,
        maturidade: input.maturidade,
        duracao_semanas: input.duracaoSemanas ?? null,
        frequencia_sessoes: input.frequenciaSessoes?.trim() || null,
        observacoes_importantes: input.observacoesImportantes?.trim() || null,
        autor: input.autor?.trim() || null,
        motivo_alteracao: null,
        status: 'ativa',
      })
      .select('id')
      .single()

    if (versErr || !versao) throw versErr ?? new Error('Falha ao criar versão do protocolo')

    // 3. Fases (se houver)
    if (input.fases && input.fases.length > 0) {
      const fasesPayload = input.fases.map((f: any, idx: number) => ({
        versao_protocolo_id: versao.id,
        tenant_id: tenantId,
        nome: f.nome.trim(),
        descricao: f.descricao?.trim() || null,
        instrucoes: f.instrucoes?.trim() || null,
        duracao_semanas: f.duracaoSemanas ?? null,
        ordem: f.ordem ?? idx,
        formulas_indicadas: f.formulasIndicadas ?? [],
        metadados: {},
      }))

      const { error: fasesErr } = await supabase.from('fases_protocolo').insert(fasesPayload)
      if (fasesErr) throw fasesErr
    }

    return { protocoloId: proto.id }
  }

  // ── Nova Versão ───────────────────────────

  async criarVersao(
    tenantId: string,
    userId: string,
    input: NovaVersaoProtocoloInput,
  ): Promise<{ versaoId: string }> {
    const supabase = await getDb()

    // 1. Buscar versão ativa atual para obter o número
    const { data: versaoAtual, error: vaErr } = await supabase
      .from('versoes_protocolo')
      .select('id, numero_versao')
      .eq('protocolo_id', input.protocoloId)
      .eq('tenant_id', tenantId)
      .eq('status', 'ativa')
      .maybeSingle()

    if (vaErr) throw vaErr

    const proximoNumero = (versaoAtual?.numero_versao ?? 0) + 1

    // 2. Arquivar versão ativa anterior
    if (versaoAtual) {
      const { error: subErr } = await supabase
        .from('versoes_protocolo')
        .update({ status: 'substituida' })
        .eq('id', versaoAtual.id)
        .eq('tenant_id', tenantId)

      if (subErr) throw subErr
    }

    // 3. Criar nova versão ativa
    const { data: novaVersao, error: nvErr } = await supabase
      .from('versoes_protocolo')
      .insert({
        protocolo_id: input.protocoloId,
        tenant_id: tenantId,
        numero_versao: proximoNumero,
        titulo: input.titulo.trim(),
        objetivo: input.objetivo?.trim() || null,
        descricao: input.descricao?.trim() || null,
        indicacoes: input.indicacoes?.trim() || null,
        contraindicacoes: input.contraindicacoes?.trim() || null,
        maturidade: input.maturidade,
        duracao_semanas: input.duracaoSemanas ?? null,
        frequencia_sessoes: input.frequenciaSessoes?.trim() || null,
        observacoes_importantes: input.observacoesImportantes?.trim() || null,
        autor: input.autor?.trim() || null,
        motivo_alteracao: input.motivoAlteracao.trim(),
        status: 'ativa',
      })
      .select('id')
      .single()

    if (nvErr || !novaVersao) throw nvErr ?? new Error('Falha ao criar nova versão')

    // 4. Fases da nova versão
    if (input.fases && input.fases.length > 0) {
      const fasesPayload = input.fases.map((f: any, idx: number) => ({
        versao_protocolo_id: novaVersao.id,
        tenant_id: tenantId,
        nome: f.nome.trim(),
        descricao: f.descricao?.trim() || null,
        instrucoes: f.instrucoes?.trim() || null,
        duracao_semanas: f.duracaoSemanas ?? null,
        ordem: f.ordem ?? idx,
        formulas_indicadas: f.formulasIndicadas ?? [],
        metadados: {},
      }))

      const { error: fasesErr } = await supabase.from('fases_protocolo').insert(fasesPayload)
      if (fasesErr) throw fasesErr
    }

    // 5. Atualizar maturidade desnormalizada no pai
    const { error: patchErr } = await supabase
      .from('protocolos')
      .update({
        maturidade: input.maturidade,
        atualizado_em: new Date().toISOString(),
      })
      .eq('id', input.protocoloId)
      .eq('tenant_id', tenantId)

    if (patchErr) throw patchErr

    return { versaoId: novaVersao.id }
  }

  // ── Favoritar / Arquivar ──────────────────

  async favoritar(tenantId: string, protocoloId: string, favorito: boolean): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('protocolos')
      .update({ favorito, atualizado_em: new Date().toISOString() })
      .eq('id', protocoloId)
      .eq('tenant_id', tenantId)

    if (error) throw error
  }

  async arquivar(tenantId: string, protocoloId: string): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('protocolos')
      .update({ archived_at: new Date().toISOString(), atualizado_em: new Date().toISOString() })
      .eq('id', protocoloId)
      .eq('tenant_id', tenantId)

    if (error) throw error
  }

  // ── Conexões (salvar) ─────────────────────

  async salvarConexoes(tenantId: string, input: SalvarConexoesProtocoloInput): Promise<void> {
    const supabase = await getDb()
    const pid = input.protocoloId

    // Ativos
    if (input.ativoIds !== undefined) {
      await supabase.from('protocolo_ativos').delete()
        .eq('protocolo_id', pid).eq('tenant_id', tenantId)
      if (input.ativoIds.length > 0) {
        await supabase.from('protocolo_ativos').insert(
          input.ativoIds.map((aId) => ({ protocolo_id: pid, ativo_id: aId, tenant_id: tenantId }))
        )
      }
    }

    // Tags (salvas no pai)
    if (input.tags !== undefined) {
      await supabase
        .from('protocolos')
        .update({ tags: input.tags, atualizado_em: new Date().toISOString() })
        .eq('id', pid)
        .eq('tenant_id', tenantId)
    }
  }

  // ── Tags do Tenant ────────────────────────

  async getTagsTenant(tenantId: string): Promise<string[]> {
    const supabase = await getDb()
    const { data, error } = await supabase
      .from('protocolos')
      .select('tags')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    if (error || !data) return []
    const todas = (data as { tags: string[] }[]).flatMap((p: any) => p.tags ?? [])
    return [...new Set(todas)].sort()
  }
}

// Singleton — seguro pois o módulo é server-only
export const supabaseProtocoloRepository = new SupabaseProtocoloRepository()
