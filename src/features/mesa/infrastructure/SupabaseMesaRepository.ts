// ============================================================
// SupabaseMesaRepository — Implementação com Supabase
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// REGRAS RÍGIDAS:
// - Único arquivo da feature que importa Supabase
// - Todo SQL vive aqui — nenhuma query em outro lugar
// - Transforma Row types em tipos de domínio antes de retornar
// - Erros do banco são capturados aqui; a Application vê arrays vazios
//
// server-only: repositórios são exclusivos do servidor.
// ============================================================

import 'server-only'
import { createClient } from '@/lib/supabase/server'
import type { IMesaRepository } from '../repositories/IMesaRepository'
import type { BilheteView, CardView, ArtigoView, ChipView, CadernoStats, AtividadeRecente } from '../types'
import type { BilheteAurora } from '@/types/database'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ─────────────────────────────────────────────
// Helpers de transformação
// ─────────────────────────────────────────────

function bilheteParaView(row: BilheteAurora): BilheteView {
  const previewTexto = row.preview ?? row.titulo

  // Mensagem pode conter \n\n para separar saudação do corpo
  const todosParagrafos = row.conteudo.trim().split('\n\n')
  const saudacao = todosParagrafos[0] ?? 'Olá, Rafa.'
  const paragrafos = todosParagrafos.slice(1)

  return {
    id: row.id,
    preview: previewTexto,
    saudacao,
    paragrafos,
    assinatura: row.assinatura,
    lido: row.lido_em !== null,
    fixado: row.fixado,
  }
}

function statusEpistemicoParaBadge(status: string): {
  badge: string
  badgeColor: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray'
} {
  switch (status) {
    case 'validada':     return { badge: 'validada',     badgeColor: 'green'  }
    case 'refutada':     return { badge: 'refutada',     badgeColor: 'red'    }
    case 'observacao':   return { badge: 'observação',   badgeColor: 'blue'   }
    case 'hipotese':     return { badge: 'hipótese',     badgeColor: 'amber'  }
    case 'em_revisao':   return { badge: 'em revisão',   badgeColor: 'purple' }
    default:             return { badge: status,         badgeColor: 'gray'   }
  }
}

function statusFormulaParaBadge(status: string): {
  badge: string
  badgeColor: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray'
} {
  switch (status) {
    case 'ativa':       return { badge: 'ativa',       badgeColor: 'green'  }
    case 'rascunho':    return { badge: 'rascunho',    badgeColor: 'amber'  }
    case 'arquivada':   return { badge: 'arquivada',   badgeColor: 'gray'   }
    case 'revisao':     return { badge: 'em revisão',  badgeColor: 'purple' }
    default:            return { badge: status,        badgeColor: 'gray'   }
  }
}

function statusCasoParaBadge(status: string): {
  badge: string
  badgeColor: 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray'
} {
  switch (status) {
    case 'em_acompanhamento': return { badge: 'em andamento', badgeColor: 'blue'   }
    case 'concluido':         return { badge: 'concluído',    badgeColor: 'green'  }
    case 'suspenso':          return { badge: 'suspenso',     badgeColor: 'amber'  }
    default:                  return { badge: status,         badgeColor: 'gray'   }
  }
}

function tipoEntidadeParaHref(tipo: string, id: string): string {
  switch (tipo) {
    case 'formula':    return `/formulas/${id}`
    case 'observacao': return `/caderno/${id}`
    case 'caso':       return `/casos/${id}`
    case 'artigo':     return `/acervo/${id}`
    case 'ativo':      return `/acervo/ativos/${id}`
    default:           return `#`
  }
}

// ─────────────────────────────────────────────
// Implementação
// ─────────────────────────────────────────────

export class SupabaseMesaRepository implements IMesaRepository {

  // ── Bilhetes ──────────────────────────────────────────────

