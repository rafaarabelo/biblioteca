// ============================================================
// IReferenciaRepository — Interface do Repositório
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Contrato entre Application e Infrastructure.
// A Application nunca conhece a implementação concreta.
// ============================================================

import type {
  ReferenciaView,
  ReferenciaDetalheView,
  ConexaoAcervo,
  AcervoListagem,
  AcervoFiltros,
  CriarReferenciaInput,
  AtualizarReferenciaInput,
  SalvarConexoesAcervoInput,
} from '../types'

export interface IReferenciaRepository {
  /** Lista referências com filtros e paginação */
  listar(tenantId: string, filtros: AcervoFiltros): Promise<AcervoListagem>

  /** Busca referência por ID com todas as conexões */
  getById(tenantId: string, id: string): Promise<ReferenciaDetalheView | null>

  /** Busca por DOI (único por tenant) */
  getByDoi(tenantId: string, doi: string): Promise<ReferenciaView | null>

  /** Busca por PMID */
  getByPmid(tenantId: string, pmid: string): Promise<ReferenciaView | null>

  /** Cria nova referência */
  criar(tenantId: string, input: CriarReferenciaInput): Promise<ReferenciaView>

  /** Atualiza referência existente (não cria versão — referência não é imutável) */
  atualizar(tenantId: string, input: AtualizarReferenciaInput): Promise<ReferenciaView>

  /** Alterna favorito */
  favoritar(tenantId: string, referenciaId: string, favorito: boolean): Promise<void>

  /** Arquiva referência (soft delete) */
  arquivar(tenantId: string, referenciaId: string): Promise<void>

  /** Lista todas as conexões de uma referência */
  getConexoes(tenantId: string, referenciaId: string): Promise<ConexaoAcervo[]>

  /** Salva conexões (replace: exclui antigas, insere novas) */
  salvarConexoes(tenantId: string, input: SalvarConexoesAcervoInput): Promise<void>

  /** Lista todas as tags únicas do tenant */
  getTagsTenant(tenantId: string): Promise<string[]>
}
