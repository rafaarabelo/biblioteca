import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon?: ReactNode
  titulo: string
  descricao?: string
  acao?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  titulo,
  descricao,
  acao,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.titulo}>{titulo}</p>
      {descricao && <p className={styles.descricao}>{descricao}</p>}
      {acao && <div className={styles.acao}>{acao}</div>}
    </div>
  )
}
