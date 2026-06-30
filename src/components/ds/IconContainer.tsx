// ============================================================
// IconContainer — Container para ícones
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './IconContainer.module.css'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconShape = 'redondo' | 'quadrado' | 'arredondado'
export type IconColor = 'terracota' | 'musgo' | 'dourado' | 'vinho' | 'oliva' | 'neutro'
export type IconVariant = 'suave' | 'solido' | 'fantasma'

interface IconContainerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: IconSize
  shape?: IconShape
  color?: IconColor
  variant?: IconVariant
}

export const IconContainer = forwardRef<HTMLSpanElement, IconContainerProps>(
  function IconContainer(
    {
      size = 'md',
      shape = 'arredondado',
      color = 'terracota',
      variant = 'suave',
      className,
      children,
      ...props
    },
    ref
  ) {
    const sizeClass = {
      xs: styles.iconXs,
      sm: styles.iconSm,
      md: styles.iconMd,
      lg: styles.iconLg,
      xl: styles.iconXl,
    }[size]

    const shapeClass = {
      redondo: styles.iconRedondo,
      quadrado: styles.iconQuadrado,
      arredondado: '',
    }[shape]

    const colorClass = {
      terracota: styles.iconTerracota,
      musgo: styles.iconMusgo,
      dourado: styles.iconDourado,
      vinho: styles.iconVinho,
      oliva: styles.iconOliva,
      neutro: styles.iconNeutro,
    }[color]

    const variantClass = {
      suave: '',
      solido: styles.iconSolido,
      fantasma: styles.iconFantasma,
    }[variant]

    const classes = [
      styles.icon,
      sizeClass,
      shapeClass,
      colorClass,
      variantClass,
      className,
    ].filter(Boolean).join(' ')

    return (
      <span ref={ref} className={classes} aria-hidden="true" {...props}>
        {children}
      </span>
    )
  }
)
