// ============================================================
// ReferenceFilters — Filtros laterais do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

'use client'

import { TIPOS_ESTUDO, NIVEIS_EVIDENCIA } from '../types'
import type { TipoEstudo, NivelEvidencia, AcervoFiltros } from '../types'
import styles from './ReferenceFilters.module.css'

const TIPOS_ORDEM: TipoEstudo[] = [
  'meta_analise', 'revisao_sistematica', 'ensaio_clinico_randomizado',
  'estudo_clinico', 'coorte', 'caso_controle', 'estudo_transversal',
  'estudo_in_vitro', 'estudo_em_animais', 'revisao_narrativa', 'artigo_opiniao', 'outro',
]

const NIVEIS_ORDEM: NivelEvidencia[] = ['ia', 'ib', 'iia', 'iib', 'iii', 'iv', 'v']

interface ReferenceFiltersProps {
  tipoAtivo: TipoEstudo | null
  nivelAtivo: NivelEvidencia | null
  favoritoAtivo: boolean | undefined
  tags: string[]
  temFiltrosAtivos: boolean
  onTipo: (t: TipoEstudo | null) => void
  onNivel: (n: NivelEvidencia | null) => void
  onFavorito: (f: boolean | undefined) => void
  onLimpar: () => void
}

const NIVEL_CORES: Record<NivelEvidencia, string> = {
  ia: '#15803d', ib: '#16a34a', iia: '#65a30d',
  iib: '#ca8a04', iii: '#ea580c', iv: 'var(--terracota-500)', v: 'var(--texto-terciario)',
}

export function ReferenceFilters({
  tipoAtivo, nivelAtivo, favoritoAtivo, tags, temFiltrosAtivos,
  onTipo, onNivel, onFavorito, onLimpar,
}: ReferenceFiltersProps) {
  return (
    <nav className={styles.nav} aria-label="Filtros do Acervo">

      {/* Favoritos */}
      <button
        type="button"
        className={[styles.favoritoBtn, favoritoAtivo ? styles.favoritoAtivo : ''].filter(Boolean).join(' ')}
        onClick={() => onFavorito(favoritoAtivo ? undefined : true)}
        aria-pressed={!!favoritoAtivo}
      >
        {favoritoAtivo ? '★' : '☆'} Favoritos
      </button>

      {/* Tipo de Estudo */}
      <div className={styles.grupo}>
        <span className={styles.grupoLabel}>Tipo de estudo</span>
        <ul className={styles.lista}>
          {TIPOS_ORDEM.map((tipo) => {
            const meta = TIPOS_ESTUDO[tipo]!
            const ativo = tipoAtivo === tipo
            return (
              <li key={tipo}>
                <button
                  type="button"
                  className={[styles.item, ativo ? styles.itemAtivo : ''].filter(Boolean).join(' ')}
                  onClick={() => onTipo(ativo ? null : tipo)}
                  aria-pressed={ativo}
                >
                  <span className={styles.icone} aria-hidden="true">{meta.icone}</span>
                  {meta.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Nível de Evidência */}
      <div className={styles.grupo}>
        <span className={styles.grupoLabel}>Nível de evidência</span>
        <ul className={styles.lista}>
          {NIVEIS_ORDEM.map((nivel) => {
            const meta = NIVEIS_EVIDENCIA[nivel]!
            const ativo = nivelAtivo === nivel
            return (
              <li key={nivel}>
                <button
                  type="button"
                  className={[styles.item, ativo ? styles.itemAtivo : ''].filter(Boolean).join(' ')}
                  onClick={() => onNivel(ativo ? null : nivel)}
                  aria-pressed={ativo}
                >
                  <span
                    className={styles.dotNivel}
                    style={{ background: NIVEL_CORES[nivel] }}
                    aria-hidden="true"
                  />
                  {meta.abrev}
                  <span className={styles.nivelDesc}>{meta.label.split(' — ')[1]}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Limpar */}
      {temFiltrosAtivos && (
        <button type="button" className={styles.limpar} onClick={onLimpar}>
          Limpar filtros
        </button>
      )}
    </nav>
  )
}
