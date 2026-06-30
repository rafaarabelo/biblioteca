// ============================================================
// SupabaseReferenciaRepository — Implementação Supabase
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// import 'server-only' garante que este módulo nunca chegue ao cliente.
// Todo SQL da feature Acervo vive SOMENTE aqui.
// ============================================================

import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { IReferenciaRepository } from '../repositories/IReferenciaRepository'
import type {
  ReferenciaView,
  ReferenciaDetalheView,
  ConexaoAcervo,
  AcervoListagem,
  AcervoFiltros,
  CriarReferenciaInput,
  AtualizarReferenciaInput,
  SalvarConexoesAcervoInput,
  TipoEstudo,
  NivelEvidencia,
} from '../types'
import type { ReferenciaCientifica } from '@/types/database'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ─────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────

function referenciaParaView(r: ReferenciaCientifica, totalConexoes = 0): ReferenciaView {
  return {
    id: r.id,
    titulo: r.titulo,
    autores: r.autores ?? [],
    anoPublicacao: r.ano_publicacao,
    journal: r.journal,
    doi: r.doi,
    pmid: r.pmid,
    url: r.url,
    abstract: r.abstract,
    tipoEstudo: (r.tipo_estudo as TipoEstudo) ?? null,
    nivelEvidencia: (r.nivel_evidencia as NivelEvidencia) ?? null,
    conclusoesPrincipais: r.conclusoes_principais,
    notasPessoais: r.notas_pessoais,
    tags: r.tags ?? [],
    favorito: r.favorito ?? false,
    totalConexoes,
    criadoEm: r.criado_em,
    atualizadoEm: r.atualizado_em,
  }
}

function referenciaParaDetalhe(
  r: ReferenciaCientifica,
  conexoes: ConexaoAcervo[],
): ReferenciaDetalheView {
  return {
    ...referenciaParaView(r, conexoes.length),
    isbn: r.isbn,
    limitacoes: r.limitacoes,
    populacaoEstudo: r.populacao_estudo,
    nAmostras: r.n_amostras,
    conflitoInteresses: r.conflito_interesses,
    acessadoEm: r.acessado_em,
    statusExtracao: r.status_extracao ?? 'pendente',
    conexoes,
  }
}

// ─────────────────────────────────────────────
// Implementação
// ─────────────────────────────────────────────

export class SupabaseReferenciaRepository implements IReferenciaRepository {

  async listar(tenantId: string, filtros: AcervoFiltros): Promise<AcervoListagem> {
    const supabase = await getDb()
    const limite = filtros.limite ?? 20
    const pagina = filtros.pagina ?? 0
    const offset = pagina * limite

    let query = supabase
      .from('referencias_cientificas')
      .select('*', { count: 'exact' })
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .range(offset, offset + limite - 1)

    if (filtros.busca) {
      const termo = `%${filtros.busca}%`
      query = query.or(
        `titulo.ilike.${termo},abstract.ilike.${termo},doi.ilike.${termo},pmid.ilike.${termo},journal.ilike.${termo}`
      )
    }
    if (filtros.tipoEstudo)    query = query.eq('tipo_estudo', filtros.tipoEstudo)
    if (filtros.nivelEvidencia) query = query.eq('nivel_evidencia', filtros.nivelEvidencia)
    if (filtros.favorito !== undefined) query = query.eq('favorito', filtros.favorito)
    if (filtros.anoMin)        query = query.gte('ano_publicacao', filtros.anoMin)
    if (filtros.anoMax)        query = query.lte('ano_publicacao', filtros.anoMax)
    if (filtros.tags?.length)  query = query.overlaps('tags', filtros.tags)

    switch (filtros.ordenar) {
      case 'mais_antigo': query = query.order('criado_em', { ascending: true }); break
      case 'titulo':      query = query.order('titulo', { ascending: true }); break
      case 'ano':         query = query.order('ano_publicacao', { ascending: false, nullsFirst: false }); break
      default:            query = query.order('atualizado_em', { ascending: false }); break
    }

    const { data, count, error } = await query
    if (error) throw error

    return {
      referencias: (data ?? []).map((r: any) => referenciaParaView(r as ReferenciaCientifica)),
      total: count ?? 0,
      pagina,
      temMais: offset + limite < (count ?? 0),
    }
  }

