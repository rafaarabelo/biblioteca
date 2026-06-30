// ============================================================
// CadernoInterativo — Client Component de Filtros e Busca
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Gerencia o estado de filtros + busca do lado do cliente.
// Chama Server Actions para buscar dados filtrados.
// ============================================================

'use client'

import { useState, useCallback, useTransition, useEffect } from 'react'
import { NotebookSidebar } from '@/features/caderno/components/NotebookSidebar'
import { NotebookSearch } from '@/features/caderno/components/NotebookSearch'
import { ObservationCard } from '@/features/caderno/components/ObservationCard'
import { NotebookEmptyState } from '@/features/caderno/components/NotebookEmptyState'
import { listarObservacoes } from '@/features/caderno/actions/cadernoActions'
import type { TipoObservacao, StatusEpistemicoUI, ObservacaoView } from '@/features/caderno/types'

// ─────────────────────────────────────────────
// Modos: sidebar usa o interativo para os filtros;
// busca usa para a barra de pesquisa + resultados filtrados.
// ─────────────────────────────────────────────

// Evento de sincronização entre instâncias sidebar ↔ busca
const SYNC_FILTROS = '__biblioteca_caderno_filtros_sync__'
type SyncPayload = { tipo: TipoObservacao | null; status: StatusEpistemicoUI | null; favorito: boolean | undefined }

interface CadernoInterativoProps {
  modo: 'sidebar' | 'busca'
  tagsDisponiveis?: string[]
  tipoAtivo?: TipoObservacao | null
  statusAtivo?: StatusEpistemicoUI | null
}

export function CadernoInterativo({
  modo,
  tagsDisponiveis = [],
  tipoAtivo: tipoInicial = null,
  statusAtivo: statusInicial = null,
}: CadernoInterativoProps) {
  const [tipo, setTipo] = useState<TipoObservacao | null>(tipoInicial)
  const [status, setStatus] = useState<StatusEpistemicoUI | null>(statusInicial)
  const [favorito, setFavorito] = useState<boolean | undefined>()
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState<ObservacaoView[] | null>(null)
  const [total, setTotal] = useState<number>(0)
  const [pending, startTransition] = useTransition()

  const temFiltrosAtivos = !!(tipo || status || favorito !== undefined || busca)

  const atualizar = useCallback((
    novoBusca?: string,
    novoTipo?: TipoObservacao | null,
    novoStatus?: StatusEpistemicoUI | null,
    novoFavorito?: boolean | undefined,
  ) => {
    const b = novoBusca !== undefined ? novoBusca : busca
    const t = novoTipo !== undefined ? novoTipo : tipo
    const s = novoStatus !== undefined ? novoStatus : status
    const f = novoFavorito !== undefined ? novoFavorito : favorito

    const temFiltro = !!(b || t || s || f !== undefined)
    if (!temFiltro) {
      setResultados(null)
      return
    }

    startTransition(async () => {
      const dados = await listarObservacoes({
        busca: b || undefined,
        tipo: t ?? undefined,
        statusEpistemico: s ?? undefined,
        favorito: f,
        limite: 20,
      })
      if (dados) {
        setResultados(dados.observacoes)
        setTotal(dados.total)
      }
    })
  }, [busca, tipo, status, favorito])

  // Instância busca: receber filtros disparados pela instância sidebar
  useEffect(() => {
    if (modo !== 'busca') return
    function onSync(e: Event) {
      const { tipo: t, status: s, favorito: f } = (e as CustomEvent<SyncPayload>).detail
      setTipo(t)
      setStatus(s)
      setFavorito(f)
      // Acionar busca com os novos filtros imediatamente (usando parâmetros para evitar closure stale)
      atualizar(undefined, t, s, f)
    }
    window.addEventListener(SYNC_FILTROS, onSync)
    return () => window.removeEventListener(SYNC_FILTROS, onSync)
  }, [modo, atualizar])

  const handleBusca = useCallback((termo: string) => {
    setBusca(termo)
    atualizar(termo)
  }, [atualizar])

  const handleTipo = useCallback((t: TipoObservacao | null) => {
    setTipo(t)
    atualizar(undefined, t)
    // Notificar instância busca com estado completo atualizado
    if (modo === 'sidebar') {
      window.dispatchEvent(new CustomEvent<SyncPayload>(SYNC_FILTROS, {
        detail: { tipo: t, status, favorito },
      }))
    }
  }, [atualizar, modo, status, favorito])

  const handleStatus = useCallback((s: StatusEpistemicoUI | null) => {
    setStatus(s)
    atualizar(undefined, undefined, s)
    if (modo === 'sidebar') {
      window.dispatchEvent(new CustomEvent<SyncPayload>(SYNC_FILTROS, {
        detail: { tipo, status: s, favorito },
      }))
    }
  }, [atualizar, modo, tipo, favorito])

  const handleFavorito = useCallback((f: boolean | undefined) => {
    setFavorito(f)
    atualizar(undefined, undefined, undefined, f)
    if (modo === 'sidebar') {
      window.dispatchEvent(new CustomEvent<SyncPayload>(SYNC_FILTROS, {
        detail: { tipo, status, favorito: f },
      }))
    }
  }, [atualizar, modo, tipo, status])

  const handleLimpar = useCallback(() => {
    setBusca('')
    setTipo(null)
    setStatus(null)
    setFavorito(undefined)
    setResultados(null)
    if (modo === 'sidebar') {
      window.dispatchEvent(new CustomEvent<SyncPayload>(SYNC_FILTROS, {
        detail: { tipo: null, status: null, favorito: undefined },
      }))
    }
  }, [modo])

  if (modo === 'sidebar') {
    return (
      <NotebookSidebar
        tipoAtivo={tipo}
        statusAtivo={status}
        favoritoAtivo={favorito}
        tags={tagsDisponiveis}
        onTipo={handleTipo}
        onStatus={handleStatus}
        onFavorito={handleFavorito}
        onLimpar={handleLimpar}
        temFiltrosAtivos={temFiltrosAtivos}
      />
    )
  }

  // modo === 'busca'
  return (
    <div>
      <NotebookSearch valor={busca} onBuscar={handleBusca} />

      {resultados !== null && (
        <div style={{ marginTop: 'var(--spacing-4)' }}>
          {pending && (
            <p style={{ fontSize: '0.75rem', color: 'var(--texto-terciario)', marginBottom: 'var(--spacing-3)' }}>
              Buscando...
            </p>
          )}

          {!pending && resultados.length === 0 && (
            <NotebookEmptyState tipo="busca" />
          )}

          {!pending && resultados.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {resultados.map((obs) => (
                <ObservationCard key={obs.id} observacao={obs} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
