// ============================================================
// ObservationTimeline — Linha do Tempo da Observação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Cada edição gera uma nova versão.
// Nada é apagado. Todo o histórico permanece consultável.
// ============================================================

import type { VersaoView } from '../types'
import { STATUS_EPISTEMICO } from '../types'
import styles from './ObservationTimeline.module.css'

interface ObservationTimelineProps {
  versoes: VersaoView[]
  criadoEm: string
  onVerVersao?: (versao: VersaoView) => void
}

export function ObservationTimeline({
  versoes,
  criadoEm,
  onVerVersao,
}: ObservationTimelineProps) {
  const versoesOrdenadas = [...versoes].sort((a, b) => b.numeroVersao - a.numeroVersao)

  return (
    <div className={styles.timeline}>
      <h3 className={styles.titulo}>Linha do tempo</h3>

      <div className={styles.linha}>
        {versoesOrdenadas.map((versao, index) => {
          const statusMeta = STATUS_EPISTEMICO[versao.statusEpistemico] ?? STATUS_EPISTEMICO.hipotese
          const dataFormatada = formatarDataCompleta(versao.criadoEm)
          const isAtual = versao.isVersaoAtual

          return (
            <div
              key={versao.id}
              className={[
                styles.item,
                isAtual ? styles.itemAtual : '',
              ].filter(Boolean).join(' ')}
            >
              {/* Marcador na linha */}
              <div className={styles.marcador} aria-hidden="true">
                <div className={[
                  styles.ponto,
                  isAtual ? styles.pontoAtual : '',
                ].filter(Boolean).join(' ')} />
                {index < versoesOrdenadas.length - 1 && (
                  <div className={styles.fio} />
                )}
              </div>

              {/* Conteúdo do item */}
              <div className={styles.conteudo}>
                <div className={styles.cabecalho}>
                  <span className={styles.versaoNum}>v{versao.numeroVersao}</span>
                  {isAtual && (
                    <span className={styles.badge} aria-label="Versão atual">atual</span>
                  )}
                  <span
                    className={[
                      styles.status,
                      styles[`status_${statusMeta.cor}`],
                    ].filter(Boolean).join(' ')}
                  >
                    {statusMeta.label}
                  </span>
                </div>

                <time className={styles.data} dateTime={versao.criadoEm}>
                  {dataFormatada}
                </time>

                {versao.justificativa && (
                  <p className={styles.justificativa}>
                    <span className={styles.justificativaLabel}>Justificativa: </span>
                    {versao.justificativa}
                  </p>
                )}

                {onVerVersao && !isAtual && (
                  <button
                    type="button"
                    className={styles.botaoVer}
                    onClick={() => onVerVersao(versao)}
                  >
                    Ver esta versão
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Origem */}
        <div className={styles.item}>
          <div className={styles.marcador}>
            <div className={[styles.ponto, styles.pontoOrigem].join(' ')} />
          </div>
          <div className={styles.conteudo}>
            <span className={styles.origemLabel}>Primeira observação</span>
            <time className={styles.data} dateTime={criadoEm}>
              {formatarDataCompleta(criadoEm)}
            </time>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatarDataCompleta(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}
