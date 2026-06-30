// ============================================================
// ProtocolCard — Card de Protocolo na Listagem
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Sensação: "estou consultando um protocolo que amadureceu."
// A maturidade não é badge — é visualização progressiva.
// ============================================================

import Link from 'next/link'
import type { ProtocoloView } from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'
import { ProtocolEvidence } from './ProtocolEvidence'
import styles from './ProtocolCard.module.css'

interface ProtocolCardProps {
  protocolo: ProtocoloView
}

export function ProtocolCard({ protocolo: p }: ProtocolCardProps) {
  const meta = MATURIDADES_PROTOCOLO[p.maturidade]

  return (
    <Link
      href={`/protocolos/${p.id}`}
      className={styles.card}
      aria-label={`Abrir protocolo: ${p.titulo}`}
    >
      {/* Acento lateral — cor da maturidade */}
      <span
        className={styles.acento}
        style={{ backgroundColor: meta.cor }}
        aria-hidden="true"
      />

      <div className={styles.corpo}>
        {/* Cabeçalho */}
        <div className={styles.cabecalho}>
          <h3 className={styles.titulo}>{p.titulo}</h3>
          {p.favorito && (
            <span className={styles.favorito} aria-label="Favorito" title="Favorito">★</span>
          )}
        </div>

        {/* Objetivo */}
        {p.objetivo && (
          <p className={styles.objetivo}>{p.objetivo}</p>
        )}

        {/* Indicações */}
        {p.indicacoes && (
          <p className={styles.indicacoes}>{p.indicacoes}</p>
        )}

        {/* Rodapé */}
        <div className={styles.rodape}>
          <ProtocolEvidence maturidade={p.maturidade} compacto />

          {p.tags.length > 0 && (
            <div className={styles.tags} aria-label="Tags">
              {p.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
              {p.tags.length > 3 && (
                <span className={styles.tag}>+{p.tags.length - 3}</span>
              )}
            </div>
          )}

          {p.totalConexoes > 0 && (
            <span className={styles.conexoes} aria-label={`${p.totalConexoes} conexões`}>
              {p.totalConexoes} conexão{p.totalConexoes !== 1 ? 'ões' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
