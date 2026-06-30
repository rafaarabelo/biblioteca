// ============================================================
// useObservacaoEditor — Hook do Editor de Observações
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Gerencia o estado do editor: draft, submit, revisão.
// Nunca importa Supabase — usa Server Actions.
// ============================================================

'use client'

import { useState, useCallback, useTransition, useRef } from 'react'
import { criarObservacao, revisarObservacao } from '../actions/cadernoActions'
import type {
  TipoObservacao,
  StatusEpistemicoUI,
  ObservacaoView,
  CriarObservacaoInput,
  RevisarObservacaoInput,
} from '../types'

// ─────────────────────────────────────────────
// Estado do editor
// ─────────────────────────────────────────────

export interface EditorState {
  titulo: string
  tipo: TipoObservacao
  conteudo: string
  statusEpistemico: StatusEpistemicoUI
  justificativa: string
  tags: string[]
  erro: string | null
  salvando: boolean
}

const ESTADO_INICIAL: EditorState = {
  titulo: '',
  tipo: 'observacao',
  conteudo: '',
  statusEpistemico: 'hipotese',
  justificativa: '',
  tags: [],
  erro: null,
  salvando: false,
}

// ─────────────────────────────────────────────
// Hook para criação (página /caderno/nova)
// ─────────────────────────────────────────────

export function useNovaObservacao() {
  const [estado, setEstado] = useState<EditorState>(ESTADO_INICIAL)
  const [pending, startTransition] = useTransition()

  const set = useCallback(<K extends keyof EditorState>(campo: K, valor: EditorState[K]) => {
    setEstado((prev) => ({ ...prev, [campo]: valor, erro: null }))
  }, [])

  const registrar = useCallback(() => {
    if (!estado.titulo.trim() || !estado.conteudo.trim()) {
      setEstado((prev) => ({ ...prev, erro: 'Título e conteúdo são obrigatórios.' }))
      return
    }

    setEstado((prev) => ({ ...prev, salvando: true, erro: null }))

    const input: CriarObservacaoInput = {
      titulo: estado.titulo,
      tipo: estado.tipo,
      conteudo: estado.conteudo,
      statusEpistemico: estado.statusEpistemico,
      tags: estado.tags,
    }

    startTransition(() => {
      // criarObservacao faz redirect internamente — não retorna
      criarObservacao(input).catch((err) => {
        setEstado((prev) => ({
          ...prev,
          salvando: false,
          erro: err instanceof Error ? err.message : 'Erro ao registrar',
        }))
      })
    })
  }, [estado])

  return {
    estado,
    salvando: pending || estado.salvando,
    set,
    registrar,
  }
}

// ─────────────────────────────────────────────
// Hook para revisão (página /caderno/[id])
// ─────────────────────────────────────────────

export interface RevisaoState {
  aberta: boolean
  conteudo: string
  statusEpistemico: StatusEpistemicoUI
  justificativa: string
  erro: string | null
  salvando: boolean
}

export function useRevisarObservacao(observacao: ObservacaoView) {
  const versaoAtual = observacao.versaoAtual
  const [estado, setEstado] = useState<RevisaoState>({
    aberta: false,
    conteudo: versaoAtual?.conteudo ?? '',
    statusEpistemico: observacao.statusEpistemico,
    justificativa: '',
    erro: null,
    salvando: false,
  })
  const [pending, startTransition] = useTransition()

  const abrir = useCallback(() => {
    setEstado((prev) => ({
      ...prev,
      aberta: true,
      conteudo: versaoAtual?.conteudo ?? '',
      statusEpistemico: observacao.statusEpistemico,
      justificativa: '',
      erro: null,
    }))
  }, [versaoAtual, observacao.statusEpistemico])

  const fechar = useCallback(() => {
    setEstado((prev) => ({ ...prev, aberta: false, erro: null }))
  }, [])

  const set = useCallback(<K extends keyof RevisaoState>(campo: K, valor: RevisaoState[K]) => {
    setEstado((prev) => ({ ...prev, [campo]: valor, erro: null }))
  }, [])

  const salvar = useCallback(() => {
    if (!estado.conteudo.trim()) {
      setEstado((prev) => ({ ...prev, erro: 'O conteúdo não pode estar vazio.' }))
      return
    }

    setEstado((prev) => ({ ...prev, salvando: true, erro: null }))

    const input: RevisarObservacaoInput = {
      observacaoId: observacao.id,
      conteudo: estado.conteudo,
      statusEpistemico: estado.statusEpistemico,
      justificativa: estado.justificativa || undefined,
    }

    startTransition(async () => {
      const resultado = await revisarObservacao(input)
      if (resultado.ok) {
        setEstado((prev) => ({ ...prev, aberta: false, salvando: false, erro: null }))
      } else {
        setEstado((prev) => ({
          ...prev,
          salvando: false,
          erro: resultado.erro ?? 'Erro ao revisar',
        }))
      }
    })
  }, [estado, observacao.id])

  return {
    estado,
    salvando: pending || estado.salvando,
    abrir,
    fechar,
    set,
    salvar,
  }
}

// ─────────────────────────────────────────────
// Hook para ações rápidas (favoritar, arquivar)
// ─────────────────────────────────────────────

export function useAcoesObservacao(observacaoId: string) {
  const [favorito, setFavorito] = useState(false)
  const [arquivado, setArquivado] = useState(false)
  const [pending, startTransition] = useTransition()
  const { favoritarObservacao, arquivarObservacao, duplicarObservacao } =
    require('../actions/cadernoActions') as typeof import('../actions/cadernoActions')

  const alternarFavorito = useCallback((valorAtual: boolean) => {
    const novoValor = !valorAtual
    setFavorito(novoValor) // otimista
    startTransition(async () => {
      const resultado = await favoritarObservacao(observacaoId, novoValor)
      if (!resultado.ok) setFavorito(valorAtual) // revert
    })
  }, [observacaoId, favoritarObservacao])

  const arquivar = useCallback(() => {
    setArquivado(true) // otimista
    startTransition(async () => {
      const resultado = await arquivarObservacao(observacaoId)
      if (!resultado.ok) setArquivado(false) // revert
    })
  }, [observacaoId, arquivarObservacao])

  const duplicar = useCallback(async () => {
    return duplicarObservacao(observacaoId)
  }, [observacaoId, duplicarObservacao])

  return {
    favorito,
    arquivado,
    pending,
    alternarFavorito,
    arquivar,
    duplicar,
  }
}
