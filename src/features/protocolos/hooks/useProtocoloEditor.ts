// ============================================================
// useProtocoloEditor — Hooks de Criação e Edição
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import { useState, useTransition } from 'react'
import { criarProtocolo, criarVersaoProtocolo } from '../actions/protocoloActions'
import type {
  ProtocoloDetalheView,
  ProtocoloEditorCampos,
  FaseEditorCampos,
  CriarProtocoloInput,
  NovaVersaoProtocoloInput,
  MaturidadeProtocolo,
} from '../types'

// ─────────────────────────────────────────────
// Estado inicial do editor
// ─────────────────────────────────────────────

const camposVazios = (): ProtocoloEditorCampos => ({
  titulo: '',
  objetivo: '',
  descricao: '',
  indicacoes: '',
  contraindicacoes: '',
  maturidade: 'hipotese',
  duracaoSemanas: '',
  frequenciaSessoes: '',
  observacoesImportantes: '',
  autor: '',
  motivoAlteracao: '',
  tags: [],
  codigoInterno: '',
  fases: [],
})

// ─────────────────────────────────────────────
// Hook: Novo Protocolo
// ─────────────────────────────────────────────

export function useNovoProtocolo() {
  const [campos, setCampos] = useState<ProtocoloEditorCampos>(camposVazios())
  const [erro, setErro] = useState<string | null>(null)
  const [registrando, startRegistrando] = useTransition()

  function onSet(patch: Partial<ProtocoloEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
  }

  function adicionarFase() {
    const novaFase: FaseEditorCampos = {
      nome: '',
      descricao: '',
      instrucoes: '',
      duracaoSemanas: '',
      ordem: campos.fases.length,
    }
    setCampos((prev) => ({ ...prev, fases: [...prev.fases, novaFase] }))
  }

  function atualizarFase(idx: number, patch: Partial<FaseEditorCampos>) {
    setCampos((prev) => {
      const fases = [...prev.fases]
      fases[idx] = { ...fases[idx]!, ...patch }
      return { ...prev, fases }
    })
  }

  function removerFase(idx: number) {
    setCampos((prev) => ({
      ...prev,
      fases: prev.fases.filter((_, i) => i !== idx).map((f, i) => ({ ...f, ordem: i })),
    }))
  }

  function moverFase(idx: number, direcao: 'cima' | 'baixo') {
    setCampos((prev) => {
      const fases = [...prev.fases]
      const alvo = direcao === 'cima' ? idx - 1 : idx + 1
      if (alvo < 0 || alvo >= fases.length) return prev
      ;[fases[idx], fases[alvo]] = [fases[alvo]!, fases[idx]!]
      return { ...prev, fases: fases.map((f, i) => ({ ...f, ordem: i })) }
    })
  }

  async function onSalvar() {
    setErro(null)

    const input: CriarProtocoloInput = {
      titulo: campos.titulo.trim(),
      objetivo: campos.objetivo.trim(),
      descricao: campos.descricao.trim(),
      indicacoes: campos.indicacoes.trim(),
      contraindicacoes: campos.contraindicacoes.trim(),
      maturidade: campos.maturidade as MaturidadeProtocolo,
      duracaoSemanas: campos.duracaoSemanas ? parseInt(campos.duracaoSemanas, 10) : null,
      frequenciaSessoes: campos.frequenciaSessoes.trim(),
      observacoesImportantes: campos.observacoesImportantes.trim(),
      autor: campos.autor.trim(),
      tags: campos.tags,
      codigoInterno: campos.codigoInterno.trim(),
      fases: campos.fases.map((f) => ({
        nome: f.nome.trim(),
        descricao: f.descricao.trim(),
        instrucoes: f.instrucoes.trim(),
        duracaoSemanas: f.duracaoSemanas ? parseInt(f.duracaoSemanas, 10) : null,
        ordem: f.ordem,
        formulasIndicadas: [],
      })),
    }

    startRegistrando(async () => {
      try {
        await criarProtocolo(input)
        // criarProtocolo redireciona — este trecho só executa em erro
      } catch (err) {
        setErro(err instanceof Error ? err.message : 'Erro ao registrar protocolo')
      }
    })
  }

  return {
    campos,
    erro,
    registrando,
    onSet,
    onSalvar,
    adicionarFase,
    atualizarFase,
    removerFase,
    moverFase,
  }
}

// ─────────────────────────────────────────────
// Hook: Nova Versão (Revisão)
// ─────────────────────────────────────────────

