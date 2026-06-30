// ============================================================
// ReferenceTimeline — Histórico de edições da Referência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Linha do tempo de criação e edições. Sem versões estruturadas
// como o Caderno — apenas timestamps de atualização.
// ============================================================

import styles from './ReferenceTimeline.module.css'

interface EventoTimeline {
  tipo: 'criacao' | 'edicao'
  data: Date
  descricao?: string
}

interface ReferenceTimelineProps {
  criadoEm: Date
  atualizadoEm: Date
}

export function ReferenceTimeline({ criadoEm, atualizadoEm }: ReferenceTimelineProps) {
  const eventos: EventoTimeline[] = [
    { tipo: 'criacao', data: criadoEm, descricao: 'Referência registrada no acervo' },
  ]

  const mesmoDia =
    criadoEm.toDateString() === atualizadoEm.toDateString() &&
    criadoEm.getTime() === atualizadoEm.getTime()

  if (!mesmoDia) {
    eventos.push({ tipo: 'edicao', data: atualizadoEm, descricao: 'Última atualização' })
  }

  const formatarData = (d: Date) =>
    d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const formatarHora = (d: Date) =>
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={styles.timeline} role="list" aria-label="Histórico da referência">
      <div className={styles.fio} aria-hidden="true" />
      {eventos.map((evento, i) => (
        <div
          key={i}
          className={styles.item}
          role="listitem"
        >
          <div
            className={[
              styles.ponto,
              evento.tipo === 'criacao' ? styles.pontoOrigem : styles.pontoAtual,
            ].join(' ')}
            aria-hidden="true"
          />
          <div className={styles.conteudo}>
            <time
              className={styles.data}
              dateTime={evento.data.toISOString()}
            >
              {formatarData(evento.data)} · {formatarHora(evento.data)}
            </time>
            {evento.descricao && (
              <p className={styles.descricao}>{evento.descricao}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
