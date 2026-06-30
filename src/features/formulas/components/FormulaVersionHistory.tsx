// ============================================================
// FormulaVersionHistory — Histórico de versões
// Capítulo V: Fórmulas
// ============================================================
// Cada versão carrega a memória das anteriores.
// O histórico é sagrado — nunca é apagado.
// ============================================================

'use client'

import { useState } from 'react'
import { FormulaStatus } from './FormulaStatus'
import type { VersaoView } from '../types'
import styles from './FormulaVersionHistory.module.css'

interface FormulaVersionHistoryProps {
  versoes:         VersaoView[]
  versaoSelecionadaId?: string
  onSelecionar?:   (versaoId: string) => void
  onCompararCom?:  (versaoAId: string, versaoBId: string) => void
}

export function FormulaVersionHistory({
  versoes, versaoSelecionadaId, onSelecionar, onCompararCom
}: FormulaVersionHistoryProps) {
  const [comparandoA, setComparandoA] = useState<string | null>(null)

  function handleComparar(versaoId: string) {
    if (!comparandoA) {
      setComparandoA(versaoId)
      return
    }
    if (comparandoA === versaoId) {
      setComparandoA(null)
      return
    }
    // Garante que A < B em número de versão (cronológico)
    const vA = versoes.find((v) => v.id === comparandoA)
    const vB = versoes.find((v) => v.id === versaoId)
    if (vA && vB && onCompararCom) {
      const [menor, maior] = vA.numeroVersao < vB.numeroVersao
        ? [comparandoA, versaoId]
        : [versaoId, comparandoA]
      onCompararCom(menor, maior)
    }
    setComparandoA(null)
  }

  return (
    <div className={styles.historico}>
      <div className={styles.header}>
        <span className={styles.titulo}>Histórico de versões</span>
        {comparandoA && (
          <span className={styles.dica}>
            Selecione outra versão para comparar
          </span>
        )}
      </div>

      <ol className={styles.lista} aria-label="Versões da fórmula">
        {versoes.map((versao) => {
          const selecionada = versao.id === versaoSelecionadaId
          const comparandoB = versao.id !== comparandoA && comparandoA !== null
          const estaNoModo = comparandoA !== null

          const dataFormatada = new Date(versao.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit', month: 'short', year: 'numeric',
          })

          return (
            <li
              key={versao.id}
              className={[
                styles.versao,
                selecionada ? styles.selecionada : '',
                versao.id === comparandoA ? styles.marcadaComparacao : '',
              ].join(' ')}
            >
              <div className={styles.versaoTrilha} aria-hidden="true">
                <span className={[styles.versaoBola, versao.status === 'ativa' ? styles.bolaAtiva : ''].join(' ')} />
                <span className={styles.versaoLinha} />
              </div>

              <div className={styles.versaoCorpo}>
                <button
                  className={styles.versaoBotao}
                  onClick={() => onSelecionar?.(versao.id)}
                  aria-pressed={selecionada}
                  aria-label={`Selecionar versão ${versao.numeroVersao}`}
                >
                  <div className={styles.versaoTop}>
                    <span className={styles.versaoNum}>v{versao.numeroVersao}</span>
                    <FormulaStatus status={versao.status} compacto />
                    <span className={styles.versaoData}>{dataFormatada}</span>
                  </div>

                  <span className={styles.versaoTitulo}>{versao.titulo}</span>

                  {versao.motivoAlteracao && (
                    <span className={styles.versaoMotivo}>
                      {versao.motivoAlteracao}
                    </span>
                  )}
                </button>

                {onCompararCom && (
                  <button
                    className={[
                      styles.comparar,
                      versao.id === comparandoA ? styles.compararAtivo : '',
                    ].join(' ')}
                    onClick={() => handleComparar(versao.id)}
                    aria-label={
                      versao.id === comparandoA
                        ? 'Cancelar comparação'
                        : comparandoA
                        ? `Comparar com v${versao.numeroVersao}`
                        : `Iniciar comparação com v${versao.numeroVersao}`
                    }
                  >
                    {versao.id === comparandoA ? '✕' : '↔'}
                  </button>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
