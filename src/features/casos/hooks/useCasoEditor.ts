// ============================================================
// useCasoEditor — Hooks de Editor de Caso Clínico
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================

'use client'

import { useState, useTransition } from 'react'
import { criarCaso, criarEvolucao } from '../actions/casoActions'
import type {
  CasoEditorCampos,
  EvolucaoEditorCampos,
  CasoDetalheView,
} from '../types'

// ─────────────────────────────────────────────
// Estado inicial do formulário de caso
// ─────────────────────────────────────────────

const camposCasoVazios = (): CasoEditorCampos => ({
  codigoAnonimizado:  '',
  objetivoPrincipal:  '',
  queixaPrincipal:    '',
  hipoteses:          '',
  observacoesIniciais:'',
  status:             'em_avaliacao',
  tags:               [],
})

const camposEvolucaoVazios = (): EvolucaoEditorCampos => ({
  tipo:                'consulta',
  dataAtendimento:     new Date().toISOString().slice(0, 16), // datetime-local format
  descricao:           '',
  observacoesClinices: '',
  reacoesAdversas:     '',
  satisfacaoPaciente:  '',
  resultados:          '',
  versaoProtocoloId:   '',
})

// ─────────────────────────────────────────────
// useNovoCaso
// ─────────────────────────────────────────────

export function useNovoCaso() {
  const [campos, setCampos] = useState<CasoEditorCampos>(camposCasoVazios())
  const [erro, setErro] = useState<string | null>(null)
  const [registrando, startRegistrando] = useTransition()

  function onSet(patch: Partial<CasoEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
    setErro(null)
  }

  function onSalvar() {
    if (!campos.objetivoPrincipal.trim()) {
      setErro('O objetivo principal é obrigatório.')
      return
    }
    if (!campos.queixaPrincipal.trim()) {
      setErro('A queixa principal é obrigatória.')
      return
    }
    startRegistrando(async () => {
      try {
        await criarCaso({
          codigoAnonimizado:   campos.codigoAnonimizado.trim() || '',
          objetivoPrincipal:   campos.objetivoPrincipal.trim(),
          queixaPrincipal:     campos.queixaPrincipal.trim(),
          hipoteses:           campos.hipoteses.trim(),
          observacoesIniciais: campos.observacoesIniciais.trim(),
          status:              campos.status,
          tags:                campos.tags,
        })
      } catch (e: any) {
        setErro(e.message ?? 'Erro ao registrar caso.')
      }
    })
  }

  return { campos, erro, registrando, onSet, onSalvar }
}

// ─────────────────────────────────────────────
// useNovaEvolucao
// ─────────────────────────────────────────────

export function useNovaEvolucao(caso: CasoDetalheView) {
  const [aberto, setAberto] = useState(false)
  const [campos, setCampos] = useState<EvolucaoEditorCampos>(camposEvolucaoVazios())
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, startSalvando] = useTransition()

  function onSet(patch: Partial<EvolucaoEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
    setErro(null)
  }

  function onSalvar() {
    if (!campos.descricao.trim()) {
      setErro('A descrição da evolução é obrigatória.')
      return
    }
    if (!campos.dataAtendimento) {
      setErro('A data do atendimento é obrigatória.')
      return
    }

    const satisfacao = campos.satisfacaoPaciente
      ? parseInt(campos.satisfacaoPaciente, 10)
      : null

    startSalvando(async () => {
      const resultado = await criarEvolucao({
        casoId:              caso.id,
        tipo:                campos.tipo,
        dataAtendimento:     campos.dataAtendimento,
        descricao:           campos.descricao.trim(),
        observacoesClinices: campos.observacoesClinices.trim(),
        reacoesAdversas:     campos.reacoesAdversas.trim(),
        satisfacaoPaciente:  satisfacao,
        resultados:          campos.resultados.trim(),
        versaoProtocoloId:   campos.versaoProtocoloId || null,
      })

      if (!resultado.ok) {
        setErro(resultado.erro ?? 'Erro ao registrar evolução.')
        return
      }

      // Limpar e fechar
      setCampos(camposEvolucaoVazios())
      setAberto(false)
    })
  }

  return { aberto, setAberto, campos, erro, salvando, onSet, onSalvar }
}

// ─────────────────────────────────────────────
// useAcoesCaso
// ─────────────────────────────────────────────

export function useAcoesCaso(casoId: string, favoritoInicial: boolean) {
  const [favorito, setFavorito] = useState(favoritoInicial)

  async function onFavoritar(novoValor: boolean) {
    setFavorito(novoValor) // optimistic
    const { favoritarCaso } = await import('../actions/casoActions')
    const resultado = await favoritarCaso(casoId, novoValor)
    if (!resultado.ok) {
      setFavorito(!novoValor) // reverte
    }
  }

  return { favorito, onFavoritar }
}
