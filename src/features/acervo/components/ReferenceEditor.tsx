// ============================================================
// ReferenceEditor — Editor de Referência Científica
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Client Component. Usado tanto para criação (nova) quanto edição.
// Nenhum acesso direto a Supabase — usa hooks de useReferenciaEditor.
// ============================================================

'use client'

import { useState, KeyboardEvent } from 'react'
import { TIPOS_ESTUDO, NIVEIS_EVIDENCIA } from '../types'
import type { TipoEstudo, NivelEvidencia } from '../types'
import styles from './ReferenceEditor.module.css'

// ─────────────────────────────────────────────
// Tipos de props para modo criação vs edição
// ─────────────────────────────────────────────

export interface EditorCampos {
  titulo: string
  autores: string[]
  anoPublicacao: number | null
  journal: string
  doi: string
  pmid: string
  url: string
  abstract: string
  tipoEstudo: TipoEstudo | null
  nivelEvidencia: NivelEvidencia | null
  conclusoesPrincipais: string
  limitacoes: string
  notasPessoais: string
  tags: string[]
  erro: string | null
  registrando?: boolean
  salvando?: boolean
}

interface ReferenceEditorProps {
  campos: EditorCampos
  modoEdicao?: boolean
  tagsDisponiveis?: string[]
  onSet: <K extends keyof EditorCampos>(campo: K, valor: EditorCampos[K]) => void
  onSalvar: () => void
  onCancelar?: () => void
}

const TIPOS_LISTA = Object.entries(TIPOS_ESTUDO) as [TipoEstudo, (typeof TIPOS_ESTUDO)[TipoEstudo]][]
const NIVEIS_LISTA = Object.entries(NIVEIS_EVIDENCIA) as [NivelEvidencia, (typeof NIVEIS_EVIDENCIA)[NivelEvidencia]][]

// ─────────────────────────────────────────────
// Sub-componente: Input de autores (chips)
// ─────────────────────────────────────────────

