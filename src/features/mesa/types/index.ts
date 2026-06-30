// ============================================================
// Mesa de Pesquisa — Tipos de Domínio
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Estes tipos são o contrato entre a camada de Application
// e a interface. Nunca exportam tipos do Supabase diretamente.
// A interface consome apenas estes tipos — nunca Row types.
// ============================================================

// Tipos de entidade que a Mesa exibe
export type TipoEntidadeMesa =
  | 'ativo'
  | 'formula'
  | 'artigo'
  | 'caso'
  | 'observacao'
  | 'protocolo'

// Cores de badge disponíveis para EntityCard
export type BadgeColor = 'green' | 'amber' | 'red' | 'blue' | 'purple' | 'gray'

// ─────────────────────────────────────────────
// Bilhete da Aurora
// ─────────────────────────────────────────────

/**
 * Bilhete da Aurora como a interface o vê.
 * Tudo já transformado pelo Application Service —
 * o componente não precisa conhecer a tabela.
 */
export interface BilheteView {
  id: string
  /** Texto curto exibido quando o bilhete está fechado */
  preview: string
  /** Saudação (primeira linha da mensagem) */
  saudacao: string
  /** Parágrafos do corpo da mensagem */
  paragrafos: string[]
  /** Ex: "— Aurora ✿" ou "A." para primeira visita */
  assinatura: string
  /** Se lido_em !== null */
  lido: boolean
  /** Se aparece fixado no topo independente de leitura */
  fixado: boolean
}

// ─────────────────────────────────────────────
// Cards de Entidade
// ─────────────────────────────────────────────

/**
 * Card genérico para EntityCard.
 * Usado em: Em andamento, Últimas observações, Últimas fórmulas.
 */
export interface CardView {
  id: string
  type: TipoEntidadeMesa
  titulo: string
  subtitulo?: string
  descricao?: string
  badge?: string
  badgeColor?: BadgeColor
  atualizadoEm: string      // ISO 8601
  icone?: string
  href?: string              // link para a entidade
}

// ─────────────────────────────────────────────
// Artigos
// ─────────────────────────────────────────────

/**
 * Artigo científico para PaperCard.
 */
export interface ArtigoView {
  id: string
  titulo: string
  autores: string[]
  journal: string
  ano: number
  doi?: string
  resumo: string
  tags: string[]
}

// ─────────────────────────────────────────────
// Chips de pesquisa
// ─────────────────────────────────────────────

/**
 * Chip de "Continuar pesquisando".
 * Representa uma entidade com leitura incompleta (reading_progress).
 */
export interface ChipView {
  id: string                 // entity_id
  label: string              // título da entidade
  tipo: TipoEntidadeMesa
  href?: string
  percentual: number         // 1–99 (nunca 0 ou 100 aqui)
}

// ─────────────────────────────────────────────
// Estatísticas do Caderno de Campo
// ─────────────────────────────────────────────

export interface CadernoStats {
  hipoteses: number
  emObservacao: number
  parcialmenteValidadas: number
  validadas: number
  refutadas: number
  arquivadas: number
  total: number
}

// ─────────────────────────────────────────────
// Atividade recente
// ─────────────────────────────────────────────

export interface AtividadeRecente {
  id: string
  tipo: TipoEntidadeMesa
  descricao: string
  badgeLabel: string
  badgeColor: BadgeColor
  realizadaEm: string   // ISO 8601
  href?: string
}

// ─────────────────────────────────────────────
// Mesa View — modelo completo
// ─────────────────────────────────────────────

/**
 * A visão completa da Mesa de Pesquisa.
 * Montada pelo MesaService, consumida por mesa/page.tsx.
 * Cada campo pode ser um array vazio — a interface cuida do Empty State.
 */
export interface MesaView {
  bilhete: BilheteView | null
  emAndamento: CardView[]
  observacoes: CardView[]
  formulas: CardView[]
  artigos: ArtigoView[]
  pesquisando: ChipView[]
  colecoes: CardView[]
  cadernoStats: CadernoStats
  atividades: AtividadeRecente[]
}
