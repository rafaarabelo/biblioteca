// ============================================================
// SupabaseCasoRepository — Implementação Supabase
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// server-only: nunca importado no cliente.
// Todo SQL aqui. Zero lógica clínica aqui.
// Evoluções: INSERT ONLY — nunca UPDATE, nunca DELETE.
// ============================================================

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { ICasoRepository } from './ICasoRepository'
import type {
  CasoView,
  CasoDetalheView,
  EvolucaoView,
  FotoView,
  ConexaoCaso,
  CasoFiltros,
  CriarCasoInput,
  CriarEvolucaoInput,
  TipoConexaoCaso,
} from '../types'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ─────────────────────────────────────────────
// Mappers
// ─────────────────────────────────────────────

function mapEvolucao(r: any): EvolucaoView {
  return {
    id:                   r.id,
    tenantId:             r.tenant_id,
    casoId:               r.caso_id,
    tipo:                 r.tipo,
    dataAtendimento:      r.data_atendimento,
    descricao:            r.descricao,
    observacoesClinices:  r.observacoes_clinicas ?? null,
    reacoesAdversas:      r.reacoes_adversas ?? null,
    satisfacaoPaciente:   r.satisfacao_paciente ?? null,
    resultados:           r.resultados ?? null,
    versaoProtocoloId:    r.versao_protocolo_id ?? null,
    criadoEm:             r.criado_em,
  }
}

function mapFoto(r: any): FotoView {
  return {
    id:          r.id,
    casoId:      r.caso_id,
    tipo:        r.tipo,
    angulo:      r.angulo ?? null,
    iluminacao:  r.iluminacao ?? null,
    dataFoto:    r.data_foto ?? null,
    notas:       r.notas ?? null,
    criadoEm:    r.criado_em,
    url:         null, // Resolvido pelo storage separadamente
  }
}

function mapCasoView(r: any): CasoView {
  return {
    id:                r.id,
    tenantId:          r.tenant_id,
    codigoAnonimizado: r.codigo_anonimizado ?? null,
    objetivoPrincipal: r.objetivo_principal ?? null,
    queixaPrincipal:   r.queixa_principal ?? null,
    status:            r.status,
    tags:              r.tags ?? [],
    favorito:          r.favorito ?? false,
    totalEvolucoes:    Number(r.total_evolucoes ?? 0),
    totalFotos:        Number(r.total_fotos ?? 0),
    abertoEm:          r.aberto_em,
    atualizadoEm:      r.atualizado_em,
  }
}

// ─────────────────────────────────────────────
// Repository
// ─────────────────────────────────────────────

class SupabaseCasoRepository implements ICasoRepository {
  // ── Listar ──────────────────────────────────
  async listar(tenantId: string, filtros: Partial<CasoFiltros>): Promise<CasoView[]> {
    const supabase = await getDb()

    let query = supabase
      .from('casos_clinicos')
      .select(`
        id,
        tenant_id,
        codigo_anonimizado,
        objetivo_principal,
        queixa_principal,
        status,
        tags,
        favorito,
        aberto_em,
        atualizado_em,
        evolucoes_caso!inner ( count ),
        fotos_caso ( count )
      `)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    // Busca textual
    if (filtros.busca) {
      const termo = `%${filtros.busca}%`
      query = query.or(
        `codigo_anonimizado.ilike.${termo},objetivo_principal.ilike.${termo},queixa_principal.ilike.${termo}`
      )
    }

    // Status
    if (filtros.status) {
      query = query.eq('status', filtros.status)
    }

    // Favorito
    if (filtros.favorito) {
      query = query.eq('favorito', true)
    }

    // Tags
    if (filtros.tags && filtros.tags.length > 0) {
      query = query.overlaps('tags', filtros.tags)
    }

    // Ordenação
    switch (filtros.ordenar) {
      case 'antigo':
        query = query.order('aberto_em', { ascending: true })
        break
      case 'codigo':
        query = query.order('codigo_anonimizado', { ascending: true })
        break
      default:
        query = query.order('atualizado_em', { ascending: false })
    }

    // Paginação
    if (filtros.limite) query = query.limit(filtros.limite)
    if (filtros.offset) query = query.range(filtros.offset, filtros.offset + (filtros.limite ?? 20) - 1)

    const { data, error } = await query
    if (error) throw new Error(`CasoRepository.listar: ${error.message}`)

    return (data ?? []).map((r: any) => ({
      ...mapCasoView(r),
      totalEvolucoes: r.evolucoes_caso?.[0]?.count ?? 0,
      totalFotos:     r.fotos_caso?.[0]?.count ?? 0,
    }))
  }

