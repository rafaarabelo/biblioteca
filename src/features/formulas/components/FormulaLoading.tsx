// FormulaLoading — Esqueleto de carregamento para Fórmulas
// Capítulo V: Fórmulas

import styles from './FormulaLoading.module.css'

interface FormulaLoadingProps {
  quantidade?: number
  tipo?:       'lista' | 'detalhe'
}

export function FormulaLoading({ quantidade = 4, tipo = 'lista' }: FormulaLoadingProps) {
  if (tipo === 'detalhe') {
    return (
      <div className={styles.detalhe} aria-label="Carregando fórmula…" aria-busy="true">
        <div className={styles.detalheHeader}>
          <div className={[styles.pulso, styles.titulo].join(' ')} />
          <div className={[styles.pulso, styles.subtitulo].join(' ')} />
        </div>
        <div className={styles.detalheColunas}>
          <div className={styles.detalheCorpo}>
            <div className={[styles.pulso, styles.bloco].join(' ')} />
            <div className={[styles.pulso, styles.bloco].join(' ')} />
            <div className={[styles.pulso, styles.blocoMenor].join(' ')} />
          </div>
          <div className={styles.detalheLateral}>
            <div className={[styles.pulso, styles.blocoMenor].join(' ')} />
            <div className={[styles.pulso, styles.blocoMenor].join(' ')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.lista} aria-label="Carregando fórmulas…" aria-busy="true">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div key={i} className={styles.card}>
          <div className={styles.cardAcento} />
          <div className={styles.cardCorpo}>
            <div className={styles.cardTop}>
              <div className={[styles.pulso, styles.codigo].join(' ')} />
              <div className={[styles.pulso, styles.data].join(' ')} />
            </div>
            <div className={[styles.pulso, styles.nome].join(' ')} />
            <div className={[styles.pulso, styles.objetivo].join(' ')} />
            <div className={styles.cardBottom}>
              <div className={[styles.pulso, styles.badge].join(' ')} />
              <div className={[styles.pulso, styles.versao].join(' ')} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
