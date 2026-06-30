// ============================================================
// Paper — Superfície de papel reutilizável
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Paper.module.css'

export type PaperVariant = 'algodao' | 'velho' | 'caderno' | 'cartao'
export type PaperSize = 'compacto' | 'normal' | 'espacoso'
export type PaperElevation = 'plano' | 'normal' | 'elevado' | 'flutuante'

interface PaperProps extends React.HTMLAttributes<HTMLElement> {
  variant?: PaperVariant
  size?: PaperSize
  elevation?: PaperElevation
  interactive?: boolean
  as?: 'div' | 'article' | 'section' | 'aside'
}

export const Paper = forwardRef<HTMLElement, PaperProps>(
  function Paper(
    {
      variant = 'algodao',
      size = 'normal',
      elevation = 'normal',
      interactive = false,
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      styles.paper,
      variant === 'velho' && styles.paperVelho,
      variant === 'caderno' && styles.paperCaderno,
      variant === 'cartao' && styles.paperCartao,
      size === 'compacto' && styles.paperCompacto,
      size === 'espacoso' && styles.paperEspacoso,
      elevation === 'plano' && styles.paperPlano,
      elevation === 'elevado' && styles.paperElevado,
      elevation === 'flutuante' && styles.paperFlutuante,
      interactive && styles.paperInterativo,
      className,
    ].filter(Boolean).join(' ')

    return (
      <Tag ref={ref as any} className={classes} {...props}>
        {children}
      </Tag>
    )
  }
)
