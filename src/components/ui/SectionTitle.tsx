import type { ReactNode } from 'react'
import styles from './SectionTitle.module.css'

interface SectionTitleProps {
  children: ReactNode
  action?: ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}

export function SectionTitle({
  children,
  action,
  className = '',
  as: Tag = 'h2',
}: SectionTitleProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')}>
      <Tag className={styles.texto}>{children}</Tag>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  )
}
