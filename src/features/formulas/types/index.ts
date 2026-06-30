// ============================================================
// Types — Capítulo V: Fórmulas
// Biblioteca Cosmetológica Rafa Rabelo
// ============================================================
// Uma fórmula não é uma receita.
// É uma hipótese transformada em composição.
// Cada versão é conhecimento acumulado.
// ============================================================

// ── Status de versão ──────────────────────────────────────

export type StatusVersaoFormula = 'rascunho' | 'ativa' | 'substituida' | 'arquivada'

export interface StatusVersaoMeta {
  label:    string
  cor:      string
  descricao: string
  ordem:    number
}

export const STATUS_VERSAO_META: Record<StatusVersaoFormula, StatusVersaoMeta> = {
  rascunho:   { label: 'Rascunho',    cor: 'var(--texto-terciario)',         descricao: 'Em desenvolvimento',       ordem: 1 },
  ativa:      { label: 'Ativa',       cor: 'var(--verde-600, #16a34a)',       descricao: 'Versão atual em uso',      ordem: 2 },
  substituida:{ label: 'Substituída', cor: 'var(--amarelo-600, #ca8a04)',     descricao: 'Substituída por versão mais recente', ordem: 3 },
  arquivada:  { label: 'Arquivada',   cor: 'var(--texto-terciario)',         descricao: 'Encerrada',                ordem: 4 },
}

// ── Fase de incorporação ──────────────────────────────────

export type FaseIncorporacao =
  | 'fase_aquosa'
  | 'fase_oleosa'
  | 'fase_emulsificante'
  | 'fase_final'
  | 'ativo_principal'
  | 'preservante'
  | 'ajuste_ph'
  | 'outro'

export const FASE_META: Record<FaseIncorporacao, { label: string; abrev: string; cor: string }> = {
  fase_aquosa:       { label: 'Fase Aquosa',       abrev: 'A', cor: '#0ea5e9' },
  fase_oleosa:       { label: 'Fase Oleosa',       abrev: 'B', cor: '#f59e0b' },
  fase_emulsificante:{ label: 'Fase Emulsificante',abrev: 'C', cor: '#8b5cf6' },
  fase_final:        { label: 'Fase Final',        abrev: 'D', cor: '#ec4899' },
  ativo_principal:   { label: 'Ativo Principal',   abrev: '★', cor: 'var(--terracota-500)' },
  preservante:       { label: 'Preservante',       abrev: 'P', cor: '#6b7280' },
  ajuste_ph:         { label: 'Ajuste de pH',      abrev: 'pH',cor: '#059669' },
  outro:             { label: 'Outro',             abrev: '○', cor: 'var(--texto-terciario)' },
}

// ── Ativo / Ingrediente ───────────────────────────────────

export interface IngredienteView {
  id:              string
  composicaoId:    string
  ativoId:         string
  nomeAtivo:       string        // ativos_cosmeticos.nome_inci ou nome_popular
  nomeCientifico?: string
  fase:            FaseIncorporacao
  concentracao:    number
  unidade:         string        // geralmente '%'
  funcaoNaFormula?: string
  observacoes?:    string
  ordem:           number
}

// ── Versão da fórmula ─────────────────────────────────────

export interface VersaoView {
  id:              string
  formulaId:       string
  tenantId:        string
  numeroVersao:    number
  titulo:          string
  objetivo?:       string
  descricao?:      string
  veiculo?:        string
  modoPreparo?:    string
  modoUso?:        string
  instrucoes?:     string
  indicacoes?:     string
  contraindicacoes?: string
  validadeDias?:   number
  status:          StatusVersaoFormula
  motivoAlteracao?: string
  ingredientes:    IngredienteView[]
  criadoEm:        string
  atualizadoEm:    string
}

// ── Conexão com o ecossistema ─────────────────────────────

export type TipoConexaoFormula = 'observacao' | 'protocolo' | 'caso' | 'referencia'

export interface ConexaoFormula {
  tipo:      TipoConexaoFormula
  id:        string
  titulo:    string
  subtitulo?: string
  href:      string
}

// ── Vista de fórmula (listagem) ───────────────────────────

