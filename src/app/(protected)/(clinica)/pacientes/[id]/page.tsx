import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ctx,
  listarAtendimentos,
  listarFotos,
  listarPedidos,
  listarProgramas,
  listarTarefasAbertas,
  obterPaciente,
  proximosAgendamentosPaciente,
} from '@/features/clinica/dados'
import { concluirTarefa, criarPrograma, criarTarefa, registrarAtendimento } from '@/features/clinica/acoes'
import {
  fmtData,
  fmtDataCurta,
  fmtHora,
  hojeISO,
  idade,
  linkWhatsApp,
  STATUS_PEDIDO_ENCERRADO,
  STATUS_PROGRAMA,
  TIPOS_AGENDAMENTO,
  TIPOS_ATENDIMENTO,
  type Atendimento,
} from '@/features/clinica/dominio'
import { BotaoAcao, BotaoEnviar, FormAcao } from '@/features/clinica/ui/componentes'
import { FotoUpload } from '@/features/clinica/ui/FotoUpload'
import { chipStatusPedido, PedidoFormulas } from '@/features/clinica/ui/PedidoFormulas'
import s from '@/features/clinica/ui/clinica.module.css'

const ABAS = [
  ['resumo', 'Resumo'],
  ['prontuario', 'Prontuário'],
  ['formulas', 'Fórmulas e pedidos'],
  ['programas', 'Programas'],
  ['fotos', 'Antes e depois'],
] as const

type Aba = (typeof ABAS)[number][0]

export default async function PacientePage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { aba?: string; agendamento?: string; sessao?: string; adendo?: string }
}) {
  const paciente = await obterPaciente(params.id)
  if (!paciente) notFound()

  const aba: Aba = (ABAS.find(([k]) => k === searchParams.aba)?.[0] ?? 'resumo') as Aba
  const anos = idade(paciente.dataNascimento)
  const base = `/pacientes/${paciente.id}`

  const alertas: string[] = []
  if (paciente.gestante) alertas.push('Gestante')
  if (paciente.amamentando) alertas.push('Amamentando')
  paciente.alergias.forEach((a) => alertas.push(`Alergia: ${a}`))
  paciente.medicamentos.forEach((m) => alertas.push(`Usa: ${m}`))

  return (
    <div className={s.pagina}>
      <Link href="/pacientes" className={s.voltar}>← Pacientes</Link>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>{paciente.nome}</h1>
          <p className={s.subtitulo}>
            {[anos !== null ? `${anos} anos` : null, paciente.tipoPele, paciente.fototipo ? `fototipo ${paciente.fototipo}` : null]
              .filter(Boolean).join(' · ') || 'Cadastro básico'}
          </p>
        </div>
        <div className={s.acoes}>
          <Link href={`/pedidos/novo?paciente=${paciente.id}`} className={s.botao}>+ Pedido</Link>
          <Link href={`/agenda?paciente=${paciente.id}#novo`} className={s.botaoSec}>Agendar</Link>
          {paciente.telefone && (
            <a href={linkWhatsApp(paciente.telefone, '')} target="_blank" rel="noreferrer" className={s.botaoSec}>WhatsApp</a>
          )}
          <Link href={`${base}/editar`} className={s.botaoFantasma}>Editar cadastro</Link>
        </div>
      </header>

      {alertas.length > 0 && (
        <div className={s.alertasClinicos} role="note" aria-label="Alertas clínicos">
          {alertas.map((a) => <span key={a} className={`${s.chip} ${s.chipTrava}`}>⚠ {a}</span>)}
        </div>
      )}

      <nav className={s.abas} aria-label="Seções da ficha">
        {ABAS.map(([k, rotulo]) => (
          <Link key={k} href={`${base}?aba=${k}`} className={`${s.aba} ${aba === k ? s.abaAtiva : ''}`} aria-current={aba === k ? 'page' : undefined}>
            {rotulo}
          </Link>
        ))}
      </nav>

      {aba === 'resumo' && <Resumo pacienteId={paciente.id} paciente={paciente} />}
      {aba === 'prontuario' && (
        <Prontuario
          pacienteId={paciente.id}
          agendamentoId={searchParams.agendamento}
          sessaoId={searchParams.sessao}
          adendoDe={searchParams.adendo}
        />
      )}
      {aba === 'formulas' && <Formulas pacienteId={paciente.id} />}
      {aba === 'programas' && <Programas pacienteId={paciente.id} />}
      {aba === 'fotos' && <Fotos pacienteId={paciente.id} />}
    </div>
  )
}

