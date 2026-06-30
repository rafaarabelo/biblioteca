// ============================================================
// BilheteAurora — Coordenador
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Gerencia estado e interação. Delega visual aos sub-componentes.
//
// Sprint 4: dados chegam do servidor via prop 'bilhete'.
// O componente não sabe de onde veio o bilhete —
// isso é responsabilidade do MesaService.
//
// Interações (abrir, fechar, marcar como lido) são gerenciadas
// pelo hook useBilhetes, que se comunica via Server Actions.
// ============================================================

'use client'

import { useRef, useEffect } from 'react'
import type { BilheteView } from '@/features/mesa/types'
import { useBilhetes } from '@/features/mesa/hooks/useBilhetes'
import styles from './BilheteAurora.module.css'
import { BilheteAuroraFechado } from './BilheteAuroraFechado'
import { BilheteAuroraAberto } from './BilheteAuroraAberto'

interface BilheteAuroraProps {
  /** Bilhete vindo do servidor via MesaService. null → não renderiza nada. */
  bilhete: BilheteView | null
  className?: string
}

export function BilheteAurora({ bilhete: bilheteInicial, className = '' }: BilheteAuroraProps) {
  const { bilhete, aberto, onAbrir, onFechar } = useBilhetes({ bilhete: bilheteInicial })
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Fechar ao clicar fora
  useEffect(() => {
    if (!aberto) return
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        onFechar()
      }
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [aberto, onFechar])

  // Fechar com Escape
  useEffect(() => {
    if (!aberto) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onFechar()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [aberto, onFechar])

  // Sem bilhete — sem renderização
  // (MesaService retorna null quando não há bilhetes; Empty State fica no page.tsx)
  if (!bilhete) return null

  return (
    <div
      ref={wrapperRef}
      className={[
        styles.wrapper,
        styles.wrapperMounted,
        aberto ? styles.wrapperAberto : '',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div
        className={[styles.bilhete, aberto ? styles.bilheteAberto : ''].filter(Boolean).join(' ')}
        role="button"
        aria-expanded={aberto}
        aria-label={aberto ? 'Bilhete da Aurora — aberto' : 'Ler bilhete da Aurora'}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !aberto && onAbrir()}
      >
        <div className={styles.papel}>
          <div className={styles.margem} aria-hidden="true" />

          <BilheteAuroraFechado
            preview={bilhete.preview}
            escondido={aberto}
            onAbrir={onAbrir}
          />

          <BilheteAuroraAberto
            saudacao={bilhete.saudacao}
            paragrafos={bilhete.paragrafos}
            assinatura={bilhete.assinatura}
            visivel={aberto}
            onFechar={onFechar}
          />

          <div className={styles.canto} aria-hidden="true" />
        </div>
      </div>
    </div>
  )
}
