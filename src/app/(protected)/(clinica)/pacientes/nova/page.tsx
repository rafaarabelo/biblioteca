import Link from 'next/link'
import { PacienteForm } from '@/features/clinica/ui/PacienteForm'
import s from '@/features/clinica/ui/clinica.module.css'

export const metadata = { title: 'Nova paciente · Gestão Natural' }

export default function NovaPacientePage() {
  return (
    <div className={s.pagina} style={{ maxWidth: 760 }}>
      <Link href="/pacientes" className={s.voltar}>← Pacientes</Link>
      <header className={s.cabecalho}>
        <div>
          <h1 className={s.titulo}>Nova paciente</h1>
          <p className={s.subtitulo}>Só o nome é obrigatório. O resto dá pra completar depois.</p>
        </div>
      </header>
      <PacienteForm />
    </div>
  )
}
