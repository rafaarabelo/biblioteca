'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './NotasRapidas.module.css'

const STORAGE_KEY = 'biblioteca:notas-rapidas'

// Apenas conteúdo — a superfície (Notebook) é fornecida pelo pai
export function NotasRapidas() {
  const [texto, setTexto] = useState('')
  const [salvo, setSalvo] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const persistido = localStorage.getItem(STORAGE_KEY)
    if (persistido) setTexto(persistido)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const valor = e.target.value
    setTexto(valor)
    setSalvo(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, valor)
      setSalvo(true)
    }, 800)
  }

  return (
    <div className={styles.wrapper}>
      <textarea
        className={styles.textarea}
        value={texto}
        onChange={handleChange}
        placeholder="Escreva algo..."
        aria-label="Notas rápidas"
        rows={6}
      />
      {salvo && (
        <span className={styles.salvo} aria-live="polite">salvo</span>
      )}
    </div>
  )
}
