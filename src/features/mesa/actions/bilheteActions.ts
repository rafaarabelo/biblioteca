// ============================================================
// bilheteActions — Server Actions para Bilhetes Aurora
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Server Actions são o único caminho autorizado entre
// Client Hooks e o MesaService (Application Layer).
//
// Fluxo: Client Hook → Server Action → MesaService → Repository → Supabase
//
// Segurança:
// - getAuthContext() garante usuária autenticada
// - tenantId vem sempre do JWT (nunca do cliente)
// - bilheteId é validado contra o tenant antes de qualquer mutação
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { getAuthContext } from '@/lib/supabase/server'
import { mesaService } from '../application/MesaService'

// ─────────────────────────────────────────────
// marcarBilheteComoLido
// ─────────────────────────────────────────────

/**
 * Marca um bilhete como lido.
 * Chamado quando a usuária abre o bilhete.
 * Após marcar, invalida o cache da página Mesa para
 * que a próxima visita busque o próximo bilhete.
 */
export async function marcarBilheteComoLido(bilheteId: string): Promise<void> {
  const auth = await getAuthContext()
  if (!auth) return  // silencioso: não expõe que o usuário não está autenticado

  const tenantId = auth.claims.tenant_id
  if (!tenantId || !bilheteId) return

  try {
    await mesaService.marcarComoLido(bilheteId, tenantId)
    // Não invalidamos o path aqui: o componente gerencia o estado local otimisticamente.
    // A próxima navegação para /mesa já buscará o estado atualizado do banco.
  } catch {
    // Erros de rede não devem quebrar a UX do bilhete
    // A próxima visita tentará novamente naturalmente
  }
}

// ─────────────────────────────────────────────
// fixarBilhete
// ─────────────────────────────────────────────

/**
 * Fixa ou desfixa um bilhete.
 * Bilhetes fixados aparecem sempre na Mesa, mesmo após lidos.
 */
export async function fixarBilhete(bilheteId: string, fixado: boolean): Promise<void> {
  const auth = await getAuthContext()
  if (!auth) return

  const tenantId = auth.claims.tenant_id
  if (!tenantId || !bilheteId) return

  try {
    await mesaService.fixarBilhete(bilheteId, tenantId, fixado)
    revalidatePath('/mesa')
  } catch {
    // Silent failure — UX não deve quebrar por isso
  }
}

// ─────────────────────────────────────────────
// arquivarBilhete
// ─────────────────────────────────────────────

/**
 * Arquiva um bilhete (desaparece da Mesa).
 * IMPORTANTE: bilhetes são permanentes. Arquivar ≠ deletar.
 * Após arquivar, a Mesa mostrará o próximo bilhete disponível.
 */
export async function arquivarBilhete(bilheteId: string): Promise<void> {
  const auth = await getAuthContext()
  if (!auth) return

  const tenantId = auth.claims.tenant_id
  if (!tenantId || !bilheteId) return

  try {
    await mesaService.arquivarBilhete(bilheteId, tenantId)
    revalidatePath('/mesa')
  } catch {
    // Silent failure
  }
}
