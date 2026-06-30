// ============================================================
// WoodSurface — Superfície de madeira
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './WoodSurface.module.css'

export type WoodTone = 'nogueira' | 'clara' | 'media' | 'escura' | 'profunda'
export type WoodSize = 'compacto' | 'normal' | 'espacoso' | 'inline'

interface WoodSurfaceProps extends React.HTMLAttributes<HTMLElement> {
  tone?: WoodTone
  size?: WoodSize
  grain?: boolean
  as?: 'div' | 'section' | 'aside' | 'header' | 'footer'
}

export const WoodSurface = forwardRef<HTMLElement, WoodSurfaceProps>(
  function WoodSurface(
    {
      tone = 'nogueira',
      size = 'normal',
      grain = false,
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      styles.wood,
      tone === 'clara' && styles.woodClara,
      tone === 'media' && styles.woodMedia,
      tone === 'escura' && styles.woodEscura,
      tone === 'profunda' && styles.woodProfunda,
      size === 'compacto' && styles.woodCompacto,
      size === 'espacoso' && styles.woodEspacoso,
      size === 'inline' && styles.woodInline,
      grain && styles.woodVeios,
      className,
    ].filter(Boolean).join(' ')

    return (
      <Tag ref={ref as any} className={classes} {...props}>
        {children}
      </Tag>
    )
  }
)
