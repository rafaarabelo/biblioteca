// ============================================================
// useBilhetes — Hook de interação com Bilhetes Aurora
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Gerencia o estado de UI do bilhete (aberto/fechado, lido).
// Comunica-se com o banco APENAS via Server Actions.
// Nunca importa Supabase. Nunca faz fetch diretamente.
//
// Fluxo: useBilhetes → Server Action → MesaService → Repository → Supabase
// ============================================================

'use client'

import { useState, useCallback, useTransition } from 'react'
import type { BilheteView } from '../types'
import { marcarBilheteComoLido, fixarBilhete, arquivarBilhete } from '../actions/bilheteActions'

interface UseBilhetesProps {
  bilhete: BilheteView | null
}

interface UseBilhetesReturn {
  bilhete: BilheteView | null
  aberto: boolean
  isPending: boolean
  onAbrir: () => void
  onFechar: () => void
  onFixar: () => void
  onArquivar: () => void
}

export function useBilhetes({ bilhete: bilheteInicial }: UseBilhetesProps): UseBilhetesReturn {
  const [aberto, setAberto] = useState(false)
  const [isPending, startTransition] = useTransition()
  // Estado local do bilhete: permite update otimista (marcar como lido imediatamente)
  const [bilhete, setBilhete] = useState<BilheteView | null>(bilheteInicial)

  const onAbrir = useCallback(() => {
    if (!bilhete || aberto) return
    setAberto(true)

    // Marcar como lido otimisticamente + persistir no banco
    if (!bilhete.lido) {
      setBilhete(prev => prev ? { ...prev, lido: true } : prev)
      startTransition(async () => {
        await marcarBilheteComoLido(bilhete.id)
      })
    }
  }, [bilhete, aberto])

  const onFechar = useCallback(() => {
    setAberto(false)
  }, [])

  const onFixar = useCallback(() => {
    if (!bilhete) return
    const novoEstado = !bilhete.fixado
    setBilhete(prev => prev ? { ...prev, fixado: novoEstado } : prev)
    startTransition(async () => {
      await fixarBilhete(bilhete.id, novoEstado)
    })
  }, [bilhete])

  const onArquivar = useCallback(() => {
    if (!bilhete) return
    // Otimisticamente remove o bilhete da view
    setBilhete(null)
    startTransition(async () => {
      await arquivarBilhete(bilhete.id)
    })
  }, [bilhete])

  return {
    bilhete,
    aberto,
    isPending,
    onAbrir,
    onFechar,
    onFixar,
    onArquivar,
  }
}
