// ============================================================
// ClinicalPhotoGallery — Galeria de fotos clínicas
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Tipos: antes / durante / depois / detalhe / comparativo
// Fotos sem URL renderizam placeholder — estrutura preservada.
// ============================================================

import type { FotoView } from '../types'
import styles from './ClinicalPhotoGallery.module.css'

interface ClinicalPhotoGalleryProps {
  fotos: FotoView[]
  casoId: string
}

const TIPO_LABELS: Record<string, string> = {
  antes:       'Antes',
  durante:     'Durante',
  depois:      'Depois',
  detalhe:     'Detalhe',
  comparativo: 'Comparativo',
}

const TIPO_ORDEM = ['antes', 'durante', 'depois', 'detalhe', 'comparativo']

export function ClinicalPhotoGallery({ fotos }: ClinicalPhotoGalleryProps) {
  if (fotos.length === 0) {
    return (
      <div className={styles.vazio}>
        <p className={styles.vazioTexto}>
          Nenhuma foto registrada neste caso.
        </p>
        <p className={styles.vazioHint}>
          As fotos clínicas são parte essencial da documentação visual da evolução.
        </p>
      </div>
    )
  }

  // Agrupar por tipo
  const grupos = TIPO_ORDEM.reduce<Record<string, FotoView[]>>((acc, tipo) => {
    const fotosTipo = fotos.filter((f) => f.tipo === tipo)
    if (fotosTipo.length > 0) acc[tipo] = fotosTipo
    return acc
  }, {})

  return (
    <div className={styles.galeria}>
      {Object.entries(grupos).map(([tipo, fotosGrupo]) => (
        <div key={tipo} className={styles.grupo}>
          <h4 className={styles.grupoTitulo}>{TIPO_LABELS[tipo] ?? tipo}</h4>
          <div className={styles.grid}>
            {fotosGrupo.map((foto) => (
              <FotoItem key={foto.id} foto={foto} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function FotoItem({ foto }: { foto: FotoView }) {
  const data = foto.dataFoto
    ? new Date(foto.dataFoto).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', year: 'numeric',
      })
    : null

  return (
    <figure className={styles.foto}>
      {foto.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={foto.url}
          alt={`Foto ${TIPO_LABELS[foto.tipo] ?? foto.tipo} — ${data}`}
          className={styles.imagem}
          loading="lazy"
        />
      ) : (
        <div className={styles.placeholder} aria-label="Foto sem arquivo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M21 16l-5-5L8 19" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <figcaption className={styles.legenda}>
        <span className={styles.legendaData}>{data}</span>
        {foto.angulo && (
          <span className={styles.legendaAngulo}>{foto.angulo}</span>
        )}
        {foto.notas && (
          <span className={styles.legendaNotas}>{foto.notas}</span>
        )}
      </figcaption>
    </figure>
  )
}
