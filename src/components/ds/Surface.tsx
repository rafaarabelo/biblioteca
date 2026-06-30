// ============================================================
// Surface — Container genérico de superfície
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Surface.module.css'

export type SurfaceBorder = 'nenhuma' | 'sutil' | 'media' | 'forte'
export type SurfaceElevation = 'plano' | 1 | 2 | 3 | 4
export type SurfaceBackground = 'mesa' | 'papel' | 'rebaixado' | 'elevado'
export type SurfacePadding = 0 | 2 | 3 | 4 | 6 | 8

interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  border?: SurfaceBorder
  elevation?: SurfaceElevation
  background?: SurfaceBackground
  padding?: SurfacePadding
  as?: 'div' | 'section' | 'article' | 'aside' | 'main'
}

export const Surface = forwardRef<HTMLElement, SurfaceProps>(
  function Surface(
    {
      border = 'sutil',
      elevation = 'plano',
      background = 'papel',
      padding = 4,
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) {
    const borderClass = {
      nenhuma: '',
      sutil: styles.surfaceBordaSutil,
      media: styles.surfaceBordaMedia,
      forte: styles.surfaceBordaForte,
    }[border]

    const elevationClass = {
      plano: styles.surfacePlano,
      1: styles.surfaceElevacao1,
      2: styles.surfaceElevacao2,
      3: styles.surfaceElevacao3,
      4: styles.surfaceElevacao4,
    }[elevation]

    const bgClass = {
      mesa: styles.surfaceMesa,
      papel: styles.surfacePapel,
      rebaixado: styles.surfaceRebaixado,
      elevado: styles.surfaceElevado,
    }[background]

    const padClass = {
      0: styles.surfaceP0,
      2: styles.surfaceP2,
      3: styles.surfaceP3,
      4: styles.surfaceP4,
      6: styles.surfaceP6,
      8: styles.surfaceP8,
    }[padding]

    const classes = [
      styles.surface,
      borderClass,
      elevationClass,
      bgClass,
      padClass,
      className,
    ].filter(Boolean).join(' ')

    return (
      <Tag ref={ref as any} className={classes} {...props}>
        {children}
      </Tag>
    )
  }
)
