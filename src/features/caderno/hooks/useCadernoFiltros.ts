// ============================================================
// useCadernoFiltros — Filtros e busca do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { CadernoFiltros, TipoObservacao, StatusEpistemicoUI } from '../types'

const DEBOUNCE_MS = 350
const STORAGE_KEY = 'biblioteca-caderno-filtros'

export function useCadernoFiltros(onFiltrar: (f: CadernoFiltros) => void) {
  const [filtros, setFiltros] = useState<CadernoFiltros>(() => {
    // Restaurar filtros da sessão anterior
    try {
      const salvo = localStorage.getItem(STORAGE_KEY)
      if (salvo) return JSON.parse(salvo) as CadernoFiltros
    } catch { /* private browsing */ }
    return {}
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Propagar filtros com debounce
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onFiltrar(filtros)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(filtros)) } catch {}
    }, DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros])

  const setBusca = useCallback((busca: string) => {
    setFiltros((f) => ({ ...f, busca: busca || undefined, pagina: 1 }))
  }, [])

  const setTipo = useCallback((tipo: TipoObservacao | null) => {
    setFiltros((f) => ({ ...f, tipo: tipo ?? undefined, pagina: 1 }))
  }, [])

  const setStatus = useCallback((status: StatusEpistemicoUI | null) => {
    setFiltros((f) => ({ ...f, statusEpistemico: status ?? undefined, pagina: 1 }))
  }, [])

  const setFavorito = useCallback((favorito: boolean | undefined) => {
    setFiltros((f) => ({ ...f, favorito, pagina: 1 }))
  }, [])

  const setOrdenar = useCallback((ordenar: CadernoFiltros['ordenar']) => {
    setFiltros((f) => ({ ...f, ordenar, pagina: 1 }))
  }, [])

  const limpar = useCallback(() => {
    setFiltros({})
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const temFiltrosAtivos = Object.values(filtros).some((v) =>
    v !== undefined && v !== null && v !== '' && v !== 1
  )

  return {
    filtros,
    temFiltrosAtivos,
    setBusca,
    setTipo,
    setStatus,
    setFavorito,
    setOrdenar,
    limpar,
  }
}
