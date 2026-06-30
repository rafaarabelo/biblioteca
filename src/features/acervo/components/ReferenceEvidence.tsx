// ============================================================
// ReferenceEvidence — Indicador de Nível de Evidência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Hierarquia de evidência como barras verticais — como uma pirâmide
// visual de evidência. Não um badge corporativo.
// ============================================================

import type { NivelEvidencia } from '../types'
import { NIVEIS_EVIDENCIA } from '../types'
import styles from './ReferenceEvidence.module.css'

const ORDEM: NivelEvidencia[] = ['ia', 'ib', 'iia', 'iib', 'iii', 'iv', 'v']
const BARRAS = 6 // máximo de peso

interface ReferenceEvidenceProps {
  nivel: NivelEvidencia | null
  compacto?: boolean
}

export function ReferenceEvidence({ nivel, compacto }: ReferenceEvidenceProps) {
  if (!nivel) return null

  const meta = NIVEIS_EVIDENCIA[nivel]
  if (!meta) return null
  const barrasAtivas = meta.peso

  return (
    <div
      className={[styles.wrapper, compacto ? styles.compacto : ''].filter(Boolean).join(' ')}
      title={meta.descricao}
    >
      <div className={styles.barras} aria-label={`Nível de evidência: ${meta.label}`}>
        {Array.from({ length: BARRAS }).map((_, i) => (
          <div
            key={i}
            className={[
              styles.barra,
              styles[`altura_${i + 1}`],
              i < barrasAtivas ? styles[`cor_${meta.cor}`] : styles.inativa,
            ].filter(Boolean).join(' ')}
            aria-hidden="true"
          />
        ))}
      </div>
      {!compacto && (
        <span className={[styles.label, styles[`label_${meta.cor}`]].filter(Boolean).join(' ')}>
          {meta.abrev}
        </span>
      )}
    </div>
  )
}
