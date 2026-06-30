'use client'

// FormulaInterativo + FormulaSidebarClient — Client wrappers para /formulas
// Capítulo V: Fórmulas

import { useEffect, useState, useTransition } from 'react'
import { useFormulaFiltros } from '@/features/formulas/hooks/useFormulaFiltros'
import { listarFormulas }    from '@/features/formulas/actions/formulaActions'
import { FormulaCard }       from '@/features/formulas/components/FormulaCard'
import { FormulaSearch }     from '@/features/formulas/components/FormulaSearch'
import { FormulaLoading }    from '@/features/formulas/components/FormulaLoading'
import { FormulaFilters }    from '@/features/formulas/components/FormulaFilters'
import type { FormulaView }  from '@/features/formulas/types'
import styles from './FormulaInterativo.module.css'

// ── Listagem interativa ─────────────────────────────────────

interface FormulaInterativoProps {
  formulasIniciais: FormulaView[]
  tagsDisponiveis:  string[]
}

export function FormulaInterativo({ formulasIniciais, tagsDisponiveis }: FormulaInterativoProps) {
  const { filtros, filtrosPropagados, setBusca } = useFormulaFiltros()
  const [formulas, setFormulas]   = useState<FormulaView[]>(formulasIniciais)
  const [buscando, setBuscando]   = useState(false)
  const [, startTransition]       = useTransition()

  useEffect(() => {
    setBuscando(true)
    startTransition(async () => {
      const resultado = await listarFormulas(filtrosPropagados)
      setFormulas(resultado ?? [])
      setBuscando(false)
    })
  }, [filtrosPropagados])

  return (
    <div>
      <div className={styles.buscaWrapper}>
        <FormulaSearch value={filtros.busca} onChange={setBusca} />
      </div>

      {buscando ? (
        <FormulaLoading />
      ) : formulas.length === 0 ? (
        <FormulaEstadoVazio temFiltro={
          !!filtros.busca || !!filtros.status || filtros.favorito || filtros.tags.length > 0
        } />
      ) : (
        <div className={styles.lista}>
          {formulas.map((formula) => (
            <FormulaCard key={formula.id} formula={formula} />
          ))}
        </div>
      )}
    </div>
  )
}

function FormulaEstadoVazio({ temFiltro }: { temFiltro: boolean }) {
  return (
    <div className={styles.vazio}>
      <p className={styles.vazioTexto}>
        {temFiltro
          ? 'Nenhuma fórmula encontrada com os filtros aplicados.'
          : 'Nenhuma fórmula registrada ainda.'}
      </p>
      {!temFiltro && (
        <p className={styles.vazioSubtexto}>
          Nenhuma fórmula nasce pronta. Comece com uma hipótese.
        </p>
      )}
    </div>
  )
}

// ── Sidebar de filtros ──────────────────────────────────────

interface FormulaSidebarClientProps {
  tagsDisponiveis: string[]
}

export function FormulaSidebarClient({ tagsDisponiveis }: FormulaSidebarClientProps) {
  const {
    filtros,
    temFiltrosAtivos,
    setStatus,
    setFavorito,
    setTags,
    setOrdenar,
    limpar,
  } = useFormulaFiltros()

  return (
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
  )
}
