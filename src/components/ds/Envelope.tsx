// ============================================================
// Envelope — Superfície de envelope / carta
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Envelope.module.css'

export type EnvelopeVariant = 'fechado' | 'semDobra' | 'aberto'
export type EnvelopeSize = 'compacto' | 'normal' | 'espacoso'

interface EnvelopeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: EnvelopeVariant
  size?: EnvelopeSize
  seal?: boolean
  as?: 'div' | 'article' | 'aside'
}

export const Envelope = forwardRef<HTMLElement, EnvelopeProps>(
  function Envelope(
    {
      variant = 'fechado',
      size = 'normal',
      seal = false,
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      styles.envelope,
      variant === 'semDobra' && styles.envelopeSemDobra,
      variant === 'aberto' && styles.envelopeAberto,
      size === 'compacto' && styles.envelopeCompacto,
      size === 'espacoso' && styles.envelopeEspacoso,
      seal && styles.envelopeLacre,
      className,
    ].filter(Boolean).join(' ')

    return (
      <Tag ref={ref as any} className={classes} {...props}>
        {seal && <span className={styles.lacre} aria-hidden="true" />}
        {children}
      </Tag>
    )
  }
)
