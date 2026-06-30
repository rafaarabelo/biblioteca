// ============================================================
// Typography — Sistema Tipográfico
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 3
// ============================================================
// Componentes que aplicam a hierarquia tipográfica do Design System.
// Spectral para editorial/científico, Instrument Sans para UI.
// ============================================================

import type { ReactNode, ElementType } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
}

// Títulos serifa — editorial, científico
export function H1({ children, className = '' }: TypographyProps) {
  return (
    <h1 className={`typo-h1 ${className}`} style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '2rem',
      fontWeight: 400,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
      color: 'var(--foreground)',
    }}>
      {children}
    </h1>
  )
}

export function H2({ children, className = '' }: TypographyProps) {
  return (
    <h2 className={`typo-h2 ${className}`} style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '-0.015em',
      lineHeight: 1.25,
      color: 'var(--foreground)',
    }}>
      {children}
    </h2>
  )
}

export function H3({ children, className = '' }: TypographyProps) {
  return (
    <h3 className={`typo-h3 ${className}`} style={{
      fontFamily: 'var(--font-serif)',
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '-0.01em',
      lineHeight: 1.3,
      color: 'var(--foreground)',
    }}>
      {children}
    </h3>
  )
}

// Corpo de texto
export function Body({ children, className = '' }: TypographyProps) {
  return (
    <p className={`typo-body ${className}`} style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: 'var(--foreground)',
    }}>
      {children}
    </p>
  )
}

// Texto auxiliar / caption
export function Caption({ children, className = '' }: TypographyProps) {
  return (
    <span className={`typo-caption ${className}`} style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: 'var(--muted-fg)',
    }}>
      {children}
    </span>
  )
}

// Texto de label (UI)
export function Label({ children, className = '' }: TypographyProps) {
  return (
    <span className={`typo-label ${className}`} style={{
      fontFamily: 'var(--font-sans)',
      fontSize: '0.8125rem',
      fontWeight: 500,
      letterSpacing: '0.01em',
      color: 'var(--foreground)',
    }}>
      {children}
    </span>
  )
}

// Texto de código / INCI
export function Mono({ children, className = '' }: TypographyProps) {
  return (
    <code className={`typo-mono ${className}`} style={{
      fontFamily: 'var(--font-mono)',
      fontSize: '0.8125rem',
      letterSpacing: '0.01em',
      color: 'var(--terracota-600)',
      background: 'var(--terracota-50)',
      padding: '1px 5px',
      borderRadius: '3px',
      border: '1px solid var(--terracota-100)',
    }}>
      {children}
    </code>
  )
}