export interface FormulaView {
  id:              string
  tenantId:        string
  codigoInterno?:  string
  favorito:        boolean
  tags:            string[]
  // Dados da versão ativa
  titulo:          string
  objetivo?:       string
  veiculo?:        string
  versaoAtiva:     number
  statusVersao:    StatusVersaoFormula
  totalAtivos:     number
  totalCasos:      number
  totalProtocolos: number
  criadoEm:        string
  atualizadoEm:    string
}

// ── Vista de detalhe ──────────────────────────────────────

export interface FormulaDetalheView extends FormulaView {
  versoes:   VersaoView[]  // histórico completo, desc por numero_versao
  conexoes:  ConexaoFormula[]
}

// ── Comparação entre versões ──────────────────────────────

export interface DiferencaIngrediente {
  ativoId:       string
  nomeAtivo:     string
  tipo:          'adicionado' | 'removido' | 'alterado'
  concentracaoAntes?: number
  concentracaoDepois?: number
  unidade:       string
  faseAntes?:    FaseIncorporacao
  faseDepois?:   FaseIncorporacao
}

export interface FormulaComparacao {
  versaoA: Pick<VersaoView, 'id' | 'numeroVersao' | 'titulo' | 'criadoEm' | 'motivoAlteracao'>
  versaoB: Pick<VersaoView, 'id' | 'numeroVersao' | 'titulo' | 'criadoEm' | 'motivoAlteracao'>
  ingredientes:   DiferencaIngrediente[]
  mudancaVeiculo?: { antes: string; depois: string }
  mudancaModoUso?: { antes: string; depois: string }
  semMudancas:    boolean
}

// ── Filtros ───────────────────────────────────────────────

export interface FormulaFiltros {
  busca:    string
  status:   string          // status da versão ativa
  favorito: boolean
  tags:     string[]
  ordenar:  'atualizadoEm' | 'titulo' | 'versaoAtiva'
  limite:   number
  offset:   number
}

// ── Inputs de criação ──────────────────────────────────────

export interface CriarFormulaInput {
  codigoInterno?: string
  titulo:         string
  objetivo?:      string
  veiculo?:       string
  descricao?:     string
  modoPreparo?:   string
  modoUso?:       string
  instrucoes?:    string
  indicacoes?:    string
  contraindicacoes?: string
  validadeDias?:  number
  tags:           string[]
  ingredientes:   CriarIngredienteInput[]
}

export interface CriarIngredienteInput {
  ativoId:         string
  fase:            FaseIncorporacao
  concentracao:    number
  unidade:         string
  funcaoNaFormula?: string
  observacoes?:    string
  ordem:           number
}

export interface CriarVersaoInput {
  formulaId:       string
  titulo:          string
  objetivo?:       string
  veiculo?:        string
  descricao?:      string
  modoPreparo?:    string
  modoUso?:        string
  instrucoes?:     string
  indicacoes?:     string
  contraindicacoes?: string
  validadeDias?:   number
  motivoAlteracao: string   // OBRIGATÓRIO ao criar nova versão
  ingredientes:    CriarIngredienteInput[]
}

// ── Campos para o editor ──────────────────────────────────

export interface FormulaEditorCampos {
  codigoInterno: string
  titulo:        string
  objetivo:      string
  veiculo:       string
  descricao:     string
  modoPreparo:   string
  modoUso:       string
  instrucoes:    string
  indicacoes:    string
  contraindicacoes: string
  validadeDias:  string    // string para input
  tags:          string[]
  ingredientes:  IngredienteEditorItem[]
}

export interface IngredienteEditorItem {
  _key:            string  // id temporário para controle React
  ativoId:         string
  ativoNome:       string  // nome exibido no editor
  fase:            FaseIncorporacao
  concentracao:    string  // string para input
  unidade:         string
  funcaoNaFormula: string
  observacoes:     string
  ordem:           number
}

export interface VersaoEditorCampos {
  titulo:          string
  objetivo:        string
  veiculo:         string
  descricao:       string
  modoPreparo:     string
  modoUso:         string
  instrucoes:      string
  indicacoes:      string
  contraindicacoes: string
  validadeDias:    string
  motivoAlteracao: string   // sempre obrigatório
  ingredientes:    IngredienteEditorItem[]
}

// ── Ativo disponível para seleção no editor ───────────────

export interface AtivoDisponivel {
  id:             string
  nome:           string
  nomeINCIDisplay?: string
  categoria?:     string
}
