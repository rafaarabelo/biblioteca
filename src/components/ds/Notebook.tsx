// ============================================================
// Notebook — Superfície de caderno de campo
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Notebook.module.css'

export type NotebookVariant = 'pautado' | 'semEspiral' | 'liso'
export type NotebookSize = 'compacto' | 'normal' | 'espacoso'

interface NotebookProps extends React.HTMLAttributes<HTMLElement> {
  variant?: NotebookVariant
  size?: NotebookSize
  as?: 'div' | 'article' | 'section'
}

export const Notebook = forwardRef<HTMLElement, NotebookProps>(
  function Notebook(
    {
      variant = 'pautado',
      size = 'normal',
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = [
      styles.notebook,
      variant === 'semEspiral' && styles.notebookSemEspiral,
      variant === 'liso' && styles.notebookLiso,
      size === 'compacto' && styles.notebookCompacto,
      size === 'espacoso' && styles.notebookEspacoso,
      className,
    ].filter(Boolean).join(' ')

    return (
      <Tag ref={ref as any} className={classes} {...props}>
        {children}
      </Tag>
    )
  }
)
