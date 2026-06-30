// ============================================================
// DDivider — Divisor editorial
// A Biblioteca — Design System
// ============================================================

import styles from './DDivider.module.css'

export type DividerVariant = 'linha' | 'dupla' | 'pontilhada' | 'ornamento' | 'gradiente'
export type DividerSpacing = 'sm' | 'md' | 'lg' | 'xl'

interface DDividerProps {
  variant?: DividerVariant
  spacing?: DividerSpacing
  className?: string
}

export function DDivider({
  variant = 'linha',
  spacing = 'md',
  className,
}: DDividerProps) {
  const variantClass = {
    linha: styles.dividerLinha,
    dupla: styles.dividerDupla,
    pontilhada: styles.dividerPontilhada,
    ornamento: styles.dividerOrnamento,
    gradiente: styles.dividerGradiente,
  }[variant]

  const spacingClass = {
    sm: styles.dividerSm,
    md: '',
    lg: styles.dividerLg,
    xl: styles.dividerXl,
  }[spacing]

  const classes = [
    styles.divider,
    variantClass,
    spacingClass,
    className,
  ].filter(Boolean).join(' ')

  return <hr className={classes} aria-hidden="true" />
}
