// ============================================================
// Ribbon — Fita decorativa / marcador
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Ribbon.module.css'

export type RibbonColor = 'terracota' | 'musgo' | 'dourado' | 'vinho' | 'oliva' | 'neutro'
export type RibbonVariant = 'inline' | 'marcador' | 'banner'

interface RibbonProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: RibbonColor
  variant?: RibbonVariant
}

export const Ribbon = forwardRef<HTMLSpanElement, RibbonProps>(
  function Ribbon(
    {
      color = 'terracota',
      variant = 'inline',
      className,
      children,
      ...props
    },
    ref
  ) {
    const colorClass = {
      terracota: styles.ribbonTerracota,
      musgo: styles.ribbonMusgo,
      dourado: styles.ribbonDourado,
      vinho: styles.ribbonVinho,
      oliva: styles.ribbonOliva,
      neutro: styles.ribbonNeutro,
    }[color]

    const variantClass = {
      inline: '',
      marcador: styles.ribbonMarcador,
      banner: styles.ribbonBanner,
    }[variant]

    const classes = [
      styles.ribbon,
      colorClass,
      variantClass,
      className,
    ].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    )
  }
)
