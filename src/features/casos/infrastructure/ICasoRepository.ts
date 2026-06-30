// ============================================================
// ICasoRepository — Interface do Repositório de Casos Clínicos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================

import type {
  CasoView,
  CasoDetalheView,
  CasoFiltros,
  CriarCasoInput,
  CriarEvolucaoInput,
} from '../types'

export interface ICasoRepository {
  listar(tenantId: string, filtros: Partial<CasoFiltros>): Promise<CasoView[]>
  getById(tenantId: string, id: string): Promise<CasoDetalheView | null>
  criar(tenantId: string, userId: string, input: CriarCasoInput): Promise<string>
  criarEvolucao(tenantId: string, userId: string, input: CriarEvolucaoInput): Promise<string>
  favoritar(tenantId: string, id: string, favorito: boolean): Promise<void>
  arquivar(tenantId: string, id: string): Promise<void>
  getTagsTenant(tenantId: string): Promise<string[]>
}
