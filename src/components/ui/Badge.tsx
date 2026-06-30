import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeVariant = 'terracota' | 'salvia' | 'ambar' | 'neutro'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const VARIANT: Record<BadgeVariant, string | undefined> = {
  terracota: styles.terracota,
  salvia:    styles.salvia,
  ambar:     styles.ambar,
  neutro:    styles.neutro,
}

export function Badge({
  children,
  variant = 'neutro',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        styles.badge,
        styles[size],
        VARIANT[variant],
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </span>
  )
}
