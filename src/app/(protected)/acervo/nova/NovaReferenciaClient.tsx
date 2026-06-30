// ============================================================
// NovaReferenciaClient — Client Component para nova referência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

'use client'

import { useNovaReferencia } from '@/features/acervo/hooks/useReferenciaEditor'
import { ReferenceEditor } from '@/features/acervo/components/ReferenceEditor'
import type { EditorCampos } from '@/features/acervo/components/ReferenceEditor'

type SetEditorFn = <K extends keyof EditorCampos>(campo: K, valor: EditorCampos[K]) => void

interface NovaReferenciaClientProps {
  tagsDisponiveis: string[]
}

export function NovaReferenciaClient({ tagsDisponiveis }: NovaReferenciaClientProps) {
  const { estado, set, registrar } = useNovaReferencia()

  return (
    <ReferenceEditor
      campos={estado}
      modoEdicao={false}
      tagsDisponiveis={tagsDisponiveis}
      onSet={set as unknown as SetEditorFn}
      onSalvar={registrar}
    />
  )
}
