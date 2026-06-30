// ============================================================
// MesaService — Camada de Application
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// O serviço orquestra o repositório e monta a visão completa
// da Mesa de Pesquisa. Toda lógica de negócio fica aqui.
//
// REGRAS:
// - Zero imports do Supabase
// - Zero SQL
// - Zero lógica de renderização
// - Depende de IMesaRepository, nunca da implementação concreta
//
// Exemplo de lógica de negócio que fica AQUI (não nos componentes):
// - Decidir a ordem de prioridade dos bilhetes
// - Definir limites por seção
// - Agregar múltiplas fontes (formulas + casos → emAndamento)
// ============================================================

import 'server-only'
import type { IMesaRepository } from '../repositories/IMesaRepository'
import type { MesaView, BilheteView } from '../types'
import { SupabaseMesaRepository } from '../infrastructure/SupabaseMesaRepository'

// Limites padrão por seção — ajustáveis sem mexer nos componentes
const LIMITES = {
  emAndamento: 5,
  observacoes: 3,
  formulas: 3,
  artigos: 3,
  pesquisando: 8,
  colecoes: 6,
  atividades: 8,
} as const

export class MesaService {
  private readonly repo: IMesaRepository

  constructor(repo?: IMesaRepository) {
    // Injeção de dependência: facilita testes unitários.
    // Em produção, usa a implementação padrão do Supabase.
    this.repo = repo ?? new SupabaseMesaRepository()
  }

  /**
   * Monta a visão completa da Mesa de Pesquisa.
   * Todas as seções são carregadas em paralelo — sem waterfalls.
   * Erros em seções individuais retornam array vazio (degradação graciosa).
   */
  async getMesaView(tenantId: string, userId: string): Promise<MesaView> {
    const [bilhete, emAndamento, observacoes, formulas, artigos, pesquisando, colecoes, cadernoStats, atividades] =
      await Promise.all([
        this.repo.getBilheteAtivo(tenantId).catch(() => null),
        this.repo.getEmAndamento(tenantId, LIMITES.emAndamento).catch(() => []),
        this.repo.getUltimasObservacoes(tenantId, LIMITES.observacoes).catch(() => []),
        this.repo.getUltimasFormulas(tenantId, LIMITES.formulas).catch(() => []),
        this.repo.getUltimosArtigos(tenantId, LIMITES.artigos).catch(() => []),
        this.repo.getContinuarPesquisando(tenantId, userId, LIMITES.pesquisando).catch(() => []),
        this.repo.getColecoes(tenantId, userId, LIMITES.colecoes).catch(() => []),
        this.repo.getCadernoStats(tenantId).catch(() => ({ hipoteses: 0, emObservacao: 0, parcialmenteValidadas: 0, validadas: 0, refutadas: 0, arquivadas: 0, total: 0 })),
        this.repo.getAtividadesRecentes(tenantId, LIMITES.atividades).catch(() => []),
      ])

    return {
      bilhete,
      emAndamento,
      observacoes,
      formulas,
      artigos,
      pesquisando,
      colecoes,
      cadernoStats,
      atividades,
    }
  }

  /**
   * Busca apenas o bilhete ativo (para refresh sem recarregar a página inteira).
   */
  async getBilheteAtivo(tenantId: string): Promise<BilheteView | null> {
    return this.repo.getBilheteAtivo(tenantId).catch(() => null)
  }

  /**
   * Marca bilhete como lido.
   * Chamado quando a usuária abre o bilhete.
   * Idempotente: pode ser chamado várias vezes sem efeito colateral.
   */
  async marcarComoLido(bilheteId: string, tenantId: string): Promise<void> {
    await this.repo.marcarComoLido(bilheteId, tenantId)
  }

  /**
   * Fixa ou desfixa um bilhete.
   * Bilhetes fixados aparecem sempre na Mesa, mesmo após lidos.
   */
  async fixarBilhete(bilheteId: string, tenantId: string, fixado: boolean): Promise<void> {
    await this.repo.fixarBilhete(bilheteId, tenantId, fixado)
  }

  /**
   * Arquiva um bilhete.
   * Bilhetes arquivados não aparecem na Mesa, mas jamais são deletados.
   */
  async arquivarBilhete(bilheteId: string, tenantId: string): Promise<void> {
    await this.repo.arquivarBilhete(bilheteId, tenantId)
  }
}

// ─────────────────────────────────────────────
// Instância singleton para uso nas Server Actions
// (evita criar nova instância a cada request)
// ─────────────────────────────────────────────
export const mesaService = new MesaService()
