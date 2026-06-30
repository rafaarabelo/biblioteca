'use client'

// ============================================================
// ConnectionChip — Chip de Conexão / Entidade em Pesquisa
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Desacoplado de mocks
// ============================================================
// Sprint 4: tipo TipoEntidade agora é definido localmente.
// Compatível com TipoEntidadeMesa de features/mesa/types.
// ============================================================

import styles from './ConnectionChip.module.css'

// Tipos de entidade que a Biblioteca conhece
// (espelho de TipoEntidadeMesa em features/mesa/types/index.ts)
type TipoEntidade =
  | 'ativo'
  | 'formula'
  | 'artigo'
  | 'caso'
  | 'observacao'
  | 'protocolo'

interface ConnectionChipProps {
  label: string
  tipo?: TipoEntidade
  onClick?: () => void
  className?: string
}

const TIPO_EMOJI: Record<TipoEntidade, string> = {
  ativo:      '⚗️',
  formula:    '🧪',
  artigo:     '📄',
  caso:       '🧬',
  observacao: '🔬',
  protocolo:  '📋',
}

export function ConnectionChip({
  label,
  tipo,
  onClick,
  className = '',
}: ConnectionChipProps) {
  const emoji = tipo ? TIPO_EMOJI[tipo] : '◦'

  return (
    <button
      className={[styles.chip, className].filter(Boolean).join(' ')}
      onClick={onClick}
      type="button"
      aria-label={`Abrir: ${label}`}
    >
      <span className={styles.emoji} aria-hidden="true">{emoji}</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
