'use client'

// ============================================================
// FormulaEditor — Editor de nova fórmula ou nova versão
// Capítulo V: Fórmulas
// ============================================================
// Não é um formulário de manipulação farmacêutica.
// É o espaço onde uma hipótese clínica ganha composição.
// ============================================================

import { useState } from 'react'
import { useAtivosSearch } from '../hooks/useFormulaEditor'
import { FASE_META } from '../types'
import type {
  FormulaEditorCampos,
  VersaoEditorCampos,
  IngredienteEditorItem,
  AtivoDisponivel,
  FaseIncorporacao,
} from '../types'
import styles from './FormulaEditor.module.css'

// ── Tipos de props ──────────────────────────────────────────

type ModoFormula = {
  modo: 'formula'
  campos: FormulaEditorCampos
  onSet: (patch: Partial<FormulaEditorCampos>) => void
  adicionarIngrediente: (ativo: AtivoDisponivel) => void
  removerIngrediente:   (key: string) => void
  atualizarIngrediente: (key: string, patch: Partial<IngredienteEditorItem>) => void
  onSalvar: () => void
  registrando: boolean
  erro: string | null
}

type ModoVersao = {
  modo: 'versao'
  campos: VersaoEditorCampos
  onSet: (patch: Partial<VersaoEditorCampos>) => void
  adicionarIngrediente: (ativo: AtivoDisponivel) => void
  removerIngrediente:   (key: string) => void
  atualizarIngrediente: (key: string, patch: Partial<IngredienteEditorItem>) => void
  onSalvar: () => void
  salvando: boolean
  erro: string | null
}

type FormulaEditorProps = ModoFormula | ModoVersao

// ── Componente ─────────────────────────────────────────────

