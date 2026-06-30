// ============================================================
// Tipos de Domínio — Acervo Científico
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Toda a linguagem de domínio do Acervo vive aqui.
// Nenhum componente importa do banco diretamente.
// ============================================================

import type { TipoEstudo, NivelEvidencia } from '@/types/database'

export type { TipoEstudo, NivelEvidencia }

// ─────────────────────────────────────────────
// Metadados de Tipo de Estudo
// ─────────────────────────────────────────────

export interface TipoEstudoMeta {
  label: string
  icone: string
  descricao: string
  /** Peso epistêmico relativo (1=menor, 5=maior) */
  pesoEpistemico: number
}

export const TIPOS_ESTUDO: Record<TipoEstudo, TipoEstudoMeta> = {
  meta_analise: {
    label: 'Meta-análise',
    icone: '◈',
    descricao: 'Síntese quantitativa de múltiplos estudos primários',
    pesoEpistemico: 5,
  },
  revisao_sistematica: {
    label: 'Revisão Sistemática',
    icone: '⊞',
    descricao: 'Revisão estruturada com protocolo pré-definido',
    pesoEpistemico: 5,
  },
  ensaio_clinico_randomizado: {
    label: 'Ensaio Clínico Randomizado',
    icone: '⊿',
    descricao: 'ECR — padrão ouro em eficácia de intervenções',
    pesoEpistemico: 4,
  },
  estudo_clinico: {
    label: 'Estudo Clínico',
    icone: '◎',
    descricao: 'Estudo clínico sem randomização completa',
    pesoEpistemico: 3,
  },
  coorte: {
    label: 'Coorte',
    icone: '⊙',
    descricao: 'Acompanhamento longitudinal de grupo exposto e não exposto',
    pesoEpistemico: 3,
  },
  caso_controle: {
    label: 'Caso-controle',
    icone: '⊖',
    descricao: 'Comparação retrospectiva entre casos e controles',
    pesoEpistemico: 2,
  },
  estudo_transversal: {
    label: 'Estudo Transversal',
    icone: '⊕',
    descricao: 'Avaliação em um ponto único no tempo',
    pesoEpistemico: 2,
  },
  estudo_in_vitro: {
    label: 'Estudo In Vitro',
    icone: '⬡',
    descricao: 'Experimento em células ou tecidos fora do organismo',
    pesoEpistemico: 2,
  },
  estudo_em_animais: {
    label: 'Estudo em Animais',
    icone: '⬢',
    descricao: 'Pesquisa pré-clínica em modelos animais',
    pesoEpistemico: 2,
  },
  revisao_narrativa: {
    label: 'Revisão Narrativa',
    icone: '≡',
    descricao: 'Revisão não sistemática da literatura',
    pesoEpistemico: 1,
  },
  artigo_opiniao: {
    label: 'Artigo de Opinião',
    icone: '∿',
    descricao: 'Posicionamento de especialista sem metodologia primária',
    pesoEpistemico: 1,
  },
  // Valores existentes mantidos para compatibilidade
  estudo_observacional: {
    label: 'Estudo Observacional',
    icone: '◌',
    descricao: 'Observação sem intervenção controlada',
    pesoEpistemico: 2,
  },
  relato_caso: {
    label: 'Relato de Caso',
    icone: '○',
    descricao: 'Descrição de caso individual ou série pequena',
    pesoEpistemico: 1,
  },
  estudo_in_vivo: {
    label: 'Estudo In Vivo',
    icone: '⬟',
    descricao: 'Experimento em organismo completo',
    pesoEpistemico: 2,
  },
  diretriz: {
    label: 'Diretriz',
    icone: '▤',
    descricao: 'Recomendação oficial de sociedade científica ou órgão regulador',
    pesoEpistemico: 4,
  },
  consenso: {
    label: 'Consenso',
    icone: '▦',
    descricao: 'Declaração de consenso de especialistas',
    pesoEpistemico: 3,
  },
  outro: {
    label: 'Outro',
    icone: '○',
    descricao: 'Tipo não classificado nas categorias acima',
    pesoEpistemico: 1,
  },
}

// ─────────────────────────────────────────────
// Metadados de Nível de Evidência (Oxford/GRADE)
// ─────────────────────────────────────────────

export interface NivelEvidenciaMeta {
  label: string
  descricao: string
  /** Peso: 6 (mais forte) → 1 (mais fraco) */
  peso: number
  /** Cor semântica para visualização */
  cor: 'verde_escuro' | 'verde' | 'oliva' | 'ambar' | 'laranja' | 'terracota' | 'neutro'
  /** Abreviação para exibição compacta */
  abrev: string
}

