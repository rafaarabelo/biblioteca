// ============================================================
// CaseTimeline — Timeline cronológica de evoluções
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Append-only: apenas exibição. Nunca edição.
// A linha conectora visual reforça a continuidade histórica.
// ============================================================

'use client'

import { useState } from 'react'
import { EvolutionCard } from './EvolutionCard'
import type { EvolucaoView } from '../types'
import styles from './CaseTimeline.module.css'

interface CaseTimelineProps {
  evolucoes: EvolucaoView[]
  onNovaEvolucao?: () => void
}

const MOSTRAR_INICIAL = 5

export function CaseTimeline({ evolucoes, onNovaEvolucao }: CaseTimelineProps) {
  const [expandida, setExpandida] = useState(false)

  if (evolucoes.length === 0) {
    return (
      <div className={styles.vazio}>
        <p className={styles.vazioTexto}>Nenhum registro de evolução ainda.</p>
        {onNovaEvolucao && (
          <button type="button" className={styles.vazioAcao} onClick={onNovaEvolucao}>
            Adicionar primeiro registro
          </button>
        )}
      </div>
    )
  }

  const visiveis = expandida ? evolucoes : evolucoes.slice(-MOSTRAR_INICIAL)
  const temMais = evolucoes.length > MOSTRAR_INICIAL && !expandida

  return (
    <div className={styles.timeline}>
      {/* Botão para expandir antigas */}
      {temMais && (
        <button
          type="button"
          className={styles.expandir}
          onClick={() => setExpandida(true)}
        >
          Ver {evolucoes.length - MOSTRAR_INICIAL} registro{evolucoes.length - MOSTRAR_INICIAL !== 1 ? 's' : ''} anterior{evolucoes.length - MOSTRAR_INICIAL !== 1 ? 'es' : ''}
        </button>
      )}

      {/* Lista de evoluções */}
      <ol className={styles.lista} aria-label="Histórico de evoluções">
        {visiveis.map((evolucao, idx) => {
          const posicaoReal = expandida
            ? idx + 1
            : evolucoes.length - MOSTRAR_INICIAL + idx + 1 > 0
              ? evolucoes.length - visiveis.length + idx + 1
              : idx + 1

          return (
            <li key={evolucao.id} className={styles.item}>
              <div className={styles.conector} aria-hidden="true">
                <span className={styles.marcador} />
                {idx < visiveis.length - 1 && <span className={styles.linha} />}
              </div>
              <div className={styles.conteudo}>
                <EvolutionCard evolucao={evolucao} posicao={posicaoReal} />
              </div>
            </li>
          )
        })}
      </ol>

      {/* Adicionar nova evolução */}
      {onNovaEvolucao && (
        <div className={styles.nova}>
          <div className={styles.novaConector} aria-hidden="true">
            <span className={styles.novaLinha} />
            <span className={styles.novaMarcador} />
          </div>
          <button type="button" className={styles.novaBtn} onClick={onNovaEvolucao}>
            + Adicionar evolução
          </button>
        </div>
      )}
    </div>
  )
}
