'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { registrarFoto } from '../acoes'
import { hojeISO } from '../dominio'
import s from './clinica.module.css'

/** Reduz a foto do celular (que chega com 4–8 MB) para ~1600px JPEG. */
async function comprimir(arquivo: File): Promise<Blob> {
  if (!arquivo.type.startsWith('image/')) return arquivo
  try {
    const bitmap = await createImageBitmap(arquivo)
    const escala = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * escala)
    canvas.height = Math.round(bitmap.height * escala)
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    return await new Promise((ok) => canvas.toBlob((b) => ok(b ?? arquivo), 'image/jpeg', 0.85))
  } catch {
    return arquivo
  }
}

export function FotoUpload({
  tenantId,
  pacienteId,
  sessaoId = null,
  programaId = null,
  momentoPadrao = 'evolucao',
  compacto = false,
}: {
  tenantId: string
  pacienteId: string
  sessaoId?: string | null
  programaId?: string | null
  momentoPadrao?: 'antes' | 'depois' | 'evolucao'
  compacto?: boolean
}) {
  const [momento, setMomento] = useState(momentoPadrao)
  const [regiao, setRegiao] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()

  async function enviar(arquivos: FileList | null) {
    if (!arquivos?.length) return
    setEnviando(true)
    setErro(null)
    try {
      const supabase = createClient()
      for (const arquivo of Array.from(arquivos)) {
        const blob = await comprimir(arquivo)
        const caminho = `${tenantId}/${pacienteId}/${hojeISO()}-${momento}-${crypto.randomUUID()}.jpg`
        const { error } = await supabase.storage.from('fotos-clinicas').upload(caminho, blob, {
          contentType: 'image/jpeg',
        })
        if (error) throw new Error(error.message)
        const r = await registrarFoto({
          pacienteId, sessaoId, programaId, momento,
          regiao: regiao.trim() || null,
          storagePath: caminho,
          tiradaEm: hojeISO(),
        })
        if (r?.erro) throw new Error(r.erro)
      }
      router.refresh()
    } catch (e: any) {
      setErro(e.message ?? 'Não consegui enviar a foto.')
    } finally {
      setEnviando(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className={s.form} style={{ gap: 8 }}>
      {!compacto && (
        <div className={s.campos}>
          <label className={s.campo}>
            <span className={s.rotulo}>Momento</span>
            <select className={s.select} value={momento} onChange={(e) => setMomento(e.target.value as typeof momento)}>
              <option value="antes">Antes</option>
              <option value="evolucao">Evolução</option>
              <option value="depois">Depois</option>
            </select>
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Região / ângulo</span>
            <input className={s.input} value={regiao} onChange={(e) => setRegiao(e.target.value)} placeholder="rosto frontal, perfil esquerdo…" />
          </label>
        </div>
      )}
      <label className={compacto ? `${s.botaoSec} ${s.botaoPequeno}` : s.botao} style={{ alignSelf: 'flex-start' }}>
        {enviando ? 'Enviando…' : compacto ? `📷 Foto ${momento}` : '📷 Tirar ou escolher foto'}
        <input
          ref={input}
          type="file"
          accept="image/*"
          capture="environment"
          multiple={!compacto}
          hidden
          disabled={enviando}
          onChange={(e) => enviar(e.target.files)}
        />
      </label>
      {erro && <p className={s.avisoTrava}>{erro}</p>}
    </div>
  )
}
