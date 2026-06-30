import 'server-only'

import { supabaseFormulaRepository } from '../infrastructure/SupabaseFormulaRepository'
import type { IFormulaRepository } from '../infrastructure/IFormulaRepository'
import type {
  FormulaView,
  FormulaDetalheView,
  FormulaFiltros,
  CriarFormulaInput,
  CriarVersaoInput,
  FormulaComparacao,
  AtivoDisponivel,
} from '../types'

// ── Erros de domínio ──────────────────────────────────────

export class FormulaValidacaoError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FormulaValidacaoError'
  }
}

export class FormulaNotFoundError extends Error {
  constructor(id: string) {
    super(`Fórmula não encontrada: ${id}`)
    this.name = 'FormulaNotFoundError'
  }
}

// ── Service ────────────────────────────────────────────────

export class FormulaService {
  constructor(private readonly repository: IFormulaRepository) {}

  async listar(tenantId: string, filtros: Partial<FormulaFiltros>): Promise<FormulaView[]> {
    return this.repository.listar(tenantId, filtros)
  }

  async getById(tenantId: string, id: string): Promise<FormulaDetalheView> {
    const formula = await this.repository.getById(tenantId, id)
    if (!formula) throw new FormulaNotFoundError(id)
    return formula
  }

  async criar(tenantId: string, userId: string, input: CriarFormulaInput): Promise<string> {
    this.validarCriarFormula(input)
    return this.repository.criar(tenantId, userId, input)
  }

  async criarVersao(tenantId: string, userId: string, input: CriarVersaoInput): Promise<string> {
    this.validarCriarVersao(input)

    // Verificar que a fórmula-pai existe
    const formula = await this.repository.getById(tenantId, input.formulaId)
    if (!formula) throw new FormulaNotFoundError(input.formulaId)

    return this.repository.criarVersao(tenantId, userId, input)
  }

  async favoritar(tenantId: string, id: string, favorito: boolean): Promise<void> {
    // Verificar existência antes de favoritar
    const formula = await this.repository.getById(tenantId, id)
    if (!formula) throw new FormulaNotFoundError(id)
    return this.repository.favoritar(tenantId, id, favorito)
  }

  async arquivar(tenantId: string, id: string): Promise<void> {
    const formula = await this.repository.getById(tenantId, id)
    if (!formula) throw new FormulaNotFoundError(id)
    return this.repository.arquivar(tenantId, id)
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    return this.repository.getTagsTenant(tenantId)
  }

  async getAtivosDisponiveis(tenantId: string, busca?: string): Promise<AtivoDisponivel[]> {
    return this.repository.getAtivosDisponiveis(tenantId, busca)
  }

  async compararVersoes(
    tenantId: string,
    versaoAId: string,
    versaoBId: string
  ): Promise<FormulaComparacao> {
    if (versaoAId === versaoBId) {
      throw new FormulaValidacaoError('As duas versões para comparação devem ser diferentes.')
    }
    return this.repository.compararVersoes(tenantId, versaoAId, versaoBId)
  }

  // ── Validações de domínio ────────────────────────────────

  private validarCriarFormula(input: CriarFormulaInput): void {
    if (!input.titulo || input.titulo.trim().length < 2) {
      throw new FormulaValidacaoError('O título da fórmula é obrigatório e deve ter ao menos 2 caracteres.')
    }
    if (!input.objetivo || input.objetivo.trim().length === 0) {
      throw new FormulaValidacaoError('O objetivo clínico é obrigatório. Uma fórmula sem objetivo não é uma hipótese, é ruído.')
    }
    for (const ing of input.ingredientes) {
      this.validarIngrediente(ing)
    }
  }

  private validarCriarVersao(input: CriarVersaoInput): void {
    if (!input.titulo || input.titulo.trim().length < 2) {
      throw new FormulaValidacaoError('O título da versão é obrigatório.')
    }
    if (!input.motivoAlteracao || input.motivoAlteracao.trim().length < 5) {
      throw new FormulaValidacaoError(
        'O motivo da alteração é obrigatório ao criar uma nova versão. Cada revisão deve ser justificada — essa é a memória da fórmula.'
      )
    }
    if (!input.objetivo || input.objetivo.trim().length === 0) {
      throw new FormulaValidacaoError('O objetivo clínico é obrigatório em cada versão.')
    }
    for (const ing of input.ingredientes) {
      this.validarIngrediente(ing)
    }
  }

  private validarIngrediente(ing: { ativoId: string; concentracao: number; unidade: string; fase: string }): void {
    if (!ing.ativoId) {
      throw new FormulaValidacaoError('Cada ingrediente precisa ter um ativo selecionado.')
    }
    if (!ing.concentracao || ing.concentracao <= 0) {
      throw new FormulaValidacaoError('A concentração de cada ingrediente deve ser maior que zero.')
    }
    if (!ing.fase) {
      throw new FormulaValidacaoError('A fase de incorporação é obrigatória para cada ingrediente.')
    }
  }
}

// ── Singleton ─────────────────────────────────────────────────
export const formulaService = new FormulaService(supabaseFormulaRepository)
