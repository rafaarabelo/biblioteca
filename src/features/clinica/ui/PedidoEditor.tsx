'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { checarFormula, salvarPedido, type PedidoPayload } from '../acoes'
import type { AlertaSeguranca } from '../seguranca'
import { CATEGORIAS_ITEM, hojeISO, STATUS_PEDIDO, type CategoriaItem, type PedidoItem, type StatusPedido } from '../dominio'
import s from './clinica.module.css'

export interface AtivoOpcao {
  id: string
  nome: string
  linha: string
  faixa: string | null
  busca: string
}

type Checagem = Awaited<ReturnType<typeof checarFormula>>

const semAcento = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

function BuscaAtivo({ ativos, aoEscolher }: { ativos: AtivoOpcao[]; aoEscolher: (a: AtivoOpcao) => void }) {
  const [termo, setTermo] = useState('')
  const resultados = useMemo(() => {
    const q = semAcento(termo.trim())
    if (q.length < 2) return []
    return ativos.filter((a) => a.busca.includes(q)).slice(0, 8)
  }, [termo, ativos])
  if (ativos.length === 0) return null
  return (
    <div className={`${s.campo} ${s.campoLargo}`}>
      <input
        className={s.input}
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder={`Buscar entre os ${ativos.length} ativos da Biblioteca e inserir na composição`}
        aria-label="Buscar ativo da Biblioteca"
      />
      {resultados.length > 0 && (
        <div className={s.acoes}>
          {resultados.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`${s.botaoSec} ${s.botaoPequeno}`}
              onClick={() => { aoEscolher(a); setTermo('') }}
              title={a.faixa ? `Faixa da Biblioteca: ${a.faixa}` : undefined}
            >
              + {a.linha}{a.faixa ? ` (${a.faixa})` : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function PainelSeguranca({ alertas, detectados, total }: {
  alertas: AlertaSeguranca[]
  detectados: { nome: string; concentracao: number | null }[]
  total: number
}) {
  if (total === 0) return null
  const travas = alertas.filter((a) => a.nivel === 'trava')
  return (
    <section className={s.card} aria-live="polite">
      <h2 className={s.cardTitulo}>
        Conferência com a Biblioteca
        <span className={`${s.contador} ${travas.length ? s.contadorAlerta : ''}`}>{alertas.length}</span>
      </h2>
      {detectados.length === 0 ? (
        <p className={s.vazio}>Nenhum ativo da Biblioteca reconhecido na composição ainda.</p>
      ) : (
        <div className={s.acoes} style={{ marginBottom: 12 }}>
          {detectados.map((d, i) => (
            <span key={i} className={`${s.chip} ${s.chipAcento}`}>
              {d.nome}{d.concentracao !== null ? ` ${String(d.concentracao).replace('.', ',')}%` : ''}
            </span>
          ))}
        </div>
      )}
      {alertas.length === 0 && detectados.length > 0 && (
        <p className={s.avisoOk}>Nada contraindicado para esta paciente nos ativos reconhecidos.</p>
      )}
      <div className={s.pilha} style={{ gap: 8 }}>
        {alertas.map((a, i) => (
          <p key={i} className={a.nivel === 'trava' ? s.avisoTrava : s.aviso}>
            {a.nivel === 'trava' ? '🔒 ' : '⚠ '}<strong>{a.ativo}</strong>: {a.mensagem}
          </p>
        ))}
      </div>
    </section>
  )
}

const itemVazio = (): PedidoItem => ({ categoria: 'cosmetico', nome: '', formula: '', quantidade: '', posologia: '' })

export function PedidoEditor({
  pacientes,
  farmacias,
  ativos = [],
  inicial,
}: {
  pacientes: { id: string; nome: string }[]
  farmacias: string[]
  ativos?: AtivoOpcao[]
  inicial: Partial<PedidoPayload>
}) {
  const [p, setP] = useState<PedidoPayload>({
    pacienteId: inicial.pacienteId ?? '',
    status: inicial.status ?? 'rascunho',
    farmacia: inicial.farmacia ?? '',
    dataPedido: inicial.dataPedido ?? hojeISO(),
    previsaoEntrega: inicial.previsaoEntrega ?? '',
    valor: inicial.valor ?? null,
    observacoes: inicial.observacoes ?? '',
    origemPedidoId: inicial.origemPedidoId ?? null,
    itens: inicial.itens?.length ? inicial.itens.map((i) => ({ ...i, id: undefined })) : [itemVazio()],
    id: inicial.id,
  })
  const [erro, setErro] = useState<string | null>(null)
  const [salvando, iniciar] = useTransition()
  const router = useRouter()
  const historico = p.status === 'historico'
  const [checagem, setChecagem] = useState<Checagem | null>(null)

  // Confere a composição com a Biblioteca enquanto você escreve
  const chaveChecagem = JSON.stringify([p.pacienteId, p.itens.map((i) => i.formula)])
  useEffect(() => {
    if (ativos.length === 0) return
    const t = setTimeout(async () => {
      setChecagem(await checarFormula(p.pacienteId || null, p.itens.map((i) => i.formula)))
    }, 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chaveChecagem, ativos.length])

  const travas = checagem?.alertas.filter((a) => a.nivel === 'trava') ?? []

  const set = <K extends keyof PedidoPayload>(k: K, v: PedidoPayload[K]) => setP((x) => ({ ...x, [k]: v }))
  const setItem = (i: number, campo: keyof PedidoItem, v: string) =>
    setP((x) => ({ ...x, itens: x.itens.map((it, j) => (j === i ? { ...it, [campo]: v } : it)) }))

  function salvar(statusFinal?: StatusPedido) {
    setErro(null)
    if (travas.length > 0 && !window.confirm(
      `A conferência com a Biblioteca encontrou ${travas.length} alerta(s) sério(s):\n\n` +
      travas.map((a) => `• ${a.ativo}: ${a.mensagem}`).join('\n') +
      '\n\nSalvar mesmo assim?',
    )) return
    iniciar(async () => {
      const r = await salvarPedido({ ...p, status: statusFinal ?? p.status })
      if (r.erro) setErro(r.erro)
      else router.push(`/pedidos/${r.id}`)
    })
  }

  return (
    <div className={s.form}>
      <section className={s.card}>
        <h2 className={s.cardTitulo}>Pedido</h2>
        <div className={s.campos}>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Paciente *</span>
            <select className={s.select} value={p.pacienteId} onChange={(e) => set('pacienteId', e.target.value)}>
              <option value="">Escolha…</option>
              {pacientes.map((x) => <option key={x.id} value={x.id}>{x.nome}</option>)}
            </select>
            <span className={s.dica}>Não está na lista? <a href="/pacientes/nova" target="_blank">Cadastre em outra aba</a> e recarregue.</span>
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Farmácia</span>
            <input className={s.input} list="farmacias" value={p.farmacia ?? ''} onChange={(e) => set('farmacia', e.target.value)} />
            <datalist id="farmacias">{farmacias.map((f) => <option key={f} value={f} />)}</datalist>
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>{historico ? 'Data original do pedido' : 'Data do pedido'}</span>
            <input type="date" className={s.input} value={p.dataPedido} onChange={(e) => set('dataPedido', e.target.value)} />
          </label>
          {!historico && (
            <label className={s.campo}>
              <span className={s.rotulo}>Previsão de entrega</span>
              <input type="date" className={s.input} value={p.previsaoEntrega ?? ''} onChange={(e) => set('previsaoEntrega', e.target.value)} />
            </label>
          )}
          <label className={s.campo}>
            <span className={s.rotulo}>Valor (R$)</span>
            <input
              className={s.input}
              inputMode="decimal"
              value={p.valor ?? ''}
              onChange={(e) => {
                const v = e.target.value.replace(',', '.')
                set('valor', v === '' || isNaN(Number(v)) ? null : Number(v))
              }}
            />
          </label>
          {p.id && (
            <label className={s.campo}>
              <span className={s.rotulo}>Status</span>
              <select className={s.select} value={p.status} onChange={(e) => set('status', e.target.value as StatusPedido)}>
                {Object.entries(STATUS_PEDIDO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
          )}
        </div>
        {historico && !p.id && (
          <p className={s.aviso} style={{ marginTop: 12 }}>
            Modo <strong>fórmula antiga</strong>: cole o texto da mensagem do WhatsApp na composição e use a data original.
            O pedido entra direto no histórico da paciente, sem virar tarefa.
          </p>
        )}
      </section>

      {p.itens.map((it, i) => (
        <section key={i} className={s.card}>
          <h2 className={s.cardTitulo}>
            Fórmula {i + 1}
            {p.itens.length > 1 && (
              <button type="button" className={s.botaoFantasma} onClick={() => set('itens', p.itens.filter((_, j) => j !== i))}>
                remover
              </button>
            )}
          </h2>
          <div className={s.campos}>
            <label className={s.campo}>
              <span className={s.rotulo}>Nome *</span>
              <input className={s.input} value={it.nome} onChange={(e) => setItem(i, 'nome', e.target.value)} placeholder="Sérum clareador noturno" />
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Categoria</span>
              <select className={s.select} value={it.categoria} onChange={(e) => setItem(i, 'categoria', e.target.value as CategoriaItem)}>
                {Object.entries(CATEGORIAS_ITEM).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <BuscaAtivo
              ativos={ativos}
              aoEscolher={(a) => setItem(i, 'formula', (it.formula.trim() ? it.formula.replace(/\s*$/, '') + '\n' : '') + a.linha)}
            />
            <label className={`${s.campo} ${s.campoLargo}`}>
              <span className={s.rotulo}>Composição *</span>
              <textarea
                className={`${s.textarea} ${s.textareaFormula}`}
                value={it.formula}
                onChange={(e) => setItem(i, 'formula', e.target.value)}
                placeholder={'Ácido azelaico 10%\nNiacinamida 4%\nSérum base qsp 30 g'}
              />
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Quantidade</span>
              <input className={s.input} value={it.quantidade ?? ''} onChange={(e) => setItem(i, 'quantidade', e.target.value)} placeholder="30 g · 60 cápsulas" />
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Modo de uso</span>
              <input className={s.input} value={it.posologia ?? ''} onChange={(e) => setItem(i, 'posologia', e.target.value)} placeholder="Aplicar à noite, 3x por semana" />
            </label>
          </div>
        </section>
      ))}

      <button type="button" className={s.botaoSec} style={{ alignSelf: 'flex-start' }} onClick={() => set('itens', [...p.itens, itemVazio()])}>
        + Outra fórmula neste pedido
      </button>

      <section className={s.card}>
        <label className={s.campo}>
          <span className={s.rotulo}>Observações</span>
          <textarea className={s.textarea} value={p.observacoes ?? ''} onChange={(e) => set('observacoes', e.target.value)} />
        </label>
      </section>

      {checagem && (
        <PainelSeguranca alertas={checagem.alertas} detectados={checagem.detectados} total={checagem.totalBiblioteca} />
      )}

      {erro && <p className={s.avisoTrava} role="alert">{erro}</p>}

      <div className={s.rodapeForm}>
        <button type="button" className={s.botaoSec} onClick={() => router.back()}>Cancelar</button>
        {p.id || historico ? (
          <button type="button" className={s.botao} disabled={salvando} onClick={() => salvar()}>
            {salvando ? 'Salvando…' : historico && !p.id ? 'Salvar no histórico' : 'Salvar'}
          </button>
        ) : (
          <>
            <button type="button" className={s.botaoSec} disabled={salvando} onClick={() => salvar('rascunho')}>
              Salvar rascunho
            </button>
            <button type="button" className={s.botao} disabled={salvando} onClick={() => salvar('enviado_farmacia')}>
              {salvando ? 'Salvando…' : 'Salvar e marcar como enviado'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
