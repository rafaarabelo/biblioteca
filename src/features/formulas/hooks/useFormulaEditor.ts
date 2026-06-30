// ============================================================
// useFormulaEditor — Hooks de Editor de Fórmulas
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo V
// ============================================================

'use client'

import { useState, useTransition, useCallback } from 'react'
import { criarFormula, criarNovaVersao, getAtivosDisponiveisFormula } from '../actions/formulaActions'
import type {
  FormulaEditorCampos,
  VersaoEditorCampos,
  IngredienteEditorItem,
  FormulaDetalheView,
  FaseIncorporacao,
  AtivoDisponivel,
} from '../types'

// ── Helpers ─────────────────────────────────────────────────

function camposVazios(): FormulaEditorCampos {
  return {
    codigoInterno:    '',
    titulo:           '',
    objetivo:         '',
    veiculo:          '',
    descricao:        '',
    modoPreparo:      '',
    modoUso:          '',
    instrucoes:       '',
    indicacoes:       '',
    contraindicacoes: '',
    validadeDias:     '',
    tags:             [],
    ingredientes:     [],
  }
}

function versaoVazia(): VersaoEditorCampos {
  return {
    titulo:           '',
    objetivo:         '',
    veiculo:          '',
    descricao:        '',
    modoPreparo:      '',
    modoUso:          '',
    instrucoes:       '',
    indicacoes:       '',
    contraindicacoes: '',
    validadeDias:     '',
    motivoAlteracao:  '',
    ingredientes:     [],
  }
}

function novoIngrediente(ativo: AtivoDisponivel, ordem: number): IngredienteEditorItem {
  return {
    _key:            `tmp-${Date.now()}-${Math.random()}`,
    ativoId:         ativo.id,
    ativoNome:       ativo.nome,
    fase:            'fase_aquosa',
    concentracao:    '',
    unidade:         '%',
    funcaoNaFormula: '',
    observacoes:     '',
    ordem,
  }
}

// ── useNovaFormula ────────────────────────────────────────────

export function useNovaFormula() {
  const [campos, setCampos] = useState<FormulaEditorCampos>(camposVazios())
  const [erro,   setErro]   = useState<string | null>(null)
  const [registrando, startRegistrando] = useTransition()

  function onSet(patch: Partial<FormulaEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
    setErro(null)
  }

  function adicionarIngrediente(ativo: AtivoDisponivel) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, novoIngrediente(ativo, prev.ingredientes.length)],
    }))
  }

  function removerIngrediente(key: string) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes
        .filter((i) => i._key !== key)
        .map((i, idx) => ({ ...i, ordem: idx })),
    }))
  }

  function atualizarIngrediente(key: string, patch: Partial<IngredienteEditorItem>) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.map((i) =>
        i._key === key ? { ...i, ...patch } : i
      ),
    }))
  }

  function onSalvar() {
    if (!campos.titulo.trim()) {
      setErro('O nome da fórmula é obrigatório.')
      return
    }
    if (!campos.objetivo.trim()) {
      setErro('O objetivo clínico é obrigatório. Uma fórmula sem objetivo não é uma hipótese, é ruído.')
      return
    }

    startRegistrando(async () => {
      try {
        await criarFormula({
          codigoInterno:    campos.codigoInterno.trim() || undefined,
          titulo:           campos.titulo.trim(),
          objetivo:         campos.objetivo.trim(),
          veiculo:          campos.veiculo.trim() || undefined,
          descricao:        campos.descricao.trim() || undefined,
          modoPreparo:      campos.modoPreparo.trim() || undefined,
          modoUso:          campos.modoUso.trim() || undefined,
          instrucoes:       campos.instrucoes.trim() || undefined,
          indicacoes:       campos.indicacoes.trim() || undefined,
          contraindicacoes: campos.contraindicacoes.trim() || undefined,
          validadeDias:     campos.validadeDias ? parseInt(campos.validadeDias) : undefined,
          tags:             campos.tags,
          ingredientes:     campos.ingredientes.map((i, idx) => ({
            ativoId:         i.ativoId,
            fase:            i.fase as FaseIncorporacao,
            concentracao:    parseFloat(i.concentracao) || 0,
            unidade:         i.unidade || '%',
            funcaoNaFormula: i.funcaoNaFormula || undefined,
            observacoes:     i.observacoes || undefined,
            ordem:           idx,
          })),
        })
      } catch (e: any) {
        setErro(e.message ?? 'Erro ao registrar fórmula.')
      }
    })
  }

  return {
    campos, erro, registrando,
    onSet, onSalvar,
    adicionarIngrediente, removerIngrediente, atualizarIngrediente,
  }
}

// ── useNovaVersao ─────────────────────────────────────────────

