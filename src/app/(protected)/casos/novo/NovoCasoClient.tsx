// NovoCasoClient — Formulário de criação de caso (client)

'use client'

import { useNovoCaso } from '@/features/casos/hooks/useCasoEditor'
import { CaseEditor }  from '@/features/casos/components/CaseEditor'

interface NovoCasoClientProps {
  tagsDisponiveis: string[]
}

export function NovoCasoClient({ tagsDisponiveis }: NovoCasoClientProps) {
  const { campos, erro, registrando, onSet, onSalvar } = useNovoCaso()

  return (
    <CaseEditor
      campos={campos}
      erro={erro}
      registrando={registrando}
      tagsDisponiveis={tagsDisponiveis}
      onSet={onSet}
      onSalvar={onSalvar}
    />
  )
}
