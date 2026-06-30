// ============================================================
// ProtocoloService — Application Service
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// import 'server-only' garante que este módulo nunca chegue ao cliente.
// Zero SQL aqui. Regras de domínio puras: orquestra o repositório.
// ============================================================

import 'server-only'

import { supabaseProtocoloRepository } from '../infrastructure/SupabaseProtocoloRepository'
import type {
  ProtocoloView,
  ProtocoloDetalheView,
  ProtocoloFiltros,
  CriarProtocoloInput,
  NovaVersaoProtocoloInput,
  SalvarConexoesProtocoloInput,
  MaturidadeProtocolo,
} from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'

const repo = supabaseProtocoloRepository

// ─────────────────────────────────────────────
// Validações de domínio
// ─────────────────────────────────────────────

function validarMaturidade(maturidade: string): asserts maturidade is MaturidadeProtocolo {
  const validas = Object.keys(MATURIDADES_PROTOCOLO)
  if (!validas.includes(maturidade)) {
    throw new Error(`Maturidade inválida: "${maturidade}". Valores aceitos: ${validas.join(', ')}`)
  }
}

function validarProgressaoMaturidade(atual: MaturidadeProtocolo, nova: MaturidadeProtocolo): void {
  const ordemAtual = MATURIDADES_PROTOCOLO[atual].ordem
  const ordemNova  = MATURIDADES_PROTOCOLO[nova].ordem
  // Permite regredir somente com uma diferença de no máximo 1 nível.
  // Saltos para trás maiores que 1 nível exigem revisão consciente fora do sistema.
  if (ordemNova < ordemAtual - 1) {
    throw new Error(
      `Não é possível regredir o protocolo de "${MATURIDADES_PROTOCOLO[atual].label}" para "${MATURIDADES_PROTOCOLO[nova].label}" diretamente. ` +
      `A maturidade de um protocolo deve evoluir progressivamente.`
    )
  }
}

function validarCriarProtocolo(input: CriarProtocoloInput): void {
  if (!input.titulo?.trim()) {
    throw new Error('O título do protocolo é obrigatório.')
  }
  if (!input.objetivo?.trim()) {
    throw new Error('O objetivo clínico é obrigatório.')
  }
  validarMaturidade(input.maturidade)
}

function validarNovaVersao(input: NovaVersaoProtocoloInput): void {
  if (!input.titulo?.trim()) {
    throw new Error('O título do protocolo é obrigatório.')
  }
  if (!input.motivoAlteracao?.trim()) {
    throw new Error('A justificativa da revisão é obrigatória ao criar uma nova versão.')
  }
  validarMaturidade(input.maturidade)
}

// ─────────────────────────────────────────────
// Service
// ─────────────────────────────────────────────

export class ProtocoloService {

  async listar(tenantId: string, filtros?: Partial<ProtocoloFiltros>): Promise<ProtocoloView[]> {
    return repo.listar(tenantId, filtros)
  }

  async getById(tenantId: string, protocoloId: string): Promise<ProtocoloDetalheView | null> {
    if (!protocoloId) return null
    return repo.getById(tenantId, protocoloId)
  }

  async criar(
    tenantId: string,
    userId: string,
    input: CriarProtocoloInput,
  ): Promise<{ protocoloId: string }> {
    validarCriarProtocolo(input)
    return repo.criar(tenantId, userId, input)
  }

  async criarVersao(
    tenantId: string,
    userId: string,
    input: NovaVersaoProtocoloInput,
  ): Promise<{ versaoId: string }> {
    validarNovaVersao(input)

    // Verificar progressão de maturidade
    const protocolo = await repo.getById(tenantId, input.protocoloId)
    if (!protocolo) {
      throw new Error('Protocolo não encontrado.')
    }
    validarProgressaoMaturidade(protocolo.maturidade, input.maturidade)

    return repo.criarVersao(tenantId, userId, input)
  }

  async favoritar(tenantId: string, protocoloId: string, favorito: boolean): Promise<void> {
    return repo.favoritar(tenantId, protocoloId, favorito)
  }

  async arquivar(tenantId: string, protocoloId: string): Promise<void> {
    const protocolo = await repo.getById(tenantId, protocoloId)
    if (!protocolo) {
      throw new Error('Protocolo não encontrado.')
    }
    return repo.arquivar(tenantId, protocoloId)
  }

  async salvarConexoes(tenantId: string, input: SalvarConexoesProtocoloInput): Promise<void> {
    if (!input.protocoloId) {
      throw new Error('ID do protocolo é obrigatório para salvar conexões.')
    }
    return repo.salvarConexoes(tenantId, input)
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    return repo.getTagsTenant(tenantId)
  }
}

// Singleton — seguro pois o módulo é server-only
export const protocoloService = new ProtocoloService()
