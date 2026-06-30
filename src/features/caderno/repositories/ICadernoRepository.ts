// ============================================================
// ICadernoRepository — Contrato da Camada de Dados
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Interface que isola a camada Application da Infrastructure.
// A Application nunca sabe se está falando com Supabase,
// um banco local, ou um mock de testes.
// ============================================================

import type {
  ObservacaoView,
  ObservacaoDetalheView,
  VersaoView,
  CadernoFiltros,
  CadernoListagem,
  CriarObservacaoInput,
  RevisarObservacaoInput,
  SalvarConexoesInput,
} from '../types'

export interface ICadernoRepository {
  // ─── Listagem ──────────────────────────────
  listar(tenantId: string, filtros: CadernoFiltros): Promise<CadernoListagem>

  // ─── Detalhe ───────────────────────────────
  getById(tenantId: string, observacaoId: string): Promise<ObservacaoDetalheView | null>

  // ─── Versões ───────────────────────────────
  getVersoes(tenantId: string, observacaoId: string): Promise<VersaoView[]>

  // ─── Criação ───────────────────────────────
  criar(tenantId: string, input: CriarObservacaoInput): Promise<ObservacaoView>

  // ─── Revisão (nova versão) ─────────────────
  revisar(tenantId: string, input: RevisarObservacaoInput): Promise<ObservacaoView>

  // ─── Mutações simples ──────────────────────
  favoritar(tenantId: string, observacaoId: string, favorito: boolean): Promise<void>
  arquivar(tenantId: string, observacaoId: string): Promise<void>
  duplicar(tenantId: string, observacaoId: string): Promise<ObservacaoView>

  // ─── Conexões ──────────────────────────────
  getConexoes(tenantId: string, observacaoId: string): Promise<ObservacaoDetalheView['conexoes']>
  salvarConexoes(tenantId: string, input: SalvarConexoesInput): Promise<void>

  // ─── Tags ──────────────────────────────────
  getTagsTenant(tenantId: string): Promise<string[]>
}
