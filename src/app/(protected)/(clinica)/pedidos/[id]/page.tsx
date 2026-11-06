import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obterPedido } from '@/features/clinica/dados'
import { mudarStatusPedido } from '@/features/clinica/acoes'
import {
  diasDesde,
  fmtData,
  fmtHora,
  fmtMoeda,
  FLUXO_PEDIDO,
  linkWhatsApp,
  proximoStatusPedido,
  PROXIMA_ACAO_PEDIDO,
  STATUS_PEDIDO,
  STATUS_PEDIDO_ENCERRADO,
  textoPedidoFarmacia,
  textoPedidoPaciente,
} from '@/features/clinica/dominio'
import { BotaoAcao, BotaoCopiar } from '@/features/clinica/ui/componentes'
import { chipStatusPedido, PedidoFormulas } from '@/features/clinica/ui/PedidoFormulas'
import { NotaPedido } from '@/features/clinica/ui/NotaPedido'
import s from '@/features/clinica/ui/clinica.module.css'

export default async function PedidoPage({ params }: { params: { id: string } }) {
  const r = await obterPedido(params.id)
  if (!r) notFound()
  const { pedido: p, eventos } = r
  const encerrado = STATUS_PEDIDO_ENCERRADO.includes(p.status)
  const proximo = proximoStatusPedido(p.status)
  const etapaAtual = FLUXO_PEDIDO.indexOf(p.status)
  const textoFarmacia = textoPedidoFarmacia(p)
  const textoPaciente = textoPedidoPaciente(p)

  return (
    <div className={s.pagina}>
      <Link href="/pedidos" className={s.voltar}>← Pedidos</Link>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>Pedido #{p.numero}</h1>
          <p className={s.subtitulo}>
            <Link href={`/pacientes/${p.pacienteId}?aba=formulas`}>{p.pacienteNome}</Link> · {fmtData(p.dataPedido)}
            {p.farmacia ? ` · ${p.farmacia}` : ''}
          </p>
        </div>
        <div className={s.acoes}>
          {chipStatusPedido(p)}
          <Link href={`/pedidos/${p.id}/editar`} className={s.botaoSec}>Editar</Link>
          <Link href={`/pedidos/novo?repetir=${p.id}`} className={s.botaoSec}>Repetir</Link>
        </div>
      </header>

      <div className={s.colunaPrincipal}>
        <div className={s.pilha}>
          {!encerrado && (
            <section className={s.card}>
              <h2 className={s.cardTitulo}>Próximo passo</h2>
              <div className={s.etapas} aria-hidden="true">
                {FLUXO_PEDIDO.map((st, i) => (
                  <div key={st} className={`${s.etapa} ${i <= etapaAtual ? s.etapaFeita : ''}`} title={STATUS_PEDIDO[st]} />
                ))}
              </div>
              <p style={{ fontSize: 18, fontWeight: 500, margin: '8px 0' }}>{PROXIMA_ACAO_PEDIDO[p.status]}</p>
              <p className={s.itemMeta}>
                Em “{STATUS_PEDIDO[p.status]}” há {diasDesde(p.statusDesde)} dia(s).
              </p>
              <div className={s.acoes} style={{ marginTop: 12 }}>
                {proximo && (
                  <BotaoAcao acao={mudarStatusPedido.bind(null, p.id, 'proximo', undefined)} variante="principal">
                    Feito → {STATUS_PEDIDO[proximo]}
                  </BotaoAcao>
                )}
                <BotaoAcao
                  acao={mudarStatusPedido.bind(null, p.id, 'cancelado', undefined)}
                  variante="perigo"
                  confirmar="Cancelar este pedido?"
                >
                  Cancelar pedido
                </BotaoAcao>
              </div>
            </section>
          )}

          <section className={s.card}>
            <h2 className={s.cardTitulo}>Fórmulas</h2>
            <PedidoFormulas pedido={p} comCabecalho={false} />
            {p.observacoes && <p className={s.aviso} style={{ marginTop: 12 }}>{p.observacoes}</p>}
          </section>

          <section className={s.card}>
            <h2 className={s.cardTitulo}>Mandar pelo WhatsApp</h2>
            <p className={s.dica} style={{ marginBottom: 12 }}>
              O pedido já está salvo aqui. O WhatsApp vira só o meio de envio, não o lugar onde a fórmula mora.
            </p>
            <div className={s.grade}>
              <div>
                <p className={s.rotulo}>Para a farmácia</p>
                <pre className={`${s.formulaBloco} ${s.formulaTexto}`}>{textoFarmacia}</pre>
                <div className={s.acoes} style={{ marginTop: 8 }}>
                  <BotaoCopiar texto={textoFarmacia} rotulo="Copiar texto" />
                  <a className={s.botaoSec} href={linkWhatsApp(null, textoFarmacia)} target="_blank" rel="noreferrer">Abrir no WhatsApp</a>
                </div>
              </div>
              <div>
                <p className={s.rotulo}>Para a paciente</p>
                <pre className={`${s.formulaBloco} ${s.formulaTexto}`}>{textoPaciente}</pre>
                <div className={s.acoes} style={{ marginTop: 8 }}>
                  <BotaoCopiar texto={textoPaciente} rotulo="Copiar texto" />
                  {p.pacienteTelefone && (
                    <a className={s.botaoSec} href={linkWhatsApp(p.pacienteTelefone, textoPaciente)} target="_blank" rel="noreferrer">
                      Enviar para {p.pacienteNome.split(' ')[0]}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className={s.pilha}>
          <section className={s.card}>
            <h2 className={s.cardTitulo}>Detalhes</h2>
            <dl className={s.dados}>
              <dt>Farmácia</dt><dd>{p.farmacia ?? '·'}</dd>
              <dt>Valor</dt><dd>{fmtMoeda(p.valor)}</dd>
              <dt>Previsão</dt><dd>{fmtData(p.previsaoEntrega)}</dd>
              {p.origemPedidoId && (<><dt>Repete</dt><dd><Link href={`/pedidos/${p.origemPedidoId}`}>pedido anterior</Link></dd></>)}
            </dl>
          </section>

          <section className={s.card}>
            <h2 className={s.cardTitulo}>Linha do tempo</h2>
            <ul className={s.lista}>
              {eventos.map((e, i) => (
                <li key={i} className={s.item} style={{ alignItems: 'flex-start' }}>
                  <div className={s.itemCorpo}>
                    <span className={s.itemTitulo} style={{ whiteSpace: 'normal' }}>{e.nota ?? STATUS_PEDIDO[e.status]}</span>
                    <span className={s.itemMeta}>{fmtData(e.criadoEm)} · {fmtHora(e.criadoEm)}</span>
                  </div>
                </li>
              ))}
            </ul>
            <NotaPedido pedidoId={p.id} />
          </section>
        </aside>
      </div>
    </div>
  )
}
