// ============================================================
// ProtocolTimeline — Linha do Tempo Simples do Protocolo
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Mostra criação e última revisão. Para o histórico completo
// de versões, usar ProtocolVersionHistory.
// ============================================================

import styles from './ProtocolTimeline.module.css'

interface ProtocolTimelineProps {
  criadoEm: Date
  atualizadoEm: Date
  totalVersoes: number
}

function formatarData(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function ProtocolTimeline({ criadoEm, atualizadoEm, totalVersoes }: ProtocolTimelineProps) {
  const foiRevisado = criadoEm.getTime() !== atualizadoEm.getTime()

  return (
    <div className={styles.timeline}>
      {/* Evento: criação */}
      <div className={styles.evento}>
        <div className={styles.fio}>
          <span className={styles.pontoOrigem} aria-hidden="true" />
          {foiRevisado && <span className={styles.linha} aria-hidden="true" />}
        </div>
        <div className={styles.conteudo}>
          <span className={styles.rotulo}>Criado</span>
          <span className={styles.data}>{formatarData(criadoEm)}</span>
        </div>
      </div>

      {/* Evento: última revisão */}
      {foiRevisado && (
        <div className={styles.evento}>
          <div className={styles.fio}>
            <span className={styles.pontoAtual} aria-hidden="true" />
          </div>
          <div className={styles.conteudo}>
            <span className={styles.rotulo}>
              Versão {totalVersoes} — última revisão
            </span>
            <span className={styles.data}>{formatarData(atualizadoEm)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
