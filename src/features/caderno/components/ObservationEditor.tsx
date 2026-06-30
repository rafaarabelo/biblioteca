// ============================================================
// ObservationEditor — Editor de Observação do Caderno
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// A experiência deve lembrar um editor de pesquisa.
// Nunca um formulário administrativo.
// ============================================================

'use client'

import { useCallback } from 'react'
import type { TipoObservacao, StatusEpistemicoUI, ObservacaoView } from '../types'
import { TIPOS_OBSERVACAO, STATUS_EPISTEMICO, requerJustificativaStatus } from '../types'
import { useNovaObservacao, useRevisarObservacao } from '../hooks/useObservacaoEditor'
import { ObservationStatus } from './ObservationStatus'
import styles from './ObservationEditor.module.css'

// ─────────────────────────────────────────────
// Editor de nova observação
// ─────────────────────────────────────────────

export function NovaObservacaoEditor() {
  const { estado, salvando, set, registrar } = useNovaObservacao()

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter para registrar
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      registrar()
    }
  }, [registrar])

  return (
    <div className={styles.editor} onKeyDown={handleKeyDown}>
      {/* Seletor de tipo */}
      <div className={styles.tipoSeletor} role="radiogroup" aria-label="Tipo de observação">
        {(Object.entries(TIPOS_OBSERVACAO) as [TipoObservacao, typeof TIPOS_OBSERVACAO[TipoObservacao]][]).map(
          ([tipo, meta]) => (
            <button
              key={tipo}
              type="button"
              role="radio"
              aria-checked={estado.tipo === tipo}
              className={[
                styles.tipoOpcao,
                estado.tipo === tipo ? styles.tipoAtivo : '',
              ].filter(Boolean).join(' ')}
              onClick={() => set('tipo', tipo)}
              title={meta.descricao}
            >
              <span className={styles.tipoOpcaoIcone}>{meta.icone}</span>
              <span className={styles.tipoOpcaoLabel}>{meta.label}</span>
            </button>
          )
        )}
      </div>

      {/* Título */}
      <input
        type="text"
        className={styles.titulo}
        value={estado.titulo}
        onChange={(e) => set('titulo', e.target.value)}
        placeholder="Uma observação começa com um título..."
        aria-label="Título da observação"
        autoFocus
        maxLength={300}
      />

      {/* Corpo */}
      <textarea
        className={styles.conteudo}
        value={estado.conteudo}
        onChange={(e) => set('conteudo', e.target.value)}
        placeholder="Descreva o que você observou, pensou ou descobriu..."
        aria-label="Conteúdo da observação"
        rows={12}
      />

      {/* Footer: status + tags + ação */}
      <div className={styles.footer}>
        <div className={styles.footerEsquerda}>
          {/* Status epistêmico */}
          <div className={styles.statusSeletor}>
            <label className={styles.statusLabel} htmlFor="status-select">
              Status
            </label>
            <select
              id="status-select"
              className={styles.statusSelect}
              value={estado.statusEpistemico}
              onChange={(e) => set('statusEpistemico', e.target.value as StatusEpistemicoUI)}
              aria-label="Status epistêmico"
            >
              {(
                ['hipotese', 'em_observacao', 'parcialmente_validada', 'validada', 'refutada'] as StatusEpistemicoUI[]
              ).map((s) => (
                <option key={s} value={s}>{STATUS_EPISTEMICO[s]?.label ?? s}</option>
              ))}
            </select>
            <ObservationStatus status={estado.statusEpistemico} compacto />
          </div>

          {/* Tags */}
          <TagInput
            tags={estado.tags}
            onChange={(tags) => set('tags', tags)}
          />
        </div>

        <div className={styles.footerDireita}>
          {estado.erro && (
            <p className={styles.erro} role="alert">{estado.erro}</p>
          )}
          <span className={styles.atalho} aria-hidden="true">⌘ Enter</span>
          <button
            type="button"
            className={styles.botaoRegistrar}
            onClick={registrar}
            disabled={salvando || !estado.titulo.trim() || !estado.conteudo.trim()}
          >
            {salvando ? 'Registrando...' : 'Registrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Editor de revisão (observação existente)
// ─────────────────────────────────────────────

interface RevisaoEditorProps {
  observacao: ObservacaoView
  onCancelar: () => void
}

export function RevisaoEditor({ observacao, onCancelar }: RevisaoEditorProps) {
  const { estado, salvando, set, salvar } = useRevisarObservacao(observacao)
  const requerJustificativa = requerJustificativaStatus(estado.statusEpistemico)

  return (
    <div className={styles.revisao}>
      <div className={styles.revisaoTitulo}>
        <span className={styles.revisaoLabel}>Revisando</span>
        <h2 className={styles.revisaoNome}>{observacao.titulo}</h2>
      </div>

      <textarea
        className={styles.conteudo}
        value={estado.conteudo}
        onChange={(e) => set('conteudo', e.target.value)}
        aria-label="Conteúdo revisado"
        rows={14}
        autoFocus
      />

      {/* Status + Justificativa */}
      <div className={styles.revisaoMeta}>
        <div className={styles.statusSeletor}>
          <label className={styles.statusLabel} htmlFor="revisao-status">
            Status
          </label>
          <select
            id="revisao-status"
            className={styles.statusSelect}
            value={estado.statusEpistemico}
            onChange={(e) => set('statusEpistemico', e.target.value as StatusEpistemicoUI)}
          >
            {(
              ['hipotese', 'em_observacao', 'parcialmente_validada', 'validada', 'refutada', 'arquivada'] as StatusEpistemicoUI[]
            ).map((s) => (
              <option key={s} value={s}>{STATUS_EPISTEMICO[s]?.label ?? s}</option>
            ))}
          </select>
        </div>

        {requerJustificativa && (
          <div className={styles.justificativaWrapper}>
            <label className={styles.statusLabel} htmlFor="revisao-justificativa">
              Justificativa <span className={styles.obrigatorio}>*</span>
            </label>
            <textarea
              id="revisao-justificativa"
              className={styles.justificativa}
              value={estado.justificativa}
              onChange={(e) => set('justificativa', e.target.value)}
              placeholder="O que justifica esta mudança de status?"
              rows={3}
            />
          </div>
        )}
      </div>

      {estado.erro && (
        <p className={styles.erro} role="alert">{estado.erro}</p>
      )}

      <div className={styles.revisaoAcoes}>
        <button
          type="button"
          className={styles.botaoCancelar}
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={styles.botaoRegistrar}
          onClick={salvar}
          disabled={salvando || !estado.conteudo.trim()}
        >
          {salvando ? 'Salvando...' : 'Registrar revisão'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Tag Input
// ─────────────────────────────────────────────

function TagInput({ tags, onChange }: { tags: string[]; onChange: (t: string[]) => void }) {
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const valor = (e.target as HTMLInputElement).value.trim()
      if (valor && !tags.includes(valor)) {
        onChange([...tags, valor])
        ;(e.target as HTMLInputElement).value = ''
      }
    }
  }, [tags, onChange])

  const remover = useCallback((tag: string) => {
    onChange(tags.filter((t) => t !== tag))
  }, [tags, onChange])

  return (
    <div className={styles.tagInput}>
      {tags.map((tag) => (
        <span key={tag} className={styles.tagChip}>
          {tag}
          <button
            type="button"
            className={styles.tagRemover}
            onClick={() => remover(tag)}
            aria-label={`Remover tag ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        className={styles.tagInputField}
        placeholder={tags.length === 0 ? 'Adicionar tag...' : ''}
        onKeyDown={handleKeyDown}
        aria-label="Adicionar tag (Enter para confirmar)"
        maxLength={50}
      />
    </div>
  )
}
