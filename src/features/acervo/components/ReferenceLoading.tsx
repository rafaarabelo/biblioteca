// ============================================================
// ReferenceLoading — Skeleton de carregamento do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

import styles from './ReferenceLoading.module.css'

function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.acento} />
      <div className={styles.corpo}>
        <div className={styles.topo}>
          <div className={[styles.shimmer, styles.tipoPill].join(' ')} />
        </div>
        <div className={[styles.shimmer, styles.titulo].join(' ')} />
        <div className={[styles.shimmer, styles.tituloLinha2].join(' ')} />
        <div className={[styles.shimmer, styles.citacao].join(' ')} />
        <div className={styles.rodape}>
          <div className={[styles.shimmer, styles.barras].join(' ')} />
          <div className={[styles.shimmer, styles.tag].join(' ')} />
          <div className={[styles.shimmer, styles.tag].join(' ')} />
        </div>
      </div>
    </div>
  )
}

export function ReferenceLoading() {
  return (
    <div className={styles.lista} aria-label="Carregando referências..." aria-busy="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