  async getById(tenantId: string, id: string): Promise<ReferenciaDetalheView | null> {
    const supabase = await getDb()
    const { data, error } = await supabase
      .from('referencias_cientificas')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .single()

    if (error || !data) return null
    const conexoes = await this.getConexoes(tenantId, id)
    return referenciaParaDetalhe(data as ReferenciaCientifica, conexoes)
  }

  async getByDoi(tenantId: string, doi: string): Promise<ReferenciaView | null> {
    const supabase = await getDb()
    const { data, error } = await supabase
      .from('referencias_cientificas')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('doi', doi)
      .is('archived_at', null)
      .maybeSingle()

    if (error || !data) return null
    return referenciaParaView(data as ReferenciaCientifica)
  }

  async getByPmid(tenantId: string, pmid: string): Promise<ReferenciaView | null> {
    const supabase = await getDb()
    const { data, error } = await supabase
      .from('referencias_cientificas')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('pmid', pmid)
      .is('archived_at', null)
      .maybeSingle()

    if (error || !data) return null
    return referenciaParaView(data as ReferenciaCientifica)
  }

  async criar(tenantId: string, input: CriarReferenciaInput): Promise<ReferenciaView> {
    const supabase = await getDb()
    const { data, error } = await (supabase as any)
      .from('referencias_cientificas')
      .insert({
        tenant_id: tenantId,
        titulo: input.titulo.trim(),
        autores: input.autores ?? [],
        ano_publicacao: input.anoPublicacao ?? null,
        journal: input.journal?.trim() ?? null,
        doi: input.doi?.trim() ?? null,
        pmid: input.pmid?.trim() ?? null,
        isbn: input.isbn?.trim() ?? null,
        url: input.url?.trim() ?? null,
        abstract: input.abstract?.trim() ?? null,
        tipo_estudo: input.tipoEstudo ?? null,
        nivel_evidencia: input.nivelEvidencia ?? null,
        populacao_estudo: input.populacaoEstudo?.trim() ?? null,
        n_amostras: input.nAmostras ?? null,
        conclusoes_principais: input.conclusoesPrincipais?.trim() ?? null,
        limitacoes: input.limitacoes?.trim() ?? null,
        conflito_interesses: input.conflitoInteresses ?? null,
        acessado_em: input.acessadoEm ?? null,
        notas_pessoais: input.notasPessoais?.trim() ?? null,
        tags: input.tags ?? [],
      })
      .select()
      .single()

    if (error) throw error
    return referenciaParaView(data as ReferenciaCientifica)
  }

