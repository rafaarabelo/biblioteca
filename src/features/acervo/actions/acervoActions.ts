// ============================================================
// Server Actions do Acervo Científico
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Ponte entre Client Components e ReferenciaService.
// Nenhum componente toca o serviço diretamente.
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { referenciaService } from '../application/ReferenciaService'
import type {
  AcervoFiltros,
  CriarReferenciaInput,
  AtualizarReferenciaInput,
  SalvarConexoesAcervoInput,
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

export async function listarReferencias(filtros: AcervoFiltros = {}) {
  try {
    const { tenantId } = await getCtx()
    return await referenciaService.listar(tenantId, filtros)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// Busca por identificador
// ─────────────────────────────────────────────

export async function buscarPorDoi(doi: string) {
  try {
    const { tenantId } = await getCtx()
    return await referenciaService.getByDoi(tenantId, doi)
  } catch {
    return null
  }
}

export async function buscarPorPmid(pmid: string) {
  try {
    const { tenantId } = await getCtx()
    return await referenciaService.getByPmid(tenantId, pmid)
  } catch {
    return null
  }
}

// ─────────────────────────────────────────────
// Criação — redireciona para a referência criada
// ─────────────────────────────────────────────

export async function criarReferencia(input: CriarReferenciaInput) {
  const { tenantId } = await getCtx()
  const nova = await referenciaService.criar(tenantId, input)
  revalidatePath('/acervo')
  redirect(`/acervo/${nova.id}`)
}

// ─────────────────────────────────────────────
// Atualização
// ─────────────────────────────────────────────

export async function atualizarReferencia(input: AtualizarReferenciaInput) {
  try {
    const { tenantId } = await getCtx()
    const atualizada = await referenciaService.atualizar(tenantId, input)
    revalidatePath(`/acervo/${input.referenciaId}`)
    revalidatePath('/acervo')
    return { ok: true, id: atualizada.id }
  } catch (err) {
    return { ok: false, erro: err instanceof Error ? err.message : 'Erro ao atualizar' }
  }
}

// ─────────────────────────────────────────────
// Favoritar
// ─────────────────────────────────────────────

export async function favoritarReferencia(referenciaId: string, favorito: boolean) {
  try {
    const { tenantId } = await getCtx()
    await referenciaService.favoritar(tenantId, referenciaId, favorito)
    revalidatePath('/acervo')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Arquivar
// ─────────────────────────────────────────────

export async function arquivarReferencia(referenciaId: string) {
  try {
    const { tenantId } = await getCtx()
    await referenciaService.arquivar(tenantId, referenciaId)
    revalidatePath('/acervo')
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Conexões
// ─────────────────────────────────────────────

export async function salvarConexoesAcervo(input: SalvarConexoesAcervoInput) {
  try {
    const { tenantId } = await getCtx()
    await referenciaService.salvarConexoes(tenantId, input)
    revalidatePath(`/acervo/${input.referenciaId}`)
    return { ok: true }
  } catch {
    return { ok: false }
  }
}

// ─────────────────────────────────────────────
// Tags do tenant
// ─────────────────────────────────────────────

export async function getTagsTenantAcervo() {
  try {
    const { tenantId } = await getCtx()
    return await referenciaService.getTagsTenant(tenantId)
  } catch {
    return []
  }
}
