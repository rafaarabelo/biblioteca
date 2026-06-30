// ============================================================
// useSessionContinuity — Persistência de sessão na Mesa
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Gerencia continuidade de sessão via localStorage:
// - Posição de scroll ao retornar para a Mesa
// - Última busca global feita
//
// Nota de design: scroll e busca são estado de UI — ficam
// no localStorage (rápido, sem round-trip para o banco).
// Estado de dados (bilhetes lidos, progresso) vai para o banco.
// ============================================================

'use client'

import { useEffect, useCallback } from 'react'

const CHAVE_SCROLL = 'biblioteca-mesa-scroll'
const CHAVE_ULTIMA_BUSCA = 'biblioteca-mesa-ultima-busca'

// ─────────────────────────────────────────────
// useScrollContinuity
// ─────────────────────────────────────────────

/**
 * Salva a posição de scroll ao sair da Mesa.
 * Restaura ao montar o componente.
 * Deve ser usado no container principal da página.
 */
export function useScrollContinuity() {
  // Restaurar scroll ao montar
  useEffect(() => {
    try {
      const posicao = localStorage.getItem(CHAVE_SCROLL)
      if (posicao) {
        const y = parseInt(posicao, 10)
        // requestAnimationFrame garante que o DOM já renderizou
        requestAnimationFrame(() => {
          window.scrollTo({ top: y, behavior: 'instant' })
        })
      }
    } catch {
      // localStorage pode estar bloqueado em modo privado
    }

    // Salvar scroll ao sair da página
    function salvarScroll() {
      try {
        localStorage.setItem(CHAVE_SCROLL, String(window.scrollY))
      } catch {
        // silencioso
      }
    }

    window.addEventListener('beforeunload', salvarScroll)

    // Para navegação SPA (Next.js router), também salvar ao clicar em links internos
    // O beforeunload não dispara em navegações de client-side
    return () => {
      salvarScroll()
      window.removeEventListener('beforeunload', salvarScroll)
    }
  }, [])
}

// ─────────────────────────────────────────────
// useUltimaBusca
// ─────────────────────────────────────────────

interface UseUltimaBuscaReturn {
  ultimaBusca: string
  salvarBusca: (query: string) => void
  limparBusca: () => void
}

/**
 * Persiste a última busca feita na Mesa.
 * Usado para restaurar o campo de busca ao retornar.
 */
export function useUltimaBusca(): UseUltimaBuscaReturn {
  const getUltimaBusca = (): string => {
    try {
      return localStorage.getItem(CHAVE_ULTIMA_BUSCA) ?? ''
    } catch {
      return ''
    }
  }

  const salvarBusca = useCallback((query: string) => {
    try {
      if (query.trim()) {
        localStorage.setItem(CHAVE_ULTIMA_BUSCA, query.trim())
      } else {
        localStorage.removeItem(CHAVE_ULTIMA_BUSCA)
      }
    } catch {
      // silencioso
    }
  }, [])

  const limparBusca = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE_ULTIMA_BUSCA)
    } catch {
      // silencioso
    }
  }, [])

  return {
    ultimaBusca: getUltimaBusca(),
    salvarBusca,
    limparBusca,
  }
}
