// ============================================================
// ObservationToolbar — Ações contextuais da Observação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Linguagem: Revisar / Arquivar / Duplicar (não Editar/Excluir)
// ============================================================

'use client'

import { useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { favoritarObservacao, arquivarObservacao, duplicarObservacao } from '../actions/cadernoActions'
import styles from './ObservationToolbar.module.css'

interface ObservationToolbarProps {
  observacaoId: string
  favorito: boolean
  onRevisar: () => void
}

export function ObservationToolbar({
  observacaoId,
  favorito: favoritoInicial,
  onRevisar,
}: ObservationToolbarProps) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleFavoritar = useCallback(() => {
    startTransition(async () => {
      await favoritarObservacao(observacaoId, !favoritoInicial)
    })
  }, [observacaoId, favoritoInicial])

  const handleArquivar = useCallback(() => {
    if (!confirm('Arquivar esta observação? Ela deixará de aparecer no Caderno.')) return
    startTransition(async () => {
      const resultado = await arquivarObservacao(observacaoId)
      if (resultado.ok) router.push('/caderno')
    })
  }, [observacaoId, router])

  const handleDuplicar = useCallback(() => {
    startTransition(async () => {
      const resultado = await duplicarObservacao(observacaoId)
      if (resultado.ok && resultado.id) router.push(`/caderno/${resultado.id}`)
    })
  }, [observacaoId, router])

  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Ações da observação">
      <button
        className={[styles.acao, styles.primaria].join(' ')}
        onClick={onRevisar}
        type="button"
        disabled={pending}
        aria-label="Revisar observação"
      >
        Revisar
      </button>

      <div className={styles.divisor} aria-hidden="true" />

      <button
        className={[
          styles.acao,
          favoritoInicial ? styles.favoritoAtivo : '',
        ].filter(Boolean).join(' ')}
        onClick={handleFavoritar}
        type="button"
        disabled={pending}
        aria-label={favoritoInicial ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={favoritoInicial ? 'Remover dos favoritos' : 'Favoritar'}
      >
        {favoritoInicial ? '★' : '☆'}
      </button>

      <button
        className={styles.acao}
        onClick={handleDuplicar}
        type="button"
        disabled={pending}
        aria-label="Duplicar observação"
        title="Duplicar"
      >
        ⎘
      </button>

      <button
        className={[styles.acao, styles.perigo].join(' ')}
        onClick={handleArquivar}
        type="button"
        disabled={pending}
        aria-label="Arquivar observação"
        title="Arquivar"
      >
        Arquivar
      </button>
    </div>
  )
}
