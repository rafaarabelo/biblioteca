'use client'

// FormulaHeader — Cabeçalho da listagem de fórmulas
// Capítulo V: Fórmulas

import Link from 'next/link'
import styles from './FormulaHeader.module.css'

interface FormulaHeaderProps {
  total?: number
}

export function FormulaHeader({ total }: FormulaHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.esquerda}>
        <h1 className={styles.titulo}>Fórmulas</h1>
        {total !== undefined && (
          <span className={styles.contagem}>{total} fórmula{total !== 1 ? 's' : ''}</span>
        )}
      </div>

      <Link href="/formulas/nova" className={styles.botaoNovo}>
        Nova fórmula
      </Link>
    </header>
  )
}
