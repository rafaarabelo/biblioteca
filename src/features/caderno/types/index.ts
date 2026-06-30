// ============================================================
// Caderno de Campo — Tipos de Domínio
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Uma observação não é um dado. É o início de uma descoberta.
// ============================================================

// ─────────────────────────────────────────────
// Enumerações de domínio
// ─────────────────────────────────────────────

export type TipoObservacao =
  | 'observacao'       // Observação clínica direta — 🔬
  | 'hipotese'         // Hipótese ainda sem evidência — 💭
  | 'pergunta_clinica' // Pergunta em aberto — ❓
  | 'insight'          // Conexão inesperada — ✦
  | 'lembrete'         // Lembrete contextual — 📌
  | 'ideia'            // Ideia em estado germinal — 💡
  | 'descoberta'       // Descoberta com evidência — 🎯

export type StatusEpistemicoUI =
  | 'hipotese'
  | 'em_observacao'
  | 'observacao'         // alias para em_observacao (backward compat)
  | 'parcialmente_validada'
  | 'validada'
  | 'refutada'
  | 'arquivada'

// ─────────────────────────────────────────────
// Identidade visual por tipo
// ─────────────────────────────────────────────

export interface TipoObservacaoMeta {
  label: string
  icone: string
  descricao: string      // tooltip
  acento: string         // classe CSS de acento visual
}

export const TIPOS_OBSERVACAO: Record<TipoObservacao, TipoObservacaoMeta> = {
  observacao: {
    label: 'Observação',
    icone: '🔬',
    descricao: 'Observação clínica direta, ainda em registro',
    acento: 'acentoObservacao',
  },
  hipotese: {
    label: 'Hipótese',
    icone: '💭',
    descricao: 'Ideia que precisa de mais evidências para avançar',
    acento: 'acentoHipotese',
  },
  pergunta_clinica: {
    label: 'Pergunta Clínica',
    icone: '❓',
    descricao: 'Pergunta aberta que orienta a pesquisa',
    acento: 'acentoPergunta',
  },
  insight: {
    label: 'Insight',
    icone: '✦',
    descricao: 'Conexão inesperada ou clareza súbita',
    acento: 'acentoInsight',
  },
  lembrete: {
    label: 'Lembrete',
    icone: '📌',
    descricao: 'Lembrete contextual relevante para a pesquisa',
    acento: 'acentoLembrete',
  },
  ideia: {
    label: 'Ideia',
    icone: '💡',
    descricao: 'Ideia em estado germinal, ainda sem forma definida',
    acento: 'acentoIdeia',
  },
  descoberta: {
    label: 'Descoberta',
    icone: '🎯',
    descricao: 'Descoberta com evidência suficiente para registrar',
    acento: 'acentoDescoberta',
  },
}

export interface StatusEpistemicoMeta {
  label: string
  descricao: string
  peso: 1 | 2 | 3 | 4 | 5   // 1 = embrionário, 5 = maduro
  cor: 'neutro' | 'ambar' | 'verde' | 'vermelho' | 'azul'
}

export const STATUS_EPISTEMICO: Record<StatusEpistemicoUI, StatusEpistemicoMeta> = {
  hipotese: {
    label: 'Hipótese',
    descricao: 'Ideia ainda sem evidência suficiente',
    peso: 1,
    cor: 'neutro',
  },
  em_observacao: {
    label: 'Em observação',
    descricao: 'Observado mas ainda não validado sistematicamente',
    peso: 2,
    cor: 'ambar',
  },
  observacao: {
    label: 'Em observação',
    descricao: 'Observado mas ainda não validado sistematicamente',
    peso: 2,
    cor: 'ambar',
  },
  parcialmente_validada: {
    label: 'Parcialmente validada',
    descricao: 'Validação parcial — evidências insuficientes para conclusão',
    peso: 3,
    cor: 'azul',
  },
  validada: {
    label: 'Validada',
    descricao: 'Validado com evidência clínica suficiente',
    peso: 5,
    cor: 'verde',
  },
  refutada: {
    label: 'Refutada',
    descricao: 'Refutado por evidência',
    peso: 4,
    cor: 'vermelho',
  },
  arquivada: {
    label: 'Arquivada',
    descricao: 'Encerrada sem conclusão definitiva',
    peso: 4,
    cor: 'neutro',
  },
}

