// ============================================================
// IProtocoloRepository — Interface do Repositório
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Contrato puro. Zero dependência de infraestrutura.
// ============================================================

import type {
  ProtocoloView,
  ProtocoloDetalheView,
  ProtocoloFiltros,
  CriarProtocoloInput,
  NovaVersaoProtocoloInput,
  SalvarConexoesProtocoloInput,
} from '../types'

export interface IProtocoloRepository {
  listar(tenantId: string, filtros?: Partial<ProtocoloFiltros>): Promise<ProtocoloView[]>
  getById(tenantId: string, protocoloId: string): Promise<ProtocoloDetalheView | null>
  criar(tenantId: string, userId: string, input: CriarProtocoloInput): Promise<{ protocoloId: string }>
  criarVersao(tenantId: string, userId: string, input: NovaVersaoProtocoloInput): Promise<{ versaoId: string }>
  favoritar(tenantId: string, protocoloId: string, favorito: boolean): Promise<void>
  arquivar(tenantId: string, protocoloId: string): Promise<void>
  salvarConexoes(tenantId: string, input: SalvarConexoesProtocoloInput): Promise<void>
  getTagsTenant(tenantId: string): Promise<string[]>
}