function AutorInput({
  autores,
  onChange,
}: {
  autores: string[]
  onChange: (a: string[]) => void
}) {
  const [input, setInput] = useState('')

  const adicionar = () => {
    const val = input.trim()
    if (val && !autores.includes(val)) {
      onChange([...autores, val])
    }
    setInput('')
  }

  const remover = (i: number) => onChange(autores.filter((_, idx) => idx !== i))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionar()
    }
  }

  return (
    <div className={styles.chipWrapper}>
      {autores.map((autor, i) => (
        <span key={i} className={styles.chip}>
          {autor}
          <button
            type="button"
            className={styles.chipRemover}
            onClick={() => remover(i)}
            aria-label={`Remover autor ${autor}`}
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        className={styles.chipInput}
        placeholder={autores.length === 0 ? 'Adicionar autor (Enter para confirmar)' : 'Adicionar outro...'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKey}
        onBlur={adicionar}
      />
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-componente: Input de tags (chips)
// ─────────────────────────────────────────────

function TagInput({
  tags,
  sugestoes,
  onChange,
}: {
  tags: string[]
  sugestoes: string[]
  onChange: (t: string[]) => void
}) {
  const [input, setInput] = useState('')

  const adicionar = (val: string) => {
    const normalizado = val.trim().toLowerCase()
    if (normalizado && !tags.includes(normalizado)) {
      onChange([...tags, normalizado])
    }
    setInput('')
  }

  const remover = (i: number) => onChange(tags.filter((_, idx) => idx !== i))

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionar(input)
    }
  }

  const sugestoesFiltradas = sugestoes
    .filter((s) => !tags.includes(s) && s.includes(input.toLowerCase()))
    .slice(0, 6)

  return (
    <div className={styles.tagEditorWrapper}>
      <div className={styles.chipWrapper}>
        {tags.map((tag, i) => (
          <span key={i} className={styles.chipTag}>
            {tag}
            <button
              type="button"
              className={styles.chipRemover}
              onClick={() => remover(i)}
              aria-label={`Remover tag ${tag}`}
            >
              ✕
            </button>
          </span>
        ))}
        <input
          type="text"
          className={styles.chipInput}
          placeholder={tags.length === 0 ? 'Adicionar tag...' : 'Outra tag...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={() => input && adicionar(input)}
        />
      </div>
      {sugestoesFiltradas.length > 0 && input && (
        <div className={styles.sugestoes}>
          {sugestoesFiltradas.map((s) => (
            <button
              key={s}
              type="button"
              className={styles.sugestaoItem}
              onMouseDown={(e) => { e.preventDefault(); adicionar(s) }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Editor principal
// ─────────────────────────────────────────────

export function ReferenceEditor({
  campos,
  modoEdicao,
  tagsDisponiveis = [],
  onSet,
  onSalvar,
  onCancelar,
}: ReferenceEditorProps) {
  const carregando = campos.registrando || campos.salvando

  return (
    <form
      className={styles.form}
      onSubmit={(e) => { e.preventDefault(); onSalvar() }}
      noValidate
    >
      {/* TÍTULO */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-titulo">
          Título <span className={styles.obrigatorio}>*</span>
        </label>
        <input
          id="ref-titulo"
          type="text"
          className={styles.input}
          value={campos.titulo}
          onChange={(e) => onSet('titulo', e.target.value)}
          placeholder="Título completo do artigo ou estudo"
          required
          autoFocus={!modoEdicao}
        />
      </div>

      {/* AUTORES */}
      <div className={styles.campo}>
        <label className={styles.label}>Autores</label>
        <AutorInput autores={campos.autores} onChange={(v) => onSet('autores', v)} />
      </div>

      {/* ANO + JOURNAL */}
      <div className={styles.linha2}>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="ref-ano">Ano</label>
          <input
            id="ref-ano"
            type="number"
            className={styles.input}
            value={campos.anoPublicacao ?? ''}
            onChange={(e) => onSet('anoPublicacao', e.target.value ? Number(e.target.value) : null)}
            placeholder="ex: 2023"
            min={1800}
            max={new Date().getFullYear() + 1}
          />
        </div>
        <div className={[styles.campo, styles.flex2].join(' ')}>
          <label className={styles.label} htmlFor="ref-journal">Periódico</label>
          <input
            id="ref-journal"
            type="text"
            className={styles.input}
            value={campos.journal}
            onChange={(e) => onSet('journal', e.target.value)}
            placeholder="Journal of Cosmetic Science, JAMA..."
          />
        </div>
      </div>

      {/* DOI + PMID + URL */}
      <div className={styles.linha2}>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="ref-doi">DOI</label>
          <input
            id="ref-doi"
            type="text"
            className={styles.input}
            value={campos.doi}
            onChange={(e) => onSet('doi', e.target.value)}
            placeholder="10.1234/exemplo"
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label} htmlFor="ref-pmid">PMID</label>
          <input
            id="ref-pmid"
            type="text"
            className={styles.input}
            value={campos.pmid}
            onChange={(e) => onSet('pmid', e.target.value)}
            placeholder="12345678"
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-url">URL</label>
        <input
          id="ref-url"
          type="url"
          className={styles.input}
          value={campos.url}
          onChange={(e) => onSet('url', e.target.value)}
          placeholder="https://..."
        />
      </div>

      {/* TIPO DE ESTUDO */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-tipo">Tipo de estudo</label>
        <select
          id="ref-tipo"
          className={styles.select}
          value={campos.tipoEstudo ?? ''}
          onChange={(e) => onSet('tipoEstudo', (e.target.value as TipoEstudo) || null)}
        >
          <option value="">Selecionar tipo...</option>
          {TIPOS_LISTA.map(([valor, meta]) => (
            <option key={valor} value={valor}>
              {meta.icone} {meta.label}
            </option>
          ))}
        </select>
      </div>

      {/* NÍVEL DE EVIDÊNCIA */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-nivel">Nível de evidência</label>
        <select
          id="ref-nivel"
          className={styles.select}
          value={campos.nivelEvidencia ?? ''}
          onChange={(e) => onSet('nivelEvidencia', (e.target.value as NivelEvidencia) || null)}
        >
          <option value="">Selecionar nível...</option>
          {NIVEIS_LISTA.map(([valor, meta]) => (
            <option key={valor} value={valor}>
              {meta.abrev} — {meta.label.split(' — ')[1] ?? meta.label}
            </option>
          ))}
        </select>
      </div>

      {/* ABSTRACT */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-abstract">Resumo (abstract)</label>
        <textarea
          id="ref-abstract"
          className={[styles.input, styles.textarea].join(' ')}
          value={campos.abstract}
          onChange={(e) => onSet('abstract', e.target.value)}
          placeholder="Resumo original do artigo..."
          rows={4}
        />
      </div>

      {/* CONCLUSÕES */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-conclusoes">
          Principais conclusões
        </label>
        <textarea
          id="ref-conclusoes"
          className={[styles.input, styles.textarea].join(' ')}
          value={campos.conclusoesPrincipais}
          onChange={(e) => onSet('conclusoesPrincipais', e.target.value)}
          placeholder="O que este estudo concluiu de mais relevante?"
          rows={3}
        />
      </div>

      {/* LIMITAÇÕES */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-limitacoes">Limitações</label>
        <textarea
          id="ref-limitacoes"
          className={[styles.input, styles.textarea].join(' ')}
          value={campos.limitacoes}
          onChange={(e) => onSet('limitacoes', e.target.value)}
          placeholder="Limitações metodológicas ou populacionais..."
          rows={2}
        />
      </div>

      {/* NOTAS PESSOAIS */}
      <div className={styles.campo}>
        <label className={styles.label} htmlFor="ref-notas">Notas pessoais</label>
        <textarea
          id="ref-notas"
          className={[styles.input, styles.textarea].join(' ')}
          value={campos.notasPessoais}
          onChange={(e) => onSet('notasPessoais', e.target.value)}
          placeholder="Sua interpretação, dúvidas, como aplicar na prática..."
          rows={3}
        />
      </div>

      {/* TAGS */}
      <div className={styles.campo}>
        <label className={styles.label}>Tags</label>
        <TagInput
          tags={campos.tags}
          sugestoes={tagsDisponiveis}
          onChange={(v) => onSet('tags', v)}
        />
      </div>

      {/* ERRO */}
      {campos.erro && (
        <div className={styles.erro} role="alert">
          {campos.erro}
        </div>
      )}

      {/* AÇÕES */}
      <div className={styles.acoes}>
        {onCancelar && (
          <button
            type="button"
            className={styles.cancelar}
            onClick={onCancelar}
            disabled={carregando}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className={styles.salvar}
          disabled={carregando || !campos.titulo.trim()}
        >
          {carregando
            ? 'Salvando...'
            : modoEdicao
            ? 'Salvar alterações'
            : 'Registrar referência'}
        </button>
      </div>
    </form>
  )
}
