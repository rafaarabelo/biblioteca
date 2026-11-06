import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ctx, obterPrograma } from '@/features/clinica/dados'
import { concluirSessao, mudarStatusPrograma } from '@/features/clinica/acoes'
import { fmtData, hojeISO, sessaoPodeConcluir, STATUS_PROGRAMA } from '@/features/clinica/dominio'
import { BotaoAcao } from '@/features/clinica/ui/componentes'
import { FotoUpload } from '@/features/clinica/ui/FotoUpload'
import { ItemChecklist } from '@/features/clinica/ui/ItemChecklist'
import s from '@/features/clinica/ui/clinica.module.css'

export default async function ProgramaPage({ params }: { params: { id: string } }) {
  const [programa, { tenantId }] = await Promise.all([obterPrograma(params.id), ctx()])
  if (!programa) notFound()
  const p = programa
  const feitas = p.sessoes.filter((x) => x.status === 'realizada').length
  const atual = p.sessoes.find((x) => x.status === 'pendente')
  const hoje = hojeISO()
  const ativo = p.status === 'ativo'

  return (
    <div className={s.pagina} style={{ maxWidth: 860 }}>
      <Link href={`/pacientes/${p.pacienteId}?aba=programas`} className={s.voltar}>← {p.pacienteNome}</Link>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>{p.nome}</h1>
          <p className={s.subtitulo}>
            {p.pacienteNome} · {feitas} de {p.totalSessoes} sessões · a cada {p.intervaloDias} dias
          </p>
        </div>
        <div className={s.acoes}>
          <span className={`${s.chip} ${ativo ? s.chipAcento : ''}`}>{STATUS_PROGRAMA[p.status]}</span>
          {p.status === 'ativo' && (
            <BotaoAcao acao={mudarStatusPrograma.bind(null, p.id, 'pausado')} pequeno variante="fantasma">pausar</BotaoAcao>
          )}
          {p.status === 'pausado' && (
            <BotaoAcao acao={mudarStatusPrograma.bind(null, p.id, 'ativo')} pequeno>retomar</BotaoAcao>
          )}
        </div>
      </header>

      <div className={s.progresso} style={{ marginBottom: 16 }}>
        <div className={s.progressoBarra} style={{ width: `${(feitas / p.totalSessoes) * 100}%` }} />
      </div>
      {p.objetivo && <p className={s.aviso} style={{ marginBottom: 16 }}><strong>Objetivo:</strong> {p.objetivo}</p>}

      <div className={s.sessoes}>
        {p.sessoes.map((sessao) => {
          const eAtual = atual?.id === sessao.id
          const feita = sessao.status === 'realizada'
          const futura = !feita && !eAtual
          const { ok, faltando } = sessaoPodeConcluir(sessao)
          const temFotoAntes = sessao.checklist.some((i) => i.chave === 'foto_antes')
          const temFotoDepois = sessao.checklist.some((i) => i.chave === 'foto_depois')
          const temFotoEvol = sessao.checklist.some((i) => i.chave === 'foto_evolucao')
          return (
            <section
              key={sessao.id}
              className={`${s.sessao} ${eAtual ? s.sessaoAtual : ''} ${feita ? s.sessaoFeita : ''} ${futura ? s.sessaoBloqueada : ''}`}
            >
              <div className={s.sessaoCabecalho}>
                <div>
                  <strong>Sessão {sessao.numero}</strong>
                  <span className={s.itemMeta}>
                    {feita ? `realizada em ${fmtData(sessao.realizadaEm)}` : `prevista ${fmtData(sessao.dataPrevista)}`}
                    {!feita && sessao.dataPrevista && sessao.dataPrevista < hoje ? ' · atrasada' : ''}
                  </span>
                </div>
                {feita ? (
                  <span className={`${s.chip} ${s.chipOk}`}>✓ concluída</span>
                ) : eAtual ? (
                  <span className={`${s.chip} ${ok ? s.chipOk : s.chipTrava}`}>
                    {ok ? 'pronta para concluir' : `${faltando.length} trava(s)`}
                  </span>
                ) : (
                  <span className={s.chip}>🔒 aguarda a sessão {sessao.numero - 1}</span>
                )}
              </div>

              {(eAtual || feita) && (
                <ul className={s.checklist}>
                  {sessao.checklist.map((item) => (
                    <ItemChecklist key={item.chave} item={item} sessaoId={sessao.id} programaId={p.id} bloqueado={feita || !ativo} />
                  ))}
                </ul>
              )}

              {eAtual && ativo && (
                <>
                  <div className={s.acoes} style={{ marginTop: 16 }}>
                    <Link href={`/agenda?paciente=${p.pacienteId}&sessao=${sessao.id}&data=${sessao.dataPrevista ?? hoje}#novo`} className={`${s.botaoSec} ${s.botaoPequeno}`}>
                      Agendar
                    </Link>
                    <Link href={`/pacientes/${p.pacienteId}?aba=prontuario&sessao=${sessao.id}#novo-registro`} className={`${s.botaoSec} ${s.botaoPequeno}`}>
                      Registrar no prontuário
                    </Link>
                    {temFotoAntes && <FotoUpload tenantId={tenantId} pacienteId={p.pacienteId} sessaoId={sessao.id} programaId={p.id} momentoPadrao="antes" compacto />}
                    {temFotoDepois && <FotoUpload tenantId={tenantId} pacienteId={p.pacienteId} sessaoId={sessao.id} programaId={p.id} momentoPadrao="depois" compacto />}
                    {temFotoEvol && <FotoUpload tenantId={tenantId} pacienteId={p.pacienteId} sessaoId={sessao.id} programaId={p.id} momentoPadrao="evolucao" compacto />}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    {ok ? (
                      <BotaoAcao acao={concluirSessao.bind(null, sessao.id, p.id, undefined)} variante="principal">
                        Concluir sessão {sessao.numero}
                      </BotaoAcao>
                    ) : (
                      <p className={s.avisoTrava}>🔒 Para concluir falta: {faltando.join(' · ')}</p>
                    )}
                  </div>
                </>
              )}
              {sessao.notas && <p className={s.itemMeta} style={{ marginTop: 8 }}>{sessao.notas}</p>}
            </section>
          )
        })}
      </div>
    </div>
  )
}
