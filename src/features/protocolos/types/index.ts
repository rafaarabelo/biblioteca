// ============================================================
// Protocolos — Domain Types
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Protocolos não são receitas. São conhecimento amadurecido.
// ============================================================

// ─────────────────────────────────────────────
// MATURIDADE
// ─────────────────────────────────────────────

export type MaturidadeProtocolo =
  | 'hipotese'
  | 'em_validacao'
  | 'validado_internamente'
  | 'consolidado'
  | 'referencia_biblioteca'

export interface MaturidadeMeta {
  label: string
  descricao: string
  ordem: number
  cor: string        // CSS custom property ou hex
  icone: string      // caractere ou descrição semântica
}

export const MATURIDADES_PROTOCOLO: Record<MaturidadeProtocolo, MaturidadeMeta> = {
  hipotese: {
    label: 'Hipótese',
    descricao: 'Ideia inicial. Sem validação clínica ainda.',
    ordem: 1,
    cor: 'var(--texto-terciario)',
    icone: '○',
  },
  em_validacao: {
    label: 'Em validação',
    descricao: 'Em processo ativo de teste e observação.',
    ordem: 2,
    cor: 'var(--amarelo-600, #ca8a04)',
    icone: '◐',
  },
  validado_internamente: {
    label: 'Validado internamente',
    descricao: 'Resultados consistentes na clínica da Rafa.',
    ordem: 3,
    cor: 'var(--verde-600, #16a34a)',
    icone: '◕',
  },
  consolidado: {
    label: 'Consolidado',
    descricao: 'Estável. Múltiplas versões e casos documentados.',
    ordem: 4,
    cor: 'var(--terracota-600, #b45309)',
    icone: '●',
  },
  referencia_biblioteca: {
    label: 'Referência da Biblioteca',
    descricao: 'Protocolo de excelência. Referência do método MRR.',
    ordem: 5,
    cor: 'var(--terracota-500)',
    icone: '★',
  },
}

// ─────────────────────────────────────────────
// FASE DO PROTOCOLO (sequência de aplicação)
// ─────────────────────────────────────────────

export interface FaseProtocoloView {
  id: string
  versaoProtocoloId: string
  nome: string
  descricao: string | null
  duracaoSemanas: number | null
  ordem: number
  instrucoes: string | null
  formulasIndicadas: string[]  // IDs de versoes_formula
}

// ─────────────────────────────────────────────
// VERSÃO DO PROTOCOLO
// ─────────────────────────────────────────────

export interface VersaoProtocoloView {
  id: string
  protocoloId: string
  numeroVersao: number
  titulo: string
  objetivo: string | null
  descricao: string | null
  indicacoes: string | null
  contraindicacoes: string | null
  maturidade: MaturidadeProtocolo
  duracaoSemanas: number | null
  frequenciaSessoes: string | null
  observacoesImportantes: string | null
  autor: string | null
  motivoAlteracao: string | null  // justificativa da revisão
  status: 'rascunho' | 'ativa' | 'substituida' | 'arquivada'
  criadoEm: Date
  fases: FaseProtocoloView[]
}

// ─────────────────────────────────────────────
// CONEXÃO DE PROTOCOLO
// ─────────────────────────────────────────────

export type TipoConexaoProtocolo =
  | 'observacao'
  | 'ativo'
  | 'formula'
  | 'referencia'
  | 'caso'

export interface ConexaoProtocolo {
  tipo: TipoConexaoProtocolo
  id: string
  titulo: string
  subtitulo?: string
  href: string
}

// ─────────────────────────────────────────────
// VIEWS PRINCIPAIS
// ─────────────────────────────────────────────

/** Protocolo compacto — usado na listagem /protocolos */
export interface ProtocoloView {
  id: string
  tenantId: string
  codigoInterno: string | null
  titulo: string          // título da versão ativa
  objetivo: string | null // objetivo da versão ativa
  indicacoes: string | null
  maturidade: MaturidadeProtocolo
  tags: string[]
  favorito: boolean
  totalVersoes: number
  totalCasos: number
  totalConexoes: number
  criadoEm: Date
  atualizadoEm: Date
}

/** Protocolo completo — usado na página /protocolos/[id] */
export interface ProtocoloDetalheView extends ProtocoloView {
  versaoAtiva: VersaoProtocoloView
  historicoVersoes: VersaoProtocoloView[]  // todas as versões (imutáveis)
  conexoes: ConexaoProtocolo[]
}

// ─────────────────────────────────────────────
// FILTROS
// ─────────────────────────────────────────────

export interface ProtocoloFiltros {
  busca: string
  maturidade: MaturidadeProtocolo | ''
  favorito: boolean
  tags: string[]
  ordenar: 'recente' | 'antigo' | 'titulo' | 'maturidade'
  limite: number
  offset: number
}

// ─────────────────────────────────────────────
// INPUTS DE CRIAÇÃO / EDIÇÃO
// ─────────────────────────────────────────────

export interface CriarProtocoloInput {
  titulo: string
  objetivo: string
  descricao: string
  indicacoes: string
  contraindicacoes: string
  maturidade: MaturidadeProtocolo
  duracaoSemanas: number | null
  frequenciaSessoes: string
  observacoesImportantes: string
  autor: string
  tags: string[]
  codigoInterno: string
  fases: CriarFaseInput[]
}

export interface CriarFaseInput {
  nome: string
  descricao: string
  instrucoes: string
  duracaoSemanas: number | null
  ordem: number
  formulasIndicadas: string[]
}

export interface NovaVersaoProtocoloInput {
  protocoloId: string
  titulo: string
  objetivo: string
  descricao: string
  indicacoes: string
  contraindicacoes: string
  maturidade: MaturidadeProtocolo
  duracaoSemanas: number | null
  frequenciaSessoes: string
  observacoesImportantes: string
  autor: string
  motivoAlteracao: string      // obrigatório ao criar nova versão
  fases: CriarFaseInput[]
}

export interface SalvarConexoesProtocoloInput {
  protocoloId: string
  ativoIds: string[]
  tags: string[]
}

// ─────────────────────────────────────────────
// CAMPOS DO EDITOR (client-side state)
// ─────────────────────────────────────────────

export interface ProtocoloEditorCampos {
  titulo: string
  objetivo: string
  descricao: string
  indicacoes: string
  contraindicacoes: string
  maturidade: MaturidadeProtocolo
  duracaoSemanas: string       // string no form, parseado para number na action
  frequenciaSessoes: string
  observacoesImportantes: string
  autor: string
  motivoAlteracao: string
  tags: string[]
  codigoInterno: string
  fases: FaseEditorCampos[]
}

export interface FaseEditorCampos {
  id?: string                  // presente ao editar fase existente
  nome: string
  descricao: string
  instrucoes: string
  duracaoSemanas: string
  ordem: number
}
