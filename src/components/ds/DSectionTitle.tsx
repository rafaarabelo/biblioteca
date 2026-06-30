// ============================================================
// SectionTitle — Título de seção editorial
// A Biblioteca — Design System
// ============================================================

import styles from './SectionTitle.module.css'

export type SectionTitleSize = 'sm' | 'md' | 'lg' | 'xl'
export type SectionTitleVariant = 'linha' | 'semLinha' | 'ornamento' | 'centralizado'

interface SectionTitleProps {
  children: React.ReactNode
  size?: SectionTitleSize
  variant?: SectionTitleVariant
  overline?: string
  action?: React.ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5'
  className?: string
}

export function DSectionTitle({
  children,
  size = 'md',
  variant = 'linha',
  overline,
  action,
  as: Tag = 'h2',
  className,
}: SectionTitleProps) {
  const sizeClass = {
    sm: styles.sectionSm,
    md: '',
    lg: styles.sectionLg,
    xl: styles.sectionXl,
  }[size]

  const variantClass = {
    linha: '',
    semLinha: styles.sectionSemLinha,
    ornamento: styles.sectionOrnamento,
    centralizado: styles.sectionCentralizado,
  }[variant]

  const classes = [
    styles.section,
    sizeClass,
    variantClass,
    overline && styles.sectionOverline,
    className,
  ].filter(Boolean).join(' ')

  if (overline) {
    return (
      <div className={classes}>
        <span className={styles.overlineTexto}>{overline}</span>
        <Tag className={styles.sectionTexto}>{children}</Tag>
        {action && <div className={styles.sectionAction}>{action}</div>}
      </div>
    )
  }

  if (variant === 'centralizado') {
    return (
      <div className={classes}>
        <span className={styles.sectionLinha} aria-hidden="true" />
        <Tag className={styles.sectionTexto}>{children}</Tag>
        <span className={styles.sectionLinha} aria-hidden="true" />
        {action && <div className={styles.sectionAction}>{action}</div>}
      </div>
    )
  }

  return (
    <div className={classes}>
      <Tag className={styles.sectionTexto}>{children}</Tag>
      {variant === 'linha' && <span className={styles.sectionLinha} aria-hidden="true" />}
      {action && <div className={styles.sectionAction}>{action}</div>}
    </div>
  )
}
