import Link from 'next/link'
import { CATEGORIAS_ITEM, fmtData, pedidoAtrasado, STATUS_PEDIDO, type Pedido } from '../dominio'
import s from './clinica.module.css'

export function chipStatusPedido(p: Pedido) {
  const classe =
    p.status === 'entregue' || p.status === 'historico' ? s.chipOk
      : p.status === 'cancelado' ? ''
        : pedidoAtrasado(p) ? s.chipAlerta
          : s.chipAcento
  return <span className={`${s.chip} ${classe}`}>{STATUS_PEDIDO[p.status]}</span>
}

/** Bloco de fórmulas de um pedido: composição completa, sempre visível. */
export function PedidoFormulas({ pedido, comCabecalho = true }: { pedido: Pedido; comCabecalho?: boolean }) {
  return (
    <article>
      {comCabecalho && (
        <div className={s.registroCabecalho} style={{ justifyContent: 'space-between' }}>
          <Link href={`/pedidos/${pedido.id}`} className={s.itemTitulo}>
            Pedido #{pedido.numero} · {fmtData(pedido.dataPedido)}
            {pedido.farmacia ? ` · ${pedido.farmacia}` : ''}
          </Link>
          {chipStatusPedido(pedido)}
        </div>
      )}
      {pedido.itens.map((it, i) => (
        <div key={it.id ?? i} className={s.formulaBloco}>
          <div className={s.registroCabecalho} style={{ marginBottom: 0 }}>
            <strong>{it.nome}</strong>
            <span className={s.chip}>{CATEGORIAS_ITEM[it.categoria]}</span>
            {it.quantidade && <span className={s.itemMeta}>{it.quantidade}</span>}
          </div>
          <pre className={s.formulaTexto}>{it.formula}</pre>
          {it.posologia && (
            <p className={s.itemMeta} style={{ marginTop: 8 }}>
              <strong>Modo de uso:</strong> {it.posologia}
            </p>
          )}
        </div>
      ))}
    </article>
  )
}