export function useNovaVersaoProtocolo(protocolo: ProtocoloDetalheView) {
  const versaoAtiva = protocolo.versaoAtiva

  const [aberto, setAberto] = useState(false)
  const [campos, setCampos] = useState<ProtocoloEditorCampos>(() => ({
    titulo: versaoAtiva.titulo,
    objetivo: versaoAtiva.objetivo ?? '',
    descricao: versaoAtiva.descricao ?? '',
    indicacoes: versaoAtiva.indicacoes ?? '',
    contraindicacoes: versaoAtiva.contraindicacoes ?? '',
    maturidade: versaoAtiva.maturidade,
    duracaoSemanas: versaoAtiva.duracaoSemanas?.toString() ?? '',
    frequenciaSessoes: versaoAtiva.frequenciaSessoes ?? '',
    observacoesImportantes: versaoAtiva.observacoesImportantes ?? '',
    autor: versaoAtiva.autor ?? '',
    motivoAlteracao: '',
    tags: protocolo.tags,
    codigoInterno: protocolo.codigoInterno ?? '',
    fases: versaoAtiva.fases.map((f) => ({
      id: f.id,
      nome: f.nome,
      descricao: f.descricao ?? '',
      instrucoes: f.instrucoes ?? '',
      duracaoSemanas: f.duracaoSemanas?.toString() ?? '',
      ordem: f.ordem,
    })),
  }))
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, startSalvando] = useTransition()

  function onSet(patch: Partial<ProtocoloEditorCampos>) {
    setCampos((prev) => ({ ...prev, ...patch }))
  }

  function adicionarFase() {
    const novaFase: FaseEditorCampos = {
      nome: '',
      descricao: '',
      instrucoes: '',
      duracaoSemanas: '',
      ordem: campos.fases.length,
    }
    setCampos((prev) => ({ ...prev, fases: [...prev.fases, novaFase] }))
  }

  function atualizarFase(idx: number, patch: Partial<FaseEditorCampos>) {
    setCampos((prev) => {
      const fases = [...prev.fases]
      fases[idx] = { ...fases[idx]!, ...patch }
      return { ...prev, fases }
    })
  }

  function removerFase(idx: number) {
    setCampos((prev) => ({
      ...prev,
      fases: prev.fases.filter((_, i) => i !== idx).map((f, i) => ({ ...f, ordem: i })),
    }))
  }

  function moverFase(idx: number, direcao: 'cima' | 'baixo') {
    setCampos((prev) => {
      const fases = [...prev.fases]
      const alvo = direcao === 'cima' ? idx - 1 : idx + 1
      if (alvo < 0 || alvo >= fases.length) return prev
      ;[fases[idx], fases[alvo]] = [fases[alvo]!, fases[idx]!]
      return { ...prev, fases: fases.map((f, i) => ({ ...f, ordem: i })) }
    })
  }

  async function onSalvar() {
    setErro(null)
    if (!campos.motivoAlteracao.trim()) {
      setErro('A justificativa da revisão é obrigatória.')
      return
    }

    const input: NovaVersaoProtocoloInput = {
      protocoloId: protocolo.id,
      titulo: campos.titulo.trim(),
      objetivo: campos.objetivo.trim(),
      descricao: campos.descricao.trim(),
      indicacoes: campos.indicacoes.trim(),
      contraindicacoes: campos.contraindicacoes.trim(),
      maturidade: campos.maturidade as MaturidadeProtocolo,
      duracaoSemanas: campos.duracaoSemanas ? parseInt(campos.duracaoSemanas, 10) : null,
      frequenciaSessoes: campos.frequenciaSessoes.trim(),
      observacoesImportantes: campos.observacoesImportantes.trim(),
      autor: campos.autor.trim(),
      motivoAlteracao: campos.motivoAlteracao.trim(),
      fases: campos.fases.map((f) => ({
        nome: f.nome.trim(),
        descricao: f.descricao.trim(),
        instrucoes: f.instrucoes.trim(),
        duracaoSemanas: f.duracaoSemanas ? parseInt(f.duracaoSemanas, 10) : null,
        ordem: f.ordem,
        formulasIndicadas: [],
      })),
    }

    startSalvando(async () => {
      const result = await criarVersaoProtocolo(input)
      if (!result.ok) {
        setErro(result.erro ?? 'Erro ao salvar revisão')
      } else {
        setAberto(false)
      }
    })
  }

  return {
    aberto,
    setAberto,
    campos,
    erro,
    salvando,
    onSet,
    onSalvar,
    adicionarFase,
    atualizarFase,
    removerFase,
    moverFase,
  }
}

// ─────────────────────────────────────────────
// Hook: Ações do Protocolo (favoritar / arquivar)
// ─────────────────────────────────────────────

export function useAcoesProtocolo(
  protocoloId: string,
  favoritoInicial: boolean,
) {
  const [favorito, setFavorito] = useState(favoritoInicial)
  const [, startTransition] = useTransition()

  function toggleFavorito() {
    const novoValor = !favorito
    setFavorito(novoValor)  // optimistic
    startTransition(async () => {
      const { favoritarProtocolo } = await import('../actions/protocoloActions')
      const result = await favoritarProtocolo(protocoloId, novoValor)
      if (!result.ok) setFavorito(favorito)  // reverter
    })
  }

  return { favorito, toggleFavorito }
}
