// ============================================================
// ProtocolEditor — Editor de Protocolo (criação + revisão)
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import type { ProtocoloEditorCampos, FaseEditorCampos, MaturidadeProtocolo } from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'
import styles from './ProtocolEditor.module.css'

const MATURIDADES_ORDEM: MaturidadeProtocolo[] = [
  'hipotese',
  'em_validacao',
  'validado_internamente',
  'consolidado',
  'referencia_biblioteca',
]

// ─────────────────────────────────────────────
// TagInput sub-component
// ─────────────────────────────────────────────

interface TagInputProps {
  tags: string[]
  tagsDisponiveis?: string[]
  onChange: (tags: string[]) => void
}

function TagInput({ tags, tagsDisponiveis = [], onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const [sugestoesVisiveis, setSugestoesVisiveis] = useState(false)

  const sugestoes = tagsDisponiveis.filter(
    (t) => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
  )

  function adicionarTag(tag: string) {
    const normalizada = tag.trim().toLowerCase()
    if (normalizada && !tags.includes(normalizada)) {
      onChange([...tags, normalizada])
    }
    setInput('')
    setSugestoesVisiveis(false)
  }

  function removerTag(tag: string) {
    onChange(tags.filter((t) => t !== tag))
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      adicionarTag(input)
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className={styles.tagWrapper}>
      <div className={styles.chips}>
        {tags.map((tag) => (
          <span key={tag} className={styles.chip}>
            {tag}
            <button
              type="button"
              className={styles.chipRemover}
              onClick={() => removerTag(tag)}
              aria-label={`Remover tag ${tag}`}
            >×</button>
          </span>
        ))}
        <div className={styles.tagInputContainer}>
          <input
            type="text"
            className={styles.tagInput}
            value={input}
            placeholder={tags.length === 0 ? 'Adicionar tag e pressionar Enter...' : ''}
            onChange={(e) => {
              setInput(e.target.value)
              setSugestoesVisiveis(true)
            }}
            onKeyDown={onKeyDown}
            onFocus={() => setSugestoesVisiveis(true)}
            onBlur={() => setTimeout(() => setSugestoesVisiveis(false), 150)}
          />
          {sugestoesVisiveis && sugestoes.length > 0 && (
            <ul className={styles.sugestoes} role="listbox">
              {sugestoes.slice(0, 8).map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    className={styles.sugestaoItem}
                    onMouseDown={() => adicionarTag(s)}
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
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FaseEditor sub-component
// ─────────────────────────────────────────────

interface FaseEditorProps {
  fase: FaseEditorCampos
  idx: number
  totalFases: number
  onChange: (patch: Partial<FaseEditorCampos>) => void
  onRemover: () => void
  onMover: (direcao: 'cima' | 'baixo') => void
}

function FaseEditor({ fase, idx, totalFases, onChange, onRemover, onMover }: FaseEditorProps) {
  return (
    <div className={styles.fase}>
      <div className={styles.faseCabecalho}>
        <span className={styles.faseNumero}>{idx + 1}</span>
        <div className={styles.faseControles}>
          {idx > 0 && (
            <button type="button" className={styles.faseMover} onClick={() => onMover('cima')}
              aria-label="Mover fase para cima">↑</button>
          )}
          {idx < totalFases - 1 && (
            <button type="button" className={styles.faseMover} onClick={() => onMover('baixo')}
              aria-label="Mover fase para baixo">↓</button>
          )}
          <button type="button" className={styles.faseRemover} onClick={onRemover}
            aria-label="Remover fase">×</button>
        </div>
      </div>

      <div className={styles.faseGrid}>
        <div className={styles.campo}>
          <label className={styles.label}>Nome da fase *</label>
          <input
            type="text"
            className={styles.input}
            value={fase.nome}
            onChange={(e) => onChange({ nome: e.target.value })}
            placeholder="Ex: Limpeza profunda"
            required
          />
        </div>
        <div className={styles.campo}>
          <label className={styles.label}>Duração (semanas)</label>
          <input
            type="number"
            className={styles.input}
            value={fase.duracaoSemanas}
            onChange={(e) => onChange({ duracaoSemanas: e.target.value })}
            placeholder="Ex: 2"
            min={1}
          />
        </div>
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Descrição</label>
        <textarea
          className={[styles.input, styles.textarea].join(' ')}
          value={fase.descricao}
          onChange={(e) => onChange({ descricao: e.target.value })}
          placeholder="O que acontece nesta fase?"
          rows={2}
        />
      </div>

      <div className={styles.campo}>
        <label className={styles.label}>Instruções técnicas</label>
        <textarea
          className={[styles.input, styles.textarea].join(' ')}
          value={fase.instrucoes}
          onChange={(e) => onChange({ instrucoes: e.target.value })}
          placeholder="Passo a passo, parâmetros, cuidados específicos desta fase..."
          rows={3}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// ProtocolEditor principal
// ─────────────────────────────────────────────

import { useState } from 'react'

interface ProtocolEditorProps {
  campos: ProtocoloEditorCampos
  modoRevisao?: boolean            // true = está criando nova versão
  tagsDisponiveis?: string[]
  erro: string | null
  salvando: boolean
  onSet: (patch: Partial<ProtocoloEditorCampos>) => void
  onSalvar: () => void
  onCancelar?: () => void
  adicionarFase: () => void
  atualizarFase: (idx: number, patch: Partial<FaseEditorCampos>) => void
  removerFase: (idx: number) => void
  moverFase: (idx: number, direcao: 'cima' | 'baixo') => void
}

export function ProtocolEditor({
  campos,
  modoRevisao = false,
  tagsDisponiveis = [],
  erro,
  salvando,
  onSet,
  onSalvar,
  onCancelar,
  adicionarFase,
  atualizarFase,
  removerFase,
  moverFase,
}: ProtocolEditorProps) {
  return (
    <form
      className={styles.form}
      onSubmit={(e) => { e.preventDefault(); onSalvar() }}
      aria-label={modoRevisao ? 'Formulário de revisão do protocolo' : 'Formulário de novo protocolo'}
    >
      {/* ── Identificação ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Identificação</h2>
        <div className={styles.grid2}>
          <div className={[styles.campo, styles.spanFull].join(' ')}>
            <label className={styles.label} htmlFor="titulo">Título do protocolo *</label>
            <input
              id="titulo"
              type="text"
              className={styles.input}
              value={campos.titulo}
              onChange={(e) => onSet({ titulo: e.target.value })}
              placeholder="Ex: Protocolo de Rejuvenescimento com Vitamina C"
              required
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="codigo">Código interno</label>
            <input
              id="codigo"
              type="text"
              className={styles.input}
              value={campos.codigoInterno}
              onChange={(e) => onSet({ codigoInterno: e.target.value })}
              placeholder="Ex: PROT-2026-001"
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="autor">Autor / Responsável</label>
            <input
              id="autor"
              type="text"
              className={styles.input}
              value={campos.autor}
              onChange={(e) => onSet({ autor: e.target.value })}
              placeholder="Ex: Rafa Rabelo"
            />
          </div>
        </div>
      </section>

      {/* ── Conteúdo Clínico ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Conteúdo clínico</h2>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="objetivo">Objetivo clínico *</label>
          <textarea
            id="objetivo"
            className={[styles.input, styles.textarea].join(' ')}
            value={campos.objetivo}
            onChange={(e) => onSet({ objetivo: e.target.value })}
            placeholder="Qual é o propósito clínico deste protocolo?"
            rows={2}
            required
          />
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="descricao">Descrição geral</label>
          <textarea
            id="descricao"
            className={[styles.input, styles.textarea].join(' ')}
            value={campos.descricao}
            onChange={(e) => onSet({ descricao: e.target.value })}
            placeholder="Visão geral do protocolo — contexto, embasamento, mecanismo de ação..."
            rows={4}
          />
        </div>

        <div className={styles.grid2}>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="indicacoes">Indicações</label>
            <textarea
              id="indicacoes"
              className={[styles.input, styles.textarea].join(' ')}
              value={campos.indicacoes}
              onChange={(e) => onSet({ indicacoes: e.target.value })}
              placeholder="Para quais casos este protocolo está indicado?"
              rows={3}
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="contraindicacoes">Contraindicações</label>
            <textarea
              id="contraindicacoes"
              className={[styles.input, styles.textarea].join(' ')}
              value={campos.contraindicacoes}
              onChange={(e) => onSet({ contraindicacoes: e.target.value })}
              placeholder="Quais situações contraindicam este protocolo?"
              rows={3}
            />
          </div>
        </div>

        <div className={styles.grid2}>
          <div className={styles.campo}>
            <label className={styles.label} htmlFor="duracao">Duração total (semanas)</label>
            <input
              id="duracao"
              type="number"
              className={styles.input}
              value={campos.duracaoSemanas}
              onChange={(e) => onSet({ duracaoSemanas: e.target.value })}
              placeholder="Ex: 8"
              min={1}
            />
          </div>

          <div className={styles.campo}>
            <label className={styles.label} htmlFor="frequencia">Frequência das sessões</label>
            <input
              id="frequencia"
              type="text"
              className={styles.input}
              value={campos.frequenciaSessoes}
              onChange={(e) => onSet({ frequenciaSessoes: e.target.value })}
              placeholder="Ex: 1x por semana"
            />
          </div>
        </div>

        <div className={styles.campo}>
          <label className={styles.label} htmlFor="obsImportantes">Observações importantes</label>
          <textarea
            id="obsImportantes"
            className={[styles.input, styles.textarea].join(' ')}
            value={campos.observacoesImportantes}
            onChange={(e) => onSet({ observacoesImportantes: e.target.value })}
            placeholder="Observações clínicas que originaram ou sustentam este protocolo..."
            rows={3}
          />
        </div>
      </section>

      {/* ── Maturidade ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Maturidade epistêmica</h2>
        <div className={styles.maturidadeGrupo} role="radiogroup" aria-label="Nível de maturidade">
          {MATURIDADES_ORDEM.map((m) => {
            const meta = MATURIDADES_PROTOCOLO[m]
            const selecionado = campos.maturidade === m
            return (
              <label
                key={m}
                className={[styles.maturidadeOpcao, selecionado ? styles.maturidadeOpcaoAtiva : ''].filter(Boolean).join(' ')}
              >
                <input
                  type="radio"
                  name="maturidade"
                  value={m}
                  checked={selecionado}
                  onChange={() => onSet({ maturidade: m })}
                  className={styles.radioOculto}
                />
                <span
                  className={styles.maturidadePonto}
                  style={{ backgroundColor: selecionado ? meta.cor : 'var(--superficie-terciaria)' }}
                  aria-hidden="true"
                />
                <div className={styles.maturidadeTexto}>
                  <span className={styles.maturidadeLabel}>{meta.label}</span>
                  <span className={styles.maturidadeDesc}>{meta.descricao}</span>
                </div>
              </label>
            )
          })}
        </div>
      </section>

      {/* ── Fases / Sequência ── */}
      <section className={styles.secao}>
        <div className={styles.secaoCabecalho}>
          <h2 className={styles.secaoTitulo}>Sequência de aplicação</h2>
          <button type="button" className={styles.adicionarFase} onClick={adicionarFase}>
            + Adicionar fase
          </button>
        </div>

        {campos.fases.length === 0 ? (
          <p className={styles.fasesVazio}>
            Nenhuma fase definida. Fases descrevem a sequência de aplicação do protocolo.
          </p>
        ) : (
          <div className={styles.fasesList}>
            {campos.fases.map((fase, idx) => (
              <FaseEditor
                key={idx}
                fase={fase}
                idx={idx}
                totalFases={campos.fases.length}
                onChange={(patch) => atualizarFase(idx, patch)}
                onRemover={() => removerFase(idx)}
                onMover={(dir) => moverFase(idx, dir)}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Tags ── */}
      <section className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Tags</h2>
        <TagInput
          tags={campos.tags}
          tagsDisponiveis={tagsDisponiveis}
          onChange={(tags) => onSet({ tags })}
        />
      </section>

      {/* ── Justificativa (somente em revisão) ── */}
      {modoRevisao && (
        <section className={styles.secao}>
          <h2 className={styles.secaoTitulo}>Justificativa da revisão *</h2>
          <textarea
            id="motivoAlteracao"
            className={[styles.input, styles.textarea].join(' ')}
            value={campos.motivoAlteracao}
            onChange={(e) => onSet({ motivoAlteracao: e.target.value })}
            placeholder="Por que este protocolo está sendo revisado? O que mudou?"
            rows={3}
            required
          />
          <p className={styles.hint}>
            A justificativa fica registrada permanentemente no histórico de versões.
          </p>
        </section>
      )}

      {/* ── Erro ── */}
      {erro && (
        <p className={styles.erro} role="alert">{erro}</p>
      )}

      {/* ── Ações ── */}
      <div className={styles.acoes}>
        {onCancelar && (
          <button type="button" className={styles.cancelar} onClick={onCancelar} disabled={salvando}>
            Cancelar
          </button>
        )}
        <button type="submit" className={styles.salvar} disabled={salvando}>
          {salvando
            ? (modoRevisao ? 'Salvando revisão...' : 'Registrando...')
            : (modoRevisao ? 'Salvar revisão' : 'Registrar protocolo')
          }
        </button>
      </div>
    </form>
  )
}
