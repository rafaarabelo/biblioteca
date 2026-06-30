// ============================================================
// ObservationHistory — Detalhe de versão histórica
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================

'use client'

import { useState } from 'react'
import type { VersaoView } from '../types'
import { STATUS_EPISTEMICO } from '../types'
import styles from './ObservationHistory.module.css'

interface ObservationHistoryProps {
  versao: VersaoView
  onFechar: () => void
}

export function ObservationHistory({ versao, onFechar }: ObservationHistoryProps) {
  const statusMeta = STATUS_EPISTEMICO[versao.statusEpistemico] ?? STATUS_EPISTEMICO.hipotese

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-label={`Versão ${versao.numeroVersao}`}>
        <div className={styles.cabecalho}>
          <div className={styles.cabecalhoInfo}>
            <span className={styles.versaoNum}>Versão {versao.numeroVersao}</span>
            <span
              className={[styles.status, styles[`status_${statusMeta.cor}`]].filter(Boolean).join(' ')}
            >
              {statusMeta.label}
            </span>
            <time className={styles.data} dateTime={versao.criadoEm}>
              {new Date(versao.criadoEm).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </time>
          </div>
          <button
            type="button"
            className={styles.fechar}
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {versao.justificativa && (
          <div className={styles.justificativa}>
            <span className={styles.justificativaLabel}>Justificativa</span>
            <p>{versao.justificativa}</p>
          </div>
        )}

        <div className={styles.conteudo}>
          {versao.conteudo.split('\n').map((linha, i) => (
            linha ? <p key={i}>{linha}</p> : <br key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
