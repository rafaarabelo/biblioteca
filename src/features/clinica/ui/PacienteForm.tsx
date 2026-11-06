'use client'

import Link from 'next/link'
import { atualizarPaciente, criarPaciente } from '../acoes'
import type { Paciente } from '../dominio'
import { BotaoEnviar, FormAcao } from './componentes'
import s from './clinica.module.css'

export function PacienteForm({ paciente }: { paciente?: Paciente }) {
  const p = paciente
  return (
    <FormAcao acao={p ? atualizarPaciente : criarPaciente}>
      {p && <input type="hidden" name="id" value={p.id} />}

      <section className={s.card}>
        <h2 className={s.cardTitulo}>Identificação</h2>
        <div className={s.campos}>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Nome completo *</span>
            <input name="nome" className={s.input} defaultValue={p?.nome ?? ''} required autoFocus={!p} />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>WhatsApp</span>
            <input name="telefone" className={s.input} defaultValue={p?.telefone ?? ''} inputMode="tel" placeholder="(61) 99999-9999" />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>E-mail</span>
            <input name="email" type="email" className={s.input} defaultValue={p?.email ?? ''} />
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Data de nascimento</span>
            <input name="data_nascimento" type="date" className={s.input} defaultValue={p?.dataNascimento ?? ''} />
          </label>
        </div>
      </section>

      <section className={s.card}>
        <h2 className={s.cardTitulo}>Pele e segurança clínica</h2>
        <div className={s.campos}>
          <label className={s.campo}>
            <span className={s.rotulo}>Fototipo</span>
            <select name="fototipo" className={s.select} defaultValue={p?.fototipo ?? ''}>
              <option value="">não informado</option>
              {['I', 'II', 'III', 'IV', 'V', 'VI'].map((f) => <option key={f} value={f}>Fitzpatrick {f}</option>)}
            </select>
          </label>
          <label className={s.campo}>
            <span className={s.rotulo}>Tipo de pele</span>
            <input name="tipo_pele" className={s.input} defaultValue={p?.tipoPele ?? ''} placeholder="mista, sensibilizada, acneica…" />
          </label>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Alergias conhecidas</span>
            <input name="alergias" className={s.input} defaultValue={p?.alergias.join(', ') ?? ''} placeholder="separe por vírgula" />
          </label>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Medicamentos de uso contínuo</span>
            <input name="medicamentos" className={s.input} defaultValue={p?.medicamentos.join(', ') ?? ''} placeholder="isotretinoína, anticoncepcional…" />
          </label>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Condições relevantes</span>
            <input name="condicoes" className={s.input} defaultValue={p?.condicoes.join(', ') ?? ''} placeholder="rosácea, SOP, hipotireoidismo…" />
          </label>
          <label className={s.checkLinha}>
            <input type="checkbox" name="gestante" defaultChecked={p?.gestante} /> Gestante
          </label>
          <label className={s.checkLinha}>
            <input type="checkbox" name="amamentando" defaultChecked={p?.amamentando} /> Amamentando
          </label>
          <label className={`${s.campo} ${s.campoLargo}`}>
            <span className={s.rotulo}>Observações gerais</span>
            <textarea name="observacoes" className={s.textarea} defaultValue={p?.observacoes ?? ''} />
          </label>
        </div>
      </section>

      <div className={s.rodapeForm}>
        <Link href={p ? `/pacientes/${p.id}` : '/pacientes'} className={s.botaoSec}>Cancelar</Link>
        <BotaoEnviar>{p ? 'Salvar alterações' : 'Cadastrar paciente'}</BotaoEnviar>
      </div>
    </FormAcao>
  )
}
