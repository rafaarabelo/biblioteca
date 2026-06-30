// ============================================================
// Tipos de banco de dados — Aliases sobre supabase.generated.ts
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 2 — ADR-008 implementado
// ============================================================
// Este arquivo contém APENAS aliases, helpers e tipos derivados.
// A fonte da verdade é src/types/supabase.generated.ts (gerado pelo Supabase CLI).
//
// Para adicionar um novo alias:
//   export type NomeTabela = Database["public"]["Tables"]["nome_tabela"]["Row"]
//
// NUNCA escrever tipos de coluna aqui — eles devem vir do arquivo gerado.
// ============================================================

import type { Database } from './supabase.generated'

// Re-exportar o tipo Database para conveniência
export type { Database }
export type { Json } from './supabase.generated'

// ─────────────────────────────────────────────
// ENUMs (derivados de Database["public"]["Enums"])
// ─────────────────────────────────────────────
export type UserRole = Database['public']['Enums']['user_role']
export type TipoEntidade = Database['public']['Enums']['tipo_entidade']
export type StatusEpistemico = Database['public']['Enums']['status_epistemico']
export type TipoObservacao = Database['public']['Enums']['tipo_observacao']
export type NivelAcesso = Database['public']['Enums']['nivel_acesso']
export type NivelEvidencia = Database['public']['Enums']['nivel_evidencia']
export type TipoEstudo = Database['public']['Enums']['tipo_estudo']
export type TipoAudit = Database['public']['Enums']['tipo_audit']
export type StatusFormula = Database['public']['Enums']['status_versao']
export type StatusVersao = Database['public']['Enums']['status_versao']
export type StatusProtocolo = Database['public']['Enums']['maturidade_protocolo']
export type StatusCaso = Database['public']['Enums']['status_caso']
export type TipoEvolucao = Database['public']['Enums']['tipo_evolucao_caso']
export type FaseIncorporacao = Database['public']['Enums']['fase_incorporacao']
export type MaturidadeProtocolo = Database['public']['Enums']['maturidade_protocolo']
export type TipoBilhete = Database['public']['Enums']['tipo_bilhete']
export type TipoConexao = Database['public']['Enums']['tipo_entidade']
export type AuditOrigin = Database['public']['Enums']['tipo_audit']
export type TipoContextoAurora = Database['public']['Enums']['tipo_padrao_aurora']
export type GeneratedBy = string

// ─────────────────────────────────────────────
// Identity
// ─────────────────────────────────────────────
export type Tenant = Database['public']['Tables']['tenants']['Row']
export type TenantInsert = Database['public']['Tables']['tenants']['Insert']
export type TenantUpdate = Database['public']['Tables']['tenants']['Update']

export type ConfiguracaoTenant = Database['public']['Tables']['configuracoes_tenant']['Row']
export type ConfiguracaoTenantInsert = Database['public']['Tables']['configuracoes_tenant']['Insert']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// ─────────────────────────────────────────────
// Scientific
// ─────────────────────────────────────────────
export type FamiliaQuimica = Database['public']['Tables']['familias_quimicas']['Row']
export type FuncaoCosmetica = Database['public']['Tables']['funcoes_cosmeticas']['Row']

export type AtivoCosmetico = Database['public']['Tables']['ativos_cosmeticos']['Row']
export type AtivoCosmeticoInsert = Database['public']['Tables']['ativos_cosmeticos']['Insert']
export type AtivoCosmeticoUpdate = Database['public']['Tables']['ativos_cosmeticos']['Update']

export type ReferenciaCientifica = Database['public']['Tables']['referencias_cientificas']['Row']
export type ReferenciaCientificaInsert = Database['public']['Tables']['referencias_cientificas']['Insert']
export type ReferenciaCientificaUpdate = Database['public']['Tables']['referencias_cientificas']['Update']

// Acervo — junções (migration 022)
export type ReferenciaFormula   = Database['public']['Tables']['referencia_formulas']['Row']
export type ReferenciaFormulaInsert = Database['public']['Tables']['referencia_formulas']['Insert']
export type ReferenciaProtocolo = Database['public']['Tables']['referencia_protocolos']['Row']
export type ReferenciaProtocoloInsert = Database['public']['Tables']['referencia_protocolos']['Insert']
export type ReferenciaCaso      = Database['public']['Tables']['referencia_casos']['Row']
export type ReferenciaCasoInsert = Database['public']['Tables']['referencia_casos']['Insert']