export function useNovaVersao(formula: FormulaDetalheView) {
  const [aberto,  setAberto]  = useState(false)
  const [campos,  setCampos]  = useState<VersaoEditorCampos>(() => {
    // Pré-preencher com dados da versão ativa
    const va = formula.versoes.find((v) => v.status === 'ativa') ?? formula.versoes[0]
    if (!va) return versaoVazia()
    return {
      titulo:           va.titulo,
      objetivo:         va.objetivo ?? '',
      veiculo:          va.veiculo ?? '',
      descricao:        va.descricao ?? '',
      modoPreparo:      va.modoPreparo ?? '',
      modoUso:          va.modoUso ?? '',
      instrucoes:       va.instrucoes ?? '',
      indicacoes:       va.indicacoes ?? '',
      contraindicacoes: va.contraindicacoes ?? '',
      validadeDias:     va.validadeDias?.toString() ?? '',
      motivoAlteracao:  '',
      ingredientes:     va.ingredientes.map((ing) => ({
        _key:            ing.id,
        ativoId:         ing.ativoId,
        ativoNome:       ing.nomeAtivo,
        fase:            ing.fase,
        concentracao:    ing.concentracao.toString(),
        unidade:         ing.unidade,
        funcaoNaFormula: ing.funcaoNaFormula ?? '',
        observacoes:     ing.observacoes ?? '',
        ordem:           ing.ordem,
      })),
    }
  })
  const [erro,    setErro]    = useState<string | null>(null)
  const [salvando, startSalvando] = useTransition()

  function onSet(patch: Partial<VersaoEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
    setErro(null)
  }

  function adicionarIngrediente(ativo: AtivoDisponivel) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: [...prev.ingredientes, novoIngrediente(ativo, prev.ingredientes.length)],
    }))
  }

  function removerIngrediente(key: string) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes
        .filter((i) => i._key !== key)
        .map((i, idx) => ({ ...i, ordem: idx })),
    }))
  }

  function atualizarIngrediente(key: string, patch: Partial<IngredienteEditorItem>) {
    setCampos((prev) => ({
      ...prev,
      ingredientes: prev.ingredientes.map((i) =>
        i._key === key ? { ...i, ...patch } : i
      ),
    }))
  }

  function onSalvar() {
    if (!campos.motivoAlteracao.trim()) {
      setErro('O motivo da alteração é obrigatório. Cada revisão deve ser justificada — essa é a memória da fórmula.')
      return
    }
    if (!campos.titulo.trim()) {
      setErro('O título da versão é obrigatório.')
      return
    }
    if (!campos.objetivo.trim()) {
      setErro('O objetivo clínico é obrigatório.')
      return
    }

    startSalvando(async () => {
      const resultado = await criarNovaVersao({
        formulaId:        formula.id,
        titulo:           campos.titulo.trim(),
        objetivo:         campos.objetivo.trim(),
        veiculo:          campos.veiculo.trim() || undefined,
        descricao:        campos.descricao.trim() || undefined,
        modoPreparo:      campos.modoPreparo.trim() || undefined,
        modoUso:          campos.modoUso.trim() || undefined,
        instrucoes:       campos.instrucoes.trim() || undefined,
        indicacoes:       campos.indicacoes.trim() || undefined,
        contraindicacoes: campos.contraindicacoes.trim() || undefined,
        validadeDias:     campos.validadeDias ? parseInt(campos.validadeDias) : undefined,
        motivoAlteracao:  campos.motivoAlteracao.trim(),
        ingredientes:     campos.ingredientes.map((i, idx) => ({
          ativoId:         i.ativoId,
          fase:            i.fase as FaseIncorporacao,
          concentracao:    parseFloat(i.concentracao) || 0,
          unidade:         i.unidade || '%',
          funcaoNaFormula: i.funcaoNaFormula || undefined,
          observacoes:     i.observacoes || undefined,
          ordem:           idx,
        })),
      })

      if (!resultado.ok) {
        setErro(resultado.erro ?? 'Erro ao criar nova versão.')
        return
      }
      setAberto(false)
    })
  }

  return {
    aberto, setAberto,
    campos, erro, salvando,
    onSet, onSalvar,
    adicionarIngrediente, removerIngrediente, atualizarIngrediente,
  }
}

// ── useAcoesFormula ───────────────────────────────────────────

export function useAcoesFormula(formulaId: string, favoritoInicial: boolean) {
  const [favorito, setFavorito] = useState(favoritoInicial)

  async function onFavoritar(novoValor: boolean) {
    setFavorito(novoValor) // optimistic
    const { favoritarFormula } = await import('../actions/formulaActions')
    const resultado = await favoritarFormula(formulaId, novoValor)
    if (!resultado.ok) {
      setFavorito(!novoValor) // reverte
    }
  }

  return { favorito, onFavoritar }
}

// ── useAtivosSearch ───────────────────────────────────────────

export function useAtivosSearch() {
  const [ativos,   setAtivos]   = useState<AtivoDisponivel[]>([])
  const [busca,    setBusca]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const buscar = useCallback(async (termo: string) => {
    setBusca(termo)
    setLoading(true)
    const resultado = await getAtivosDisponiveisFormula(termo || undefined)
    setAtivos(resultado)
    setLoading(false)
  }, [])

  return { ativos, busca, loading, buscar }
}
