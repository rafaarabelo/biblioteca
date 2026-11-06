import Link from 'next/link'
import { listarAgenda, listarPacientes } from '@/features/clinica/dados'
import { criarAgendamento, mudarStatusAgendamento } from '@/features/clinica/acoes'
import {
  fmtHora,
  hojeISO,
  linkWhatsApp,
  somarDias,
  STATUS_AGENDAMENTO,
  TIPOS_AGENDAMENTO,
  type Agendamento,
} from '@/features/clinica/dominio'
import { BotaoAcao, BotaoEnviar, FormAcao } from '@/features/clinica/ui/componentes'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Agenda · Gestão Natural' }

function segundaDaSemana(iso: string) {
  const d = new Date(iso + 'T12:00:00Z')
  const dia = d.getUTCDay() // 0 = domingo
  return somarDias(iso, dia === 0 ? -6 : 1 - dia)
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: { semana?: string; paciente?: string; sessao?: string; data?: string }
}) {
  const hoje = hojeISO()
  const inicio = segundaDaSemana(searchParams.semana ?? hoje)
  const fim = somarDias(inicio, 7)
  const [agenda, pacientes] = await Promise.all([
    listarAgenda(new Date(`${inicio}T00:00:00-03:00`).toISOString(), new Date(`${fim}T00:00:00-03:00`).toISOString()),
    listarPacientes(),
  ])

  const dias = Array.from({ length: 7 }, (_, i) => somarDias(inicio, i))
  const porDia = (dia: string) =>
    agenda.filter((a) => new Date(a.inicio).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) === dia)
  const rotuloSemana = `${new Date(inicio + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${new Date(somarDias(inicio, 6) + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`

  return (
    <div className={s.pagina}>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>Agenda</h1>
          <p className={s.subtitulo}>Semana de {rotuloSemana} · {agenda.filter((a) => a.tipo !== 'bloqueio').length} atendimento(s)</p>
        </div>
        <div className={s.navSemana}>
          <Link href={`/agenda?semana=${somarDias(inicio, -7)}`} className={s.botaoSec}>←</Link>
          <Link href="/agenda" className={s.botaoSec}>Esta semana</Link>
          <Link href={`/agenda?semana=${fim}`} className={s.botaoSec}>→</Link>
        </div>
      </header>

      <div className={s.colunaPrincipal}>
        <section className={s.card}>
          {dias.map((dia) => {
            const itens = porDia(dia)
            const fimDeSemana = [5, 6].includes(dias.indexOf(dia))
            if (fimDeSemana && itens.length === 0) return null
            return (
              <div key={dia} className={s.dia}>
                <h2 className={`${s.diaTitulo} ${dia === hoje ? s.diaHoje : ''}`}>
                  {new Date(dia + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' })}
                  {dia === hoje && <span className={`${s.chip} ${s.chipAcento}`}>hoje</span>}
                </h2>
                {itens.length === 0 ? (
                  <p className={s.vazio}>Livre.</p>
                ) : (
                  <ul className={s.lista}>{itens.map((a) => <LinhaAgenda key={a.id} a={a} hoje={hoje} />)}</ul>
                )}
              </div>
            )
          })}
        </section>

        <section className={`${s.card} ${s.formLateral}`} id="novo">
          <h2 className={s.cardTitulo}>Novo horário</h2>
          <FormAcao acao={criarAgendamento} limparAoSalvar mensagemOk="Agendado.">
            {searchParams.sessao && <input type="hidden" name="sessao_id" value={searchParams.sessao} />}
            <label className={s.campo}>
              <span className={s.rotulo}>Paciente</span>
              <select name="paciente_id" className={s.select} defaultValue={searchParams.paciente ?? ''}>
                <option value="">Nenhuma (bloqueio de agenda)</option>
                {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </label>
            <div className={s.campos}>
              <label className={s.campo}>
                <span className={s.rotulo}>Data</span>
                <input type="date" name="data" className={s.input} defaultValue={searchParams.data ?? hoje} required />
              </label>
              <label className={s.campo}>
                <span className={s.rotulo}>Hora</span>
                <input type="time" name="hora" className={s.input} defaultValue="09:00" step={900} required />
              </label>
              <label className={s.campo}>
                <span className={s.rotulo}>Tipo</span>
                <select name="tipo" className={s.select} defaultValue={searchParams.sessao ? 'sessao' : 'consulta'}>
                  {Object.entries(TIPOS_AGENDAMENTO).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </label>
              <label className={s.campo}>
                <span className={s.rotulo}>Duração</span>
                <select name="duracao_min" className={s.select} defaultValue="60">
                  {[30, 45, 60, 90, 120, 180].map((m) => <option key={m} value={m}>{m} min</option>)}
                </select>
              </label>
            </div>
            <label className={s.campo}>
              <span className={s.rotulo}>Modalidade</span>
              <select name="modalidade" className={s.select} defaultValue="presencial">
                <option value="presencial">Presencial</option>
                <option value="online">Online</option>
              </select>
            </label>
            <label className={s.campo}>
              <span className={s.rotulo}>Observação</span>
              <input name="observacoes" className={s.input} />
            </label>
            {searchParams.sessao && <p className={s.dica}>Este horário fica vinculado à sessão do programa.</p>}
            <div className={s.rodapeForm}><BotaoEnviar>Agendar</BotaoEnviar></div>
          </FormAcao>
        </section>
      </div>
    </div>
  )
}

function LinhaAgenda({ a, hoje }: { a: Agendamento; hoje: string }) {
  const passado = new Date(a.inicio).toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) <= hoje
  const inativo = a.status === 'cancelado' || a.status === 'faltou'
  const lembrete = a.pacienteNome
    ? `Oi, ${a.pacienteNome.split(' ')[0]}! Passando para confirmar seu horário ${new Date(a.inicio).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', weekday: 'long', day: '2-digit', month: '2-digit' })} às ${fmtHora(a.inicio)}. Posso confirmar?`
    : ''
  return (
    <li className={s.item} style={{ flexWrap: 'wrap', opacity: inativo ? 0.55 : 1 }}>
      <span className={s.hora}>{fmtHora(a.inicio)}</span>
      <div className={s.itemCorpo}>
        {a.pacienteId ? (
          <Link href={`/pacientes/${a.pacienteId}`} className={s.itemTitulo}>{a.pacienteNome}</Link>
        ) : (
          <span className={s.itemTitulo}>{a.titulo ?? a.observacoes ?? 'Bloqueio'}</span>
        )}
        <span className={s.itemMeta}>
          {TIPOS_AGENDAMENTO[a.tipo]} · {a.modalidade} · {a.duracaoMin} min
          {a.observacoes && a.pacienteId ? ` · ${a.observacoes}` : ''}
        </span>
      </div>
      <div className={s.acoes}>
        <span className={`${s.chip} ${a.temAtendimento ? s.chipOk : a.status === 'confirmado' ? s.chipAcento : ''}`}>
          {a.temAtendimento ? 'registrado' : STATUS_AGENDAMENTO[a.status].toLowerCase()}
        </span>
        {!inativo && a.pacienteId && (
          passado && !a.temAtendimento ? (
            <Link href={`/pacientes/${a.pacienteId}?aba=prontuario&agendamento=${a.id}${a.sessaoId ? `&sessao=${a.sessaoId}` : ''}`} className={`${s.botao} ${s.botaoPequeno}`}>
              Registrar
            </Link>
          ) : a.status === 'agendado' ? (
            <>
              {a.pacienteTelefone && (
                <a href={linkWhatsApp(a.pacienteTelefone, lembrete)} target="_blank" rel="noreferrer" className={`${s.botaoSec} ${s.botaoPequeno}`}>
                  Lembrar
                </a>
              )}
              <BotaoAcao acao={mudarStatusAgendamento.bind(null, a.id, 'confirmado')} pequeno>Confirmou</BotaoAcao>
            </>
          ) : null
        )}
        {!inativo && !a.temAtendimento && (
          <BotaoAcao acao={mudarStatusAgendamento.bind(null, a.id, 'cancelado')} pequeno variante="fantasma" confirmar="Cancelar este horário?">
            cancelar
          </BotaoAcao>
        )}
      </div>
    </li>
  )
}
