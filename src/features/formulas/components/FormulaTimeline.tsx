// ============================================================
// FormulaTimeline — Linha do tempo da evolução da fórmula
// Capítulo V: Fórmulas
// ============================================================
// Cada alteração fica gravada para sempre.
// O que muda não é apenas a composição.
// Muda também aquilo que aprendemos com ela.
// ============================================================

import type { VersaoView } from '../types'
import { FormulaStatus } from './FormulaStatus'
import styles from './FormulaTimeline.module.css'

interface FormulaTimelineProps {
  versoes: VersaoView[]
}

export function FormulaTimeline({ versoes }: FormulaTimelineProps) {
  // Mostrar em ordem cronológica (ascendente)
  const cronologico = [...versoes].sort((a, b) => a.numeroVersao - b.numeroVersao)

  return (
    <div className={styles.timeline} aria-label="Linha do tempo da fórmula">
      <span className={styles.titulo}>Evolução</span>

      <ol className={styles.lista}>
        {cronologico.map((versao, idx) => {
          const data = new Date(versao.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
          })
          const ehPrimeira = idx === 0
          const ehUltima   = idx === cronologico.length - 1

          return (
            <li key={versao.id} className={styles.item}>
              <div className={styles.trilha} aria-hidden="true">
                <span className={[styles.bola, versao.status === 'ativa' ? styles.bolaAtiva : ''].join(' ')} />
                {!ehUltima && <span className={styles.linha} />}
              </div>

              <div className={styles.conteudo}>
                <div className={styles.meta}>
                  <span className={styles.versaoNum}>v{versao.numeroVersao}</span>
                  <span className={styles.data}>{data}</span>
                  <FormulaStatus status={versao.status} compacto />
                </div>

                {ehPrimeira ? (
                  <p className={styles.descricao}>Fórmula criada</p>
                ) : versao.motivoAlteracao ? (
                  <p className={styles.descricao}>{versao.motivoAlteracao}</p>
                ) : (
                  <p className={styles.descricaoSemMotivo}>Alteração sem motivo registrado</p>
                )}

                {versao.titulo && (
                  <span className={styles.tituloVersao}>{versao.titulo}</span>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