// ── Resumo ─────────────────────────────────────────────────
async function Resumo({ pacienteId, paciente }: { pacienteId: string; paciente: NonNullable<Awaited<ReturnType<typeof obterPaciente>>> }) {
  const [agenda, atendimentos, pedidos, programas, tarefas] = await Promise.all([
    proximosAgendamentosPaciente(pacienteId),
    listarAtendimentos(pacienteId),
    listarPedidos({ pacienteId }),
    listarProgramas({ pacienteId }),
    listarTarefasAbertas(pacienteId),
  ])
  const ultimo = atendimentos[0]
  const ultimoPedido = pedidos[0]
  const pedidosAbertos = pedidos.filter((p) => !STATUS_PEDIDO_ENCERRADO.includes(p.status))
  const programasAtivos = programas.filter((p) => p.status === 'ativo')

  return (
    <div className={s.colunaPrincipal}>
      <div className={s.pilha}>
        <section className={s.card}>
          <h2 className={s.cardTitulo}>
            Último atendimento
            <Link href={`/pacientes/${pacienteId}?aba=prontuario`} className={s.botaoFantasma}>+ Registrar</Link>
          </h2>
          {ultimo ? <Registro a={ultimo} pacienteId={pacienteId} /> : <p className={s.vazio}>Nenhum atendimento registrado ainda.</p>}
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitulo}>
            Fórmulas mais recentes
            <Link href={`/pacientes/${pacienteId}?aba=formulas`} className={s.botaoFantasma}>Ver todas ({pedidos.length})</Link>
          </h2>
          {ultimoPedido ? (
            <>
              <PedidoFormulas pedido={ultimoPedido} />
              <div className={s.acoes} style={{ marginTop: 12 }}>
                <Link href={`/pedidos/novo?repetir=${ultimoPedido.id}`} className={s.botaoSec}>Repetir este pedido</Link>
              </div>
            </>
          ) : (
            <p className={s.vazio}>Nenhuma fórmula registrada.</p>
          )}
        </section>
      </div>

      <aside className={s.pilha}>
        <section className={s.card}>
          <h2 className={s.cardTitulo}>Próximos horários</h2>
          {agenda.length === 0 ? <p className={s.vazio}>Nada agendado.</p> : (
            <ul className={s.lista}>
              {agenda.map((a) => (
                <li key={a.id} className={s.item}>
                  <div className={s.itemCorpo}>
                    <span className={s.itemTitulo}>{fmtDataCurta(a.inicio)} · {fmtHora(a.inicio)}</span>
                    <span className={s.itemMeta}>{TIPOS_AGENDAMENTO[a.tipo]} · {a.modalidade}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {(pedidosAbertos.length > 0 || programasAtivos.length > 0) && (
          <section className={s.card}>
            <h2 className={s.cardTitulo}>Em andamento</h2>
            <ul className={s.lista}>
              {pedidosAbertos.map((p) => (
                <li key={p.id} className={s.item}>
                  <div className={s.itemCorpo}>
                    <Link href={`/pedidos/${p.id}`} className={s.itemTitulo}>Pedido #{p.numero}</Link>
                    <span className={s.itemMeta}>{p.itens.map((i) => i.nome).join(', ')}</span>
                  </div>
                  {chipStatusPedido(p)}
                </li>
              ))}
              {programasAtivos.map((p) => {
                const feitas = p.sessoes.filter((x) => x.status === 'realizada').length
                return (
                  <li key={p.id} className={s.item}>
                    <div className={s.itemCorpo}>
                      <Link href={`/programas/${p.id}`} className={s.itemTitulo}>{p.nome}</Link>
                      <span className={s.itemMeta}>{feitas}/{p.totalSessoes} sessões</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className={s.card}>
          <h2 className={s.cardTitulo}>Tarefas desta paciente</h2>
          <FormAcao acao={criarTarefa} limparAoSalvar>
            <input type="hidden" name="paciente_id" value={pacienteId} />
            <input name="titulo" className={s.input} placeholder="Ex.: cobrar foto do resultado" aria-label="Nova tarefa" />
            <div style={{ display: 'flex', gap: 8 }}>
              <input name="vencimento" type="date" className={s.input} aria-label="Para quando" />
              <BotaoEnviar variante="secundario">Adicionar</BotaoEnviar>
            </div>
          </FormAcao>
          <ul className={s.lista} style={{ marginTop: 12 }}>
            {tarefas.map((t) => (
              <li key={t.id} className={s.item}>
                <BotaoAcao acao={concluirTarefa.bind(null, t.id)} variante="fantasma" pequeno>○</BotaoAcao>
                <div className={s.itemCorpo}>
                  <span className={s.itemTitulo} style={{ whiteSpace: 'normal' }}>{t.titulo}</span>
                  {t.vencimento && <span className={s.itemMeta}>{fmtData(t.vencimento)}</span>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className={s.card}>
          <h2 className={s.cardTitulo}>Dados</h2>
          <dl className={s.dados}>
            <dt>WhatsApp</dt><dd>{paciente.telefone ?? '·'}</dd>
            <dt>E-mail</dt><dd>{paciente.email ?? '·'}</dd>
            <dt>Nascimento</dt><dd>{fmtData(paciente.dataNascimento)}</dd>
            <dt>Condições</dt><dd>{paciente.condicoes.join(', ') || '·'}</dd>
            {paciente.observacoes && (<><dt>Obs.</dt><dd style={{ whiteSpace: 'pre-wrap' }}>{paciente.observacoes}</dd></>)}
          </dl>
        </section>
      </aside>
    </div>
  )
}

// ── Prontuário ─────────────────────────────────────────────
function Registro({ a, pacienteId }: { a: Atendimento; pacienteId: string }) {
  const campos: [string, string | null][] = [
    ['Queixa / relato', a.queixa],
    ['Avaliação', a.avaliacao],
    ['Conduta', a.conduta],
    ['Orientações / home care', a.orientacoes],
    ['Próximos passos', a.proximosPassos],
  ]
  return (
    <article className={`${s.registro} ${a.adendoDe ? s.registroAdendo : ''}`}>
      <div className={s.registroCabecalho}>
        <span className={s.registroData}>{fmtData(a.data)} · {fmtHora(a.data)}</span>
        <span className={s.chip}>{TIPOS_ATENDIMENTO[a.tipo]}</span>
        <Link href={`/pacientes/${pacienteId}?aba=prontuario&adendo=${a.id}#novo-registro`} className={s.botaoFantasma}>
          adendo
        </Link>
      </div>
      {campos.filter(([, v]) => v).map(([rotulo, v]) => (
        <div key={rotulo} className={s.registroCampo}>
          <div className={s.registroRotulo}>{rotulo}</div>
          <div className={s.registroTexto}>{v}</div>
        </div>
      ))}
    </article>
  )
}

async function Prontuario({
  pacienteId, agendamentoId, sessaoId, adendoDe,
}: { pacienteId: string; agendamentoId?: string; sessaoId?: string; adendoDe?: string }) {
  const atendimentos = await listarAtendimentos(pacienteId)
  const porId = new Map(atendimentos.map((a) => [a.id, a]))
  const principais = atendimentos.filter((a) => !a.adendoDe || !porId.has(a.adendoDe))
  const adendos = (id: string) => atendimentos.filter((a) => a.adendoDe === id).reverse()
  const agora = new Date()
  const hora = agora.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={s.colunaPrincipal}>
      <section className={s.card}>
        <h2 className={s.cardTitulo}>Histórico <span className={s.contador}>{atendimentos.length}</span></h2>
        {principais.length === 0 && <p className={s.vazio}>Nenhum registro ainda.</p>}
        {principais.map((a) => (
          <div key={a.id}>
            <Registro a={a} pacienteId={pacienteId} />
            {adendos(a.id).map((ad) => <Registro key={ad.id} a={ad} pacienteId={pacienteId} />)}
          </div>
        ))}
      </section>

      <section className={`${s.card} ${s.formLateral}`} id="novo-registro">
        <h2 className={s.cardTitulo}>{adendoDe ? 'Adendo ao registro' : 'Novo registro'}</h2>
        {adendoDe && (
          <p className={s.aviso} style={{ marginBottom: 12 }}>
            Registros de prontuário não são apagados nem editados. Correções e complementos entram como adendo.
          </p>
        )}
        <FormAcao acao={registrarAtendimento} limparAoSalvar mensagemOk="Registro salvo no prontuário.">
          <input type="hidden" name="paciente_id" value={pacienteId} />
          {agendamentoId && <input type="hidden" name="agendamento_id" value={agendamentoId} />}
          {sessaoId && <input type="hidden" name="sessao_id" value={sessaoId} />}
          {adendoDe && <input type="hidden" name="adendo_de" value={adendoDe} />}
          <div className={s.campos}>
            <label className={s.campo}>
              <span className={s.rotulo}>Data</span>
              <input type="date" name="data" className={s.input} defaultValue={hojeISO()} />
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Hora</span>
              <input type="time" name="hora" className={s.input} defaultValue={hora} />
            </label>
          </div>
          <label className={s.campo}>
            <span className={s.rotulo}>Tipo</span>
            <select name="tipo" className={s.select} defaultValue={adendoDe ? 'adendo' : sessaoId ? 'sessao' : 'consulta'}>
              {Object.entries(TIPOS_ATENDIMENTO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Queixa / relato da paciente</span>
            <textarea name="queixa" className={s.textarea} />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Avaliação</span>
            <textarea name="avaliacao" className={s.textarea} placeholder="O que você observou na pele" />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Conduta</span>
            <textarea name="conduta" className={s.textarea} placeholder="Procedimento feito, o que foi prescrito" />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Orientações / home care</span>
            <textarea name="orientacoes" className={s.textarea} />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Próximos passos</span>
            <input name="proximos_passos" className={s.input} placeholder="Retorno em 30 dias, reavaliar manchas…" />
          </label>
          <div className={s.rodapeForm}>
            {(agendamentoId || sessaoId) && <span className={s.dica}>Vinculado ao agendamento{sessaoId ? ' e à sessão do programa' : ''}.</span>}
            <BotaoEnviar>Salvar no prontuário</BotaoEnviar>
          </div>
        </FormAcao>
      </section>
    </div>
  )
}

// ── Fórmulas e pedidos ─────────────────────────────────────
async function Formulas({ pacienteId }: { pacienteId: string }) {
  const pedidos = await listarPedidos({ pacienteId })
  return (
    <div className={s.pilha}>
      <div className={s.acoes}>
        <Link href={`/pedidos/novo?paciente=${pacienteId}`} className={s.botao}>+ Novo pedido</Link>
        <Link href={`/pedidos/novo?paciente=${pacienteId}&historico=1`} className={s.botaoSec}>
          Registrar fórmula antiga
        </Link>
      </div>
      {pedidos.length === 0 && (
        <p className={s.aviso}>
          Nenhuma fórmula registrada. Se você está recuperando fórmulas antigas pelo WhatsApp, use
          &quot;Registrar fórmula antiga&quot;: dá pra colar o texto da mensagem e colocar a data original.
        </p>
      )}
      {pedidos.map((p) => (
        <section key={p.id} className={s.card}>
          <PedidoFormulas pedido={p} />
          <div className={s.acoes} style={{ marginTop: 12 }}>
            <Link href={`/pedidos/novo?repetir=${p.id}`} className={`${s.botaoSec} ${s.botaoPequeno}`}>Repetir</Link>
            <Link href={`/pedidos/${p.id}`} className={`${s.botaoFantasma} ${s.botaoPequeno}`}>Abrir</Link>
          </div>
        </section>
      ))}
    </div>
  )
}

// ── Programas ──────────────────────────────────────────────
async function Programas({ pacienteId }: { pacienteId: string }) {
  const programas = await listarProgramas({ pacienteId })
  return (
    <div className={s.colunaPrincipal}>
      <div className={s.pilha}>
        {programas.length === 0 && <p className={s.vazio}>Nenhum programa de tratamento.</p>}
        {programas.map((p) => {
          const feitas = p.sessoes.filter((x) => x.status === 'realizada').length
          return (
            <section key={p.id} className={s.card}>
              <div className={s.registroCabecalho} style={{ justifyContent: 'space-between' }}>
                <Link href={`/programas/${p.id}`} className={s.itemTitulo}>{p.nome}</Link>
                <span className={`${s.chip} ${p.status === 'ativo' ? s.chipAcento : ''}`}>{STATUS_PROGRAMA[p.status]}</span>
              </div>
              {p.objetivo && <p className={s.itemMeta}>{p.objetivo}</p>}
              <div className={s.progresso} style={{ marginTop: 12 }}>
                <div className={s.progressoBarra} style={{ width: `${(feitas / p.totalSessoes) * 100}%` }} />
              </div>
              <p className={s.itemMeta} style={{ marginTop: 6 }}>
                {feitas} de {p.totalSessoes} sessões · a cada {p.intervaloDias} dias · início {fmtData(p.dataInicio)}
              </p>
            </section>
          )
        })}
      </div>

      <section className={s.card}>
        <h2 className={s.cardTitulo}>Novo programa</h2>
        <FormAcao acao={criarPrograma}>
          <input type="hidden" name="paciente_id" value={pacienteId} />
          <label className={s.campo}>
            <span className={s.rotulo}>Nome *</span>
            <input name="nome" className={s.input} placeholder="Protocolo clareamento 4 meses" required />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Objetivo</span>
            <textarea name="objetivo" className={s.textarea} />
          </label>
          <div className={s.campos}>
            <label className={s.campo}>
              <span className={s.rotulo}>Nº de sessões</span>
              <input name="total_sessoes" type="number" min={1} max={60} defaultValue={8} className={s.input} />
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Intervalo (dias)</span>
              <input name="intervalo_dias" type="number" min={1} max={180} defaultValue={15} className={s.input} />
            </label>
          </div>
          <label className={s.campo}>
            <span className={s.rotulo}>Início</span>
            <input name="data_inicio" type="date" defaultValue={hojeISO()} className={s.input} />
          </label>
          <p className={s.dica}>
            Cada sessão já nasce com checklist. Itens obrigatórios travam a conclusão: consentimento,
            anamnese e foto antes na 1ª; prontuário e home care em todas; foto depois na última.
          </p>
          <div className={s.rodapeForm}><BotaoEnviar>Criar programa</BotaoEnviar></div>
        </FormAcao>
      </section>
    </div>
  )
}

// ── Fotos ──────────────────────────────────────────────────
async function Fotos({ pacienteId }: { pacienteId: string }) {
  const [{ tenantId }, fotos] = await Promise.all([ctx(), listarFotos(pacienteId)])
  const primeiraAntes = fotos.find((f) => f.momento === 'antes')
  const ultimaDepois = [...fotos].reverse().find((f) => f.momento === 'depois' || f.momento === 'evolucao')

  return (
    <div className={s.pilha}>
      <section className={s.card}>
        <h2 className={s.cardTitulo}>Adicionar foto</h2>
        <FotoUpload tenantId={tenantId} pacienteId={pacienteId} />
      </section>

      {primeiraAntes && ultimaDepois && primeiraAntes.id !== ultimaDepois.id && (
        <section className={s.card}>
          <h2 className={s.cardTitulo}>Comparação</h2>
          <div className={s.comparacao}>
            {[primeiraAntes, ultimaDepois].map((f) => (
              <figure key={f.id} className={s.foto}>
                {f.url && <img src={f.url} alt={`${f.momento} ${fmtData(f.tiradaEm)}`} />}
                <figcaption>{f.momento === 'antes' ? 'Antes' : 'Mais recente'} · {fmtData(f.tiradaEm)}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className={s.card}>
        <h2 className={s.cardTitulo}>Todas as fotos <span className={s.contador}>{fotos.length}</span></h2>
        {fotos.length === 0 ? <p className={s.vazio}>Nenhuma foto ainda.</p> : (
          <div className={s.fotos}>
            {fotos.map((f) => (
              <figure key={f.id} className={s.foto}>
                {f.url ? (
                  <a href={f.url} target="_blank" rel="noreferrer"><img src={f.url} alt={`${f.momento} ${f.regiao ?? ''}`} loading="lazy" /></a>
                ) : <div style={{ aspectRatio: '3/4' }} />}
                <figcaption>
                  {f.momento} · {fmtData(f.tiradaEm)}{f.regiao ? ` · ${f.regiao}` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
