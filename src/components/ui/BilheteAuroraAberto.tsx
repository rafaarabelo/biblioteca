// ============================================================
// BilheteAuroraAberto — Estado Aberto do Bilhete
// Biblioteca Cosmetológica Rafa Rabelo
// ============================================================
// Renderiza o conteúdo completo. A assinatura anima separada,
// como se Aurora tivesse escrito enquanto você lia.
// ============================================================

import { AssinaturaAurora } from './AssinaturaAurora'
import styles from './BilheteAurora.module.css'

interface BilheteAuroraAbertoProps {
  saudacao: string
  paragrafos: string[]
  assinatura: string
  visivel: boolean
  onFechar: () => void
}

export function BilheteAuroraAberto({
  saudacao,
  paragrafos,
  assinatura,
  visivel,
  onFechar,
}: BilheteAuroraAbertoProps) {
  return (
    <div
      className={[
        styles.conteudo,
        visivel ? styles.conteudoAberto : '',
      ].filter(Boolean).join(' ')}
      aria-hidden={!visivel}
    >
      <p className={styles.saudacao}>{saudacao}</p>

      {paragrafos.map((paragrafo, i) => (
        <p key={i} className={styles.paragrafo}>{paragrafo}</p>
      ))}

      <AssinaturaAurora texto={assinatura} visivel={visivel} />

      <button
        className={styles.fechar}
        onClick={(e) => { e.stopPropagation(); onFechar() }}
        aria-label="Fechar bilhete"
        type="button"
      >
        fechar
      </button>
    </div>
  )
}
