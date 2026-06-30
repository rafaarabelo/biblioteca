// ============================================================
// BotanicalDecoration — Decoração botânica
// A Biblioteca — Design System
// ============================================================

import styles from './BotanicalDecoration.module.css'

export type BotanicalPosition = 'topRight' | 'topLeft' | 'bottomRight' | 'bottomLeft' | 'center'
export type BotanicalSize = 'sm' | 'md' | 'lg' | 'xl'
export type BotanicalColor = 'oliva' | 'terracota' | 'dourado' | 'neutro'
export type BotanicalOpacity = 'sutil' | 'normal' | 'visivel'

// Motivos botânicos como SVG inline
const MOTIVOS = {
  folha: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 4C24 4 8 14 8 28c0 8 7.2 14.4 16 16 8.8-1.6 16-8 16-16C40 14 24 4 24 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M24 12v28M18 20c2 2 4 3 6 3M30 24c-2 2-4 3-6 3M18 30c2 1.5 4 2 6 2M30 32c-2 1.5-4 2-6 2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
  ramo: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 42C16 32 24 20 42 6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M14 34c-2-4 1-8 5-8M22 26c-1-4 2-7 5-6M30 18c-1-3 1-6 4-5M36 11c0-2 2-4 4-3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  ),
  flor: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="4" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="24" cy="14" rx="4" ry="7" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="24" cy="34" rx="4" ry="7" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="14" cy="24" rx="7" ry="4" stroke="currentColor" strokeWidth="1" />
      <ellipse cx="34" cy="24" rx="7" ry="4" stroke="currentColor" strokeWidth="1" />
    </svg>
  ),
  espiral: (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24 24c0-2 1.5-3.5 3.5-3.5s3.5 1.5 3.5 3.5-2 5-5 5-6.5-2.5-6.5-6.5 3.5-8.5 8.5-8.5 10.5 4 10.5 10.5-5.5 13-13 13-15.5-6-15.5-15.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  ),
} as const

export type BotanicalMotif = keyof typeof MOTIVOS

interface BotanicalDecorationProps {
  motif?: BotanicalMotif
  position?: BotanicalPosition
  size?: BotanicalSize
  color?: BotanicalColor
  opacity?: BotanicalOpacity
  className?: string
}

export function BotanicalDecoration({
  motif = 'folha',
  position = 'topRight',
  size = 'md',
  color = 'oliva',
  opacity = 'normal',
  className,
}: BotanicalDecorationProps) {
  const positionClass = {
    topRight: styles.botanicalTopRight,
    topLeft: styles.botanicalTopLeft,
    bottomRight: styles.botanicalBottomRight,
    bottomLeft: styles.botanicalBottomLeft,
    center: styles.botanicalCenter,
  }[position]

  const sizeClass = {
    sm: styles.botanicalSm,
    md: styles.botanicalMd,
    lg: styles.botanicalLg,
    xl: styles.botanicalXl,
  }[size]

  const colorClass = {
    oliva: '',
    terracota: styles.botanicalTerracota,
    dourado: styles.botanicalDourado,
    neutro: styles.botanicalNeutro,
  }[color]

  const opacityClass = {
    sutil: styles.botanicalSutil,
    normal: '',
    visivel: styles.botanicalVisivel,
  }[opacity]

  const classes = [
    styles.botanical,
    positionClass,
    sizeClass,
    colorClass,
    opacityClass,
    className,
  ].filter(Boolean).join(' ')

  return (
    <span className={classes} aria-hidden="true">
      {MOTIVOS[motif]}
    </span>
  )
}
