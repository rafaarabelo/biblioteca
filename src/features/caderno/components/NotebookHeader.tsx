// ============================================================
// NotebookHeader — Cabeçalho do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

import Link from 'next/link'
import styles from './NotebookHeader.module.css'

interface NotebookHeaderProps {
  totalObservacoes?: number
}

export function NotebookHeader({ totalObservacoes }: NotebookHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titulo}>
        <h1 className={styles.nome}>Caderno de Campo</h1>
        {totalObservacoes !== undefined && (
          <span className={styles.contagem} aria-label={`${totalObservacoes} observações`}>
            {totalObservacoes}
          </span>
        )}
      </div>

      <p className={styles.descricao}>
        Onde as ideias amadurecem antes de se tornarem conhecimento.
      </p>

      <Link href="/caderno/nova" className={styles.botaoRegistrar}>
        <span className={styles.botaoIcone} aria-hidden="true">+</span>
        Registrar observação
      </Link>
    </div>
  )
}