// ─────────────────────────────────────────────
// View types — o que a interface consome
// ─────────────────────────────────────────────

export interface VersaoView {
  id: string
  numeroVersao: number
  conteudo: string
  statusEpistemico: StatusEpistemicoUI
  justificativa: string | null
  isVersaoAtual: boolean
  criadoEm: string               // ISO string
}

export interface ConexaoCaderno {
  id: string
  tipo: 'ativo' | 'formula' | 'referencia' | 'caso' | 'protocolo' | 'colecao'
  label: string
  nota?: string | null
}

export interface ObservacaoView {
  id: string
  titulo: string
  tipo: TipoObservacao
  statusEpistemico: StatusEpistemicoUI
  nivelAcesso: string
  tags: string[]
  favorito: boolean
  // Versão atual (sempre presente para observações não-arquivadas)
  versaoAtual: VersaoView | null
  // Resumo do conteúdo para card (primeiros ~200 chars)
  excerpto: string
  // Contagem de versões para mostrar no timeline
  totalVersoes: number
  // Conexões (pode ser vazio na listagem, preenchido na detalhe)
  conexoes?: ConexaoCaderno[]
  criadoEm: string
  atualizadoEm: string
}

export interface ObservacaoDetalheView extends ObservacaoView {
  // Versão atual com conteúdo completo
  versaoAtual: VersaoView
  // Todas as versões para o timeline
  versoes: VersaoView[]
  // Conexões completas
  conexoes: ConexaoCaderno[]
}

// ─────────────────────────────────────────────
// Filtros e listagem
// ─────────────────────────────────────────────

export interface CadernoFiltros {
  busca?: string
  tipo?: TipoObservacao | null
  statusEpistemico?: StatusEpistemicoUI | null
  favorito?: boolean
  tags?: string[]
  ordenar?: 'mais_recente' | 'mais_antiga' | 'titulo'
  pagina?: number
  limite?: number
}

export interface CadernoListagem {
  observacoes: ObservacaoView[]
  total: number
  pagina: number
  totalPaginas: number
  filtrosAtivos: CadernoFiltros
}

// ─────────────────────────────────────────────
// Input para criação / revisão
// ─────────────────────────────────────────────

export interface CriarObservacaoInput {
  titulo: string
  tipo: TipoObservacao
  conteudo: string
  statusEpistemico?: StatusEpistemicoUI
  tags?: string[]
  nivelAcesso?: string
}

export interface RevisarObservacaoInput {
  observacaoId: string
  conteudo: string
  statusEpistemico: StatusEpistemicoUI
  justificativa?: string          // obrigatória se status mudou
  titulo?: string                 // opcional: atualiza o título também
  tags?: string[]
}

export interface SalvarConexoesInput {
  observacaoId: string
  // IDs a adicionar/remover por tipo
  ativos?: string[]
  formulas?: string[]
  referencias?: string[]
  casos?: string[]
  protocolos?: string[]
  colecoes?: string[]
}

// ─────────────────────────────────────────────
// Helpers de regra de negócio (sem dependências server-only)
// Exportados aqui para uso seguro em Client Components.
// ─────────────────────────────────────────────

/** Status que exigem justificativa ao revisar */
export const STATUS_REQUER_JUSTIFICATIVA: StatusEpistemicoUI[] = [
  'validada', 'refutada', 'arquivada', 'parcialmente_validada',
]

/** Verifica se um status exige justificativa ao revisar */
export function requerJustificativaStatus(status: StatusEpistemicoUI): boolean {
  return STATUS_REQUER_JUSTIFICATIVA.includes(status)
}
