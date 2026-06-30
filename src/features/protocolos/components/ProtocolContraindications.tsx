// ============================================================
// ProtocolContraindications — Contraindicações e Cuidados
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import styles from './ProtocolContraindications.module.css'

interface ProtocolContraindicationsProps {
  contraindicacoes: string | null
}

export function ProtocolContraindications({ contraindicacoes }: ProtocolContraindicationsProps) {
  if (!contraindicacoes) return null

  return (
    <section className={styles.wrapper} aria-label="Contraindicações">
      <div className={styles.alerta} role="alert">
        <span className={styles.icone} aria-hidden="true">⚠</span>
        <div className={styles.conteudo}>
          <h3 className={styles.titulo}>Contraindicações e cuidados</h3>
          <p className={styles.texto}>{contraindicacoes}</p>
        </div>
      </div>
    </section>
  )
}
