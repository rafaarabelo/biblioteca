import Link from 'next/link'
import { listarPedidos } from '@/features/clinica/dados'
import { mudarStatusPedido } from '@/features/clinica/acoes'
import {
  diasDesde,
  fmtData,
  FLUXO_PEDIDO,
  pedidoAtrasado,
  PROXIMA_ACAO_PEDIDO,
  STATUS_PEDIDO,
} from '@/features/clinica/dominio'
import { BotaoAcao } from '@/features/clinica/ui/componentes'
import { PedidoFormulas } from '@/features/clinica/ui/PedidoFormulas'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Pedidos manipulados · Gestão Natural' }

export default async function PedidosPage({ searchParams }: { searchParams: { q?: string; ver?: string } }) {
  const busca = searchParams.q?.trim() ?? ''
  const verTodos = searchParams.ver === 'todos'

  if (busca || verTodos) {
    const pedidos = await listarPedidos({ busca })
    return (
      <div className={s.pagina}>
        <Cabecalho />
        <Busca valor={busca} />
        <p className={s.subtitulo} style={{ marginBottom: 16 }}>
          {busca ? `${pedidos.length} pedido(s) com “${busca}”` : `Todos os pedidos (${pedidos.length})`} ·{' '}
          <Link href="/pedidos">voltar ao quadro</Link>
        </p>
        <div className={s.pilha}>
          {pedidos.map((p) => (
            <section key={p.id} className={s.card}>
              <p className={s.itemMeta} style={{ marginBottom: 4 }}>
                <Link href={`/pacientes/${p.pacienteId}?aba=formulas`}>{p.pacienteNome}</Link>
              </p>
              <PedidoFormulas pedido={p} />
            </section>
          ))}
          {pedidos.length === 0 && <p className={s.vazio}>Nada encontrado.</p>}
        </div>
      </div>
    )
  }

  const abertos = await listarPedidos({ abertos: true })
  const colunas = FLUXO_PEDIDO.filter((st) => st !== 'entregue')

  return (
    <div className={s.pagina} style={{ maxWidth: 1400 }}>
      <Cabecalho />
      <Busca valor="" />

      {abertos.length === 0 ? (
        <section className={s.card}>
          <p className={s.vazio}>Nenhum pedido em andamento. <Link href="/pedidos?ver=todos">Ver histórico completo</Link>.</p>
        </section>
      ) : (
        <div className={s.quadro}>
          {colunas.map((st) => {
            const doStatus = abertos.filter((p) => p.status === st)
            return (
              <section key={st} className={s.colunaQuadro} aria-label={STATUS_PEDIDO[st]}>
                <h2 className={s.cardTitulo} style={{ margin: 0 }}>
                  {STATUS_PEDIDO[st]} <span className={s.contador}>{doStatus.length}</span>
                </h2>
                <p className={s.dica}>{PROXIMA_ACAO_PEDIDO[st]}</p>
                {doStatus.map((p) => {
                  const atrasado = pedidoAtrasado(p)
                  const dias = diasDesde(p.statusDesde)
                  return (
                    <article key={p.id} className={`${s.cartao} ${atrasado ? s.cartaoAtrasado : ''}`}>
                      <Link href={`/pedidos/${p.id}`} className={s.itemTitulo}>#{p.numero} · {p.pacienteNome}</Link>
                      <span className={s.itemMeta}>{p.itens.map((i) => i.nome).join(', ')}</span>
                      <span className={s.itemMeta}>
                        {p.farmacia ?? 'farmácia não definida'} · {dias === 0 ? 'hoje' : `há ${dias}d`}
                        {p.previsaoEntrega ? ` · prev. ${fmtData(p.previsaoEntrega)}` : ''}
                      </span>
                      <BotaoAcao acao={mudarStatusPedido.bind(null, p.id, 'proximo', undefined)} pequeno>
                        Avançar →
                      </BotaoAcao>
                    </article>
                  )
                })}
              </section>
            )
          })}
        </div>
      )}
      <p style={{ marginTop: 16 }}>
        <Link href="/pedidos?ver=todos" className={s.botaoFantasma}>Ver histórico completo, incluindo entregues</Link>
      </p>
    </div>
  )
}

function Cabecalho() {
  return (
    <header className={s.cabecalho}>
      <div>
        <h1 className={s.titulo}>Pedidos manipulados</h1>
        <p className={s.subtitulo}>Cada etapa mostra o que falta fazer. Pedido parado demais fica em destaque.</p>
      </div>
      <div className={s.acoes}>
        <Link href="/pedidos/novo" className={s.botao}>+ Novo pedido</Link>
        <Link href="/pedidos/novo?historico=1" className={s.botaoSec}>Registrar fórmula antiga</Link>
      </div>
    </header>
  )
}

function Busca({ valor }: { valor: string }) {
  return (
    <form className={s.busca} role="search">
      <input name="q" defaultValue={valor} className={s.input} placeholder="Buscar nas fórmulas: ácido azelaico, magnésio, sérum…" aria-label="Buscar nas fórmulas" />
      <button className={s.botaoSec} type="submit">Buscar</button>
    </form>
  )
}
