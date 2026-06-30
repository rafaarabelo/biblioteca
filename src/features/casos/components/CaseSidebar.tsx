// CaseSidebar — Sidebar de filtros (client component)

'use client'

import { useCasoFiltros } from '../hooks/useCasoFiltros'
import { CaseFilters } from './CaseFilters'

interface CaseSidebarProps {
  tagsDisponiveis: string[]
}

export function CaseSidebar({ tagsDisponiveis }: CaseSidebarProps) {
  const {
    filtros,
    temFiltrosAtivos,
    setStatus,
    setFavorito,
    setTags,
    limpar,
  } = useCasoFiltros()

  return (
    <CaseFilters
      status={filtros.status}
      favorito={filtros.favorito}
      tags={filtros.tags}
      tagsDisponiveis={tagsDisponiveis}
      temFiltrosAtivos={temFiltrosAtivos}
      onStatus={setStatus}
      onFavorito={setFavorito}
      onTags={setTags}
      onLimpar={limpar}
    />
  )
}
