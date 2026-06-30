// CaseSearch — Campo de busca de casos clínicos

'use client'

import styles from './CaseSearch.module.css'

interface CaseSearchProps {
  valor: string
  onChange: (v: string) => void
}

export function CaseSearch({ valor, onChange }: CaseSearchProps) {
  return (
    <div className={styles.wrapper} role="search">
      <svg className={styles.icone} width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className={styles.input}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por código, objetivo, protocolo..."
        aria-label="Buscar casos clínicos"
      />
      {valor && (
        <button
          type="button"
          className={styles.limpar}
          onClick={() => onChange('')}
          aria-label="Limpar busca"
        >
          <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6 6l6 6M12 6l-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
