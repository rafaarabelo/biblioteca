import Link from 'next/link'
import { listarFarmacias, listarPacientes, obterPedido, opcoesAtivos } from '@/features/clinica/dados'
import { hojeISO } from '@/features/clinica/dominio'
import type { PedidoPayload } from '@/features/clinica/acoes'
import { PedidoEditor } from '@/features/clinica/ui/PedidoEditor'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Novo pedido · Gestão Natural' }

export default async function NovoPedidoPage({
  searchParams,
}: {
  searchParams: { paciente?: string; repetir?: string; historico?: string }
}) {
  const [pacientes, farmacias, origem, ativos] = await Promise.all([
    listarPacientes(),
    listarFarmacias(),
    searchParams.repetir ? obterPedido(searchParams.repetir) : Promise.resolve(null),
    opcoesAtivos(),
  ])

  const historico = searchParams.historico === '1'
  const inicial: Partial<PedidoPayload> = origem
    ? {
        pacienteId: origem.pedido.pacienteId,
        farmacia: origem.pedido.farmacia,
        itens: origem.pedido.itens,
        observacoes: origem.pedido.observacoes,
        origemPedidoId: origem.pedido.id,
        dataPedido: hojeISO(),
      }
    : { pacienteId: searchParams.paciente, status: historico ? 'historico' : 'rascunho' }

  return (
    <div className={s.pagina} style={{ maxWidth: 820 }}>
      <Link href="/pedidos" className={s.voltar}>← Pedidos</Link>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>
            {origem ? `Repetir pedido #${origem.pedido.numero}` : historico ? 'Registrar fórmula antiga' : 'Novo pedido manipulado'}
          </h1>
          <p className={s.subtitulo}>
            {historico
              ? 'Para recuperar o que ficou perdido no WhatsApp.'
              : 'Registre aqui primeiro. Depois copie o texto pronto e mande para a farmácia.'}
          </p>
        </div>
      </header>
      <PedidoEditor pacientes={pacientes.map((p) => ({ id: p.id, nome: p.nome }))} farmacias={farmacias} ativos={ativos} inicial={inicial} />
    </div>
  )
}
