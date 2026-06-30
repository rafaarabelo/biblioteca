// ============================================================
// MesaSessionManager — Restaura continuidade de sessão
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Client Component mínimo: zero renderização visual,
// apenas gerencia scroll e última busca via localStorage.
// Renderiza null — é puro efeito colateral.
//
// Por que Client Component separado:
// - O page.tsx da Mesa é Server Component
// - localStorage só existe no cliente
// - Isolar o "use client" aqui mantém o page.tsx servidor
// ============================================================

'use client'

import { useScrollContinuity } from '../hooks/useSessionContinuity'

/**
 * Insere os efeitos de continuidade de sessão na Mesa.
 * Deve ser incluído uma vez no page.tsx, fora do conteúdo visível.
 *
 * Uso: <MesaSessionManager />
 */
export function MesaSessionManager() {
  useScrollContinuity()
  return null
}
