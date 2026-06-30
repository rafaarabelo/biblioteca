// ============================================================
// IMesaRepository — Interface do Repositório
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Contrato entre Application e Infrastructure.
// A camada de Application depende desta interface —
// NUNCA da implementação concreta do Supabase.
//
// Regras:
// - Nenhum tipo do Supabase cruza esta fronteira
// - Nenhum erro do banco chega à Application sem tratamento
// - Cada método retorna tipos de domínio da feature
// ============================================================

import type { BilheteView, CardView, ArtigoView, ChipView, CadernoStats, AtividadeRecente } from '../types'

export interface IMesaRepository {

  // ── Bilhete Aurora ──────────────────────────────────────
  /**
   * Retorna o bilhete mais relevante para exibição na Mesa.
   * Prioridade: fixados > não-lidos > lidos mais recentes.
   * Exclui arquivados.
   * Retorna null se nenhum bilhete existir.
   */
  getBilheteAtivo(tenantId: string): Promise<BilheteView | null>

  /**
   * Marca um bilhete como lido (seta lido_em = agora).
   * Idempotente: se já lido, atualiza a timestamp.
   * Bilhetes são permanentes — jamais deletar.
   */
  marcarComoLido(bilheteId: string, tenantId: string): Promise<void>

  /**
   * Fixa ou desfixa um bilhete.
   * Bilhetes fixados aparecem sempre, mesmo após lidos.
   */
  fixarBilhete(bilheteId: string, tenantId: string, fixado: boolean): Promise<void>

  /**
   * Arquiva um bilhete (não aparece mais na Mesa).
   * Bilhetes arquivados NUNCA são deletados — design intencional.
   */
  arquivarBilhete(bilheteId: string, tenantId: string): Promise<void>

  // ── Seções da Mesa ──────────────────────────────────────

  /**
   * Retorna os últimos N trabalhos em andamento.
   * Fórmulas com status 'rascunho' + casos 'em_acompanhamento'.
   * Ordenados por atualizado_em DESC.
   */
  getEmAndamento(tenantId: string, limite?: number): Promise<CardView[]>

  /**
   * Retorna as últimas N observações não-arquivadas.
   * Inclui status_epistemico como badge.
   * Ordenadas por atualizado_em DESC.
   */
  getUltimasObservacoes(tenantId: string, limite?: number): Promise<CardView[]>

  /**
   * Retorna as últimas N fórmulas (versões ativas/rascunho).
   * Usa a view v_formulas_ativas para garantir apenas versão atual.
   * Ordenadas por atualizado_em DESC.
   */
  getUltimasFormulas(tenantId: string, limite?: number): Promise<CardView[]>

  /**
   * Retorna os últimos N artigos científicos adicionados.
   * Inclui autores, journal, ano, abstract.
   * Ordenados por atualizado_em DESC.
   */
  getUltimosArtigos(tenantId: string, limite?: number): Promise<ArtigoView[]>

  /**
   * Retorna as entidades com leitura incompleta do usuário.
   * Baseado em reading_progress WHERE percentual_lido > 0 AND < 100.
   * Ordenado por ultima_leitura_em DESC.
   */
  getContinuarPesquisando(tenantId: string, userId: string, limite?: number): Promise<ChipView[]>

  /**
   * Retorna as coleções recentes do usuário.
   * Ordenadas por atualizado_em DESC.
   */
  getColecoes(tenantId: string, userId: string, limite?: number): Promise<CardView[]>

  /**
   * Retorna contagem de observações por status epistêmico.
   * Usado no painel "Caderno de Campo" da Mesa.
   */
  getCadernoStats(tenantId: string): Promise<CadernoStats>

  /**
   * Retorna as N atividades mais recentes do tenant.
   * Agrega atualizações de observações, fórmulas, artigos e casos.
   * Ordenadas por realizadaEm DESC.
   */
  getAtividadesRecentes(tenantId: string, limite?: number): Promise<AtividadeRecente[]>
}
