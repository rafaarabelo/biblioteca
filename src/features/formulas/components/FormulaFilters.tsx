'use client'

// FormulaFilters — Filtros laterais de fórmulas
// Capítulo V: Fórmulas

import type { StatusVersaoFormula } from '../types'
import styles from './FormulaFilters.module.css'

const STATUS_OPCOES: { valor: string; label: string }[] = [
  { valor: '',          label: 'Todos os status' },
  { valor: 'ativa',    label: 'Ativas' },
  { valor: 'rascunho', label: 'Rascunhos' },
  { valor: 'arquivada',label: 'Arquivadas' },
]

const ORDENAR_OPCOES: { valor: string; label: string }[] = [
  { valor: 'atualizadoEm', label: 'Mais recentes' },
  { valor: 'titulo',       label: 'Alfabética' },
  { valor: 'versaoAtiva',  label: 'Mais evoluídas' },
]

interface FormulaFiltersProps {
  status:       string
  favorito:     boolean
  tags:         string[]
  ordenar:      string
  tagsDisponiveis: string[]
  temFiltrosAtivos: boolean
  onStatus:     (s: string) => void
  onFavorito:   (f: boolean) => void
  onTags:       (t: string[]) => void
  onOrdenar:    (o: 'atualizadoEm' | 'titulo' | 'versaoAtiva') => void
  onLimpar:     () => void
}

export function FormulaFilters({
  status, favorito, tags, ordenar, tagsDisponiveis,
  temFiltrosAtivos,
  onStatus, onFavorito, onTags, onOrdenar, onLimpar,
}: FormulaFiltersProps) {

  function toggleTag(tag: string) {
    if (tags.includes(tag)) {
      onTags(tags.filter((t) => t !== tag))
    } else {
      onTags([...tags, tag])
    }
  }

  return (
    <div className={styles.filtros}>
      {/* Status */}
      <section className={styles.secao}>
        <span className={styles.label}>Status</span>
        <div className={styles.opcoes}>
          {STATUS_OPCOES.map((op) => (
            <button
              key={op.valor}
              className={[styles.opcao, status === op.valor ? styles.ativo : ''].join(' ')}
              onClick={() => onStatus(op.valor)}
            >
              {op.label}
            </button>
          ))}
        </div>
      </section>

      {/* Favoritos */}
      <section className={styles.secao}>
        <label className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={favorito}
            onChange={(e) => onFavorito(e.target.checked)}
            className={styles.check}
          />
          <span>Apenas favoritas</span>
        </label>
      </section>

      {/* Tags */}
      {tagsDisponiveis.length > 0 && (
        <section className={styles.secao}>
          <span className={styles.label}>Tags</span>
          <div className={styles.tags}>
            {tagsDisponiveis.map((tag) => (
              <button
                key={tag}
                className={[styles.tag, tags.includes(tag) ? styles.tagAtiva : ''].join(' ')}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Ordenar */}
      <section className={styles.secao}>
        <span className={styles.label}>Ordenar</span>
        <div className={styles.opcoes}>
          {ORDENAR_OPCOES.map((op) => (
            <button
              key={op.valor}
              className={[styles.opcao, ordenar === op.valor ? styles.ativo : ''].join(' ')}
              onClick={() => onOrdenar(op.valor as 'atualizadoEm' | 'titulo' | 'versaoAtiva')}
            >
              {op.label}
            </button>
          ))}
        </div>
      </section>

      {/* Limpar */}
      {temFiltrosAtivos && (
        <button className={styles.limpar} onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </div>
  )
}
