// ============================================================
// NotebookEmptyState — Estado vazio do Caderno
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

import Link from 'next/link'
import styles from './NotebookEmptyState.module.css'

interface NotebookEmptyStateProps {
  tipo?: 'caderno' | 'busca' | 'filtro'
}

const TEXTOS = {
  caderno: {
    icone: '—',
    titulo: 'Este caderno ainda está em branco.',
    descricao: 'Toda descoberta começa com uma primeira observação.',
    acao: { label: 'Registrar a primeira observação', href: '/caderno/nova' },
  },
  busca: {
    icone: '○',
    titulo: 'Nenhuma observação encontrada.',
    descricao: 'Tente termos diferentes ou remova os filtros ativos.',
    acao: null,
  },
  filtro: {
    icone: '◦',
    titulo: 'Esta prateleira está vazia.',
    descricao: 'Nenhuma observação corresponde aos filtros selecionados.',
    acao: null,
  },
}

export function NotebookEmptyState({ tipo = 'caderno' }: NotebookEmptyStateProps) {
  const { icone, titulo, descricao, acao } = TEXTOS[tipo]

  return (
    <div className={styles.container}>
      <span className={styles.icone} aria-hidden="true">{icone}</span>
      <p className={styles.titulo}>{titulo}</p>
      <p className={styles.descricao}>{descricao}</p>
      {acao && (
        <Link href={acao.href} className={styles.acao}>
          {acao.label}
        </Link>
      )}
    </div>
  )
}