  // ── Get by ID ───────────────────────────────
  async getById(tenantId: string, id: string): Promise<CasoDetalheView | null> {
    const supabase = await getDb()

    // 1. Caso principal
    const { data: casoRaw, error: casoErr } = await supabase
      .from('casos_clinicos')
      .select('*')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .single()

    if (casoErr || !casoRaw) return null

    const caso = casoRaw as any

    // 2. Evoluções (ASC = cronológica)
    const { data: evolucoesRaw } = await supabase
      .from('evolucoes_caso')
      .select('*')
      .eq('caso_id', id)
      .eq('tenant_id', tenantId)
      .order('data_atendimento', { ascending: true })

    // 3. Fotos
    const { data: fotosRaw } = await supabase
      .from('fotos_caso')
      .select('*')
      .eq('caso_id', id)
      .eq('tenant_id', tenantId)
      .order('data_foto', { ascending: true })

    // 4. Conexões
    const conexoes = await this.getConexoes(tenantId, id)

    const evolucoes = (evolucoesRaw ?? []).map(mapEvolucao)
    const fotos = (fotosRaw ?? []).map(mapFoto)

    return {
      id:                caso.id,
      tenantId:          caso.tenant_id,
      codigoAnonimizado: caso.codigo_anonimizado ?? null,
      objetivoPrincipal: caso.objetivo_principal ?? null,
      queixaPrincipal:   caso.queixa_principal ?? null,
      hipoteses:         caso.hipoteses ?? null,
      resumoClinico:     caso.resumo_clinico ?? null,
      objetivos:         caso.objetivos ?? [],
      observacoesIniciais: caso.observacoes_iniciais ?? null,
      resultadoGeral:    caso.resultado_geral ?? null,
      motivoEncerramento: caso.motivo_encerramento ?? null,
      encerradoEm:       caso.encerrado_em ?? null,
      status:            caso.status,
      tags:              caso.tags ?? [],
      favorito:          caso.favorito ?? false,
      totalEvolucoes:    evolucoes.length,
      totalFotos:        fotos.length,
      abertoEm:          caso.aberto_em,
      atualizadoEm:      caso.atualizado_em,
      evolucoes,
      fotos,
      conexoes,
    }
  }

  // ── Conexões ─────────────────────────────────
  private async getConexoes(tenantId: string, casoId: string): Promise<ConexaoCaso[]> {
    const supabase = await getDb()
    const conexoes: ConexaoCaso[] = []

    // 1. Observações via observacao_casos
    // versoes_observacao não tem 'titulo' nem 'status' — titulo fica em observacoes.titulo
    const { data: obsCasos } = await supabase
      .from('observacao_casos')
      .select('observacao_id, observacoes!inner(id, titulo)')
      .eq('caso_id', casoId)
      .eq('tenant_id', tenantId)

    for (const row of (obsCasos ?? []) as any[]) {
      const obs = row.observacoes
      if (obs) {
        conexoes.push({
          tipo: 'observacao' as TipoConexaoCaso,
          id: row.observacao_id,
          titulo: obs.titulo || 'Observação sem título',
          href: `/caderno/${row.observacao_id}`,
        })
      }
    }

    // 2. Protocolo via versao_protocolo_id
    const { data: casoData } = await supabase
      .from('casos_clinicos')
      .select('versao_protocolo_id, versoes_protocolo(id, titulo, protocolo_id)')
      .eq('id', casoId)
      .single()

    const versaoProto = (casoData as any)?.versoes_protocolo
    if (versaoProto) {
      conexoes.push({
        tipo: 'protocolo' as TipoConexaoCaso,
        id: versaoProto.protocolo_id,
        titulo: versaoProto.titulo || 'Protocolo',
        href: `/protocolos/${versaoProto.protocolo_id}`,
      })
    }

    // 3. Fórmulas via prescricoes_caso
    const { data: prescricoes } = await supabase
      .from('prescricoes_caso')
      .select('versao_formula_id, versoes_formula(id, titulo, formula_id)')
      .eq('caso_id', casoId)
      .eq('tenant_id', tenantId)

    const formulasVistas = new Set<string>()
    for (const p of prescricoes ?? []) {
      const vf = (p as any).versoes_formula
      if (vf && !formulasVistas.has(vf.formula_id)) {
        formulasVistas.add(vf.formula_id)
        conexoes.push({
          tipo: 'formula' as TipoConexaoCaso,
          id: vf.formula_id,
          titulo: vf.titulo || 'Fórmula',
          href: `/formulas/${vf.formula_id}`,
        })
      }
    }

    // 4. Referências via referencia_casos
    const { data: refCasos } = await supabase
      .from('referencia_casos')
      .select('referencia_id, referencias_cientificas!inner(id, titulo)')
      .eq('caso_id', casoId)
      .eq('tenant_id', tenantId)

    for (const row of (refCasos ?? []) as any[]) {
      const ref = row.referencias_cientificas
      if (ref) {
        conexoes.push({
          tipo: 'referencia' as TipoConexaoCaso,
          id: row.referencia_id,
          titulo: ref.titulo || 'Referência científica',
          href: `/acervo/${row.referencia_id}`,
        })
      }
    }

    // 5. Ativos via caso_ativos
    const { data: casoAtivos } = await supabase
      .from('caso_ativos')
      .select('ativo_id, ativos_cosmeticos!inner(id, nome_inci)')
      .eq('caso_id', casoId)
      .eq('tenant_id', tenantId)

    for (const row of (casoAtivos ?? []) as any[]) {
      const ativo = row.ativos_cosmeticos
      if (ativo) {
        conexoes.push({
          tipo: 'ativo' as TipoConexaoCaso,
          id: row.ativo_id,
          titulo: ativo.nome_inci || 'Ativo',
          href: `/ativos/${row.ativo_id}`,
        })
      }
    }

    return conexoes
  }

