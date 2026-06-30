// ============================================================
// FormulaComposition — Composição elegante por fase
// Capítulo V: Fórmulas
// ============================================================
// Agrupa ingredientes por fase de incorporação.
// Nunca exibe como tabela administrativa.
// A composição é a hipótese materializada.
// ============================================================

import { FormulaIngredient } from './FormulaIngredient'
import type { IngredienteView, FaseIncorporacao } from '../types'
import { FASE_META } from '../types'
import styles from './FormulaComposition.module.css'

interface FormulaCompositionProps {
  ingredientes:  IngredienteView[]
  modoCompacto?: boolean
}

export function FormulaComposition({ ingredientes, modoCompacto = false }: FormulaCompositionProps) {
  if (!ingredientes || ingredientes.length === 0) {
    return (
      <div className={styles.vazio}>
        <p className={styles.vazioTexto}>Nenhum ativo registrado nesta versão.</p>
      </div>
    )
  }

  // Agrupar por fase
  const porFase = ingredientes.reduce<Record<FaseIncorporacao, IngredienteView[]>>(
    (acc, ing) => {
      if (!acc[ing.fase]) acc[ing.fase] = []
      acc[ing.fase].push(ing)
      return acc
    },
    {} as Record<FaseIncorporacao, IngredienteView[]>
  )

  const fasesOrdenadas: FaseIncorporacao[] = [
    'ativo_principal', 'fase_aquosa', 'fase_oleosa',
    'fase_emulsificante', 'fase_final', 'preservante', 'ajuste_ph', 'outro',
  ]

  const fasesPresentes = fasesOrdenadas.filter((f) => (porFase[f] ?? []).length > 0)

  if (modoCompacto) {
    // Modo compacto: lista plana ordenada por fase
    const ordenados = fasesOrdenadas.flatMap((f) => porFase[f] ?? [])
    return (
      <div className={styles.compacto}>
        {ordenados.map((ing) => (
          <FormulaIngredient key={ing.id} ingrediente={ing} mostrarFase />
        ))}
      </div>
    )
  }

  return (
    <div className={styles.composicao}>
      {fasesPresentes.map((fase) => {
        const meta = FASE_META[fase]
        const ings = porFase[fase] ?? []
        return (
          <section key={fase} className={styles.grupo}>
            <div className={styles.grupoHeader}>
              <span
                className={styles.faseLabel}
                style={{ '--fase-cor': meta.cor } as React.CSSProperties}
              >
                <span className={styles.faseAbrev}>{meta.abrev}</span>
                {meta.label}
              </span>
              <span className={styles.grupoContagem}>{ings.length}</span>
            </div>
            <div className={styles.grupoItens}>
              {ings.sort((a, b) => a.ordem - b.ordem).map((ing) => (
                <FormulaIngredient key={ing.id} ingrediente={ing} mostrarFase={false} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
