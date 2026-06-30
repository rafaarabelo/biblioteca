import 'server-only'

import type {
  FormulaView,
  FormulaDetalheView,
  FormulaFiltros,
  CriarFormulaInput,
  CriarVersaoInput,
  FormulaComparacao,
  AtivoDisponivel,
} from '../types'

export interface IFormulaRepository {
  listar(tenantId: string, filtros: Partial<FormulaFiltros>): Promise<FormulaView[]>
  getById(tenantId: string, id: string): Promise<FormulaDetalheView | null>
  criar(tenantId: string, userId: string, input: CriarFormulaInput): Promise<string>
  criarVersao(tenantId: string, userId: string, input: CriarVersaoInput): Promise<string>
  favoritar(tenantId: string, id: string, favorito: boolean): Promise<void>
  arquivar(tenantId: string, id: string): Promise<void>
  getTagsTenant(tenantId: string): Promise<string[]>
  getAtivosDisponiveis(tenantId: string, busca?: string): Promise<AtivoDisponivel[]>
  compararVersoes(tenantId: string, versaoAId: string, versaoBId: string): Promise<FormulaComparacao>
}
