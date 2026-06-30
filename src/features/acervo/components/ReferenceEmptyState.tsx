// ============================================================
// ReferenceEmptyState — Estado vazio do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

import Link from 'next/link'
import styles from './ReferenceEmptyState.module.css'

interface ReferenceEmptyStateProps {
  comFiltros?: boolean
  onLimparFiltros?: () => void
}

export function ReferenceEmptyState({ comFiltros, onLimparFiltros }: ReferenceEmptyStateProps) {
  if (comFiltros) {
    return (
      <div className={styles.wrapper} role="status">
        <span className={styles.icone} aria-hidden="true">🔍</span>
        <p className={styles.titulo}>Nenhuma referência encontrada</p>
        <p className={styles.subtitulo}>
          Nenhum artigo corresponde aos filtros aplicados.
        </p>
        {onLimparFiltros && (
          <button type="button" className={styles.acao} onClick={onLimparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={styles.wrapper} role="status">
      <span className={styles.icone} aria-hidden="true">📚</span>
      <p className={styles.titulo}>O acervo está vazio</p>
      <p className={styles.subtitulo}>
        Toda observação merece uma fonte.<br />
        Registre a primeira referência científica desta biblioteca.
      </p>
      <Link href="/acervo/nova" className={styles.acao}>
        Registrar referência
      </Link>
    </div>
  )
}
