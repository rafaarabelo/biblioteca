import Link from 'next/link'
import { painelHoje } from '@/features/clinica/dados'
import { concluirTarefa, criarTarefa, mudarStatusAgendamento, mudarStatusPedido } from '@/features/clinica/acoes'
import {
  diasDesde,
  fmtData,
  fmtDataCurta,
  fmtHora,
  pedidoAtrasado,
  somarDias,
  PROXIMA_ACAO_PEDIDO,
  STATUS_AGENDAMENTO,
  TIPOS_AGENDAMENTO,
} from '@/features/clinica/dominio'
import { BotaoAcao, BotaoEnviar, FormAcao } from '@/features/clinica/ui/componentes'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Hoje · Gestão Natural' }

export default async function HojePage() {
  const { hoje, agendaHoje, semRegistro, pedidosAbertos, tarefas, sessoesPendentes } = await painelHoje()

  const pedidosAtrasados = pedidosAbertos.filter((p) => pedidoAtrasado(p))
  const pedidosEmDia = pedidosAbertos.filter((p) => !pedidoAtrasado(p))
  const sessoesSemAgenda = sessoesPendentes.filter((x) => !x.agendada && (x.sessao.dataPrevista ?? '9999') <= somarDias(hoje, 7))
  const tarefasHoje = tarefas.filter((t) => !t.vencimento || t.vencimento <= hoje)
  const tarefasDepois = tarefas.filter((t) => t.vencimento && t.vencimento > hoje)

  const totalPendencias = semRegistro.length + pedidosAtrasados.length + sessoesSemAgenda.length + tarefasHoje.length
  const dataExtenso = new Date(hoje + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long',
  })

  return (
    <div className={s.pagina}>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>Hoje</h1>
          <p className={s.subtitulo} style={{ textTransform: 'capitalize' }}>
            {dataExtenso} · {totalPendencias === 0 ? 'nada pendente' : `${totalPendencias} pendência${totalPendencias > 1 ? 's' : ''}`}
          </p>
        </div>
        <div className={s.acoes}>
          <Link href="/pedidos/novo" className={s.botao}>+ Pedido manipulado</Link>
          <Link href="/agenda#novo" className={s.botaoSec}>+ Agendar</Link>
          <Link href="/pacientes/nova" className={s.botaoSec}>+ Paciente</Link>
        </div>
      </header>

      <div className={s.colunaPrincipal}>
        <div className={s.pilha}>
          {/* Agenda do dia */}
          <section className={s.card}>
            <h2 className={s.cardTitulo}>
              Agenda de hoje <span className={s.contador}>{agendaHoje.length}</span>
            </h2>
            {agendaHoje.length === 0 ? (
              <p className={s.vazio}>Nenhum horário marcado para hoje.</p>
            ) : (
              <ul className={s.lista}>
                {agendaHoje.map((a) => (
                  <li key={a.id} className={s.item}>
                    <span className={s.hora}>{fmtHora(a.inicio)}</span>
                    <div className={s.itemCorpo}>
                      {a.pacienteId ? (
                        <Link href={`/pacientes/${a.pacienteId}`} className={s.itemTitulo}>{a.pacienteNome}</Link>
                      ) : (
                        <span className={s.itemTitulo}>{a.titulo ?? 'Bloqueio'}</span>
                      )}
                      <span className={s.itemMeta}>
                        {TIPOS_AGENDAMENTO[a.tipo]} · {a.modalidade} · {a.duracaoMin} min
                      </span>
                    </div>
                    {a.pacienteId && !a.temAtendimento && a.status !== 'cancelado' && a.status !== 'faltou' ? (
                      <Link
                        href={`/pacientes/${a.pacienteId}?aba=prontuario&agendamento=${a.id}${a.sessaoId ? `&sessao=${a.sessaoId}` : ''}`}
                        className={`${s.botao} ${s.botaoPequeno}`}
                      >
                        Registrar
                      </Link>
                    ) : (
                      <span className={a.temAtendimento ? `${s.chip} ${s.chipOk}` : s.chip}>
                        {a.temAtendimento ? 'Registrado' : STATUS_AGENDAMENTO[a.status]}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Atendimentos que ficaram sem prontuário */}
          {semRegistro.length > 0 && (
            <section className={s.card}>
              <h2 className={s.cardTitulo}>
                Ficou sem registro <span className={`${s.contador} ${s.contadorAlerta}`}>{semRegistro.length}</span>
              </h2>
              <p className={s.dica} style={{ marginBottom: 12 }}>
                Atendimentos dos últimos 7 dias sem prontuário. Registre ou marque falta, pra nada se perder.
              </p>
              <ul className={s.lista}>
                {semRegistro.map((a) => (
                  <li key={a.id} className={s.item} style={{ flexWrap: 'wrap' }}>
                    <div className={s.itemCorpo}>
                      <Link href={`/pacientes/${a.pacienteId}`} className={s.itemTitulo}>{a.pacienteNome}</Link>
                      <span className={s.itemMeta}>{fmtDataCurta(a.inicio)} · {fmtHora(a.inicio)} · {TIPOS_AGENDAMENTO[a.tipo]}</span>
                    </div>
                    <div className={s.acoes}>
                      <Link
                        href={`/pacientes/${a.pacienteId}?aba=prontuario&agendamento=${a.id}${a.sessaoId ? `&sessao=${a.sessaoId}` : ''}`}
                        className={`${s.botao} ${s.botaoPequeno}`}
                      >
                        Registrar
                      </Link>
                      <BotaoAcao acao={mudarStatusAgendamento.bind(null, a.id, 'faltou')} pequeno variante="fantasma">
                        Faltou
                      </BotaoAcao>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Pedidos manipulados como tarefas */}
          <section className={s.card}>
            <h2 className={s.cardTitulo}>
              Pedidos manipulados em aberto
              <span className={`${s.contador} ${pedidosAtrasados.length ? s.contadorAlerta : ''}`}>{pedidosAbertos.length}</span>
            </h2>
            {pedidosAbertos.length === 0 ? (
              <p className={s.vazio}>Nenhum pedido em andamento.</p>
            ) : (
              <ul className={s.lista}>
                {[...pedidosAtrasados, ...pedidosEmDia].map((p) => {
                  const atrasado = pedidoAtrasado(p)
                  return (
                    <li key={p.id} className={s.item} style={{ flexWrap: 'wrap' }}>
                      <div className={s.itemCorpo}>
                        <Link href={`/pedidos/${p.id}`} className={s.itemTitulo}>
                          {PROXIMA_ACAO_PEDIDO[p.status]}
                        </Link>
                        <span className={s.itemMeta}>
                          #{p.numero} · {p.pacienteNome} · {p.itens.map((i) => i.nome).join(', ')}
                        </span>
                        <span className={atrasado ? `${s.chip} ${s.chipAlerta}` : s.chip} style={{ marginTop: 4 }}>
                          parado há {diasDesde(p.statusDesde)} dia{diasDesde(p.statusDesde) === 1 ? '' : 's'}
                          {p.farmacia ? ` · ${p.farmacia}` : ''}
                        </span>
                      </div>
                      <BotaoAcao acao={mudarStatusPedido.bind(null, p.id, 'proximo', undefined)} pequeno>
                        Feito, avançar
                      </BotaoAcao>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          {/* Programas */}
          <section className={s.card}>
            <h2 className={s.cardTitulo}>
              Próximas sessões de programas <span className={s.contador}>{sessoesPendentes.length}</span>
            </h2>
            {sessoesPendentes.length === 0 ? (
              <p className={s.vazio}>Nenhum programa de tratamento ativo.</p>
            ) : (
              <ul className={s.lista}>
                {sessoesPendentes.map((x) => {
                  const atrasada = (x.sessao.dataPrevista ?? '9999') < hoje
                  const faltando = x.sessao.checklist.filter((i) => i.obrigatorio && !i.feito).length
                  return (
                    <li key={x.sessao.id} className={s.item}>
                      <div className={s.itemCorpo}>
                        <Link href={`/programas/${x.programaId}`} className={s.itemTitulo}>
                          {x.pacienteNome} · sessão {x.sessao.numero}/{x.totalSessoes}
                        </Link>
                        <span className={s.itemMeta}>
                          {x.programaNome} · prevista {fmtData(x.sessao.dataPrevista)}
                        </span>
                      </div>
                      {!x.agendada ? (
                        <span className={`${s.chip} ${atrasada ? s.chipAlerta : ''}`}>sem horário</span>
                      ) : faltando > 0 ? (
                        <span className={`${s.chip} ${s.chipTrava}`}>{faltando} trava{faltando > 1 ? 's' : ''}</span>
                      ) : (
                        <span className={`${s.chip} ${s.chipOk}`}>agendada</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Coluna de tarefas */}
        <aside className={s.pilha}>
          <section className={s.card}>
            <h2 className={s.cardTitulo}>
              Tarefas <span className={s.contador}>{tarefas.length}</span>
            </h2>
            <FormAcao acao={criarTarefa} limparAoSalvar>
              <div className={s.campo}>
                <input name="titulo" className={s.input} placeholder="Ex.: mandar orçamento pra Ana" aria-label="Nova tarefa" />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input name="vencimento" type="date" className={s.input} aria-label="Para quando" defaultValue={hoje} />
                <BotaoEnviar>Adicionar</BotaoEnviar>
              </div>
            </FormAcao>
            <ul className={s.lista} style={{ marginTop: 16 }}>
              {[...tarefasHoje, ...tarefasDepois].map((t) => (
                <li key={t.id} className={s.item}>
                  <BotaoAcao acao={concluirTarefa.bind(null, t.id)} variante="fantasma" pequeno>○</BotaoAcao>
                  <div className={s.itemCorpo}>
                    <span className={s.itemTitulo} style={{ whiteSpace: 'normal' }}>{t.titulo}</span>
                    <span className={s.itemMeta}>
                      {t.vencimento ? (t.vencimento < hoje ? `atrasada · ${fmtData(t.vencimento)}` : fmtData(t.vencimento)) : 'sem data'}
                      {t.pacienteNome ? ` · ${t.pacienteNome}` : ''}
                    </span>
                  </div>
                </li>
              ))}
              {tarefas.length === 0 && <li className={s.vazio}>Tudo em dia.</li>}
            </ul>
          </section>

          {sessoesSemAgenda.length > 0 && (
            <section className={s.aviso}>
              <strong>{sessoesSemAgenda.length} sessão(ões)</strong> prevista(s) para os próximos 7 dias ainda sem horário na agenda.
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

