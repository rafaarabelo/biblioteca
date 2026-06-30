// ============================================================
// LoadingPaper — Bilhete Aurora sendo preparado
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Substitui o BilheteAurora enquanto o servidor carrega.
// Imita a estrutura visual do bilhete: papel, margem, linhas.
// A sensação deve ser de "papel sendo colocado na mesa",
// não de "componente carregando".
// ============================================================

import styles from './LoadingPaper.module.css'

interface LoadingPaperProps {
  className?: string
}

export function LoadingPaper({ className = '' }: LoadingPaperProps) {
  return (
    <div className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-hidden="true">
      <div className={styles.papel}>
        {/* Margem lateral — imita o papel do bilhete */}
        <div className={styles.margem} />

        {/* Linhas do bilhete em shimmer */}
        <div className={styles.conteudo}>
          {/* Linha de preview */}
          <div className={[styles.linha, styles.linhaPreview].join(' ')} />

          {/* Indicador de "carta dobrada" */}
          <div className={styles.separador} />
        </div>

        {/* Canto dobrado */}
        <div className={styles.canto} />
      </div>
    </div>
  )
}
