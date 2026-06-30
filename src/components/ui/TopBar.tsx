'use client'

import { useTheme } from '@/hooks/useTheme'
import { IconMoon, IconSun } from '@/components/icons'
import styles from './TopBar.module.css'

interface TopBarProps {
  titulo?: string
  subtitulo?: string
}

export function TopBar({ titulo, subtitulo }: TopBarProps) {
  const { isDark, toggle } = useTheme()

  return (
    <header className={styles.topbar} role="banner">
      <div className={styles.esquerda}>
        {titulo && <span className={styles.titulo}>{titulo}</span>}
        {subtitulo && <span className={styles.subtitulo}>{subtitulo}</span>}
      </div>

      <div className={styles.direita}>
        <button
          className={styles.temaBtn}
          onClick={toggle}
          aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
          type="button"
        >
          {isDark ? <IconSun size={16} aria-hidden /> : <IconMoon size={16} aria-hidden />}
        </button>
      </div>
    </header>
  )
}
