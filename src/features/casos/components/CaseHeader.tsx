// CaseHeader — Cabeçalho da seção de Casos Clínicos

import Link from 'next/link'
import styles from './CaseHeader.module.css'

interface CaseHeaderProps {
  total: number
}

export function CaseHeader({ total }: CaseHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titulo}>
        <h1 className={styles.h1}>Casos Clínicos</h1>
        {total > 0 && (
          <span className={styles.total} aria-label={`${total} casos`}>
            {total}
          </span>
        )}
      </div>
      <Link href="/casos/novo" className={styles.novo}>
        Novo caso
      </Link>
    </header>
  )
}
