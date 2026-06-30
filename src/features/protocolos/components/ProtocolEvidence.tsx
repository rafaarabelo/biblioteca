// ============================================================
// ProtocolEvidence — Visualização de Maturidade
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// 5 segmentos progressivos que crescem da esquerda para a direita.
// Nunca badge. A maturidade se lê visualmente.
// ============================================================

import type { MaturidadeProtocolo } from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'
import styles from './ProtocolEvidence.module.css'

interface ProtocolEvidenceProps {
  maturidade: MaturidadeProtocolo
  compacto?: boolean
}

const SEGMENTOS = 5  // 5 níveis de maturidade

export function ProtocolEvidence({ maturidade, compacto = false }: ProtocolEvidenceProps) {
  const meta = MATURIDADES_PROTOCOLO[maturidade]
  const ordem = meta.ordem  // 1–5

  return (
    <div
      className={[styles.wrapper, compacto ? styles.compacto : ''].filter(Boolean).join(' ')}
      title={`${meta.label}: ${meta.descricao}`}
      aria-label={`Maturidade: ${meta.label}`}
    >
      <div className={styles.segmentos} aria-hidden="true">
        {Array.from({ length: SEGMENTOS }, (_, i) => {
          const nivel = i + 1
          const ativo = nivel <= ordem
          return (
            <span
              key={nivel}
              className={[
                styles.segmento,
                ativo ? styles.ativo : styles.inativo,
                ativo ? styles[`nivel_${nivel}` as keyof typeof styles] : '',
              ].filter(Boolean).join(' ')}
              style={ativo ? { backgroundColor: meta.cor } : undefined}
            />
          )
        })}
      </div>
      {!compacto && (
        <span className={styles.label}>{meta.label}</span>
      )}
    </div>
  )
}
