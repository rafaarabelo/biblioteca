// ============================================================
// FormulaIngredient — Linha elegante de ingrediente
// Capítulo V: Fórmulas
// ============================================================
// Não apresentar como tabela administrativa.
// Cada ativo tem identidade visual pela fase.
// ============================================================

import type { IngredienteView } from '../types'
import { FASE_META } from '../types'
import styles from './FormulaIngredient.module.css'

interface FormulaIngredientProps {
  ingrediente: IngredienteView
  mostrarFase?: boolean
}

export function FormulaIngredient({ ingrediente, mostrarFase = true }: FormulaIngredientProps) {
  const faseMeta = FASE_META[ingrediente.fase]

  return (
    <div className={styles.ingrediente}>
      {/* Indicador de fase */}
      {mostrarFase && (
        <span
          className={styles.faseIndicador}
          style={{ '--fase-cor': faseMeta.cor } as React.CSSProperties}
          title={faseMeta.label}
          aria-label={`Fase: ${faseMeta.label}`}
        >
          {faseMeta.abrev}
        </span>
      )}

      <div className={styles.corpo}>
        {/* Nome do ativo */}
        <span className={styles.nome}>
          {ingrediente.nomeAtivo}
        </span>

        {/* Concentração */}
        <span className={styles.concentracao}>
          {ingrediente.concentracao}{ingrediente.unidade}
        </span>
      </div>

      {/* Função e observações */}
      {(ingrediente.funcaoNaFormula || ingrediente.observacoes) && (
        <div className={styles.detalhes}>
          {ingrediente.funcaoNaFormula && (
            <span className={styles.funcao}>{ingrediente.funcaoNaFormula}</span>
          )}
          {ingrediente.observacoes && (
            <span className={styles.obs}>{ingrediente.observacoes}</span>
          )}
        </div>
      )}
    </div>
  )
}
