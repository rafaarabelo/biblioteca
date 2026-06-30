import type { ReactNode } from 'react'
import styles from './GlassCard.module.css'

interface GlassCardProps {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const PADDING = { sm: '0.75rem', md: '1.25rem', lg: '1.75rem' }

export function GlassCard({
  children,
  className = '',
  padding = 'md',
}: GlassCardProps) {
  return (
    <div
      className={[styles.card, className].filter(Boolean).join(' ')}
      style={{ padding: PADDING[padding] }}
    >
      {children}
    </div>
  )
}
