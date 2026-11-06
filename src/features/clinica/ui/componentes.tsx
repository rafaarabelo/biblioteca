'use client'

// ============================================================
// Gestão Natural — peças de interface reutilizáveis (cliente)
// ============================================================

import { useEffect, useRef, useState, useTransition } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import type { EstadoForm } from '../acoes'
import s from './clinica.module.css'

type AcaoForm = (estado: EstadoForm, fd: FormData) => Promise<EstadoForm>

/** <form> ligado a uma server action, com mensagem de erro e reset no sucesso. */
export function FormAcao({
  acao,
  children,
  limparAoSalvar = false,
  mensagemOk,
  className,
}: {
  acao: AcaoForm
  children: React.ReactNode
  limparAoSalvar?: boolean
  mensagemOk?: string
  className?: string
}) {
  const [estado, despachar] = useFormState(acao, null)
  const ref = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (estado?.ok && limparAoSalvar) ref.current?.reset()
  }, [estado, limparAoSalvar])

  return (
    <form ref={ref} action={despachar} className={className ?? s.form}>
      {children}
      {estado?.erro && <p className={s.avisoTrava} role="alert">{estado.erro}</p>}
      {estado?.ok && mensagemOk && <p className={s.avisoOk} role="status">{mensagemOk}</p>}
    </form>
  )
}

export function BotaoEnviar({
  children,
  variante = 'principal',
}: {
  children: React.ReactNode
  variante?: 'principal' | 'secundario'
}) {
  const { pending } = useFormStatus()
  return (
    <button type="submit" className={variante === 'principal' ? s.botao : s.botaoSec} disabled={pending}>
      {pending ? 'Salvando…' : children}
    </button>
  )
}

/** Botão que chama uma server action já "bindada" e mostra o erro (ex.: trava). */
export function BotaoAcao({
  acao,
  children,
  variante = 'secundario',
  pequeno = false,
  confirmar,
}: {
  acao: () => Promise<{ erro?: string; ok?: boolean } | undefined>
  children: React.ReactNode
  variante?: 'principal' | 'secundario' | 'fantasma' | 'perigo'
  pequeno?: boolean
  confirmar?: string
}) {
  const [pendente, iniciar] = useTransition()
  const [erro, setErro] = useState<string | null>(null)
  const router = useRouter()
  const classe = {
    principal: s.botao,
    secundario: s.botaoSec,
    fantasma: s.botaoFantasma,
    perigo: s.botaoPerigo,
  }[variante]

  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, maxWidth: '100%' }}>
      <button
        type="button"
        className={`${classe} ${pequeno ? s.botaoPequeno : ''}`}
        disabled={pendente}
        onClick={() => {
          if (confirmar && !window.confirm(confirmar)) return
          setErro(null)
          iniciar(async () => {
            const r = await acao()
            if (r?.erro) setErro(r.erro)
            else router.refresh()
          })
        }}
      >
        {pendente ? '…' : children}
      </button>
      {erro && <span className={s.avisoTrava} role="alert">{erro}</span>}
    </span>
  )
}

export function BotaoCopiar({ texto, rotulo = 'Copiar' }: { texto: string; rotulo?: string }) {
  const [copiado, setCopiado] = useState(false)
  return (
    <button
      type="button"
      className={s.botaoSec}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(texto)
          setCopiado(true)
          setTimeout(() => setCopiado(false), 2000)
        } catch {
          window.prompt('Copie o texto:', texto)
        }
      }}
    >
      {copiado ? 'Copiado ✓' : rotulo}
    </button>
  )
}
