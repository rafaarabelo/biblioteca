// ============================================================
// NovoProtocoloClient — Client Component de Criação
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

'use client'

import { useNovoProtocolo } from '@/features/protocolos/hooks/useProtocoloEditor'
import { ProtocolEditor } from '@/features/protocolos/components/ProtocolEditor'

interface NovoProtocoloClientProps {
  tagsDisponiveis: string[]
}

export function NovoProtocoloClient({ tagsDisponiveis }: NovoProtocoloClientProps) {
  const {
    campos,
    erro,
    registrando,
    onSet,
    onSalvar,
    adicionarFase,
    atualizarFase,
    removerFase,
    moverFase,
  } = useNovoProtocolo()

  return (
    <ProtocolEditor
      campos={campos}
      tagsDisponiveis={tagsDisponiveis}
      erro={erro}
      salvando={registrando}
      onSet={onSet}
      onSalvar={onSalvar}
      adicionarFase={adicionarFase}
      atualizarFase={atualizarFase}
      removerFase={removerFase}
      moverFase={moverFase}
    />
  )
}
