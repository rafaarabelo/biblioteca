'use client'

import { useState, useRef } from 'react'
import { IconSearch } from '@/components/icons'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function SearchBar({
  placeholder = 'Pesquisar ativos, fórmulas, artigos...',
  onSearch,
  size = 'md',
  className = '',
}: SearchBarProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const iconSize = size === 'sm' ? 15 : size === 'lg' ? 20 : 17

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (value.trim()) onSearch?.(value.trim())
  }

  return (
    <form
      className={[
        styles.searchbar,
        styles[size],
        focused ? styles.focused : '',
        className,
      ].filter(Boolean).join(' ')}
      onSubmit={handleSubmit}
      role="search"
    >
      <span className={styles.icone}>
        <IconSearch size={iconSize} aria-hidden />
      </span>

      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className={styles.input}
        aria-label={placeholder}
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <kbd className={styles.hint} aria-hidden="true">↵</kbd>
      )}
    </form>
  )
}
