import Link from 'next/link'
import { notFound } from 'next/navigation'
import { listarFarmacias, listarPacientes, obterPedido } from '@/features/clinica/dados'
import { PedidoEditor } from '@/features/clinica/ui/PedidoEditor'
import s from '@/features/clinica/ui/clinica.module.css'

export default async function EditarPedidoPage({ params }: { params: { id: string } }) {
  const [r, pacientes, farmacias] = await Promise.all([obterPedido(params.id), listarPacientes(), listarFarmacias()])
  if (!r) notFound()
  const p = r.pedido
  return (
    <div className={s.pagina} style={{ maxWidth: 820 }}>
      <Link href={`/pedidos/${p.id}`} className={s.voltar}>← Pedido #{p.numero}</Link>
      <header className={s.cabecalho}><h1 className={s.titulo}>Editar pedido #{p.numero}</h1></header>
      <PedidoEditor
        pacientes={pacientes.map((x) => ({ id: x.id, nome: x.nome }))}
        farmacias={farmacias}
        inicial={{
          id: p.id, pacienteId: p.pacienteId, status: p.status, farmacia: p.farmacia,
          dataPedido: p.dataPedido, previsaoEntrega: p.previsaoEntrega, valor: p.valor,
          observacoes: p.observacoes, origemPedidoId: p.origemPedidoId, itens: p.itens,
        }}
      />
    </div>
  )
}
