// ============================================================
// Server Actions do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Ponte entre Client Components e CadernoService.
// Nenhum componente toca o serviço diretamente.
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { cadernoService } from '../application/CadernoService'
import type {
  CriarObservacaoInput,
  RevisarObservacaoInput,
  SalvarConexoesInput,
  CadernoFiltros,
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

export async function listarObservacoes(filtros: CadernoFiltros = {}) {
  try {
    const { tenantId } = await getCtx()
    return await cadernoService.listar(tenantId, filtros)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// Criação — redireciona para a observação criada
// ─────────────────────────────────────────────

export async function criarObservacao(input: CriarObservacaoInput) {
  const { tenantId } = await getCtx()
  const nova = await cadernoService.criar(tenantId, input)
  revalidatePath('/caderno')
  redirect(`/caderno/${nova.id}`)
}

// ─────────────────────────────────────────────
// Revisão (nova versão)
// ─────────────────────────────────────────────

export async function revisarObservacao(input: RevisarObservacaoInput) {
  try {
    const { tenantId } = await getCtx()
    const revisada = await cadernoService.revisar(tenantId, input)
    revalidatePath(`/caderno/${input.observacaoId}`)
    revalidatePath('/caderno')
    return { ok: true, id: revisada.id }
  } catch (err) {
    return { ok: false, erro: err instanceof Error ? err.message : 'Erro ao revisar' }
  }
}

// ─────────────────────────────────────────────
// Favoritar
// ─────────────────────────────────────────────

export async function favoritarObservacao(observacaoId: string, favorito: boolean) {
  try {
    const { tenantId } = await getCtx()
    await cadernoService.favoritar(tenantId, observacaoId, favorito)
    revalidatePath('/caderno')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Arquivar
// ─────────────────────────────────────────────

export async function arquivarObservacao(observacaoId: string) {
  try {
    const { tenantId } = await getCtx()
    await cadernoService.arquivar(tenantId, observacaoId)
    revalidatePath('/caderno')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Duplicar
// ─────────────────────────────────────────────

export async function duplicarObservacao(observacaoId: string) {
  try {
    const { tenantId } = await getCtx()
    const nova = await cadernoService.duplicar(tenantId, observacaoId)
    revalidatePath('/caderno')
    return { ok: true, id: nova.id }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Conexões
// ─────────────────────────────────────────────

export async function salvarConexoes(input: SalvarConexoesInput) {
  try {
    const { tenantId } = await getCtx()
    await cadernoService.salvarConexoes(tenantId, input)
    revalidatePath(`/caderno/${input.observacaoId}`)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Tags do tenant
// ─────────────────────────────────────────────

export async function getTagsTenant() {
  try {
    const { tenantId } = await getCtx()
    return await cadernoService.getTagsTenant(tenantId)
  } catch {
    return []
  }
}
