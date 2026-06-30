// ============================================================
// casoActions — Server Actions
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { casoService } from '../application/CasoService'
import type { CasoFiltros, CriarCasoInput, CriarEvolucaoInput } from '../types'

async function getCtx() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const userId   = auth?.user?.id ?? ''
  if (!tenantId) throw new Error('Tenant não autenticado.')
  return { tenantId, userId }
}

// ── Listar Casos ────────────────────────────────────────────
export async function listarCasos(filtros: Partial<CasoFiltros>) {
  try {
    const { tenantId } = await getCtx()
    return await casoService.listar(tenantId, filtros)
  } catch {
    return null
  }
}

// ── Criar Caso ──────────────────────────────────────────────
export async function criarCaso(input: CriarCasoInput) {
  const { tenantId, userId } = await getCtx()
  const id = await casoService.criarCaso(tenantId, userId, input)
  revalidatePath('/casos')
  redirect(`/casos/${id}`)
}

// ── Criar Evolução ──────────────────────────────────────────
export async function criarEvolucao(input: CriarEvolucaoInput) {
  try {
    const { tenantId, userId } = await getCtx()
    const evolucaoId = await casoService.criarEvolucao(tenantId, userId, input)
    revalidatePath(`/casos/${input.casoId}`)
    return { ok: true, evolucaoId }
  } catch (e: any) {
    return { ok: false, erro: e.message ?? 'Erro ao registrar evolução.' }
  }
}

// ── Favoritar ────────────────────────────────────────────────
export async function favoritarCaso(id: string, favorito: boolean) {
  try {
    const { tenantId } = await getCtx()
    await casoService.favoritar(tenantId, id, favorito)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ── Arquivar ─────────────────────────────────────────────────
export async function arquivarCaso(id: string) {
  try {
    const { tenantId } = await getCtx()
    await casoService.arquivar(tenantId, id)
    revalidatePath('/casos')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ── Tags do Tenant ───────────────────────────────────────────
export async function getTagsTenantCasos() {
  try {
    const { tenantId } = await getCtx()
    return await casoService.getTagsTenant(tenantId)
  } catch {
    return []
  }
}
