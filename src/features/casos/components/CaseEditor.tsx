// ============================================================
// CaseEditor — Formulário de criação de caso clínico
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// NUNCA incluir campos de CPF, telefone, nome completo, e-mail.
// O paciente é uma pessoa. O caso é uma história clínica.
// Código anonimizado é a identidade clínica do caso.
// ============================================================

'use client'

import { useRef, useState } from 'react'
import { CaseStatus } from './CaseStatus'
import { STATUS_CASO_META, STATUS_PRINCIPAIS } from '../types'
import type { CasoEditorCampos, StatusCaso } from '../types'
import styles from './CaseEditor.module.css'

interface CaseEditorProps {
  campos: CasoEditorCampos
  erro?: string | null
  registrando?: boolean
  tagsDisponiveis?: string[]
  onSet: (parcial: Partial<CasoEditorCampos>) => void
  onSalvar: () => void
  onCancelar?: () => void
}

// ── Sub-componente: TagInput ──────────────────────────────

interface TagInputProps {
  tags: string[]
  sugestoes: string[]
  onChange: (tags: string[]) => void
}

function TagInput({ tags, sugestoes, onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const [aberto, setAberto] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const tagsFiltradas = sugestoes.filter(
    (s) => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  )

  function adicionarTag(tag: string) {
    const limpa = tag.trim().toLowerCase()
    if (limpa && !tags.includes(limpa)) {
      onChange([...tags, limpa])
    }
    setInput('')
    setAberto(false)
    inputRef.current?.focus()
  }

  function removerTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (input.trim()) adicionarTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
    if (e.key === 'Escape') setAberto(false)
  }

  return (
    <div className={styles.tagWrapper}>
      <div
        className={styles.chips}
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        {tags.map((tag) => (
          <span key={tag} className={styles.chip}>
            {tag}
            <button
              type="button"
              className={styles.chipRemover}
              onClick={(e) => { e.stopPropagation(); removerTag(tag) }}
              aria-label={`Remover tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <div className={styles.tagInputContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.tagInput}
            value={input}
            onChange={(e) => { setInput(e.target.value); setAberto(true) }}
            onFocus={() => setAberto(true)}
            onBlur={() => setTimeout(() => setAberto(false), 150)}
            onKeyDown={onKeyDown}
            placeholder={tags.length === 0 ? 'Adicionar tag...' : ''}
            aria-label="Nova tag"
          />
        </div>
      </div>
      {aberto && tagsFiltradas.length > 0 && (
        <ul className={styles.sugestoes} role="listbox">
          {tagsFiltradas.slice(0, 6).map((s) => (
            <li key={s}>
              <button
                type="button"
                className={styles.sugestaoItem}
                onMouseDown={(e) => { e.preventDefault(); adicionarTag(s) }}
                role="option"
                aria-selected={false}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

// ── Componente principal ──────────────────────────────────

export function CaseEditor({
  campos,
  erro,
  registrando = false,
  tagsDisponiveis = [],
  onSet,
  onSalvar,
  onCancelar,
}: CaseEditorProps) {

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSalvar()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>

      {/* ── Identificação clínica ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Identificação clínica</h2>
        <p className={styles.secaoHint}>
          Use um código que não identifique o paciente. Ex: C2026-001, ACNE-F-30.
        </p>
        <div className={styles.grid2}>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="codigoAnonimizado">
              Código anonimizado
            </label>
            <input
              id="codigoAnonimizado"
              type="text"
              className={styles.input}
              value={campos.codigoAnonimizado}
              onChange={(e) => onSet({ codigoAnonimizado: e.target.value })}
              placeholder="Ex: C2026-001"
              autoComplete="off"
            />
          </div>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="status">
              Status inicial
            </label>
            <div className={styles.statusSelectorWrapper}>
              <select
                id="status"
                className={styles.select}
                value={campos.status}
                onChange={(e) => onSet({ status: e.target.value as StatusCaso })}
              >
                {STATUS_PRINCIPAIS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CASO_META[s].label}
                  </option>
                ))}
              </select>
              <div className={styles.statusPreview}>
                <CaseStatus status={campos.status} compacto />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Queixa e objetivo ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Apresentação clínica</h2>
        <div className={[styles.campo, styles.spanFull].join(' ')}>
          <label className={styles.label} htmlFor="queixaPrincipal">
            Queixa principal <span className={styles.obrigatorio}>*</span>
          </label>
          <textarea
            id="queixaPrincipal"
            className={styles.textarea}
            value={campos.queixaPrincipal}
            onChange={(e) => onSet({ queixaPrincipal: e.target.value })}
            placeholder="O que a pessoa traz como problema principal?"
            rows={3}
            required
          />
        </div>
        <div className={[styles.campo, styles.spanFull].join(' ')}>
          <label className={styles.label} htmlFor="objetivoPrincipal">
            Objetivo clínico <span className={styles.obrigatorio}>*</span>
          </label>
          <input
            id="objetivoPrincipal"
            type="text"
            className={styles.input}
            value={campos.objetivoPrincipal}
            onChange={(e) => onSet({ objetivoPrincipal: e.target.value })}
            placeholder="O que você pretende alcançar com este caso?"
            required
          />
        </div>
      </section>

      {/* ── Hipóteses e contexto ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Hipóteses e contexto</h2>
        <div className={[styles.campo, styles.spanFull].join(' ')}>
          <label className={styles.label} htmlFor="hipoteses">
            Hipóteses diagnósticas
          </label>
          <textarea
            id="hipoteses"
            className={styles.textarea}
            value={campos.hipoteses}
            onChange={(e) => onSet({ hipoteses: e.target.value })}
            placeholder="Quais hipóteses você considera? Qual é a sua leitura clínica inicial?"
            rows={4}
          />
        </div>
        <div className={[styles.campo, styles.spanFull].join(' ')}>
          <label className={styles.label} htmlFor="observacoesIniciais">
            Observações iniciais
          </label>
          <textarea
            id="observacoesIniciais"
            className={styles.textarea}
            value={campos.observacoesIniciais}
            onChange={(e) => onSet({ observacoesIniciais: e.target.value })}
            placeholder="Notas clínicas relevantes antes de iniciar o acompanhamento."
            rows={3}
          />
        </div>
      </section>

      {/* ── Tags ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Classificação</h2>
        <div className={[styles.campo, styles.spanFull].join(' ')}>
          <label className={styles.label}>Tags</label>
          <TagInput
            tags={campos.tags}
            sugestoes={tagsDisponiveis}
            onChange={(tags) => onSet({ tags })}
          />
          <span className={styles.hint}>
            Enter ou vírgula para adicionar. Use para agrupar casos por condição, perfil ou protocolo.
          </span>
        </div>
      </section>

      {/* ── Erro ── */}
      {erro && (
        <p className={styles.erro} role="alert">{erro}</p>
      )}

      {/* ── Ações ── */}
      <div className={styles.acoes}>
        {onCancelar && (
          <button type="button" className={styles.cancelar} onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className={styles.salvar} disabled={registrando}>
          {registrando ? 'Criando caso...' : 'Criar caso clínico'}
        </button>
      </div>
    </form>
  )
}
