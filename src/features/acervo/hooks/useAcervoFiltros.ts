// ============================================================
// useAcervoFiltros — Filtros persistidos do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { AcervoFiltros, TipoEstudo, NivelEvidencia } from '../types'

const STORAGE_KEY = 'biblioteca-acervo-filtros'
const DEBOUNCE_MS = 350
// Evento interno para sincronizar múltiplas instâncias do hook na mesma página
const SYNC_EVENT  = '__biblioteca_acervo_filtros_sync__'

interface FiltrosAtivos {
  busca: string
  tipoEstudo: TipoEstudo | null
  nivelEvidencia: NivelEvidencia | null
  favorito: boolean | undefined
  anoMin: number | undefined
  anoMax: number | undefined
  ordenar: AcervoFiltros['ordenar']
}

const inicial: FiltrosAtivos = {
  busca: '',
  tipoEstudo: null,
  nivelEvidencia: null,
  favorito: undefined,
  anoMin: undefined,
  anoMax: undefined,
  ordenar: 'mais_recente',
}

function carregarStorage(): Partial<FiltrosAtivos> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistirStorage(filtros: FiltrosAtivos) {
  try {
    // Não persistir busca — textual é efêmera
    const { busca: _, ...resto } = filtros
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(resto))
  } catch {}
}

export function useAcervoFiltros() {
  const [local, setLocal] = useState<FiltrosAtivos>({ ...inicial, ...carregarStorage() })
  const [propagados, setPropagados] = useState<AcervoFiltros>({})
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncRef  = useRef('')

  // Sincronizar com outras instâncias do hook na mesma página
  useEffect(() => {
    function onSync(e: Event) {
      const d = (e as CustomEvent<Omit<FiltrosAtivos, 'busca'>>).detail
      setLocal((prev) => ({
        ...prev,
        tipoEstudo:    d.tipoEstudo,
        nivelEvidencia:d.nivelEvidencia,
        favorito:      d.favorito,
        anoMin:        d.anoMin,
        anoMax:        d.anoMax,
        ordenar:       d.ordenar,
      }))
    }
    window.addEventListener(SYNC_EVENT, onSync)
    return () => window.removeEventListener(SYNC_EVENT, onSync)
  }, [])

  // Persistir no localStorage sempre que filtros (exceto busca) mudarem + notificar outras instâncias
  useEffect(() => {
    persistirStorage(local)
    if (typeof window === 'undefined') return
    const { busca: _, ...syncable } = local
    const key = JSON.stringify(syncable)
    if (key === lastSyncRef.current) return   // evita cascade infinito
    lastSyncRef.current = key
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: syncable }))
  }, [local])

  // Debounce: só propaga após 350ms de inatividade
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const filtros: AcervoFiltros = {}
      if (local.busca)          filtros.busca          = local.busca
      if (local.tipoEstudo)     filtros.tipoEstudo     = local.tipoEstudo
      if (local.nivelEvidencia) filtros.nivelEvidencia = local.nivelEvidencia
      if (local.favorito !== undefined) filtros.favorito = local.favorito
      if (local.anoMin)         filtros.anoMin         = local.anoMin
      if (local.anoMax)         filtros.anoMax         = local.anoMax
      if (local.ordenar)        filtros.ordenar        = local.ordenar
      setPropagados(filtros)
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [local])

  const setBusca         = useCallback((v: string) => setLocal((p) => ({ ...p, busca: v })), [])
  const setTipoEstudo    = useCallback((v: TipoEstudo | null) => setLocal((p) => ({ ...p, tipoEstudo: v })), [])
  const setNivelEvidencia = useCallback((v: NivelEvidencia | null) => setLocal((p) => ({ ...p, nivelEvidencia: v })), [])
  const setFavorito      = useCallback((v: boolean | undefined) => setLocal((p) => ({ ...p, favorito: v })), [])
  const setAnoMin        = useCallback((v: number | undefined) => setLocal((p) => ({ ...p, anoMin: v })), [])
  const setAnoMax        = useCallback((v: number | undefined) => setLocal((p) => ({ ...p, anoMax: v })), [])
  const setOrdenar       = useCallback((v: AcervoFiltros['ordenar']) => setLocal((p) => ({ ...p, ordenar: v })), [])

  const limpar = useCallback(() => {
    setLocal(inicial)
    try { window.localStorage.removeItem(STORAGE_KEY) } catch {}
  }, [])

  const temFiltrosAtivos = !!(
    local.busca || local.tipoEstudo || local.nivelEvidencia ||
    local.favorito !== undefined || local.anoMin || local.anoMax
  )

  return {
    filtros: local,
    filtrosPropagados: propagados,
    temFiltrosAtivos,
    setBusca,
    setTipoEstudo,
    setNivelEvidencia,
    setFavorito,
    setAnoMin,
    setAnoMax,
    setOrdenar,
    limpar,
  }
}
