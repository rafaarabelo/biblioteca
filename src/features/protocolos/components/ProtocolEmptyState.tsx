// ============================================================
// ProtocolEmptyState — Estado Vazio de Protocolos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import Link from 'next/link'
import styles from './ProtocolEmptyState.module.css'

interface ProtocolEmptyStateProps {
  comFiltros?: boolean
  onLimparFiltros?: () => void
}

export function ProtocolEmptyState({ comFiltros, onLimparFiltros }: ProtocolEmptyStateProps) {
  if (comFiltros) {
    return (
      <div className={styles.wrapper}>
        <p className={styles.texto}>Nenhum protocolo encontrado com esses filtros.</p>
        {onLimparFiltros && (
          <button type="button" className={styles.acao} onClick={onLimparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.titulo}>Nenhum protocolo ainda.</p>
      <p className={styles.texto}>
        Protocolos não são receitas. São conhecimento que amadurece ao longo de sessões,
        casos e revisões conscientes.
      </p>
      <Link href="/protocolos/novo" className={styles.acao}>
        Registrar primeiro protocolo
      </Link>
    </div>
  )
}