  async getBilheteAtivo(tenantId: string): Promise<BilheteView | null> {
    const supabase = await getDb()

    // Ordenação: fixados primeiro, depois não-lidos, depois por data desc.
    // arquivado = FALSE: bilhetes arquivados nunca aparecem.
    const { data, error } = await supabase
      .from('bilhetes_aurora')
      .select('id, tenant_id, tipo, titulo, conteudo, preview, assinatura, lido_em, fixado, arquivado')
      .eq('tenant_id', tenantId)
      .eq('arquivado', false)
      .order('fixado', { ascending: false })
      .order('lido_em', { ascending: true, nullsFirst: true })
      .order('criado_em', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) return null

    return bilheteParaView(data as BilheteAurora)
  }

  async marcarComoLido(bilheteId: string, tenantId: string): Promise<void> {
    const supabase = await getDb()

    await supabase
      .from('bilhetes_aurora')
      .update({ lido_em: new Date().toISOString() })
      .eq('id', bilheteId)
      .eq('tenant_id', tenantId)
      // RLS já garante isolamento; eq(tenant_id) é defesa em profundidade
  }

  async fixarBilhete(bilheteId: string, tenantId: string, fixado: boolean): Promise<void> {
    const supabase = await getDb()

    await supabase
      .from('bilhetes_aurora')
      .update({ fixado })
      .eq('id', bilheteId)
      .eq('tenant_id', tenantId)
  }

  async arquivarBilhete(bilheteId: string, tenantId: string): Promise<void> {
    const supabase = await getDb()

    await supabase
      .from('bilhetes_aurora')
      .update({ arquivado: true })
      .eq('id', bilheteId)
      .eq('tenant_id', tenantId)
    // Nota: bilhetes são permanentes. Arquivar ≠ deletar.
  }

  // ── Em Andamento ──────────────────────────────────────────

  async getEmAndamento(tenantId: string, limite = 5): Promise<CardView[]> {
    const supabase = await getDb()
    const cards: CardView[] = []

    // Fórmulas em rascunho
    // Nota: formulas não têm coluna 'nome' — o título vive em versoes_formula.titulo
    const { data: formulas } = await supabase
      .from('versoes_formula')
      .select(`
        id,
        titulo,
        descricao,
        status,
        atualizado_em,
        formula_id,
        formulas!inner (
          id,
          tenant_id,
          archived_at
        )
      `)
      .eq('formulas.tenant_id', tenantId)
      .is('formulas.archived_at', null)
      .eq('status', 'rascunho')
      .order('atualizado_em', { ascending: false })
      .limit(Math.ceil(limite * 0.6))

    if (formulas) {
      for (const vf of formulas) {
        const { badge, badgeColor } = statusFormulaParaBadge(vf.status)
        cards.push({
          id: vf.formula_id,
          type: 'formula',
          titulo: vf.titulo,
          descricao: vf.descricao ?? undefined,
          badge,
          badgeColor,
          atualizadoEm: vf.atualizado_em,
          icone: '⚗️',
          href: `/formulas/${vf.formula_id}`,
        })
      }
    }

    // Casos em acompanhamento
    const limiteRestante = Math.max(limite - cards.length, 2)
    const { data: casos } = await supabase
      .from('casos_clinicos')
      .select('id, codigo_anonimizado, status, atualizado_em')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .eq('status', 'em_acompanhamento')
      .order('atualizado_em', { ascending: false })
      .limit(limiteRestante)

    if (casos) {
      for (const caso of casos) {
        const { badge, badgeColor } = statusCasoParaBadge(caso.status)
        cards.push({
          id: caso.id,
          type: 'caso',
          titulo: (caso as any).codigo_anonimizado ?? 'Caso clínico',
          badge,
          badgeColor,
          atualizadoEm: caso.atualizado_em,
          icone: '🧬',
          href: `/casos/${caso.id}`,
        })
      }
    }

    // Ordenar por atualizado_em desc e limitar
    return cards
      .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
      .slice(0, limite)
  }

  // ── Últimas Observações ───────────────────────────────────