// ─────────────────────────────────────────────
// Formulation
// ─────────────────────────────────────────────
export type Formula = Database['public']['Tables']['formulas']['Row']
export type FormulaInsert = Database['public']['Tables']['formulas']['Insert']
export type FormulaUpdate = Database['public']['Tables']['formulas']['Update']

export type VersaoFormula = Database['public']['Tables']['versoes_formula']['Row']
export type VersaoFormulaInsert = Database['public']['Tables']['versoes_formula']['Insert']

export type ComposicaoFormula = Database['public']['Tables']['composicoes_formula']['Row']
export type ComposicaoFormulaInsert = Database['public']['Tables']['composicoes_formula']['Insert']

export type Protocolo = Database['public']['Tables']['protocolos']['Row']
export type ProtocoloInsert = Database['public']['Tables']['protocolos']['Insert']
export type ProtocoloUpdate = Database['public']['Tables']['protocolos']['Update']

export type VersaoProtocolo = Database['public']['Tables']['versoes_protocolo']['Row']
export type VersaoProtocoloInsert = Database['public']['Tables']['versoes_protocolo']['Insert']

export type FaseProtocolo = Database['public']['Tables']['fases_protocolo']['Row']
export type FaseProtocoloInsert = Database['public']['Tables']['fases_protocolo']['Insert']

export type ProtocoloAtivo = Database['public']['Tables']['protocolo_ativos']['Row']
export type ProtocoloAtivoInsert = Database['public']['Tables']['protocolo_ativos']['Insert']

// Domínio de tabelas que foram ENUMs (ADR-004, migration 015)
export interface FormatoProducao {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
}

export interface CanalProducao {
  id: string
  nome: string
  descricao: string | null
  ativo: boolean
}

// ─────────────────────────────────────────────
// Clinical
// ─────────────────────────────────────────────
export type Paciente = Database['public']['Tables']['pacientes']['Row']
export type PacienteInsert = Database['public']['Tables']['pacientes']['Insert']
export type PacienteUpdate = Database['public']['Tables']['pacientes']['Update']

export type CasoClinico = Database['public']['Tables']['casos_clinicos']['Row']
export type CasoClincicoInsert = Database['public']['Tables']['casos_clinicos']['Insert']
export type CasoClincicoUpdate = Database['public']['Tables']['casos_clinicos']['Update']

export type EvolucaoCaso = Database['public']['Tables']['evolucoes_caso']['Row']
// EvolucaoCasoUpdate é `never` por design (ADR-005 — imutabilidade clínica)

export type PrescricaoCaso = Database['public']['Tables']['prescricoes_caso']['Row']
export type PrescricaoCasoInsert = Database['public']['Tables']['prescricoes_caso']['Insert']

export type FotoCaso = Database['public']['Tables']['fotos_caso']['Row']

export type CasoAtivo = Database['public']['Tables']['caso_ativos']['Row']
export type CasoAtivoInsert = Database['public']['Tables']['caso_ativos']['Insert']

// ─────────────────────────────────────────────
// Observation (migration 009)
// ─────────────────────────────────────────────
export type Observacao = Database['public']['Tables']['observacoes']['Row']
export type ObservacaoInsert = Database['public']['Tables']['observacoes']['Insert']
export type ObservacaoUpdate = Database['public']['Tables']['observacoes']['Update']

export type VersaoObservacao = Database['public']['Tables']['versoes_observacao']['Row']
// VersaoObservacaoInsert: usada internamente pela RPC validar_observacao()
// VersaoObservacaoUpdate: never — versões são imutáveis

export type Colecao = Database['public']['Tables']['colecoes']['Row']
export type ColecaoInsert = Database['public']['Tables']['colecoes']['Insert']
export type ColecaoUpdate = Database['public']['Tables']['colecoes']['Update']

