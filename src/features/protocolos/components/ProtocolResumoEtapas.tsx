// Resumo horizontal das etapas — visualização compacta para "Visão geral"

import type { FaseProtocoloView } from '../types'
import styles from './ProtocolResumoEtapas.module.css'

interface Props {
  fases: FaseProtocoloView[]
}

export function ProtocolResumoEtapas({ fases }: Props) {
  if (!fases || fases.length === 0) return null

  const ordenadas = [...fases].sort((a, b) => a.ordem - b.ordem)

  return (
    <div className={styles.wrapper} aria-label="Resumo das etapas">
      <ol className={styles.trilha}>
        {ordenadas.map((fase, idx) => (
          <li key={fase.id} className={styles.fase}>
            <div className={styles.faseConteudo}>
              <span className={styles.faseNum} aria-hidden="true">{idx + 1}</span>
              <div className={styles.faseInfo}>
                <span className={styles.faseNome}>{fase.nome}</span>
                {fase.duracaoSemanas != null && (
                  <span className={styles.faseDuracao}>
                    {fase.duracaoSemanas} sem
                  </span>
                )}
              </div>
            </div>
            {idx < ordenadas.length - 1 && (
              <span className={styles.conector} aria-hidden="true">→</span>
            )}
          </li>
        ))}
      </ol>
    </div>
  )
}
