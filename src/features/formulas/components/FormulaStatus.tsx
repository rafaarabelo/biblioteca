// FormulaStatus — Badge de status de versão
// Capítulo V: Fórmulas

import type { StatusVersaoFormula } from '../types'
import { STATUS_VERSAO_META } from '../types'
import styles from './FormulaStatus.module.css'

interface FormulaStatusProps {
  status:   StatusVersaoFormula
  compacto?: boolean
}

export function FormulaStatus({ status, compacto = false }: FormulaStatusProps) {
  const meta = STATUS_VERSAO_META[status] ?? STATUS_VERSAO_META.rascunho
  return (
    <span
      className={[styles.badge, compacto ? styles.compacto : ''].join(' ')}
      style={{ '--status-cor': meta.cor } as React.CSSProperties}
      title={meta.descricao}
      aria-label={`Status: ${meta.label}`}
    >
      {meta.label}
    </span>
  )
}
