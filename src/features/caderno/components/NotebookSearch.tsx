// ============================================================
// NotebookSearch — Busca do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

'use client'

import { useState, useCallback } from 'react'
import styles from './NotebookSearch.module.css'

interface NotebookSearchProps {
  valor?: string
  onBuscar: (termo: string) => void
  placeholder?: string
}

export function NotebookSearch({
  valor = '',
  onBuscar,
  placeholder = 'Buscar no caderno...',
}: NotebookSearchProps) {
  const [interno, setInterno] = useState(valor)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setInterno(v)
    onBuscar(v)
  }, [onBuscar])

  const limpar = useCallback(() => {
    setInterno('')
    onBuscar('')
  }, [onBuscar])

  return (
    <div className={styles.wrapper}>
      <span className={styles.icone} aria-hidden="true">○</span>
      <input
        type="search"
        className={styles.input}
        value={interno}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Buscar observações"
        autoComplete="off"
      />
      {interno && (
        <button
          className={styles.limpar}
          onClick={limpar}
          type="button"
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
    </div>
  )
}
