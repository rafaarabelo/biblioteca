// ============================================================
// Acervo — Detalhe Loading
// Biblioteca Cosmetológica Rafa Rabelo
// ============================================================

import styles from './loading.module.css'

export default function ReferenciaDetalheLoading() {
  return (
    <div className={styles.pagina} aria-label="Carregando referência..." aria-busy="true">

      <div className={[styles.shimmer, styles.voltar].join(' ')} />

      <div className={styles.grid}>
        {/* Principal */}
        <div className={styles.principal}>
          <div className={[styles.shimmer, styles.tipo].join(' ')} />
          <div className={[styles.shimmer, styles.titulo].join(' ')} />
          <div className={[styles.shimmer, styles.tituloB].join(' ')} />
          <div className={[styles.shimmer, styles.citacao].join(' ')} />
          <div className={[styles.shimmer, styles.blocoTexto].join(' ')} />
          <div className={[styles.shimmer, styles.blocoTexto, styles.curto].join(' ')} />
        </div>
        {/* Lateral */}
        <div className={styles.lateral}>
          <div className={[styles.shimmer, styles.metaDado].join(' ')} />
          <div className={[styles.shimmer, styles.metaDado].join(' ')} />
          <div className={[styles.shimmer, styles.metaDado, styles.curto].join(' ')} />
        </div>
      </div>
    </div>
  )
}
