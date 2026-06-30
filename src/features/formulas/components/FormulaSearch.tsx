'use client'

// FormulaSearch — Campo de busca de fórmulas
// Capítulo V: Fórmulas

import styles from './FormulaSearch.module.css'

interface FormulaSearchProps {
  value:    string
  onChange: (val: string) => void
}

export function FormulaSearch({ value, onChange }: FormulaSearchProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icone} aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        placeholder="Buscar fórmulas…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar fórmulas"
      />
      {value && (
        <button
          className={styles.limpar}
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
    </div>
  )
}