  // ── Criar ────────────────────────────────────
  async criar(tenantId: string, userId: string, input: CriarCasoInput): Promise<string> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('casos_clinicos')
      .insert({
        tenant_id:           tenantId,
        codigo_anonimizado:  input.codigoAnonimizado || null,
        objetivo_principal:  input.objetivoPrincipal,
        queixa_principal:    input.queixaPrincipal,
        hipoteses:           input.hipoteses || null,
        observacoes_iniciais: input.observacoesIniciais || null,
        status:              input.status,
        tags:                input.tags,
        favorito:            false,
        aberto_em:           new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) throw new Error(`CasoRepository.criar: ${error.message}`)
    return data.id
  }

  // ── Criar Evolução (APPEND-ONLY) ─────────────
  async criarEvolucao(tenantId: string, userId: string, input: CriarEvolucaoInput): Promise<string> {
    const supabase = await getDb()

    // NUNCA UPDATE. NUNCA DELETE. Apenas INSERT.
    const { data, error } = await supabase
      .from('evolucoes_caso')
      .insert({
        tenant_id:            tenantId,
        caso_id:              input.casoId,
        tipo:                 input.tipo,
        data_atendimento:     input.dataAtendimento,
        descricao:            input.descricao,
        observacoes_clinicas: input.observacoesClinices || null,
        reacoes_adversas:     input.reacoesAdversas || null,
        satisfacao_paciente:  input.satisfacaoPaciente,
        resultados:           input.resultados || null,
        versao_protocolo_id:  input.versaoProtocoloId || null,
        registrado_por:       userId,
      })
      .select('id')
      .single()

    if (error) throw new Error(`CasoRepository.criarEvolucao: ${error.message}`)

    // Atualiza timestamp do caso pai
    await supabase
      .from('casos_clinicos')
      .update({ atualizado_em: new Date().toISOString() })
      .eq('id', input.casoId)
      .eq('tenant_id', tenantId)

    return data.id
  }

  // ── Favoritar ────────────────────────────────
  async favoritar(tenantId: string, id: string, favorito: boolean): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('casos_clinicos')
      .update({ favorito })
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(`CasoRepository.favoritar: ${error.message}`)
  }

  // ── Arquivar ─────────────────────────────────
  async arquivar(tenantId: string, id: string): Promise<void> {
    const supabase = await getDb()
    const { error } = await supabase
      .from('casos_clinicos')
      .update({
        archived_at: new Date().toISOString(),
        status: 'arquivado',
      })
      .eq('id', id)
      .eq('tenant_id', tenantId)

    if (error) throw new Error(`CasoRepository.arquivar: ${error.message}`)
  }

  // ── Tags do Tenant ───────────────────────────
  async getTagsTenant(tenantId: string): Promise<string[]> {
    const supabase = await getDb()
    const { data } = await supabase
      .from('casos_clinicos')
      .select('tags')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    if (!data) return []
    const todas = (data as { tags: string[] }[]).flatMap((r: any) => r.tags ?? [])
    return [...new Set(todas)].sort()
  }
}

export const supabaseCasoRepository = new SupabaseCasoRepository()
