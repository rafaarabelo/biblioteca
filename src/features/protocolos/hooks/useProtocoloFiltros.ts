// ============================================================
// useProtocoloFiltros — Estado e Persistência dos Filtros
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// localStorage persiste filtros entre sessões.
// busca é efêmera (não persiste — só os filtros de seleção).
// Debounce de 350ms antes de propagar para a Server Action.
// ============================================================

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { ProtocoloFiltros, MaturidadeProtocolo } from '../types'

const STORAGE_KEY = 'biblioteca-protocolos-filtros'
const DEBOUNCE_MS = 350
// Evento interno para sincronizar múltiplas instâncias do hook na mesma página
const SYNC_EVENT  = '__biblioteca_protocolos_filtros_sync__'

type FiltrosPersistaveis = Omit<ProtocoloFiltros, 'busca' | 'limite' | 'offset'>

function carregarFiltros(): FiltrosPersistaveis {
  if (typeof window === 'undefined') return filtrosPadrao()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return filtrosPadrao()
    return { ...filtrosPadrao(), ...JSON.parse(raw) }
  } catch {
    return filtrosPadrao()
  }
}

function filtrosPadrao(): FiltrosPersistaveis {
  return {
    maturidade: '',
    favorito: false,
    tags: [],
    ordenar: 'recente',
  }
}

export function useProtocoloFiltros() {
  const [busca, setBusca]             = useState('')
  const [maturidade, setMaturidade]   = useState<MaturidadeProtocolo | ''>('')
  const [favorito, setFavorito]       = useState(false)
  const [tags, setTags]               = useState<string[]>([])
  const [ordenar, setOrdenar]         = useState<ProtocoloFiltros['ordenar']>('recente')

  // Filtros propagados (com debounce) — esses é que disparam o refetch
  const [filtrosPropagados, setFiltrosPropagados] = useState<Partial<ProtocoloFiltros>>({})
  const debounceRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSyncRef  = useRef('')

  // Carregar do localStorage apenas no cliente
  useEffect(() => {
    const salvo = carregarFiltros()
    setMaturidade(salvo.maturidade)
    setFavorito(salvo.favorito)
    setTags(salvo.tags)
    setOrdenar(salvo.ordenar)
  }, [])

  // Sincronizar com outras instâncias do hook na mesma página
  useEffect(() => {
    function onSync(e: Event) {
      const { maturidade: m, favorito: f, tags: t, ordenar: o } =
        (e as CustomEvent<FiltrosPersistaveis>).detail
      setMaturidade(m)
      setFavorito(f)
      setTags(t)
      setOrdenar(o)
    }
    window.addEventListener(SYNC_EVENT, onSync)
    return () => window.removeEventListener(SYNC_EVENT, onSync)
  }, [])

  // Salvar filtros persistíveis no localStorage + notificar outras instâncias
  useEffect(() => {
    if (typeof window === 'undefined') return
    const toSave: FiltrosPersistaveis = { maturidade, favorito, tags, ordenar }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    const key = JSON.stringify(toSave)
    if (key === lastSyncRef.current) return  // evita cascade infinito
    lastSyncRef.current = key
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: toSave }))
  }, [maturidade, favorito, tags, ordenar])

  // Propagar com debounce quando qualquer filtro muda
  const propagar = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setFiltrosPropagados({
        busca: busca || undefined,
        maturidade: maturidade || undefined,
        favorito: favorito || undefined,
        tags: tags.length ? tags : undefined,
        ordenar,
        limite: 20,
        offset: 0,
      })
    }, DEBOUNCE_MS)
  }, [busca, maturidade, favorito, tags, ordenar])

  useEffect(() => {
    propagar()
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [propagar])

  function limpar() {
    setBusca('')
    setMaturidade('')
    setFavorito(false)
    setTags([])
    setOrdenar('recente')
  }

  const temFiltrosAtivos = maturidade !== '' || favorito || tags.length > 0

  return {
    filtros: { busca, maturidade, favorito, tags, ordenar },
    filtrosPropagados,
    temFiltrosAtivos,
    setBusca,
    setMaturidade,
    setFavorito,
    setTags,
    setOrdenar,
    limpar,
  }
}
