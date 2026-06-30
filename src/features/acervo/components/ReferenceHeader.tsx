// ============================================================
// ReferenceHeader — Cabeçalho do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

import Link from 'next/link'
import styles from './ReferenceHeader.module.css'

interface ReferenceHeaderProps {
  totalReferencias: number
}

export function ReferenceHeader({ totalReferencias }: ReferenceHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.esquerda}>
        <h1 className={styles.titulo}>Acervo Científico</h1>
        {totalReferencias > 0 && (
          <span className={styles.cont} aria-label={`${totalReferencias} referências`}>
            {totalReferencias}
          </span>
        )}
      </div>
      <Link href="/acervo/nova" className={styles.botaoNova}>
        Registrar referência
      </Link>
    </div>
  )
}
