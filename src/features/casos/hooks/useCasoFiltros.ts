// ============================================================
// useCasoFiltros — Hook de Filtros de Casos Clínicos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// localStorage: persiste status, favorito, tags, ordenar
// Busca é efêmera (não persiste entre sessões)
// Debounce 350ms antes de propagar
// ============================================================

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { CasoFiltros, StatusCaso } from '../types'

const STORAGE_KEY = 'biblioteca-casos-filtros'
const DEBOUNCE_MS = 350
// Evento interno para sincronizar múltiplas instâncias do hook na mesma página
const SYNC_EVENT  = '__biblioteca_casos_filtros_sync__'

type FiltrosPersistidos = {
  status: string
  favorito: boolean
  tags: string[]
  ordenar: 'recente' | 'antigo' | 'codigo'
}

const filtrosPadrao: FiltrosPersistidos = {
  status:  '',
  favorito: false,
  tags:    [],
  ordenar: 'recente',
}

export function useCasoFiltros() {
  const [busca,    setBusca]    = useState('')
  const [status,   setStatus]   = useState<string>('')
  const [favorito, setFavorito] = useState(false)
  const [tags,     setTags]     = useState<string[]>([])
  const [ordenar,  setOrdenar]  = useState<'recente' | 'antigo' | 'codigo'>('recente')

  const [filtrosPropagados, setFiltrosPropagados] = useState<Partial<CasoFiltros>>({})
  const debounceRef  = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef  = useRef('')

  // Carregar do localStorage no mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as FiltrosPersistidos
        setStatus(saved.status ?? '')
        setFavorito(saved.favorito ?? false)
        setTags(saved.tags ?? [])
        setOrdenar(saved.ordenar ?? 'recente')
      }
    } catch { /* ignora */ }
  }, [])

  // Sincronizar com outras instâncias do hook na mesma página
  useEffect(() => {
    function onSync(e: Event) {
      const { status: s, favorito: f, tags: t, ordenar: o } =
        (e as CustomEvent<FiltrosPersistidos>).detail
      setStatus(s)
      setFavorito(f)
      setTags(t)
      setOrdenar(o)
    }
    window.addEventListener(SYNC_EVENT, onSync)
    return () => window.removeEventListener(SYNC_EVENT, onSync)
  }, [])

  // Persistir ao mudar + notificar outras instâncias
  useEffect(() => {
    try {
      const toSave: FiltrosPersistidos = { status, favorito, tags, ordenar }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
      const key = JSON.stringify(toSave)
      if (key === lastSyncRef.current) return  // evita cascade infinito
      lastSyncRef.current = key
      window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: toSave }))
    } catch { /* ignora */ }
  }, [status, favorito, tags, ordenar])

  // Debounce para propagar
  const propagar = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFiltrosPropagados({
        busca:   busca || undefined,
        status:  status || undefined,
        favorito: favorito || undefined,
        tags:    tags.length > 0 ? tags : undefined,
        ordenar,
        limite:  20,
      })
    }, DEBOUNCE_MS)
  }, [busca, status, favorito, tags, ordenar])

  useEffect(() => { propagar() }, [propagar])

  function limpar() {
    setBusca('')
    setStatus('')
    setFavorito(false)
    setTags([])
    setOrdenar('recente')
  }

  const temFiltrosAtivos = status !== '' || favorito || tags.length > 0

  return {
    filtros: { busca, status, favorito, tags, ordenar },
    filtrosPropagados,
    temFiltrosAtivos,
    setBusca,
    setStatus: (s: string) => setStatus(s),
    setFavorito: (f: boolean) => setFavorito(f),
    setTags: (t: string[]) => setTags(t),
    setOrdenar: (o: 'recente' | 'antigo' | 'codigo') => setOrdenar(o),
    limpar,
  }
}
