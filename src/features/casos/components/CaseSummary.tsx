// ============================================================
// CaseSummary — Resumo clínico do caso
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Exibe: objetivo, queixa, hipóteses, observações iniciais.
// O resumo conta o início da história clínica.
// ============================================================

import type { CasoDetalheView } from '../types'
import styles from './CaseSummary.module.css'

interface CaseSummaryProps {
  caso: CasoDetalheView
}

export function CaseSummary({ caso }: CaseSummaryProps) {
  return (
    <div className={styles.resumo}>
      {/* Objetivo principal */}
      {caso.objetivoPrincipal && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Objetivo clínico</h3>
          <p className={styles.blocoTexto}>{caso.objetivoPrincipal}</p>
        </div>
      )}

      {/* Queixa */}
      {caso.queixaPrincipal && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Queixa principal</h3>
          <p className={styles.blocoTexto}>{caso.queixaPrincipal}</p>
        </div>
      )}

      {/* Hipóteses clínicas */}
      {caso.hipoteses && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Hipóteses</h3>
          <blockquote className={styles.hipoteses}>{caso.hipoteses}</blockquote>
        </div>
      )}

      {/* Objetivos específicos */}
      {caso.objetivos && caso.objetivos.length > 0 && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Objetivos específicos</h3>
          <ul className={styles.objetivosList}>
            {caso.objetivos.map((obj, i) => (
              <li key={i} className={styles.objetivoItem}>{obj}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Observações iniciais */}
      {caso.observacoesIniciais && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Observações iniciais</h3>
          <p className={styles.blocoTexto}>{caso.observacoesIniciais}</p>
        </div>
      )}

      {/* Resumo clínico */}
      {caso.resumoClinico && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Síntese clínica</h3>
          <p className={styles.blocoTexto}>{caso.resumoClinico}</p>
        </div>
      )}

      {/* Resultado geral (somente se encerrado) */}
      {caso.resultadoGeral && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Resultado geral</h3>
          <p className={[styles.blocoTexto, styles.resultado].join(' ')}>
            {RESULTADO_LABELS[caso.resultadoGeral] ?? caso.resultadoGeral}
          </p>
        </div>
      )}

      {/* Motivo de encerramento */}
      {caso.motivoEncerramento && (
        <div className={styles.bloco}>
          <h3 className={styles.blocoTitulo}>Motivo de encerramento</h3>
          <p className={styles.blocoTexto}>{caso.motivoEncerramento}</p>
        </div>
      )}
    </div>
  )
}

const RESULTADO_LABELS: Record<string, string> = {
  excelente:    'Excelente',
  bom:          'Bom',
  parcial:      'Parcial',
  sem_resultado:'Sem resultado observável',
  piora:        'Piora observada',
}