  async getUltimasObservacoes(tenantId: string, limite = 3): Promise<CardView[]> {
    const supabase = await getDb()

    // Join: observacoes + versoes_observacao (apenas a versão atual)
    const { data, error } = await supabase
      .from('observacoes')
      .select(`
        id,
        titulo,
        status_epistemico,
        atualizado_em,
        versoes_observacao!inner (
          conteudo,
          is_versao_atual
        )
      `)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .eq('versoes_observacao.is_versao_atual', true)
      .order('atualizado_em', { ascending: false })
      .limit(limite)

    if (error || !data) return []

    return data.map((obs: any) => {
      const { badge, badgeColor } = statusEpistemicoParaBadge(obs.status_epistemico)
      const versao = Array.isArray(obs.versoes_observacao)
        ? obs.versoes_observacao[0]
        : obs.versoes_observacao
      const descricao = versao?.conteudo
        ? versao.conteudo.slice(0, 120) + (versao.conteudo.length > 120 ? '…' : '')
        : undefined

      return {
        id: obs.id,
        type: 'observacao' as const,
        titulo: obs.titulo,
        descricao,
        badge,
        badgeColor,
        atualizadoEm: obs.atualizado_em,
        icone: '🔬',
        href: `/caderno/${obs.id}`,
      }
    })
  }

  // ── Últimas Fórmulas ──────────────────────────────────────

  async getUltimasFormulas(tenantId: string, limite = 3): Promise<CardView[]> {
    const supabase = await getDb()

    // Usa a view v_formulas_ativas (apenas versões 'ativa').
    // Nota: 'id' na view = formula.id. Não há coluna 'formula_id' separada.
    // Não há 'nome' — fórmulas têm apenas 'titulo' (da versão).
    const { data, error } = await supabase
      .from('v_formulas_ativas')
      .select('id, titulo, atualizado_em, criado_em')
      .eq('tenant_id', tenantId)
      .order('atualizado_em', { ascending: false })
      .limit(limite)

    if (error || !data) return []

    return data.map((vf: any) => ({
      id: vf.id,
      type: 'formula' as const,
      titulo: vf.titulo,
      badge: 'ativa',
      badgeColor: 'green' as const,
      atualizadoEm: vf.atualizado_em ?? vf.criado_em,
      icone: '⚗️',
      href: `/formulas/${vf.id}`,
    }))
  }

  // ── Últimos Artigos ───────────────────────────────────────

  async getUltimosArtigos(tenantId: string, limite = 3): Promise<ArtigoView[]> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('referencias_cientificas')
      .select('id, titulo, autores, ano_publicacao, journal, doi, abstract, conclusoes_principais')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .order('atualizado_em', { ascending: false })
      .limit(limite)

    if (error || !data) return []

