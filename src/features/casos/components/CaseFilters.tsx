// CaseFilters — Filtros de casos clínicos

'use client'

import { STATUS_CASO_META, STATUS_PRINCIPAIS } from '../types'
import styles from './CaseFilters.module.css'

interface CaseFiltersProps {
  status: string
  favorito: boolean
  tags: string[]
  tagsDisponiveis: string[]
  temFiltrosAtivos: boolean
  onStatus: (s: string) => void
  onFavorito: (f: boolean) => void
  onTags: (t: string[]) => void
  onLimpar: () => void
}

export function CaseFilters({
  status, favorito, tags, tagsDisponiveis, temFiltrosAtivos,
  onStatus, onFavorito, onTags, onLimpar,
}: CaseFiltersProps) {
  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      onTags(tags.filter((t) => t !== tag))
    } else {
      onTags([...tags, tag])
    }
  }

  return (
    <div className={styles.filtros}>
      {/* Favorito */}
      <div className={styles.secao}>
        <button
          type="button"
          className={[styles.favorito, favorito ? styles.favoritoAtivo : ''].filter(Boolean).join(' ')}
          onClick={() => onFavorito(!favorito)}
          aria-pressed={favorito}
        >
          {favorito ? '★' : '☆'} Favoritos
        </button>
      </div>

      {/* Status */}
      <div className={styles.secao}>
        <p className={styles.secaoTitulo}>Status clínico</p>
        <div className={styles.statusLista}>
          {STATUS_PRINCIPAIS.map((s) => {
            const meta = STATUS_CASO_META[s]
            const ativo = status === s
            return (
              <button
                key={s}
                type="button"
                className={[styles.statusItem, ativo ? styles.statusAtivo : ''].filter(Boolean).join(' ')}
                onClick={() => onStatus(ativo ? '' : s)}
                aria-pressed={ativo}
              >
                <span
                  className={styles.ponto}
                  style={{ backgroundColor: ativo ? meta.cor : undefined }}
                  aria-hidden="true"
                />
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      {tagsDisponiveis.length > 0 && (
        <div className={styles.secao}>
          <p className={styles.secaoTitulo}>Tags</p>
          <div className={styles.tagsList}>
            {tagsDisponiveis.map((tag) => (
              <button
                key={tag}
                type="button"
                className={[styles.tagItem, tags.includes(tag) ? styles.tagAtiva : ''].filter(Boolean).join(' ')}
                onClick={() => toggleTag(tag)}
                aria-pressed={tags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Limpar */}
      {temFiltrosAtivos && (
        <button type="button" className={styles.limpar} onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </div>
  )
}
