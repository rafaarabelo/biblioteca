// ============================================================
// useReferenciaEditor — Hooks de editor do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

'use client'

import { useState, useCallback, useTransition } from 'react'
import {
  criarReferencia,
  atualizarReferencia,
  favoritarReferencia,
  arquivarReferencia,
} from '../actions/acervoActions'
import type {
  CriarReferenciaInput,
  AtualizarReferenciaInput,
  ReferenciaDetalheView,
  TipoEstudo,
  NivelEvidencia,
} from '../types'

// ─────────────────────────────────────────────
// Nova Referência
// ─────────────────────────────────────────────

interface NovaReferenciaState {
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
  registrando: boolean
}

const estadoInicial: NovaReferenciaState = {
  titulo: '',
  autores: [],
  anoPublicacao: null,
  journal: '',
  doi: '',
  pmid: '',
  url: '',
  abstract: '',
  tipoEstudo: null,
  nivelEvidencia: null,
  conclusoesPrincipais: '',
  limitacoes: '',
  notasPessoais: '',
  tags: [],
  erro: null,
  registrando: false,
}

export function useNovaReferencia() {
  const [estado, setEstado] = useState<NovaReferenciaState>(estadoInicial)

  const set = useCallback(<K extends keyof NovaReferenciaState>(
    campo: K,
    valor: NovaReferenciaState[K]
  ) => {
    setEstado((prev) => ({ ...prev, [campo]: valor, erro: null }))
  }, [])

  const registrar = useCallback(async () => {
    if (!estado.titulo.trim()) {
      setEstado((prev) => ({ ...prev, erro: 'O título é obrigatório.' }))
      return
    }

    setEstado((prev) => ({ ...prev, registrando: true, erro: null }))

    const input: CriarReferenciaInput = {
      titulo: estado.titulo.trim(),
      autores: estado.autores.filter(Boolean),
      anoPublicacao: estado.anoPublicacao,
      journal: estado.journal.trim() || undefined,
      doi: estado.doi.trim() || undefined,
      pmid: estado.pmid.trim() || undefined,
      url: estado.url.trim() || undefined,
      abstract: estado.abstract.trim() || undefined,
      tipoEstudo: estado.tipoEstudo ?? undefined,
      nivelEvidencia: estado.nivelEvidencia ?? undefined,
      conclusoesPrincipais: estado.conclusoesPrincipais.trim() || undefined,
      limitacoes: estado.limitacoes.trim() || undefined,
      notasPessoais: estado.notasPessoais.trim() || undefined,
      tags: estado.tags,
    }

    try {
      await criarReferencia(input)
      // criarReferencia faz redirect — não chega aqui em sucesso
    } catch (err) {
      setEstado((prev) => ({
        ...prev,
        registrando: false,
        erro: err instanceof Error ? err.message : 'Erro ao registrar referência',
      }))
    }
  }, [estado])

  return { estado, set, registrar }
}

// ─────────────────────────────────────────────
// Editar Referência existente
// ─────────────────────────────────────────────

interface EdicaoState {
  aberta: boolean
  erro: string | null
  salvando: boolean
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
}

export function useEditarReferencia(referencia: ReferenciaDetalheView) {
  const [pending, startTransition] = useTransition()
  const [estado, setEstado] = useState<EdicaoState>({
    aberta: false,
    erro: null,
    salvando: false,
    titulo: referencia.titulo,
    autores: referencia.autores,
    anoPublicacao: referencia.anoPublicacao,
    journal: referencia.journal ?? '',
    doi: referencia.doi ?? '',
    pmid: referencia.pmid ?? '',
    url: referencia.url ?? '',
    abstract: referencia.abstract ?? '',
    tipoEstudo: referencia.tipoEstudo,
    nivelEvidencia: referencia.nivelEvidencia,
    conclusoesPrincipais: referencia.conclusoesPrincipais ?? '',
    limitacoes: referencia.limitacoes ?? '',
    notasPessoais: referencia.notasPessoais ?? '',
    tags: referencia.tags,
  })

  const abrir = () => setEstado((prev) => ({ ...prev, aberta: true }))
  const fechar = () => setEstado((prev) => ({ ...prev, aberta: false, erro: null }))

  const set = useCallback(<K extends keyof EdicaoState>(campo: K, valor: EdicaoState[K]) => {
    setEstado((prev) => ({ ...prev, [campo]: valor, erro: null }))
  }, [])

  const salvar = useCallback(() => {
    startTransition(async () => {
      setEstado((prev) => ({ ...prev, salvando: true }))

      const input: AtualizarReferenciaInput = {
        referenciaId: referencia.id,
        titulo: estado.titulo.trim(),
        autores: estado.autores.filter(Boolean),
        anoPublicacao: estado.anoPublicacao,
        journal: estado.journal.trim() || null,
        doi: estado.doi.trim() || null,
        pmid: estado.pmid.trim() || null,
        url: estado.url.trim() || null,
        abstract: estado.abstract.trim() || null,
        tipoEstudo: estado.tipoEstudo,
        nivelEvidencia: estado.nivelEvidencia,
        conclusoesPrincipais: estado.conclusoesPrincipais.trim() || null,
        limitacoes: estado.limitacoes.trim() || null,
        notasPessoais: estado.notasPessoais.trim() || null,
        tags: estado.tags,
      }

      const resultado = await atualizarReferencia(input)
      if (resultado.ok) {
        setEstado((prev) => ({ ...prev, aberta: false, salvando: false }))
      } else {
        setEstado((prev) => ({ ...prev, salvando: false, erro: resultado.erro ?? 'Erro ao salvar' }))
      }
    })
  }, [estado, referencia.id])

  return { estado, abrir, fechar, set, salvar, pending }
}

// ─────────────────────────────────────────────
// Ações rápidas: favoritar, arquivar
// ─────────────────────────────────────────────

export function useAcoesReferencia(referenciaId: string, favoritoInicial: boolean) {
  const [favorito, setFavorito] = useState(favoritoInicial)
  const [pending, startTransition] = useTransition()

  const alternarFavorito = useCallback(() => {
    const novoFavorito = !favorito
    setFavorito(novoFavorito) // optimistic
    startTransition(async () => {
      const resultado = await favoritarReferencia(referenciaId, novoFavorito)
      if (!resultado.ok) setFavorito(favorito) // revert on error
    })
  }, [favorito, referenciaId])

  const arquivar = useCallback(async () => {
    const resultado = await arquivarReferencia(referenciaId)
    return resultado.ok
  }, [referenciaId])

  return { favorito, alternarFavorito, arquivar, pending }
}
