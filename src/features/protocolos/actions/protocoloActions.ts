// ============================================================
// Server Actions — Protocolos Inteligentes
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Ponte entre Client Components e ProtocoloService.
// Nenhum componente toca o serviço diretamente.
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { protocoloService } from '../application/ProtocoloService'
import type {
  ProtocoloFiltros,
  CriarProtocoloInput,
  NovaVersaoProtocoloInput,
  SalvarConexoesProtocoloInput,
} from '../types'

// ─────────────────────────────────────────────
// Contexto de autenticação
// ─────────────────────────────────────────────

async function getCtx() {
  const auth = await getAuthContext()
  if (!auth) throw new Error('Não autenticado')
  return {
    tenantId: auth.claims.tenant_id,
    userId: auth.user.id,
  }
}

// ─────────────────────────────────────────────
// Listagem + Busca
// ─────────────────────────────────────────────

export async function listarProtocolos(filtros: Partial<ProtocoloFiltros> = {}) {
  try {
    const { tenantId } = await getCtx()
    return await protocoloService.listar(tenantId, filtros)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// Criação — redireciona para o protocolo criado
// ─────────────────────────────────────────────

export async function criarProtocolo(input: CriarProtocoloInput) {
  const { tenantId, userId } = await getCtx()
  const result = await protocoloService.criar(tenantId, userId, input)
  revalidatePath('/protocolos')
  redirect(`/protocolos/${result.protocoloId}`)
}

// ─────────────────────────────────────────────
// Nova Versão
// ─────────────────────────────────────────────

export async function criarVersaoProtocolo(input: NovaVersaoProtocoloInput) {
  try {
    const { tenantId, userId } = await getCtx()
    const result = await protocoloService.criarVersao(tenantId, userId, input)
    revalidatePath(`/protocolos/${input.protocoloId}`)
    revalidatePath('/protocolos')
    return { ok: true, versaoId: result.versaoId }
  } catch (err) {
    return { ok: false, erro: err instanceof Error ? err.message : 'Erro ao criar versão' }
  }
}

// ─────────────────────────────────────────────
// Favoritar
// ─────────────────────────────────────────────

export async function favoritarProtocolo(protocoloId: string, favorito: boolean) {
  try {
    const { tenantId } = await getCtx()
    await protocoloService.favoritar(tenantId, protocoloId, favorito)
    revalidatePath('/protocolos')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Arquivar
// ─────────────────────────────────────────────

export async function arquivarProtocolo(protocoloId: string) {
  try {
    const { tenantId } = await getCtx()
    await protocoloService.arquivar(tenantId, protocoloId)
    revalidatePath('/protocolos')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Conexões
// ─────────────────────────────────────────────

export async function salvarConexoesProtocolo(input: SalvarConexoesProtocoloInput) {
  try {
    const { tenantId } = await getCtx()
    await protocoloService.salvarConexoes(tenantId, input)
    revalidatePath(`/protocolos/${input.protocoloId}`)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Tags do tenant
// ─────────────────────────────────────────────

export async function getTagsTenantProtocolos() {
  try {
    const { tenantId } = await getCtx()
    return await protocoloService.getTagsTenant(tenantId)
  } catch {
    return []
  }
}
