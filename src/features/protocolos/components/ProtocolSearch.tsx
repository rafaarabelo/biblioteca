// ============================================================
// ProtocolSearch — Campo de Busca
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import styles from './ProtocolSearch.module.css'

interface ProtocolSearchProps {
  valor: string
  onChange: (v: string) => void
}

export function ProtocolSearch({ valor, onChange }: ProtocolSearchProps) {
  return (
    <div className={styles.wrapper} role="search">
      <svg className={styles.icone} width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={styles.input}
        placeholder="Buscar por nome, indicação, ativo, tag..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Buscar protocolos"
      />
      {valor && (
        <button
          type="button"
          className={styles.limpar}
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          <svg width="12" height="12" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
