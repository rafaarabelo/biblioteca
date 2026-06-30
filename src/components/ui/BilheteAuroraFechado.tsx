// ============================================================
// BilheteAuroraFechado — Estado Preview do Bilhete
// Biblioteca Cosmetológica Rafa Rabelo
// ============================================================
// Renderiza o bilhete dobrado — só mostra o preview.
// A assinatura reduzida "— A." está sempre visível.
// ============================================================

import styles from './BilheteAurora.module.css'

interface BilheteAuroraFechadoProps {
  preview: string
  escondido: boolean
  onAbrir: () => void
}

export function BilheteAuroraFechado({
  preview,
  escondido,
  onAbrir,
}: BilheteAuroraFechadoProps) {
  return (
    <div
      className={[
        styles.preview,
        escondido ? styles.previewEscondido : '',
      ].filter(Boolean).join(' ')}
      onClick={onAbrir}
    >
      <p className={styles.previewTexto}>{preview}</p>
      <div className={styles.previewRodape}>
        <span className={styles.sigPreview}>— A.</span>
        <span className={styles.hint} aria-hidden="true">clique para ler</span>
      </div>
    </div>
  )
}
