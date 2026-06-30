// ============================================================
// ProtocoloDetalheClient — Client interativo da página de detalhe
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Gerencia favorito (optimistic) e nova revisão (modal).
// ============================================================

'use client'

import { useAcoesProtocolo, useNovaVersaoProtocolo } from '@/features/protocolos/hooks/useProtocoloEditor'
import { ProtocolEditor } from '@/features/protocolos/components/ProtocolEditor'
import type { ProtocoloDetalheView } from '@/features/protocolos/types'
import styles from './ProtocoloDetalheClient.module.css'

interface Props {
  protocolo: ProtocoloDetalheView
  tagsDisponiveis: string[]
}

export function ProtocoloDetalheClient({ protocolo, tagsDisponiveis }: Props) {
  const { favorito, toggleFavorito } = useAcoesProtocolo(protocolo.id, protocolo.favorito)
  const {
    aberto,
    setAberto,
    campos,
    erro,
    salvando,
    onSet,
    onSalvar,
    adicionarFase,
    atualizarFase,
    removerFase,
    moverFase,
  } = useNovaVersaoProtocolo(protocolo)

  return (
    <>
      {/* Botões de ação na sidebar */}
      <div className={styles.acoes}>
        <button
          type="button"
          className={[styles.botaoAcao, favorito ? styles.botaoFavorito : ''].filter(Boolean).join(' ')}
          onClick={toggleFavorito}
          aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {favorito ? '★' : '☆'} {favorito ? 'Favoritado' : 'Favoritar'}
        </button>

        <button
          type="button"
          className={styles.botaoRevisao}
          onClick={() => setAberto(true)}
        >
          + Criar revisão
        </button>
      </div>

      {/* Modal de revisão */}
      {aberto && (
        <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Nova revisão do protocolo">
          <div className={styles.modal}>
            <div className={styles.modalCabecalho}>
              <h2 className={styles.modalTitulo}>Nova revisão</h2>
              <p className={styles.modalSubtitulo}>
                v{protocolo.versaoAtiva?.numeroVersao ?? 1} → v{(protocolo.versaoAtiva?.numeroVersao ?? 1) + 1}
              </p>
              <button
                type="button"
                className={styles.modalFechar}
                onClick={() => setAberto(false)}
                aria-label="Fechar"
              >×</button>
            </div>

            <div className={styles.modalCorpo}>
              <ProtocolEditor
                campos={campos}
                modoRevisao
                tagsDisponiveis={tagsDisponiveis}
                erro={erro}
                salvando={salvando}
                onSet={onSet}
                onSalvar={onSalvar}
                onCancelar={() => setAberto(false)}
                adicionarFase={adicionarFase}
                atualizarFase={atualizarFase}
                removerFase={removerFase}
                moverFase={moverFase}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