// Caderno de Campo — junções (migrations 009 + 021)
export type ObservacaoAtivo     = Database['public']['Tables']['observacao_ativos']['Row']
export type ObservacaoAtivoInsert = Database['public']['Tables']['observacao_ativos']['Insert']
export type ObservacaoReferencia = Database['public']['Tables']['observacao_referencias']['Row']
export type ObservacaoReferenciaInsert = Database['public']['Tables']['observacao_referencias']['Insert']
export type ObservacaoFormula   = Database['public']['Tables']['observacao_formulas']['Row']
export type ObservacaoFormulaInsert = Database['public']['Tables']['observacao_formulas']['Insert']
export type ObservacaoCaso      = Database['public']['Tables']['observacao_casos']['Row']
export type ObservacaoCasoInsert = Database['public']['Tables']['observacao_casos']['Insert']
export type ObservacaoProtocolo = Database['public']['Tables']['observacao_protocolos']['Row']
export type ObservacaoProtocoloInsert = Database['public']['Tables']['observacao_protocolos']['Insert']
export type ObservacaoColecao   = Database['public']['Tables']['observacao_colecoes']['Row']
export type ObservacaoColecaoInsert = Database['public']['Tables']['observacao_colecoes']['Insert']

// Acervo Científico — junções (migration 006)
export type AtivoReferencia     = Database['public']['Tables']['ativo_referencias']['Row']
export type AtivoReferenciaInsert = Database['public']['Tables']['ativo_referencias']['Insert']

// Tipo de inserção de versão (usada diretamente pelo repositório)
export type VersaoObservacaoInsert = {
  observacao_id: string
  tenant_id: string
  numero_versao: number
  conteudo: string
  status_epistemico: StatusEpistemico
  justificativa?: string | null
  is_versao_atual?: boolean
}

// ─────────────────────────────────────────────
// Intelligence
// ─────────────────────────────────────────────
export type BilheteAurora = Database['public']['Tables']['bilhetes_aurora']['Row']
export type BilheteAuroraInsert = Database['public']['Tables']['bilhetes_aurora']['Insert']
export type BilheteAuroraUpdate = Database['public']['Tables']['bilhetes_aurora']['Update']

export type AuroraContext = Database['public']['Tables']['aurora_context']['Row']
export type AuroraContextInsert = Database['public']['Tables']['aurora_context']['Insert']

export type KnowledgeConnection = Database['public']['Tables']['knowledge_connections']['Row']
export type KnowledgeConnectionInsert = Database['public']['Tables']['knowledge_connections']['Insert']
export type KnowledgeConnectionUpdate = Database['public']['Tables']['knowledge_connections']['Update']

// ─────────────────────────────────────────────
// Meta
// ─────────────────────────────────────────────
export type EntityVisual = Database['public']['Tables']['entity_visual']['Row']
export type EntityVisualInsert = Database['public']['Tables']['entity_visual']['Insert']
export type EntityVisualUpdate = Database['public']['Tables']['entity_visual']['Update']

export type ReadingProgress = Database['public']['Tables']['reading_progress']['Row']
export type ReadingProgressInsert = Database['public']['Tables']['reading_progress']['Insert']
export type ReadingProgressUpdate = Database['public']['Tables']['reading_progress']['Update']

export type BibliotecaMetadata = Database['public']['Tables']['biblioteca_metadata']['Row']
// BibliotecaMetadataInsert é `never` — singleton gerenciado por migrations

export type AuditLog = Database['public']['Tables']['audit_log']['Row']
export type AuditLogInsert = Database['public']['Tables']['audit_log']['Insert']
// AuditLogUpdate é `never` — audit log é imutável

// ─────────────────────────────────────────────
// LGPD
// ─────────────────────────────────────────────
export type Consentimento = Database['lgpd']['Tables']['consentimentos']['Row']
export type ConsentimentoInsert = Database['lgpd']['Tables']['consentimentos']['Insert']

// ─────────────────────────────────────────────
// RPC Return Types
// ─────────────────────────────────────────────
export type BuscaUniversalRow = Database['public']['Functions']['busca_universal']['Returns'][number]
export type KcNeighborResult = Database['public']['Functions']['kc_neighbors']['Returns'][number]

// ─────────────────────────────────────────────
// JWT Claims (injetados pelo fn_custom_access_token_hook)
// ─────────────────────────────────────────────
export interface JwtClaims {
  sub: string          // auth.users.id
  email: string
  tenant_id: string    // injetado pelo hook (ADR-008)
  user_role: UserRole  // injetado pelo hook
  aud: string
  exp: number
  iat: number
}

// ─────────────────────────────────────────────
// Tipos auxiliares de aplicação
// ─────────────────────────────────────────────

// Resultado paginado genérico
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Resposta de operação
export interface OperationResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// Contexto de autenticação disponível em Server Components
export interface AuthContext {
  user: {
    id: string
    email: string
  }
  profile: Profile
  tenant: Tenant
  claims: JwtClaims
}
