import Link from 'next/link'
import { notFound } from 'next/navigation'
import { obterPaciente } from '@/features/clinica/dados'
import { PacienteForm } from '@/features/clinica/ui/PacienteForm'
import s from '@/features/clinica/ui/clinica.module.css'

export default async function EditarPacientePage({ params }: { params: { id: string } }) {
  const paciente = await obterPaciente(params.id)
  if (!paciente) notFound()
  return (
    <div className={s.pagina} style={{ maxWidth: 760 }}>
      <Link href={`/pacientes/${paciente.id}`} className={s.voltar}>← {paciente.nome}</Link>
      <header className={s.cabecalho}>
        <h1 className={s.titulo}>Editar cadastro</h1>
      </header>
      <PacienteForm paciente={paciente} />
    </div>
  )
}
