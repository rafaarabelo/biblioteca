// ============================================================
// ProtocolFilters — Filtros Laterais de Protocolos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import type { MaturidadeProtocolo } from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'
import styles from './ProtocolFilters.module.css'

const MATURIDADES_ORDEM: MaturidadeProtocolo[] = [
  'hipotese',
  'em_validacao',
  'validado_internamente',
  'consolidado',
  'referencia_biblioteca',
]

interface ProtocolFiltersProps {
  maturidade: MaturidadeProtocolo | ''
  favorito: boolean
  tags: string[]
  tagsDisponiveis: string[]
  temFiltrosAtivos: boolean
  onMaturidade: (v: MaturidadeProtocolo | '') => void
  onFavorito: (v: boolean) => void
  onTags: (v: string[]) => void
  onLimpar: () => void
}

export function ProtocolFilters({
  maturidade,
  favorito,
  tags,
  tagsDisponiveis,
  temFiltrosAtivos,
  onMaturidade,
  onFavorito,
  onTags,
  onLimpar,
}: ProtocolFiltersProps) {
  function toggleTag(tag: string) {
    onTags(tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag])
  }

  return (
    <nav className={styles.filtros} aria-label="Filtros de protocolo">

      {/* Favorito */}
      <section className={styles.secao}>
        <button
          type="button"
          className={[styles.favoritoBtn, favorito ? styles.favoritoBtnAtivo : ''].filter(Boolean).join(' ')}
          onClick={() => onFavorito(!favorito)}
          aria-pressed={favorito}
        >
          <span aria-hidden="true">{favorito ? '★' : '☆'}</span>
          Favoritos
        </button>
      </section>

      {/* Maturidade */}
      <section className={styles.secao}>
        <h3 className={styles.secaoTitulo}>Maturidade</h3>
        <ul className={styles.lista} role="list">
          {MATURIDADES_ORDEM.map((m) => {
            const meta = MATURIDADES_PROTOCOLO[m]
            const ativo = maturidade === m
            return (
              <li key={m}>
                <button
                  type="button"
                  className={[styles.item, ativo ? styles.itemAtivo : ''].filter(Boolean).join(' ')}
                  onClick={() => onMaturidade(ativo ? '' : m)}
                  aria-pressed={ativo}
                >
                  <span
                    className={styles.ponto}
                    style={{ backgroundColor: meta.cor }}
                    aria-hidden="true"
                  />
                  {meta.label}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Tags */}
      {tagsDisponiveis.length > 0 && (
        <section className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Tags</h3>
          <div className={styles.tags}>
            {tagsDisponiveis.map((tag) => {
              const ativo = tags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  className={[styles.tag, ativo ? styles.tagAtiva : ''].filter(Boolean).join(' ')}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={ativo}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </section>
      )}

      {/* Limpar */}
      {temFiltrosAtivos && (
        <button type="button" className={styles.limpar} onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </nav>
  )
}
