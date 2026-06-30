// ============================================================
// Tipos — Casos Clínicos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Casos não são prontuários. São histórias clínicas.
// Cada tipo reflete raciocínio clínico, não burocracia.
// ============================================================

// ─────────────────────────────────────────────
// Status do Caso
// ─────────────────────────────────────────────

export type StatusCaso =
  | 'em_avaliacao'
  | 'em_tratamento'
  | 'em_acompanhamento'
  | 'alta_clinica'
  | 'arquivado'
  // valores legados do banco (mantidos para compatibilidade)
  | 'aberto'
  | 'encerrado'

export interface StatusCasoMeta {
  label: string
  descricao: string
  cor: string
  ordem: number
  icone: string
}

export const STATUS_CASO_META: Record<StatusCaso, StatusCasoMeta> = {
  em_avaliacao: {
    label: 'Em avaliação',
    descricao: 'Caso em fase inicial de avaliação diagnóstica.',
    cor: 'var(--texto-terciario)',
    ordem: 1,
    icone: '○',
  },
  em_tratamento: {
    label: 'Em tratamento',
    descricao: 'Protocolo em andamento.',
    cor: 'var(--amarelo-600, #ca8a04)',
    ordem: 2,
    icone: '◐',
  },
  em_acompanhamento: {
    label: 'Em acompanhamento',
    descricao: 'Tratamento concluído; paciente em observação.',
    cor: 'var(--verde-600, #16a34a)',
    ordem: 3,
    icone: '◕',
  },
  alta_clinica: {
    label: 'Alta clínica',
    descricao: 'Objetivos alcançados. Alta formal registrada.',
    cor: 'var(--terracota-500)',
    ordem: 4,
    icone: '●',
  },
  arquivado: {
    label: 'Arquivado',
    descricao: 'Caso encerrado e arquivado na biblioteca.',
    cor: 'var(--texto-terciario)',
    ordem: 5,
    icone: '—',
  },
  // Aliases legados
  aberto: {
    label: 'Em avaliação',
    descricao: 'Caso em avaliação inicial.',
    cor: 'var(--texto-terciario)',
    ordem: 1,
    icone: '○',
  },
  encerrado: {
    label: 'Alta clínica',
    descricao: 'Caso encerrado.',
    cor: 'var(--terracota-500)',
    ordem: 4,
    icone: '●',
  },
}

export const STATUS_PRINCIPAIS: StatusCaso[] = [
  'em_avaliacao',
  'em_tratamento',
  'em_acompanhamento',
  'alta_clinica',
  'arquivado',
]

// ─────────────────────────────────────────────
// Tipo de Evolução
// ─────────────────────────────────────────────

export type TipoEvolucaoCaso =
  | 'consulta'
  | 'retorno'
  | 'avaliacao_resultado'
  | 'intercorrencia'
  | 'encerramento'
  | 'outro'

export interface TipoEvolucaoMeta {
  label: string
  icone: string
}

export const TIPO_EVOLUCAO_META: Record<TipoEvolucaoCaso, TipoEvolucaoMeta> = {
  consulta:           { label: 'Consulta',            icone: '○' },
  retorno:            { label: 'Retorno',              icone: '↻' },
  avaliacao_resultado:{ label: 'Avaliação de resultado', icone: '◎' },
  intercorrencia:     { label: 'Intercorrência',       icone: '△' },
  encerramento:       { label: 'Encerramento',         icone: '●' },
  outro:              { label: 'Registro',             icone: '·' },
}

// ─────────────────────────────────────────────
// Views — Evolução
// ─────────────────────────────────────────────

export interface EvolucaoView {
  id: string
  tenantId: string
  casoId: string
  tipo: TipoEvolucaoCaso
  dataAtendimento: string
  descricao: string
  observacoesClinices: string | null
  reacoesAdversas: string | null
  satisfacaoPaciente: number | null
  resultados: string | null
  versaoProtocoloId: string | null
  criadoEm: string
}

// ─────────────────────────────────────────────
// Views — Foto
// ─────────────────────────────────────────────

export type TipoFoto = 'antes' | 'durante' | 'depois' | 'comparacao' | 'detalhe'

export interface FotoView {
  id: string
  casoId: string
  tipo: TipoFoto
  angulo: string | null
  iluminacao: string | null
  dataFoto: string | null
  notas: string | null
  criadoEm: string
  // URL resolvida do storage (null se não disponível)
  url: string | null
}

// ─────────────────────────────────────────────
// Views — Conexão
// ─────────────────────────────────────────────

export type TipoConexaoCaso =
  | 'observacao'
  | 'protocolo'
  | 'formula'
  | 'referencia'
  | 'ativo'

export interface ConexaoCaso {
  tipo: TipoConexaoCaso
  id: string
  titulo: string
  subtitulo?: string
  href: string
}

// ─────────────────────────────────────────────
// Views — Caso (listagem)
// ─────────────────────────────────────────────

export interface CasoView {
  id: string
  tenantId: string
  codigoAnonimizado: string | null
  objetivoPrincipal: string | null
  queixaPrincipal: string | null
  status: StatusCaso
  tags: string[]
  favorito: boolean
  totalEvolucoes: number
  totalFotos: number
  abertoEm: string
  atualizadoEm: string
}

// ─────────────────────────────────────────────
// Views — Caso Detalhe
// ─────────────────────────────────────────────

export interface CasoDetalheView extends CasoView {
  hipoteses: string | null
  resumoClinico: string | null
  objetivos: string[]
  observacoesIniciais: string | null
  resultadoGeral: string | null
  motivoEncerramento: string | null
  encerradoEm: string | null
  evolucoes: EvolucaoView[]
  fotos: FotoView[]
  conexoes: ConexaoCaso[]
}

// ─────────────────────────────────────────────
// Filtros
// ─────────────────────────────────────────────

export interface CasoFiltros {
  busca: string
  status: string        // '' = todos
  favorito: boolean
  tags: string[]
  ordenar: 'recente' | 'antigo' | 'codigo'
  limite: number
  offset: number
}

// ─────────────────────────────────────────────
// Inputs — Criação
// ─────────────────────────────────────────────

export interface CriarCasoInput {
  codigoAnonimizado: string
  objetivoPrincipal: string
  queixaPrincipal: string
  hipoteses: string
  observacoesIniciais: string
  status: StatusCaso
  tags: string[]
}

export interface CriarEvolucaoInput {
  casoId: string
  tipo: TipoEvolucaoCaso
  dataAtendimento: string       // ISO datetime string
  descricao: string
  observacoesClinices: string
  reacoesAdversas: string
  satisfacaoPaciente: number | null
  resultados: string
  versaoProtocoloId: string | null
}

// ─────────────────────────────────────────────
// Editor — campos do formulário
// ─────────────────────────────────────────────

export interface CasoEditorCampos {
  codigoAnonimizado: string
  objetivoPrincipal: string
  queixaPrincipal: string
  hipoteses: string
  observacoesIniciais: string
  status: StatusCaso
  tags: string[]
}

export interface EvolucaoEditorCampos {
  tipo: TipoEvolucaoCaso
  dataAtendimento: string
  descricao: string
  observacoesClinices: string
  reacoesAdversas: string
  satisfacaoPaciente: string    // string no form → number | null no submit
  resultados: string
  versaoProtocoloId: string
}
