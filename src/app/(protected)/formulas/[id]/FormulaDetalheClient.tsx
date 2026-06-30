'use client'

// FormulaDetalheClient — Ações interativas na página de detalhe
// Capítulo V: Fórmulas
// Responsabilidades: favoritar (optimistic) + modal de nova versão + arquivar

import { useState }                                from 'react'
import { useAcoesFormula, useNovaVersao }          from '@/features/formulas/hooks/useFormulaEditor'
import { arquivarFormula }                         from '@/features/formulas/actions/formulaActions'
import { FormulaEditor }                           from '@/features/formulas/components/FormulaEditor'
import type { FormulaDetalheView }                 from '@/features/formulas/types'
import styles from './detalhe.module.css'

interface FormulaDetalheClientProps {
  formula: FormulaDetalheView
}

export function FormulaDetalheClient({ formula }: FormulaDetalheClientProps) {
  const { favorito, onFavoritar } = useAcoesFormula(formula.id, formula.favorito)

  const {
    aberto, setAberto,
    campos, erro, salvando,
    onSet, onSalvar,
    adicionarIngrediente, removerIngrediente, atualizarIngrediente,
  } = useNovaVersao(formula)

  const [confirmarArquivar, setConfirmarArquivar] = useState(false)
  const [arquivando,        setArquivando]        = useState(false)

  const estaArquivada = formula.statusVersao === 'arquivada'

  async function handleArquivar() {
    setArquivando(true)
    await arquivarFormula(formula.id)
    setArquivando(false)
    setConfirmarArquivar(false)
  }

  return (
    <>
      {/* ── Ações ── */}
      <div className={styles.acoes}>
        <button
          type="button"
          className={[styles.acao, favorito ? styles.acaoFavorito : ''].filter(Boolean).join(' ')}
          onClick={() => onFavoritar(!favorito)}
          aria-pressed={favorito}
          title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {favorito ? '★' : '☆'} {favorito ? 'Favoritado' : 'Favoritar'}
        </button>

        {!estaArquivada && (
          <button
            type="button"
            className={[styles.acao, styles.acaoPrincipal].join(' ')}
            onClick={() => setAberto(true)}
          >
            + Nova versão
          </button>
        )}
      </div>

      {/* ── Arquivar ── */}
      {!estaArquivada && (
        <div className={styles.arquivar}>
          {confirmarArquivar ? (
            <div className={styles.confirmar}>
              <p className={styles.confirmarTexto}>Arquivar esta fórmula?</p>
              <div className={styles.confirmarAcoes}>
                <button
                  type="button"
                  className={styles.confirmarSim}
                  onClick={handleArquivar}
                  disabled={arquivando}
                >
                  {arquivando ? 'Arquivando...' : 'Confirmar'}
                </button>
                <button
                  type="button"
                  className={styles.confirmarNao}
                  onClick={() => setConfirmarArquivar(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className={styles.acaoArquivar}
              onClick={() => setConfirmarArquivar(true)}
            >
              Arquivar fórmula
            </button>
          )}
        </div>
      )}

      {/* ── Modal: nova versão ── */}
      {aberto && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Nova versão da fórmula"
        >
          <div className={styles.modal}>
            <div className={styles.modalCabecalho}>
              <h2 className={styles.modalTitulo}>Nova versão</h2>
              <button
                type="button"
                className={styles.modalFechar}
                onClick={() => setAberto(false)}
                aria-label="Fechar"
              >
                ×
              </button>
            </div>
            <div className={styles.modalCorpo}>
              <p className={styles.avisoVersao}>
                Esta versão será registrada permanentemente. A versão atual passará para
                o estado <em>substituída</em> mas permanecerá acessível no histórico.
              </p>
              <FormulaEditor
                modo="versao"
                campos={campos}
                onSet={onSet}
                adicionarIngrediente={adicionarIngrediente}
                removerIngrediente={removerIngrediente}
                atualizarIngrediente={atualizarIngrediente}
                onSalvar={onSalvar}
                salvando={salvando}
                erro={erro}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
