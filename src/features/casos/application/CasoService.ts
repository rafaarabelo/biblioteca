// ============================================================
// CasoService — Application Layer
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// TODA lógica clínica aqui. Zero SQL aqui.
// Evoluções nunca são editadas. Esta camada garante isso.
// ============================================================

import 'server-only'
import { supabaseCasoRepository } from '../infrastructure/SupabaseCasoRepository'
import type {
  CasoView,
  CasoDetalheView,
  CasoFiltros,
  CriarCasoInput,
  CriarEvolucaoInput,
  StatusCaso,
} from '../types'
import { STATUS_CASO_META, TIPO_EVOLUCAO_META } from '../types'

// ─────────────────────────────────────────────
// Validações
// ─────────────────────────────────────────────

function validarCriarCaso(input: CriarCasoInput): void {
  if (!input.objetivoPrincipal?.trim()) {
    throw new Error('O objetivo principal do tratamento é obrigatório.')
  }
  if (!input.queixaPrincipal?.trim()) {
    throw new Error('A queixa principal é obrigatória.')
  }
  if (!input.status || !(input.status in STATUS_CASO_META)) {
    throw new Error('Status inválido.')
  }
}

function validarCriarEvolucao(input: CriarEvolucaoInput): void {
  if (!input.casoId) {
    throw new Error('ID do caso é obrigatório.')
  }
  if (!input.tipo || !(input.tipo in TIPO_EVOLUCAO_META)) {
    throw new Error('Tipo de evolução inválido.')
  }
  if (!input.dataAtendimento) {
    throw new Error('Data do atendimento é obrigatória.')
  }
  if (!input.descricao?.trim()) {
    throw new Error('A descrição da evolução é obrigatória.')
  }
  if (input.satisfacaoPaciente !== null &&
      input.satisfacaoPaciente !== undefined &&
      (input.satisfacaoPaciente < 1 || input.satisfacaoPaciente > 5)) {
    throw new Error('Satisfação do paciente deve ser entre 1 e 5.')
  }
}

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

class CasoService {
  // ── Listar ──────────────────────────────────
  async listar(tenantId: string, filtros: Partial<CasoFiltros>): Promise<CasoView[]> {
    return supabaseCasoRepository.listar(tenantId, filtros)
  }

  // ── Detalhe ──────────────────────────────────
  async getById(tenantId: string, id: string): Promise<CasoDetalheView | null> {
    return supabaseCasoRepository.getById(tenantId, id)
  }

  // ── Criar Caso ──────────────────────────────
  async criarCaso(tenantId: string, userId: string, input: CriarCasoInput): Promise<string> {
    validarCriarCaso(input)
    return supabaseCasoRepository.criar(tenantId, userId, input)
  }

  // ── Criar Evolução (APPEND-ONLY) ─────────────
  // REGRA ARQUITETURAL: Evoluções são permanentes e imutáveis.
  // Esta função APENAS cria. Nunca existe updateEvolucao().
  // O banco tem trigger que bloqueia UPDATE/DELETE.
  // A Service repete esta garantia em código.
  async criarEvolucao(tenantId: string, userId: string, input: CriarEvolucaoInput): Promise<string> {
    validarCriarEvolucao(input)
    return supabaseCasoRepository.criarEvolucao(tenantId, userId, input)
  }

  // ── Favoritar ────────────────────────────────
  async favoritar(tenantId: string, id: string, favorito: boolean): Promise<void> {
    return supabaseCasoRepository.favoritar(tenantId, id, favorito)
  }

  // ── Arquivar ─────────────────────────────────
  async arquivar(tenantId: string, id: string): Promise<void> {
    return supabaseCasoRepository.arquivar(tenantId, id)
  }

  // ── Tags ────────────────────────────────────
  async getTagsTenant(tenantId: string): Promise<string[]> {
    return supabaseCasoRepository.getTagsTenant(tenantId)
  }
}

export const casoService = new CasoService()
