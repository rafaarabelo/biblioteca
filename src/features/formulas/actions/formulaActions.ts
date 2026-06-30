// ============================================================
// formulaActions — Server Actions
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo V
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { formulaService } from '../application/FormulaService'
import type {
  FormulaFiltros,
  CriarFormulaInput,
  CriarVersaoInput,
} from '../types'

async function getCtx() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const userId   = auth?.user?.id ?? ''
  if (!tenantId) throw new Error('Tenant não autenticado.')
  return { tenantId, userId }
}

// ── Listar Fórmulas ──────────────────────────────────────────
export async function listarFormulas(filtros: Partial<FormulaFiltros>) {
  try {
    const { tenantId } = await getCtx()
    return await formulaService.listar(tenantId, filtros)
  } catch {
    return null
  }
}

// ── Criar Fórmula (primeira versão) ──────────────────────────
export async function criarFormula(input: CriarFormulaInput) {
  const { tenantId, userId } = await getCtx()
  const id = await formulaService.criar(tenantId, userId, input)
  revalidatePath('/formulas')
  redirect(`/formulas/${id}`)
}

// ── Criar Nova Versão ─────────────────────────────────────────
export async function criarNovaVersao(input: CriarVersaoInput) {
  try {
    const { tenantId, userId } = await getCtx()
    const versaoId = await formulaService.criarVersao(tenantId, userId, input)
    revalidatePath(`/formulas/${input.formulaId}`)
    return { ok: true, versaoId }
  } catch (e: any) {
    return { ok: false, erro: e.message ?? 'Erro ao criar nova versão.' }
  }
}

// ── Favoritar ─────────────────────────────────────────────────
export async function favoritarFormula(id: string, favorito: boolean) {
  try {
    const { tenantId } = await getCtx()
    await formulaService.favoritar(tenantId, id, favorito)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ── Arquivar ──────────────────────────────────────────────────
export async function arquivarFormula(id: string) {
  try {
    const { tenantId } = await getCtx()
    await formulaService.arquivar(tenantId, id)
    revalidatePath('/formulas')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ── Tags do Tenant ────────────────────────────────────────────
export async function getTagsTenantFormulas() {
  try {
    const { tenantId } = await getCtx()
    return await formulaService.getTagsTenant(tenantId)
  } catch {
    return []
  }
}

// ── Ativos disponíveis para seleção ──────────────────────────
export async function getAtivosDisponiveisFormula(busca?: string) {
  try {
    const { tenantId } = await getCtx()
    return await formulaService.getAtivosDisponiveis(tenantId, busca)
  } catch {
    return []
  }
}

// ── Comparar versões ──────────────────────────────────────────
export async function compararVersoesFormula(versaoAId: string, versaoBId: string) {
  try {
    const { tenantId } = await getCtx()
    return await formulaService.compararVersoes(tenantId, versaoAId, versaoBId)
  } catch (e: any) {
    return null
  }
}
