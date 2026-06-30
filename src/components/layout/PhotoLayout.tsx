// ============================================================
// PhotoLayout — Sistema de Coordenadas da Fotografia
// A Biblioteca — Sprint VI, Correção de Composição
// ============================================================
// Wrapper que mapeia os papéis da fotografia como containers.
// Cada slot corresponde a um papel desenhado na imagem.
// Os componentes React devem parecer impressos sobre os papéis.
//
// Server Component — sem 'use client'.
// ============================================================

import type { ReactNode } from 'react'
import styles from './PhotoLayout.module.css'

interface PhotoLayoutProps {
  /** Cabeçalho — faixa branca superior (título, busca, botão) */
  header?: ReactNode
  /** Coluna de filtros — papel vertical da esquerda */
  sidebar?: ReactNode
  /** Lista principal — papel central */
  children: ReactNode
  /** Painel lateral direito — papel vertical da direita */
  right?: ReactNode
  /** Rodapé esquerdo */
  footerLeft?: ReactNode
  /** Rodapé direito */
  footerRight?: ReactNode
  /** Variante de colunas: 3 (default) ou 2 (sem painel direito) */
  columns?: 2 | 3
  /** className adicional */
  className?: string
}

export function PhotoLayout({
  header,
  sidebar,
  children,
  right,
  footerLeft,
  footerRight,
  columns = 3,
  className,
}: PhotoLayoutProps) {
  const layoutClass = [
    styles.photoLayout,
    columns === 2 && styles.photoLayout_twoCols,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={layoutClass}>
      {header && (
        <div className={styles['paper-header']}>
          {header}
        </div>
      )}

      {sidebar && (
        <aside className={styles['paper-sidebar']} aria-label="Filtros">
          {sidebar}
        </aside>
      )}

      <div className={styles['paper-main']}>
        {children}
      </div>

      {columns === 3 && right && (
        <aside className={styles['paper-right']} aria-label="Painel lateral">
          {right}
        </aside>
      )}

      {footerLeft && (
        <div className={styles['paper-footer-left']}>
          {footerLeft}
        </div>
      )}

      {footerRight && (
        <div className={styles['paper-footer-right']}>
          {footerRight}
        </div>
      )}
    </div>
  )
}
