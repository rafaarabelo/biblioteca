// ============================================================
// ReferenceCard — Card de Referência no Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Formato de citação científica, não linha de tabela.
// Cada card é uma ficha bibliográfica que convida à leitura.
// ============================================================

import Link from 'next/link'
import { ReferenceEvidence } from './ReferenceEvidence'
import { NIVEIS_EVIDENCIA, TIPOS_ESTUDO } from '../types'
import type { ReferenciaView } from '../types'
import styles from './ReferenceCard.module.css'

interface ReferenceCardProps {
  referencia: ReferenciaView
}

function formatarAutoresCurto(autores: string[]): string {
  if (autores.length === 0) return ''
  if (autores.length <= 3) return autores.join(', ')
  return `${autores.slice(0, 3).join(', ')} et al.`
}

export function ReferenceCard({ referencia: r }: ReferenceCardProps) {
  const nivelMeta = r.nivelEvidencia ? NIVEIS_EVIDENCIA[r.nivelEvidencia] : null
  const tipoMeta  = r.tipoEstudo ? TIPOS_ESTUDO[r.tipoEstudo] : null

  const nivelCor = nivelMeta?.cor ?? 'neutro'

  return (
    <Link href={`/acervo/${r.id}`} className={styles.card} aria-label={r.titulo}>
      {/* Acento lateral — cor por nível de evidência */}
      <div className={[styles.acento, styles[`acento_${nivelCor}`]].filter(Boolean).join(' ')} aria-hidden="true" />

      {/* Corpo */}
      <div className={styles.corpo}>
        {/* Linha de topo: tipo de estudo + favorito */}
        <div className={styles.topo}>
          {tipoMeta && (
            <span className={styles.tipo}>
              <span aria-hidden="true">{tipoMeta.icone}</span>
              {tipoMeta.label}
            </span>
          )}
          {r.favorito && (
            <span className={styles.favorito} title="Favorito" aria-label="Favorito">★</span>
          )}
        </div>

        {/* Título — citação em formato bibliográfico */}
        <h3 className={styles.titulo}>{r.titulo}</h3>

        {/* Autores + Ano + Journal */}
        <p className={styles.citacao}>
          {r.autores.length > 0 && (
            <span className={styles.autores}>{formatarAutoresCurto(r.autores)}</span>
          )}
          {r.anoPublicacao && (
            <span className={styles.ano}> ({r.anoPublicacao})</span>
          )}
          {r.journal && (
            <span className={styles.journal}> · {r.journal}</span>
          )}
        </p>

        {/* Abstract (2 linhas) */}
        {r.abstract && (
          <p className={styles.abstract}>{r.abstract}</p>
        )}

        {/* Rodapé: evidência + identificadores + tags + conexões */}
        <div className={styles.rodape}>
          <div className={styles.rodapeEsq}>
            {r.nivelEvidencia && (
              <ReferenceEvidence nivel={r.nivelEvidencia} compacto />
            )}
            {r.doi && (
              <span className={styles.doi} title={r.doi}>DOI</span>
            )}
            {r.pmid && (
              <span className={styles.pmid} title={`PMID: ${r.pmid}`}>PMID</span>
            )}
            {r.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          {r.totalConexoes > 0 && (
            <span className={styles.conexoes} title={`${r.totalConexoes} conexões`}>
              {r.totalConexoes} {r.totalConexoes === 1 ? 'conexão' : 'conexões'}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
