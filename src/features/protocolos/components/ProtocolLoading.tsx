// ============================================================
// ProtocolLoading — Skeleton de Listagem
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import styles from './ProtocolLoading.module.css'

function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <span className={styles.acento} />
      <div className={styles.corpo}>
        <div className={[styles.shimmer, styles.titulo].join(' ')} />
        <div className={[styles.shimmer, styles.objetivo].join(' ')} />
        <div className={[styles.shimmer, styles.indicacoes].join(' ')} />
        <div className={styles.rodape}>
          <div className={[styles.shimmer, styles.maturidade].join(' ')} />
          <div className={[styles.shimmer, styles.tag].join(' ')} />
          <div className={[styles.shimmer, styles.tag].join(' ')} />
        </div>
      </div>
    </div>
  )
}

export function ProtocolLoading() {
  return (
    <div className={styles.lista} aria-label="Carregando protocolos..." aria-busy="true">
      {Array.from({ length: 4 }, (_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
