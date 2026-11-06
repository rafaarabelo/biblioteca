'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { anotarPedido } from '../acoes'
import s from './clinica.module.css'

export function NotaPedido({ pedidoId }: { pedidoId: string }) {
  const [nota, setNota] = useState('')
  const [pendente, iniciar] = useTransition()
  const router = useRouter()
  return (
    <form
      style={{ display: 'flex', gap: 8, marginTop: 12 }}
      onSubmit={(e) => {
        e.preventDefault()
        if (!nota.trim()) return
        iniciar(async () => {
          const r = await anotarPedido(pedidoId, nota.trim())
          if (!r?.erro) {
            setNota('')
            router.refresh()
          }
        })
      }}
    >
      <input className={s.input} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Anotar: farmácia pediu +2 dias…" aria-label="Anotação" />
      <button className={s.botaoSec} disabled={pendente} type="submit">Anotar</button>
    </form>
  )
}
