// ============================================================
// NotebookLoading — Skeleton do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Server Component — shimmer que imita a forma real do Caderno.
// Sensação de "páginas sendo preparadas, não dashboard carregando".
// ============================================================

import styles from './NotebookLoading.module.css'

function CardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.cardTipo} />
      <div className={styles.cardTitulo} />
      <div className={styles.cardExcerpto} />
      <div className={styles.cardExcerpto} style={{ width: '65%' }} />
      <div className={styles.cardFooter}>
        <div className={styles.cardStatus} />
        <div className={styles.cardData} />
      </div>
    </div>
  )
}

export function NotebookLoading() {
  return (
    <div className={styles.layout} aria-label="Carregando caderno..." aria-busy="true">
      {/* Header skeleton */}
      <div className={styles.header}>
        <div className={styles.headerTitulo} />
        <div className={styles.headerBotao} />
      </div>

      {/* Corpo */}
      <div className={styles.corpo}>
        {/* Sidebar skeleton */}
        <div className={styles.sidebar}>
          <div className={styles.sidebarLabel} />
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={styles.sidebarItem} />
          ))}
          <div className={[styles.sidebarLabel, styles.sidebarLabel2].join(' ')} />
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={styles.sidebarItem} />
          ))}
        </div>

        {/* Lista de cards skeleton */}
        <div className={styles.lista}>
          {Array.from({ length: 5 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
