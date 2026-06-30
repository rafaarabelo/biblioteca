// ============================================================
// CaseStatus — Visualização elegante do status clínico
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Nunca um badge corporativo.
// Cada status é um momento na jornada clínica.
// ============================================================

import { STATUS_CASO_META, STATUS_PRINCIPAIS } from '../types'
import type { StatusCaso } from '../types'
import styles from './CaseStatus.module.css'

interface CaseStatusProps {
  status: StatusCaso
  compacto?: boolean  // true = apenas ponto + label inline
}

export function CaseStatus({ status, compacto = false }: CaseStatusProps) {
  const meta = STATUS_CASO_META[status] ?? STATUS_CASO_META['em_avaliacao']

  if (compacto) {
    return (
      <span className={styles.compacto}>
        <span
          className={styles.ponto}
          style={{ backgroundColor: meta.cor }}
          aria-hidden="true"
        />
        <span className={styles.labelCompacto}>{meta.label}</span>
      </span>
    )
  }

  // Versão completa: progressão visual
  const ordemAtual = meta.ordem

  return (
    <div className={styles.progressao} aria-label={`Status: ${meta.label}`}>
      {STATUS_PRINCIPAIS.filter(s => s !== 'arquivado').map((s) => {
        const m = STATUS_CASO_META[s]
        const ativo = s === status || (status === 'aberto' && s === 'em_avaliacao') || (status === 'encerrado' && s === 'alta_clinica')
        const passado = m.ordem < ordemAtual
        return (
          <div key={s} className={styles.etapa}>
            <span
              className={[
                styles.etapaPonto,
                ativo   ? styles.etapaAtiva  : '',
                passado ? styles.etapaPassada : '',
              ].filter(Boolean).join(' ')}
              style={ativo || passado ? { backgroundColor: m.cor } : undefined}
              aria-hidden="true"
              title={m.label}
            />
            {ativo && (
              <span className={styles.etapaLabel} style={{ color: m.cor }}>
                {m.label}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
