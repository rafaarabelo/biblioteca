// ============================================================
// ProtocoloInterativo — Client Component de Listagem
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Gerencia estado de filtros e rebusca via Server Action.
// Dois exports: ProtocoloInterativo (listagem) + ProtocoloSidebar.
// ============================================================

'use client'

import { useState, useEffect, useTransition } from 'react'
import { listarProtocolos } from '@/features/protocolos/actions/protocoloActions'
import { useProtocoloFiltros } from '@/features/protocolos/hooks/useProtocoloFiltros'
import { ProtocolCard } from '@/features/protocolos/components/ProtocolCard'
import { ProtocolSearch } from '@/features/protocolos/components/ProtocolSearch'
import { ProtocolFilters } from '@/features/protocolos/components/ProtocolFilters'
import { ProtocolEmptyState } from '@/features/protocolos/components/ProtocolEmptyState'
import { ProtocolLoading } from '@/features/protocolos/components/ProtocolLoading'
import type { ProtocoloView } from '@/features/protocolos/types'
import styles from './ProtocoloInterativo.module.css'

// ─────────────────────────────────────────────
// Listagem Principal
// ─────────────────────────────────────────────

interface ProtocoloInterativoProps {
  protocolosIniciais: ProtocoloView[]
  tagsDisponiveis: string[]
}

export function ProtocoloInterativo({ protocolosIniciais, tagsDisponiveis }: ProtocoloInterativoProps) {
  const [protocolos, setProtocolos] = useState<ProtocoloView[]>(protocolosIniciais)
  const [buscando, startBuscando] = useTransition()
  const {
    filtros,
    filtrosPropagados,
    temFiltrosAtivos,
    setBusca,
    setMaturidade,
    setFavorito,
    setTags,
    setOrdenar,
    limpar,
  } = useProtocoloFiltros()

  // Rebusca quando filtros propagados mudam
  useEffect(() => {
    if (Object.keys(filtrosPropagados).length === 0) return
    startBuscando(async () => {
      const resultado = await listarProtocolos(filtrosPropagados)
      if (resultado) setProtocolos(resultado)
    })
  }, [filtrosPropagados])

  const temBusca = !!filtros.busca || temFiltrosAtivos

  return (
    <div className={styles.wrapper}>
      {/* Busca */}
      <ProtocolSearch valor={filtros.busca} onChange={setBusca} />

      {/* Barra superior */}
      <div className={styles.topBar}>
        <span className={styles.contagem}>
          {buscando ? 'Buscando...' : `${protocolos.length} protocolo${protocolos.length !== 1 ? 's' : ''}`}
        </span>
        <select
          className={styles.ordenar}
          value={filtros.ordenar}
          onChange={(e) => setOrdenar(e.target.value as any)}
          aria-label="Ordenar protocolos"
        >
          <option value="recente">Mais recentes</option>
          <option value="antigo">Mais antigos</option>
          <option value="titulo">Alfabético</option>
          <option value="maturidade">Maturidade</option>
        </select>
      </div>

      {/* Filtros mobile */}
      <div className={styles.filtrosMobile}>
        <ProtocolFilters
          maturidade={filtros.maturidade}
          favorito={filtros.favorito}
          tags={filtros.tags}
          tagsDisponiveis={tagsDisponiveis}
          temFiltrosAtivos={temFiltrosAtivos}
          onMaturidade={setMaturidade}
          onFavorito={setFavorito}
          onTags={setTags}
          onLimpar={limpar}
        />
      </div>

      {/* Lista ou Estados */}
      {buscando ? (
        <ProtocolLoading />
      ) : protocolos.length === 0 ? (
        <ProtocolEmptyState
          comFiltros={temBusca}
          onLimparFiltros={limpar}
        />
      ) : (
        <div className={styles.lista}>
          {protocolos.map((p) => (
            <ProtocolCard key={p.id} protocolo={p} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Sidebar (compartilha o mesmo hook pelo localStorage)
// ─────────────────────────────────────────────

export function ProtocoloSidebar({ tagsDisponiveis }: { tagsDisponiveis: string[] }) {
  const {
    filtros,
    temFiltrosAtivos,
    setMaturidade,
    setFavorito,
    setTags,
    limpar,
  } = useProtocoloFiltros()

  return (
    <ProtocolFilters
      maturidade={filtros.maturidade}
      favorito={filtros.favorito}
      tags={filtros.tags}
      tagsDisponiveis={tagsDisponiveis}
      temFiltrosAtivos={temFiltrosAtivos}
      onMaturidade={setMaturidade}
      onFavorito={setFavorito}
      onTags={setTags}
      onLimpar={limpar}
    />
  )
}
