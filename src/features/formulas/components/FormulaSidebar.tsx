'use client'

// FormulaSidebar — Sidebar de navegação/filtros de Fórmulas
// Capítulo V: Fórmulas

import { FormulaSearch }  from './FormulaSearch'
import { FormulaFilters } from './FormulaFilters'
import type { useFormulaFiltros } from '../hooks/useFormulaFiltros'
import styles from './FormulaSidebar.module.css'

type FiltroHandlers = ReturnType<typeof import('../hooks/useFormulaFiltros').useFormulaFiltros>

interface FormulaSidebarProps {
  filtroHandlers:  FiltroHandlers
  tagsDisponiveis: string[]
}

export function FormulaSidebar({ filtroHandlers, tagsDisponiveis }: FormulaSidebarProps) {
  const { filtros, temFiltrosAtivos, setBusca, setStatus, setFavorito, setTags, setOrdenar, limpar } = filtroHandlers

  return (
    <div className={styles.sidebar}>
      <FormulaSearch
        value={filtros.busca}
        onChange={setBusca}
      />

      <div className={styles.divider} aria-hidden="true" />

      <FormulaFilters
        status={filtros.status}
        favorito={filtros.favorito}
        tags={filtros.tags}
        ordenar={filtros.ordenar}
        tagsDisponiveis={tagsDisponiveis}
        temFiltrosAtivos={temFiltrosAtivos}
        onStatus={setStatus}
        onFavorito={setFavorito}
        onTags={setTags}
        onOrdenar={setOrdenar}
        onLimpar={limpar}
      />
    </div>
  )
}
