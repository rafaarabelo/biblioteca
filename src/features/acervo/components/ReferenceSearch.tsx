// ============================================================
// ReferenceSearch — Busca do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

'use client'

import styles from './ReferenceSearch.module.css'

interface ReferenceSearchProps {
  valor: string
  onChange: (v: string) => void
}

export function ReferenceSearch({ valor, onChange }: ReferenceSearchProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icone} aria-hidden="true">
        {/* Lupa */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
          <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </span>
      <input
        type="search"
        className={styles.input}
        placeholder="Buscar por título, autor, DOI, PMID, tag..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar referências científicas"
      />
      {valor && (
        <button
          type="button"
          className={styles.limpar}
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          ✕
        </button>
      )}
    </div>
  )
}
