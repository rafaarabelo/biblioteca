// ============================================================
// NotebookSidebar — Filtros laterais do Caderno
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Client Component — controla filtros ativos.
// ============================================================

'use client'

import styles from './NotebookSidebar.module.css'
import type { TipoObservacao, StatusEpistemicoUI } from '../types'
import { TIPOS_OBSERVACAO, STATUS_EPISTEMICO } from '../types'

interface NotebookSidebarProps {
  tipoAtivo: TipoObservacao | null | undefined
  statusAtivo: StatusEpistemicoUI | null | undefined
  favoritoAtivo?: boolean
  tags?: string[]
  tagsAtivas?: string[]
  onTipo: (t: TipoObservacao | null) => void
  onStatus: (s: StatusEpistemicoUI | null) => void
  onFavorito: (f: boolean | undefined) => void
  onLimpar: () => void
  temFiltrosAtivos?: boolean
}

const TIPOS_LISTA: TipoObservacao[] = [
  'observacao', 'hipotese', 'pergunta_clinica',
  'insight', 'lembrete', 'ideia', 'descoberta',
]

const STATUS_LISTA: StatusEpistemicoUI[] = [
  'hipotese', 'em_observacao', 'parcialmente_validada',
  'validada', 'refutada', 'arquivada',
]

export function NotebookSidebar({
  tipoAtivo,
  statusAtivo,
  favoritoAtivo,
  tags = [],
  tagsAtivas = [],
  onTipo,
  onStatus,
  onFavorito,
  onLimpar,
  temFiltrosAtivos,
}: NotebookSidebarProps) {
  return (
    <div className={styles.sidebar}>

      {/* Favoritos */}
      <div className={styles.grupo}>
        <button
          className={[
            styles.filtroSimples,
            favoritoAtivo ? styles.ativo : '',
          ].filter(Boolean).join(' ')}
          onClick={() => onFavorito(favoritoAtivo ? undefined : true)}
          type="button"
        >
          <span className={styles.filtroIcone} aria-hidden="true">
            {favoritoAtivo ? '★' : '☆'}
          </span>
          Favoritos
        </button>
      </div>

      {/* Tipos */}
      <div className={styles.grupo}>
        <p className={styles.grupoLabel}>Tipo</p>
        <div className={styles.lista}>
          {TIPOS_LISTA.map((tipo) => {
            const meta = TIPOS_OBSERVACAO[tipo]
            const ativo = tipoAtivo === tipo
            return (
              <button
                key={tipo}
                className={[styles.filtroItem, ativo ? styles.ativo : ''].filter(Boolean).join(' ')}
                onClick={() => onTipo(ativo ? null : tipo)}
                type="button"
                title={meta.descricao}
              >
                <span className={styles.filtroIcone} aria-hidden="true">{meta.icone}</span>
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Status Epistêmico */}
      <div className={styles.grupo}>
        <p className={styles.grupoLabel}>Status</p>
        <div className={styles.lista}>
          {STATUS_LISTA.map((status) => {
            const meta = STATUS_EPISTEMICO[status]
            if (!meta) return null
            const ativo = statusAtivo === status
            return (
              <button
                key={status}
                className={[
                  styles.filtroStatus,
                  styles[`status_${meta.cor}`],
                  ativo ? styles.ativo : '',
                ].filter(Boolean).join(' ')}
                onClick={() => onStatus(ativo ? null : status)}
                type="button"
                title={meta.descricao}
              >
                <span className={styles.statusPonto} aria-hidden="true" />
                {meta.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className={styles.grupo}>
          <p className={styles.grupoLabel}>Tags</p>
          <div className={styles.tags}>
            {tags.slice(0, 15).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
      )}

      {/* Limpar filtros */}
      {temFiltrosAtivos && (
        <button
          className={styles.limpar}
          onClick={onLimpar}
          type="button"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
