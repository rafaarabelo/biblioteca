// ============================================================
// ReferenceMetadata — Metadados da Referência (lateral)
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Exibe identificadores, tipo de estudo, nível de evidência,
// dados bibliográficos e tags. Sem SQL, sem Supabase.
// ============================================================

import { TIPOS_ESTUDO, NIVEIS_EVIDENCIA } from '../types'
import { ReferenceEvidence } from './ReferenceEvidence'
import type { ReferenciaDetalheView } from '../types'
import styles from './ReferenceMetadata.module.css'

interface ReferenceMetadataProps {
  referencia: ReferenciaDetalheView
}

export function ReferenceMetadata({ referencia: r }: ReferenceMetadataProps) {
  const tipoMeta  = r.tipoEstudo ? TIPOS_ESTUDO[r.tipoEstudo] : null
  const nivelMeta = r.nivelEvidencia ? NIVEIS_EVIDENCIA[r.nivelEvidencia] : null

  return (
    <aside className={styles.aside}>

      {/* Tipo de Estudo */}
      {tipoMeta && (
        <section className={styles.secao}>
          <span className={styles.rotulo}>Tipo de estudo</span>
          <div className={styles.tipoChip}>
            <span className={styles.tipoIcone} aria-hidden="true">{tipoMeta.icone}</span>
            <div>
              <p className={styles.tipoLabel}>{tipoMeta.label}</p>
              <p className={styles.tipoDesc}>{tipoMeta.descricao}</p>
            </div>
          </div>
        </section>
      )}

      {/* Nível de Evidência */}
      {nivelMeta && (
        <section className={styles.secao}>
          <span className={styles.rotulo}>Nível de evidência</span>
          <div className={styles.nivelWrapper}>
            <ReferenceEvidence nivel={r.nivelEvidencia} />
            <div>
              <p className={styles.nivelLabel}>{nivelMeta.label}</p>
              <p className={styles.nivelDesc}>{nivelMeta.descricao}</p>
            </div>
          </div>
        </section>
      )}

      {/* Identificadores */}
      {(r.doi || r.pmid || r.url) && (
        <section className={styles.secao}>
          <span className={styles.rotulo}>Identificadores</span>
          <dl className={styles.dl}>
            {r.doi && (
              <>
                <dt className={styles.dt}>DOI</dt>
                <dd className={styles.dd}>
                  <a
                    href={`https://doi.org/${r.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {r.doi}
                  </a>
                </dd>
              </>
            )}
            {r.pmid && (
              <>
                <dt className={styles.dt}>PMID</dt>
                <dd className={styles.dd}>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {r.pmid}
                  </a>
                </dd>
              </>
            )}
            {r.url && (
              <>
                <dt className={styles.dt}>URL</dt>
                <dd className={styles.dd}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    Ver online
                  </a>
                </dd>
              </>
            )}
          </dl>
        </section>
      )}

      {/* Dados bibliográficos */}
      {(r.journal || r.anoPublicacao || r.autores.length > 0) && (
        <section className={styles.secao}>
          <span className={styles.rotulo}>Referência</span>
          <dl className={styles.dl}>
            {r.autores.length > 0 && (
              <>
                <dt className={styles.dt}>Autores</dt>
                <dd className={styles.dd}>{r.autores.join(', ')}</dd>
              </>
            )}
            {r.journal && (
              <>
                <dt className={styles.dt}>Periódico</dt>
                <dd className={[styles.dd, styles.italic].join(' ')}>{r.journal}</dd>
              </>
            )}
            {r.anoPublicacao && (
              <>
                <dt className={styles.dt}>Ano</dt>
                <dd className={styles.dd}>{r.anoPublicacao}</dd>
              </>
            )}
          </dl>
        </section>
      )}

      {/* Tags */}
      {r.tags.length > 0 && (
        <section className={styles.secao}>
          <span className={styles.rotulo}>Tags</span>
          <div className={styles.tags}>
            {r.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </section>
      )}

      {/* Data de registro */}
      <section className={styles.secao}>
        <span className={styles.rotulo}>Registrado em</span>
        <time className={styles.data} dateTime={new Date(r.criadoEm).toISOString()}>
          {new Date(r.criadoEm).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </time>
      </section>
    </aside>
  )
}
