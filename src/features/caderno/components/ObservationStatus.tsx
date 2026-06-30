// ============================================================
// ObservationStatus — Indicador de Status Epistêmico
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// O status deve transmitir maturidade do conhecimento.
// Nunca parecer um badge corporativo.
// ============================================================

import type { StatusEpistemicoUI } from '../types'
import { STATUS_EPISTEMICO } from '../types'
import styles from './ObservationStatus.module.css'

interface ObservationStatusProps {
  status: StatusEpistemicoUI
  compacto?: boolean
  className?: string
}

export function ObservationStatus({
  status,
  compacto = false,
  className = '',
}: ObservationStatusProps) {
  const meta = STATUS_EPISTEMICO[status] ?? STATUS_EPISTEMICO.hipotese

  return (
    <span
      className={[
        styles.status,
        styles[`cor_${meta.cor}`],
        compacto ? styles.compacto : '',
        className,
      ].filter(Boolean).join(' ')}
      title={meta.descricao}
      aria-label={`Status: ${meta.label}`}
    >
      {/* Ponto de maturidade — quantos pontos preenchidos */}
      <span className={styles.pontos} aria-hidden="true">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={[
              styles.ponto,
              i < meta.peso ? styles.pontoAtivo : '',
            ].filter(Boolean).join(' ')}
          />
        ))}
      </span>

      {!compacto && (
        <span className={styles.label}>{meta.label}</span>
      )}
    </span>
  )
}
