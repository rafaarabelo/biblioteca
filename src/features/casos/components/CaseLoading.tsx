// CaseLoading — Estado de carregamento com shimmer

import styles from './CaseLoading.module.css'

function CardSkeleton() {
  return (
    <div className={styles.card}>
      <span className={styles.acento} />
      <div className={styles.corpo}>
        <div className={styles.top}>
          <span className={[styles.shimmer, styles.codigo].join(' ')} />
          <span className={[styles.shimmer, styles.data].join(' ')} />
        </div>
        <span className={[styles.shimmer, styles.objetivo].join(' ')} />
        <span className={[styles.shimmer, styles.queixa].join(' ')} />
        <div className={styles.rodape}>
          <span className={[styles.shimmer, styles.status].join(' ')} />
          <span className={[styles.shimmer, styles.contagem].join(' ')} />
        </div>
      </div>
    </div>
  )
}

export function CaseLoading() {
  return (
    <div className={styles.lista} aria-busy="true" aria-label="Carregando casos...">
      {Array.from({ length: 4 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
