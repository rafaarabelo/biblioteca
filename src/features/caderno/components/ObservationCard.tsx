// ============================================================
// ObservationCard — Card de Observação no Caderno
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Cada tipo tem identidade visual própria:
// textura, ícone, acento — não apenas cor.
// ============================================================

import Link from 'next/link'
import type { ObservacaoView } from '../types'
import { TIPOS_OBSERVACAO, STATUS_EPISTEMICO } from '../types'
import { ObservationStatus } from './ObservationStatus'
import styles from './ObservationCard.module.css'

interface ObservationCardProps {
  observacao: ObservacaoView
}

export function ObservationCard({ observacao }: ObservationCardProps) {
  const meta = TIPOS_OBSERVACAO[observacao.tipo]
  const statusMeta = STATUS_EPISTEMICO[observacao.statusEpistemico]

  // Formatar data relativa
  const dataFormatada = formatarData(observacao.atualizadoEm)

  return (
    <Link
      href={`/caderno/${observacao.id}`}
      className={[
        styles.card,
        styles[`tipo_${observacao.tipo}`],
      ].filter(Boolean).join(' ')}
      aria-label={`Abrir: ${observacao.titulo}`}
    >
      {/* Indicador de tipo — canto superior esquerdo */}
      <div className={styles.tipoIndicador} aria-hidden="true">
        <span className={styles.tipoIcone}>{meta.icone}</span>
        <span className={styles.tipoLabel}>{meta.label}</span>
      </div>

      {/* Favorito */}
      {observacao.favorito && (
        <span className={styles.favoritoMarca} aria-label="Favorito" title="Favorito">
          ★
        </span>
      )}

      {/* Título */}
      <h3 className={styles.titulo}>{observacao.titulo}</h3>

      {/* Excerpto */}
      {observacao.excerpto && (
        <p className={styles.excerpto}>{observacao.excerpto}</p>
      )}

      {/* Footer: status + versões + data */}
      <div className={styles.footer}>
        <ObservationStatus status={observacao.statusEpistemico} compacto />

        <div className={styles.footerMeta}>
          {observacao.totalVersoes > 1 && (
            <span className={styles.versoes} title={`${observacao.totalVersoes} versões`}>
              v{observacao.totalVersoes}
            </span>
          )}
          {observacao.tags.length > 0 && (
            <span className={styles.tags}>
              {observacao.tags.slice(0, 2).map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </span>
          )}
          <time className={styles.data} dateTime={observacao.atualizadoEm}>
            {dataFormatada}
          </time>
        </div>
      </div>

      {/* Linha de acento — identidade visual por tipo */}
      <div className={styles.acento} aria-hidden="true" />
    </Link>
  )
}

function formatarData(iso: string): string {
  try {
    const data = new Date(iso)
    const agora = new Date()
    const diffMs = agora.getTime() - data.getTime()
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDias === 0) return 'hoje'
    if (diffDias === 1) return 'ontem'
    if (diffDias < 7) return `${diffDias}d atrás`
    if (diffDias < 30) return `${Math.floor(diffDias / 7)}sem atrás`

    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch {
    return ''
  }
}