  async atualizar(tenantId: string, input: AtualizarReferenciaInput): Promise<ReferenciaView> {
    const supabase = await getDb()
    const patch: Record<string, unknown> = { atualizado_em: new Date().toISOString() }

    if (input.titulo             !== undefined) patch.titulo               = input.titulo.trim()
    if (input.autores            !== undefined) patch.autores              = input.autores
    if (input.anoPublicacao      !== undefined) patch.ano_publicacao       = input.anoPublicacao
    if (input.journal            !== undefined) patch.journal              = input.journal?.trim() ?? null
    if (input.doi                !== undefined) patch.doi                  = input.doi?.trim() ?? null
    if (input.pmid               !== undefined) patch.pmid                 = input.pmid?.trim() ?? null
    if (input.isbn               !== undefined) patch.isbn                 = input.isbn?.trim() ?? null
    if (input.url                !== undefined) patch.url                  = input.url?.trim() ?? null
    if (input.abstract           !== undefined) patch.abstract             = input.abstract?.trim() ?? null
    if (input.tipoEstudo         !== undefined) patch.tipo_estudo          = input.tipoEstudo
    if (input.nivelEvidencia     !== undefined) patch.nivel_evidencia      = input.nivelEvidencia
    if (input.populacaoEstudo    !== undefined) patch.populacao_estudo     = input.populacaoEstudo?.trim() ?? null
    if (input.nAmostras          !== undefined) patch.n_amostras           = input.nAmostras
    if (input.conclusoesPrincipais !== undefined) patch.conclusoes_principais = input.conclusoesPrincipais?.trim() ?? null
    if (input.limitacoes         !== undefined) patch.limitacoes           = input.limitacoes?.trim() ?? null
    if (input.conflitoInteresses !== undefined) patch.conflito_interesses  = input.conflitoInteresses
    if (input.acessadoEm         !== undefined) patch.acessado_em          = input.acessadoEm
    if (input.notasPessoais      !== undefined) patch.notas_pessoais       = input.notasPessoais?.trim() ?? null
    if (input.tags               !== undefined) patch.tags                 = input.tags

    const { data, error } = await (supabase as any)
      .from('referencias_cientificas')
      .update(patch)
      .eq('id', input.referenciaId)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (error) throw error
    return referenciaParaView(data as ReferenciaCientifica)
  }

  async favoritar(tenantId: string, referenciaId: string, favorito: boolean): Promise<void> {
    const supabase = await getDb()
    const { error } = await (supabase as any)
      .from('referencias_cientificas')
      .update({ favorito, atualizado_em: new Date().toISOString() })
      .eq('id', referenciaId)
      .eq('tenant_id', tenantId)

    if (error) throw error
  }

  async arquivar(tenantId: string, referenciaId: string): Promise<void> {
    const supabase = await getDb()
    const { error } = await (supabase as any)
      .from('referencias_cientificas')
      .update({ archived_at: new Date().toISOString(), atualizado_em: new Date().toISOString() })
      .eq('id', referenciaId)
      .eq('tenant_id', tenantId)

    if (error) throw error
  }

  async getConexoes(tenantId: string, referenciaId: string): Promise<ConexaoAcervo[]> {
    const supabase = await getDb()
    const conexoes: ConexaoAcervo[] = []

    // Ativos
    const { data: ativos } = await supabase
      .from('ativo_referencias')
      .select('ativo_id, ativos_cosmeticos(nome)')
      .eq('referencia_id', referenciaId)
    ;(ativos ?? []).forEach((a: any) => {
      if (a.ativos_cosmeticos?.nome) {
        conexoes.push({ id: a.ativo_id, tipo: 'ativo', label: a.ativos_cosmeticos.nome })
      }
    })

    // Observações
    const { data: obs } = await supabase
      .from('observacao_referencias')
      .select('observacao_id, observacoes(titulo)')
      .eq('referencia_id', referenciaId)
    ;(obs ?? []).forEach((o: any) => {
      if (o.observacoes?.titulo) {
        conexoes.push({ id: o.observacao_id, tipo: 'observacao', label: o.observacoes.titulo })
      }
    })

    // Fórmulas (migration 022)
    // formulas não tem coluna 'nome' — título fica em versoes_formula; usa codigo_interno como label
    const { data: refFormulas } = await supabase
      .from('referencia_formulas')
      .select('formula_id, formulas(id, codigo_interno)')
      .eq('referencia_id', referenciaId)
      .eq('tenant_id', tenantId)
    ;(refFormulas ?? []).forEach((f: any) => {
      conexoes.push({
        id: f.formula_id,
        tipo: 'formula',
        label: f.formulas?.codigo_interno ?? 'Fórmula',
      })
    })

    // Protocolos
    // protocolos não tem coluna 'titulo' — título fica em versoes_protocolo; usa codigo_interno como label
    const { data: refProtocolos } = await supabase
      .from('referencia_protocolos')
      .select('protocolo_id, protocolos(id, codigo_interno)')
      .eq('referencia_id', referenciaId)
      .eq('tenant_id', tenantId)
    ;(refProtocolos ?? []).forEach((p: any) => {
      conexoes.push({
        id: p.protocolo_id,
        tipo: 'protocolo',
        label: p.protocolos?.codigo_interno ?? 'Protocolo',
      })
    })

    // Casos
    // casos_clinicos.titulo removido na migration 024 — identificador é codigo_anonimizado
    const { data: refCasos } = await supabase
      .from('referencia_casos')
      .select('caso_id, casos_clinicos(codigo_anonimizado, objetivo_principal)')
      .eq('referencia_id', referenciaId)
      .eq('tenant_id', tenantId)
    ;(refCasos ?? []).forEach((c: any) => {
      const cc = c.casos_clinicos
      if (cc) {
        conexoes.push({
          id: c.caso_id,
          tipo: 'caso',
          label: cc.objetivo_principal ?? cc.codigo_anonimizado ?? 'Caso clínico',
        })
      }
    })

    return conexoes
  }

