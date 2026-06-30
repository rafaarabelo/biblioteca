// ============================================================
// ObservacaoDetalheClient — Conteúdo + Ações (Client)
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Client Component: gerencia revisão inline e ações rápidas.
// ============================================================

'use client'

import { useState } from 'react'
import type { ObservacaoDetalheView, VersaoView } from '@/features/caderno/types'
import { ObservationToolbar } from '@/features/caderno/components/ObservationToolbar'
import { RevisaoEditor } from '@/features/caderno/components/ObservationEditor'
import { ObservationHistory } from '@/features/caderno/components/ObservationHistory'
import styles from './ObservacaoDetalheClient.module.css'

interface Props {
  observacao: ObservacaoDetalheView
}

export function ObservacaoDetalheClient({ observacao }: Props) {
  const [revisando, setRevisando] = useState(false)
  const [versaoHistorico, setVersaoHistorico] = useState<VersaoView | null>(null)

  if (revisando) {
    return (
      <RevisaoEditor
        observacao={observacao}
        onCancelar={() => setRevisando(false)}
      />
    )
  }

  return (
    <>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <ObservationToolbar
          observacaoId={observacao.id}
          favorito={observacao.favorito}
          onRevisar={() => setRevisando(true)}
        />
      </div>

      {/* Conteúdo da versão atual */}
      <div className={styles.conteudo}>
        {observacao.versaoAtual?.conteudo.split('\n').map((linha, i) =>
          linha
            ? <p key={i} className={styles.paragrafo}>{linha}</p>
            : <br key={i} />
        )}
      </div>

      {/* Modal de histórico */}
      {versaoHistorico && (
        <ObservationHistory
          versao={versaoHistorico}
          onFechar={() => setVersaoHistorico(null)}
        />
      )}
    </>
  )
}
