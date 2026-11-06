import Link from 'next/link'
import { listarPacientes } from '@/features/clinica/dados'
import { idade } from '@/features/clinica/dominio'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Pacientes · Gestão Natural' }

export default async function PacientesPage({ searchParams }: { searchParams: { q?: string } }) {
  const busca = searchParams.q ?? ''
  const pacientes = await listarPacientes(busca)

  return (
    <div className={s.pagina}>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>Pacientes</h1>
          <p className={s.subtitulo}>{pacientes.length} {busca ? 'encontrada(s)' : 'cadastrada(s)'}</p>
        </div>
        <Link href="/pacientes/nova" className={s.botao}>+ Nova paciente</Link>
      </header>

      <form className={s.busca} role="search">
        <input name="q" defaultValue={busca} className={s.input} placeholder="Buscar por nome, telefone ou e-mail" aria-label="Buscar paciente" />
        <button className={s.botaoSec} type="submit">Buscar</button>
      </form>

      <section className={s.card}>
        {pacientes.length === 0 ? (
          <p className={s.vazio}>
            {busca ? 'Ninguém com esse nome.' : 'Nenhuma paciente ainda. Comece cadastrando quem você atende esta semana.'}
          </p>
        ) : (
          <ul className={s.lista}>
            {pacientes.map((p) => {
              const anos = idade(p.dataNascimento)
              const alerta = p.gestante || p.amamentando || p.alergias.length > 0
              return (
                <li key={p.id} className={s.item}>
                  <div className={s.itemCorpo}>
                    <Link href={`/pacientes/${p.id}`} className={s.itemTitulo}>{p.nome}</Link>
                    <span className={s.itemMeta}>
                      {[anos !== null ? `${anos} anos` : null, p.telefone, p.tipoPele].filter(Boolean).join(' · ') || '·'}
                    </span>
                  </div>
                  {alerta && <span className={`${s.chip} ${s.chipAlerta}`}>atenção</span>}
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