  async salvarConexoes(tenantId: string, input: SalvarConexoesAcervoInput): Promise<void> {
    const supabase = await getDb()
    const sb = supabase as any
    const rid = input.referenciaId

    // Ativos: usa tabela ativo_referencias (referencia_id, ativo_id)
    if (input.ativos !== undefined) {
      await supabase.from('ativo_referencias').delete().eq('referencia_id', rid)
      if (input.ativos.length > 0) {
        await sb.from('ativo_referencias').insert(
          input.ativos.map((aId) => ({ referencia_id: rid, ativo_id: aId, tenant_id: tenantId }))
        )
      }
    }

    // Fórmulas
    if (input.formulas !== undefined) {
      await supabase.from('referencia_formulas').delete()
        .eq('referencia_id', rid).eq('tenant_id', tenantId)
      if (input.formulas.length > 0) {
        await sb.from('referencia_formulas').insert(
          input.formulas.map((fId) => ({ referencia_id: rid, formula_id: fId, tenant_id: tenantId }))
        )
      }
    }

    // Protocolos
    if (input.protocolos !== undefined) {
      await supabase.from('referencia_protocolos').delete()
        .eq('referencia_id', rid).eq('tenant_id', tenantId)
      if (input.protocolos.length > 0) {
        await sb.from('referencia_protocolos').insert(
          input.protocolos.map((pId) => ({ referencia_id: rid, protocolo_id: pId, tenant_id: tenantId }))
        )
      }
    }

    // Casos
    if (input.casos !== undefined) {
      await supabase.from('referencia_casos').delete()
        .eq('referencia_id', rid).eq('tenant_id', tenantId)
      if (input.casos.length > 0) {
        await sb.from('referencia_casos').insert(
          input.casos.map((cId) => ({ referencia_id: rid, caso_id: cId, tenant_id: tenantId }))
        )
      }
    }

    // Observações: usa tabela observacao_referencias (observacao_id, referencia_id)
    if (input.observacoes !== undefined) {
      await supabase.from('observacao_referencias').delete().eq('referencia_id', rid)
      if (input.observacoes.length > 0) {
        await sb.from('observacao_referencias').insert(
          input.observacoes.map((oId) => ({ referencia_id: rid, observacao_id: oId, tenant_id: tenantId }))
        )
      }
    }
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    const supabase = await getDb()
    const { data, error } = await supabase
      .from('referencias_cientificas')
      .select('tags')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    if (error || !data) return []
    const todas = (data as { tags: string[] }[]).flatMap((r: any) => r.tags ?? [])
    return [...new Set(todas)].sort()
  }
}

// Singleton — seguro pois o módulo é server-only
export const supabaseReferenciaRepository = new SupabaseReferenciaRepository()
