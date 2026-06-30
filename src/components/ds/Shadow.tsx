// ============================================================
// Shadow — Container com sombra decorativa
// A Biblioteca — Design System
// ============================================================

import { forwardRef } from 'react'
import styles from './Shadow.module.css'

export type ShadowLevel = 1 | 2 | 3 | 4 | 5 | 6 | 'papel' | 'caderno' | 'envelope' | 'interna1' | 'interna2' | 'interna3'

interface ShadowProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: ShadowLevel
  hover?: boolean
  block?: boolean
  full?: boolean
}

export const Shadow = forwardRef<HTMLDivElement, ShadowProps>(
  function Shadow(
    {
      level = 3,
      hover = false,
      block = false,
      full = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    const levelClass = {
      1: styles.shadow1,
      2: styles.shadow2,
      3: styles.shadow3,
      4: styles.shadow4,
      5: styles.shadow5,
      6: styles.shadow6,
      papel: styles.shadowPapel,
      caderno: styles.shadowCaderno,
      envelope: styles.shadowEnvelope,
      interna1: styles.shadowInterna1,
      interna2: styles.shadowInterna2,
      interna3: styles.shadowInterna3,
    }[level]

    const classes = [
      styles.shadow,
      levelClass,
      hover && styles.shadowHover,
      block && styles.shadowBlock,
      full && styles.shadowFull,
      className,
    ].filter(Boolean).join(' ')

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    )
  }
)
