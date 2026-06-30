// ============================================================
// ProtocolSidebar — Slot de Sidebar (usa filtros compartilhados)
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import { useProtocoloFiltros } from '../hooks/useProtocoloFiltros'
import { ProtocolFilters } from './ProtocolFilters'

interface ProtocolSidebarProps {
  tagsDisponiveis: string[]
}

export function ProtocolSidebar({ tagsDisponiveis }: ProtocolSidebarProps) {
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
