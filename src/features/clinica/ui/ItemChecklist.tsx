'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { marcarItemChecklist } from '../acoes'
import type { ItemChecklist as Item } from '../dominio'
import s from './clinica.module.css'

export function ItemChecklist({
  item,
  sessaoId,
  programaId,
  bloqueado,
}: {
  item: Item
  sessaoId: string
  programaId: string
  bloqueado: boolean
}) {
  const [feito, setFeito] = useState(item.feito)
  const [, iniciar] = useTransition()
  const router = useRouter()
  return (
    <li>
      <label className={s.checkLinha} style={{ cursor: bloqueado ? 'default' : 'pointer' }}>
        <input
          type="checkbox"
          checked={feito}
          disabled={bloqueado}
          onChange={(e) => {
            const v = e.target.checked
            iniciar(async () => {
              setFeito(v)
              const r = await marcarItemChecklist(sessaoId, programaId, item.chave, v)
              if (r?.erro) setFeito(!v)
              router.refresh()
            })
          }}
        />
        <span style={{ textDecoration: feito ? 'line-through' : 'none', opacity: feito ? 0.7 : 1 }}>{item.label}</span>
        {item.obrigatorio && !feito && <span className={s.cadeado}>🔒 trava</span>}
      </label>
    </li>
  )
}