export function FormulaEditor(props: FormulaEditorProps) {
  const ehFormula  = props.modo === 'formula'
  const campos     = props.campos as FormulaEditorCampos & VersaoEditorCampos
  const carregando = ehFormula
    ? (props as ModoFormula).registrando
    : (props as ModoVersao).salvando

  const {
    adicionarIngrediente, removerIngrediente, atualizarIngrediente,
    onSalvar, erro
  } = props

  const [buscarAtivo, setBuscarAtivo] = useState('')
  const [mostrarBusca, setMostrarBusca] = useState(false)
  const { ativos, loading: loadingAtivos, buscar } = useAtivosSearch()

  function onBuscarAtivo(termo: string) {
    setBuscarAtivo(termo)
    buscar(termo)
  }

  function onSelecionarAtivo(ativo: AtivoDisponivel) {
    adicionarIngrediente(ativo)
    setBuscarAtivo('')
    setMostrarBusca(false)
  }

  // Tipagem helper para onSet
  function set(patch: Partial<typeof campos>) {
    ;(props.onSet as any)(patch)
  }

  return (
    <div className={styles.editor}>

      {/* Motivo da alteração — só para nova versão */}
      {!ehFormula && (
        <section className={styles.secao}>
          <label className={styles.label}>
            Motivo da alteração <span className={styles.obrigatorio}>*</span>
          </label>
          <textarea
            className={[styles.textarea, styles.motivoDestaque].join(' ')}
            placeholder="Por que esta versão foi criada? Qual conhecimento acumulado justifica a mudança?"
            value={campos.motivoAlteracao ?? ''}
            onChange={(e) => set({ motivoAlteracao: e.target.value })}
            rows={2}
            aria-required="true"
          />
          <span className={styles.ajuda}>
            Este registro é permanente e faz parte da memória da fórmula.
          </span>
        </section>
      )}

      {/* Código interno — só para nova fórmula */}
      {ehFormula && (
        <section className={styles.secao}>
          <label className={styles.label}>Código interno</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ex: FM-001"
            value={(campos as FormulaEditorCampos).codigoInterno ?? ''}
            onChange={(e) => set({ codigoInterno: e.target.value })}
          />
        </section>
      )}

      {/* Título */}
      <section className={styles.secao}>
        <label className={styles.label}>
          Nome da fórmula <span className={styles.obrigatorio}>*</span>
        </label>
        <input
          type="text"
          className={styles.input}
          placeholder="Como esta formulação é reconhecida?"
          value={campos.titulo}
          onChange={(e) => set({ titulo: e.target.value })}
          aria-required="true"
        />
      </section>

      {/* Objetivo */}
      <section className={styles.secao}>
        <label className={styles.label}>
          Objetivo clínico <span className={styles.obrigatorio}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          placeholder="O que esta fórmula se propõe a alcançar? Qual é a hipótese clínica?"
          value={campos.objetivo}
          onChange={(e) => set({ objetivo: e.target.value })}
          rows={2}
          aria-required="true"
        />
      </section>

      {/* Veículo */}
      <section className={styles.secao}>
        <label className={styles.label}>Veículo</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Ex: Sérum aquoso, Creme O/A, Gel aquoso"
          value={campos.veiculo ?? ''}
          onChange={(e) => set({ veiculo: e.target.value })}
        />
      </section>

      {/* Descrição */}
      <section className={styles.secao}>
        <label className={styles.label}>Descrição</label>
        <textarea
          className={styles.textarea}
          placeholder="Contexto clínico, observações gerais sobre esta formulação…"
          value={campos.descricao ?? ''}
          onChange={(e) => set({ descricao: e.target.value })}
          rows={3}
        />
      </section>

      {/* ── Composição ── */}
      <section className={styles.secao}>
        <div className={styles.secaoHeader}>
          <label className={styles.label}>Composição</label>
          <button
            type="button"
            className={styles.botaoAdicionarAtivo}
            onClick={() => setMostrarBusca(true)}
          >
            + Adicionar ativo
          </button>
        </div>

        {/* Busca de ativos */}
        {mostrarBusca && (
          <div className={styles.buscaAtivo}>
            <div className={styles.buscaAtivoInput}>
              <input
                type="search"
                className={styles.input}
                placeholder="Buscar ativo por nome ou INCI…"
                value={buscarAtivo}
                onChange={(e) => onBuscarAtivo(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                className={styles.botaoCancelar}
                onClick={() => { setMostrarBusca(false); setBuscarAtivo('') }}
              >
                Cancelar
              </button>
            </div>
            {loadingAtivos && <p className={styles.buscandoTexto}>Buscando…</p>}
            {!loadingAtivos && ativos.length > 0 && (
              <ul className={styles.listaAtivos}>
                {ativos.map((ativo) => (
                  <li key={ativo.id}>
                    <button
                      type="button"
                      className={styles.ativoOpcao}
                      onClick={() => onSelecionarAtivo(ativo)}
                    >
                      <span className={styles.ativoNome}>{ativo.nome}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {!loadingAtivos && buscarAtivo && ativos.length === 0 && (
              <p className={styles.buscandoTexto}>Nenhum ativo encontrado.</p>
            )}
          </div>
        )}

        {/* Lista de ingredientes */}
        {campos.ingredientes.length === 0 ? (
          <p className={styles.semIngredientes}>Nenhum ativo adicionado ainda.</p>
        ) : (
          <div className={styles.ingredientes}>
            {campos.ingredientes.map((ing) => (
              <div key={ing._key} className={styles.ingredienteItem}>
                {/* Nome (imutável) */}
                <div className={styles.ingredienteNome} title={ing.ativoNome}>
                  {ing.ativoNome}
                </div>

                {/* Fase */}
                <select
                  className={styles.selectPequeno}
                  value={ing.fase}
                  onChange={(e) => atualizarIngrediente(ing._key, { fase: e.target.value as FaseIncorporacao })}
                  aria-label="Fase de incorporação"
                >
                  {Object.entries(FASE_META).map(([val, meta]) => (
                    <option key={val} value={val}>{meta.label}</option>
                  ))}
                </select>

                {/* Concentração */}
                <div className={styles.concGroup}>
                  <input
                    type="number"
                    className={styles.inputPequeno}
                    placeholder="0"
                    min={0}
                    step={0.01}
                    value={ing.concentracao}
                    onChange={(e) => atualizarIngrediente(ing._key, { concentracao: e.target.value })}
                    aria-label="Concentração"
                  />
                  <input
                    type="text"
                    className={styles.inputUnidade}
                    value={ing.unidade}
                    onChange={(e) => atualizarIngrediente(ing._key, { unidade: e.target.value })}
                    aria-label="Unidade"
                    maxLength={4}
                  />
                </div>

                {/* Função */}
                <input
                  type="text"
                  className={styles.inputFuncao}
                  placeholder="Função…"
                  value={ing.funcaoNaFormula}
                  onChange={(e) => atualizarIngrediente(ing._key, { funcaoNaFormula: e.target.value })}
                  aria-label="Função na fórmula"
                />

                {/* Remover */}
                <button
                  type="button"
                  className={styles.botaoRemover}
                  onClick={() => removerIngrediente(ing._key)}
                  aria-label={`Remover ${ing.ativoNome}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modo de preparo */}
      <section className={styles.secao}>
        <label className={styles.label}>Modo de preparo</label>
        <textarea
          className={styles.textarea}
          placeholder="Instruções de manipulação para o farmacêutico…"
          value={campos.modoPreparo ?? ''}
          onChange={(e) => set({ modoPreparo: e.target.value })}
          rows={3}
        />
      </section>

      {/* Modo de uso */}
      <section className={styles.secao}>
        <label className={styles.label}>Modo de uso</label>
        <textarea
          className={styles.textarea}
          placeholder="Como o paciente deve usar este produto…"
          value={campos.modoUso ?? ''}
          onChange={(e) => set({ modoUso: e.target.value })}
          rows={2}
        />
      </section>

      {/* Indicações */}
      <section className={styles.secao}>
        <label className={styles.label}>Indicações clínicas</label>
        <textarea
          className={styles.textarea}
          placeholder="Para quem esta fórmula é indicada?"
          value={campos.indicacoes ?? ''}
          onChange={(e) => set({ indicacoes: e.target.value })}
          rows={2}
        />
      </section>

      {/* Contraindicações */}
      <section className={styles.secao}>
        <label className={styles.label}>Contraindicações</label>
        <textarea
          className={styles.textarea}
          placeholder="Quando NÃO usar…"
          value={campos.contraindicacoes ?? ''}
          onChange={(e) => set({ contraindicacoes: e.target.value })}
          rows={2}
        />
      </section>

      {/* Validade */}
      <section className={styles.secao}>
        <label className={styles.label}>Validade (dias)</label>
        <input
          type="number"
          className={[styles.input, styles.inputPequenoStandalone].join(' ')}
          placeholder="Ex: 90"
          min={1}
          value={campos.validadeDias ?? ''}
          onChange={(e) => set({ validadeDias: e.target.value })}
        />
      </section>

      {/* Tags — só em nova fórmula */}
      {ehFormula && (
        <section className={styles.secao}>
          <label className={styles.label}>Tags</label>
          <input
            type="text"
            className={styles.input}
            placeholder="Ex: clareamento, antienvelhecimento (separadas por vírgula)"
            onBlur={(e) => {
              const tags = e.target.value
                .split(',')
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean)
              set({ tags })
            }}
            defaultValue={(campos as FormulaEditorCampos).tags?.join(', ') ?? ''}
          />
        </section>
      )}

      {/* Erro */}
      {erro && <p className={styles.erro} role="alert">{erro}</p>}

      {/* Ação */}
      <div className={styles.acoes}>
        <button
          type="button"
          className={styles.botaoSalvar}
          onClick={onSalvar}
          disabled={carregando}
          aria-busy={carregando}
        >
          {carregando
            ? (ehFormula ? 'Registrando…' : 'Salvando versão…')
            : (ehFormula ? 'Registrar fórmula' : 'Salvar nova versão')}
        </button>
      </div>
    </div>
  )
}