export const NIVEIS_EVIDENCIA: Record<NivelEvidencia, NivelEvidenciaMeta> = {
  ia: {
    label: 'Ia — Meta-análise de ECRs',
    descricao: 'Meta-análise de ensaios clínicos randomizados com homogeneidade',
    peso: 6,
    cor: 'verde_escuro',
    abrev: 'Ia',
  },
  ib: {
    label: 'Ib — ECR',
    descricao: 'Ensaio clínico randomizado individual',
    peso: 5,
    cor: 'verde',
    abrev: 'Ib',
  },
  iia: {
    label: 'IIa — Coorte',
    descricao: 'Estudo de coorte bem delineado',
    peso: 4,
    cor: 'oliva',
    abrev: 'IIa',
  },
  iib: {
    label: 'IIb — Coorte fraco',
    descricao: 'Estudo de coorte ou caso-controle de menor qualidade',
    peso: 3,
    cor: 'ambar',
    abrev: 'IIb',
  },
  iii: {
    label: 'III — Caso-controle',
    descricao: 'Estudo caso-controle',
    peso: 2,
    cor: 'laranja',
    abrev: 'III',
  },
  iv: {
    label: 'IV — Série de casos',
    descricao: 'Série de casos ou estudos de baixa qualidade',
    peso: 2,
    cor: 'terracota',
    abrev: 'IV',
  },
  v: {
    label: 'V — Opinião',
    descricao: 'Opinião de especialistas, relatos anedóticos',
    peso: 1,
    cor: 'neutro',
    abrev: 'V',
  },
}

// ─────────────────────────────────────────────
// Views de Domínio
// ─────────────────────────────────────────────

export interface ConexaoAcervo {
  id: string
  tipo: 'ativo' | 'formula' | 'referencia' | 'caso' | 'protocolo' | 'observacao'
  label: string
  nota?: string | null
}

export interface ReferenciaView {
  id: string
  titulo: string
  autores: string[]
  anoPublicacao: number | null
  journal: string | null
  doi: string | null
  pmid: string | null
  url: string | null
  abstract: string | null
  tipoEstudo: TipoEstudo | null
  nivelEvidencia: NivelEvidencia | null
  conclusoesPrincipais: string | null
  notasPessoais: string | null
  tags: string[]
  favorito: boolean
  totalConexoes: number
  criadoEm: string
  atualizadoEm: string
}

export interface ReferenciaDetalheView extends ReferenciaView {
  isbn: string | null
  limitacoes: string | null
  populacaoEstudo: string | null
  nAmostras: number | null
  conflitoInteresses: boolean | null
  acessadoEm: string | null
  statusExtracao: string
  conexoes: ConexaoAcervo[]
}

// ─────────────────────────────────────────────
// Listagem com paginação
// ─────────────────────────────────────────────

export interface AcervoListagem {
  referencias: ReferenciaView[]
  total: number
  pagina: number
  temMais: boolean
}

// ─────────────────────────────────────────────
// Filtros de busca
// ─────────────────────────────────────────────

export interface AcervoFiltros {
  busca?: string           // fulltext: título, autores, abstract, DOI, PMID, journal
  tipoEstudo?: TipoEstudo
  nivelEvidencia?: NivelEvidencia
  anoMin?: number
  anoMax?: number
  favorito?: boolean
  tags?: string[]
  ordenar?: 'mais_recente' | 'mais_antigo' | 'titulo' | 'ano'
  limite?: number
  pagina?: number
}

// ─────────────────────────────────────────────
// Inputs de operação
// ─────────────────────────────────────────────

export interface CriarReferenciaInput {
  titulo: string
  autores?: string[]
  anoPublicacao?: number | null
  journal?: string | null
  doi?: string | null
  pmid?: string | null
  isbn?: string | null
  url?: string | null
  abstract?: string | null
  tipoEstudo?: TipoEstudo | null
  nivelEvidencia?: NivelEvidencia | null
  populacaoEstudo?: string | null
  nAmostras?: number | null
  conclusoesPrincipais?: string | null
  limitacoes?: string | null
  conflitoInteresses?: boolean | null
  acessadoEm?: string | null
  notasPessoais?: string | null
  tags?: string[]
}

export interface AtualizarReferenciaInput extends Partial<CriarReferenciaInput> {
  referenciaId: string
}

export interface SalvarConexoesAcervoInput {
  referenciaId: string
  ativos?: string[]
  formulas?: string[]
  protocolos?: string[]
  casos?: string[]
  observacoes?: string[]
}
