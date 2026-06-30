// ============================================================
// LoadingCard — Card de entidade sendo preparado
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Substitui um EntityCard individual durante o carregamento.
// Imita a estrutura visual: ícone, título, subtítulo, badge.
// A sensação: ficha sendo puxada da gaveta.
// ============================================================

import styles from './LoadingCard.module.css'

interface LoadingCardProps {
  /** Variant compacta (para stacks) vs normal (para grids) */
  compact?: boolean
  className?: string
}

export function LoadingCard({ compact = false, className = '' }: LoadingCardProps) {
  return (
    <div
      className={[styles.card, compact ? styles.cardCompact : '', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {/* Ícone placeholder */}
      <div className={styles.icone} />

      {/* Texto */}
      <div className={styles.textos}>
        {/* Título */}
        <div className={[styles.linha, styles.linhaTitulo].join(' ')} />
        {/* Subtítulo */}
        {!compact && (
          <div className={[styles.linha, styles.linhaSubtitulo].join(' ')} />
        )}
        {/* Badge */}
        <div className={[styles.linha, styles.linhaBadge].join(' ')} />
      </div>
    </div>
  )
}
