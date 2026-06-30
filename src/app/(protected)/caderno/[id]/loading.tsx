// ============================================================
// loading.tsx — Suspense para detalhe da observação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

import styles from './loading.module.css'

export default function ObservacaoLoading() {
  return (
    <div className={styles.pagina}>
      <div className={styles.nav} />
      <div className={styles.corpo}>
        <div className={styles.principal}>
          <div className={styles.shimmer} style={{ width: '80px', height: '14px', borderRadius: '4px' }} />
          <div className={styles.shimmer} style={{ width: '70%', height: '36px', borderRadius: '4px', marginTop: '8px' }} />
          <div className={styles.shimmer} style={{ width: '50%', height: '36px', borderRadius: '4px', marginTop: '4px' }} />
          <div className={styles.shimmer} style={{ width: '160px', height: '20px', borderRadius: '4px', marginTop: '12px' }} />
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={styles.shimmer}
                style={{ width: i % 3 === 2 ? '85%' : '100%', height: '16px', borderRadius: '3px' }}
              />
            ))}
          </div>
        </div>
        <div className={styles.lateral} />
      </div>
    </div>
  )
}