    return data.map((ref: any) => ({
      id: ref.id,
      titulo: ref.titulo,
      autores: Array.isArray(ref.autores) ? ref.autores : [],
      journal: ref.journal ?? '',
      ano: ref.ano_publicacao ?? new Date().getFullYear(),
      doi: ref.doi ?? undefined,
      resumo: ref.abstract ?? ref.conclusoes_principais ?? '',
      tags: [],  // Tags podem ser adicionadas quando houver tabela ref_tags
    }))
  }

  // ── Continuar Pesquisando ──────────────────────────────────

  async getContinuarPesquisando(
    tenantId: string,
    userId: string,
    limite = 8,
  ): Promise<ChipView[]> {
    const supabase = await getDb()

    // Busca entidades com leitura incompleta
    const { data, error } = await supabase
      .from('reading_progress')
      .select('entity_type, entity_id, percentual_lido, ultima_leitura_em')
      .eq('tenant_id', tenantId)
      .eq('usuario_id', userId)
      .gt('percentual_lido', 0)
      .lt('percentual_lido', 100)
      .order('ultima_leitura_em', { ascending: false })
      .limit(limite)

    if (error || !data || data.length === 0) return []

    // Para obter os títulos, precisamos de queries separadas por tipo.
    // Como a DB ainda está em desenvolvimento, retornamos o que temos
    // e tentamos resolver os títulos das entidades que existem.
    const chips: ChipView[] = []

    // Agrupar por entity_type para minimizar queries
    const porTipo = (data as any[]).reduce((acc: Record<string, any[]>, rp: any) => {
      const tipo = rp.entity_type
      if (!acc[tipo]) acc[tipo] = []
      acc[tipo]!.push(rp)
      return acc
    }, {} as Record<string, any[]>)

    // Fórmulas — título vem da versão ativa (formulas não têm 'nome')
    if (porTipo['formula']) {
      const ids = porTipo['formula'].map((r: any) => r.entity_id)
      const { data: formulas } = await supabase
        .from('v_formulas_ativas')
        .select('id, titulo')
        .in('id', ids)
        .eq('tenant_id', tenantId)

      for (const rp of porTipo['formula']) {
        const formula = formulas?.find((f: any) => f.id === rp.entity_id)
        chips.push({
          id: rp.entity_id,
          label: formula?.titulo ?? 'Fórmula',
          tipo: 'formula',
          href: `/formulas/${rp.entity_id}`,
          percentual: rp.percentual_lido,
        })
      }
    }

    // Observações
    if (porTipo['observacao']) {
      const ids = porTipo['observacao'].map((r: any) => r.entity_id)
      const { data: observacoes } = await supabase
        .from('observacoes')
        .select('id, titulo')
        .in('id', ids)
        .eq('tenant_id', tenantId)

      for (const rp of porTipo['observacao']) {
        const obs = observacoes?.find((o: any) => o.id === rp.entity_id)
        chips.push({
          id: rp.entity_id,
          label: obs?.titulo ?? 'Observação',
          tipo: 'observacao',
          href: `/caderno/${rp.entity_id}`,
          percentual: rp.percentual_lido,
        })
      }
    }

    // Artigos
    if (porTipo['artigo']) {
      const ids = porTipo['artigo'].map((r: any) => r.entity_id)
      const { data: artigos } = await supabase
        .from('referencias_cientificas')
        .select('id, titulo')
        .in('id', ids)
        .eq('tenant_id', tenantId)

      for (const rp of porTipo['artigo']) {
        const artigo = artigos?.find((a: any) => a.id === rp.entity_id)
        chips.push({
          id: rp.entity_id,
          label: artigo?.titulo ?? 'Artigo',
          tipo: 'artigo',
          href: `/acervo/${rp.entity_id}`,
          percentual: rp.percentual_lido,
        })
      }
    }

    // Ativos
    if (porTipo['ativo']) {
      const ids = porTipo['ativo'].map((r: any) => r.entity_id)
      const { data: ativos } = await supabase
        .from('ativos_cosmeticos')
        .select('id, nome, nome_inci')
        .in('id', ids)
        .eq('tenant_id', tenantId)

      for (const rp of porTipo['ativo']) {
        const ativo = ativos?.find((a: any) => a.id === rp.entity_id)
        chips.push({
          id: rp.entity_id,
          label: ativo?.nome ?? ativo?.nome_inci ?? 'Ativo',
          tipo: 'ativo',
          href: `/acervo/ativos/${rp.entity_id}`,
          percentual: rp.percentual_lido,
        })
      }
    }

    // Ordenar por ultima_leitura_em (mantém a ordem da query original)
    const ordem = data.map((r: any) => r.entity_id)
    return chips.sort((a: any, b: any) => ordem.indexOf(a.id) - ordem.indexOf(b.id))
  }

  // ── Estatísticas do Caderno ───────────────────────────────

  async getCadernoStats(tenantId: string): Promise<CadernoStats> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('observacoes')
      .select('status_epistemico')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    if (error || !data) {
      return { hipoteses: 0, emObservacao: 0, parcialmenteValidadas: 0, validadas: 0, refutadas: 0, arquivadas: 0, total: 0 }
    }

    const contagens = { hipoteses: 0, emObservacao: 0, parcialmenteValidadas: 0, validadas: 0, refutadas: 0, arquivadas: 0 }
    for (const row of data as { status_epistemico: string }[]) {
      switch (row.status_epistemico) {
        case 'hipotese':              contagens.hipoteses++;              break
        case 'observacao':
        case 'em_observacao':         contagens.emObservacao++;           break
        case 'parcialmente_validada': contagens.parcialmenteValidadas++;  break
        case 'validada':              contagens.validadas++;              break
        case 'refutada':              contagens.refutadas++;              break
        case 'arquivada':             contagens.arquivadas++;             break
      }
    }

    const total = Object.values(contagens).reduce((s, v) => s + v, 0)
    return { ...contagens, total }
  }

  // ── Atividades Recentes ───────────────────────────────────

  async getAtividadesRecentes(tenantId: string, limite = 8): Promise<AtividadeRecente[]> {
    const supabase = await getDb()
    const atividades: AtividadeRecente[] = []

    const [{ data: obs }, { data: formulas }, { data: artigos }, { data: casos }] =
      await Promise.all([
        supabase
          .from('observacoes')
          .select('id, titulo, status_epistemico, atualizado_em')
          .eq('tenant_id', tenantId)
          .is('archived_at', null)
          .order('atualizado_em', { ascending: false })
          .limit(4),
        supabase
          .from('versoes_formula')
          .select('id, titulo, status, atualizado_em, formula_id, formulas!inner(tenant_id, archived_at)')
          .eq('formulas.tenant_id', tenantId)
          .is('formulas.archived_at', null)
          .order('atualizado_em', { ascending: false })
          .limit(4),
        supabase
          .from('referencias_cientificas')
          .select('id, titulo, atualizado_em')
          .eq('tenant_id', tenantId)
          .is('archived_at', null)
          .order('atualizado_em', { ascending: false })
          .limit(3),
        supabase
          .from('casos_clinicos')
          .select('id, codigo_anonimizado, status, atualizado_em')
          .eq('tenant_id', tenantId)
          .is('archived_at', null)
          .order('atualizado_em', { ascending: false })
          .limit(3),
      ])

    for (const o of (obs ?? []) as any[]) {
      const { badge, badgeColor } = statusEpistemicoParaBadge(o.status_epistemico)
      atividades.push({
        id: o.id,
        tipo: 'observacao',
        descricao: o.titulo,
        badgeLabel: badge,
        badgeColor,
        realizadaEm: o.atualizado_em,
        href: `/caderno/${o.id}`,
      })
    }

    for (const f of (formulas ?? []) as any[]) {
      const { badge, badgeColor } = statusFormulaParaBadge(f.status)
      atividades.push({
        id: f.formula_id,
        tipo: 'formula',
        descricao: f.titulo,
        badgeLabel: badge,
        badgeColor,
        realizadaEm: f.atualizado_em,
        href: `/formulas/${f.formula_id}`,
      })
    }

    for (const a of (artigos ?? []) as any[]) {
      atividades.push({
        id: a.id,
        tipo: 'artigo',
        descricao: a.titulo,
        badgeLabel: 'referência',
        badgeColor: 'blue',
        realizadaEm: a.atualizado_em,
        href: `/acervo/${a.id}`,
      })
    }

    for (const c of (casos ?? []) as any[]) {
      const { badge, badgeColor } = statusCasoParaBadge(c.status)
      atividades.push({
        id: c.id,
        tipo: 'caso',
        descricao: c.codigo_anonimizado ?? 'Caso clínico',
        badgeLabel: badge,
        badgeColor,
        realizadaEm: c.atualizado_em,
        href: `/casos/${c.id}`,
      })
    }

    return atividades
      .sort((a, b) => b.realizadaEm.localeCompare(a.realizadaEm))
      .slice(0, limite)
  }

  // ── Coleções ──────────────────────────────────────────────

  async getColecoes(tenantId: string, userId: string, limite = 6): Promise<CardView[]> {
    const supabase = await getDb()

    const { data, error } = await supabase
      .from('colecoes')
      .select('id, titulo, descricao, cor, nivel_acesso, atualizado_em')
      .eq('tenant_id', tenantId)
      .eq('usuario_id', userId)
      .is('archived_at', null)
      .order('atualizado_em', { ascending: false })
      .limit(limite)

    if (error || !data) return []

    return data.map((col: any) => ({
      id: col.id,
      type: 'protocolo' as const, // coleções não têm tipo próprio na TipoEntidadeMesa; usa protocolo como genérico
      titulo: col.titulo,
      descricao: col.descricao ?? undefined,
      badge: col.nivel_acesso === 'publico' ? 'pública' : 'privada',
      badgeColor: col.nivel_acesso === 'publico' ? 'blue' : 'gray',
      atualizadoEm: col.atualizado_em,
      icone: col.cor ? undefined : '📂',
      href: `/colecoes/${col.id}`,
    }))
  }
}
