'use client'

// ============================================================
// FormulaComparison — Comparação entre duas versões
// Capítulo V: Fórmulas
// ============================================================
// Mostra ativos removidos, adicionados, concentrações alteradas,
// mudança de veículo, mudança de modo de uso.
// Cada diferença é conhecimento acumulado.
// ============================================================

import { useState, useTransition } from 'react'
import { compararVersoesFormula } from '../actions/formulaActions'
import { FASE_META } from '../types'
import type { FormulaComparacao, VersaoView } from '../types'
import styles from './FormulaComparison.module.css'

interface FormulaComparisonProps {
  versoes: VersaoView[]
}

export function FormulaComparison({ versoes }: FormulaComparisonProps) {
  const [versaoAId, setVersaoAId] = useState<string>('')
  const [versaoBId, setVersaoBId] = useState<string>('')
  const [resultado,  setResultado] = useState<FormulaComparacao | null>(null)
  const [comparando, startComparar] = useTransition()
  const [erro, setErro] = useState<string | null>(null)

  // Versões disponíveis para comparar (min 2)
  if (versoes.length < 2) {
    return (
      <div className={styles.semVersoes}>
        <p className={styles.semVersoesTexto}>
          É preciso ter ao menos duas versões para comparar.
        </p>
      </div>
    )
  }

  function onComparar() {
    if (!versaoAId || !versaoBId) {
      setErro('Selecione duas versões para comparar.')
      return
    }
    if (versaoAId === versaoBId) {
      setErro('Selecione versões diferentes.')
      return
    }
    setErro(null)
    startComparar(async () => {
      const r = await compararVersoesFormula(versaoAId, versaoBId)
      setResultado(r)
    })
  }

  return (
    <div className={styles.comparacao}>
      <div className={styles.seletores}>
        <div className={styles.seletor}>
          <label className={styles.seletorLabel}>Versão A</label>
          <select
            className={styles.select}
            value={versaoAId}
            onChange={(e) => { setVersaoAId(e.target.value); setResultado(null) }}
          >
            <option value="">Selecionar…</option>
            {versoes.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === versaoBId}>
                v{v.numeroVersao} — {v.titulo}
              </option>
            ))}
          </select>
        </div>

        <span className={styles.seta} aria-hidden="true">↔</span>

        <div className={styles.seletor}>
          <label className={styles.seletorLabel}>Versão B</label>
          <select
            className={styles.select}
            value={versaoBId}
            onChange={(e) => { setVersaoBId(e.target.value); setResultado(null) }}
          >
            <option value="">Selecionar…</option>
            {versoes.map((v) => (
              <option key={v.id} value={v.id} disabled={v.id === versaoAId}>
                v{v.numeroVersao} — {v.titulo}
              </option>
            ))}
          </select>
        </div>

        <button
          className={styles.botao}
          onClick={onComparar}
          disabled={comparando || !versaoAId || !versaoBId}
          aria-busy={comparando}
        >
          {comparando ? 'Comparando…' : 'Comparar'}
        </button>
      </div>

      {erro && <p className={styles.erro}>{erro}</p>}

      {resultado && (
        <div className={styles.resultado}>
          {/* Cabeçalho */}
          <div className={styles.resultadoHeader}>
            <span className={styles.resultadoTitulo}>
              v{resultado.versaoA.numeroVersao} → v{resultado.versaoB.numeroVersao}
            </span>
            {resultado.versaoB.motivoAlteracao && (
              <p className={styles.resultadoMotivo}>
                {resultado.versaoB.motivoAlteracao}
              </p>
            )}
          </div>

          {resultado.semMudancas ? (
            <p className={styles.semMudancas}>Nenhuma diferença encontrada entre as versões.</p>
          ) : (
            <>
              {/* Veículo */}
              {resultado.mudancaVeiculo && (
                <div className={styles.mudancaBloco}>
                  <span className={styles.mudancaRotulo}>Veículo</span>
                  <div className={styles.mudancaLinhas}>
                    <span className={styles.mudancaAntes}>{resultado.mudancaVeiculo.antes || '—'}</span>
                    <span className={styles.mudancaSeta}>→</span>
                    <span className={styles.mudancaDepois}>{resultado.mudancaVeiculo.depois || '—'}</span>
                  </div>
                </div>
              )}

              {/* Modo de uso */}
              {resultado.mudancaModoUso && (
                <div className={styles.mudancaBloco}>
                  <span className={styles.mudancaRotulo}>Modo de uso</span>
                  <div className={styles.mudancaLinhas}>
                    <span className={styles.mudancaAntes}>{resultado.mudancaModoUso.antes || '—'}</span>
                    <span className={styles.mudancaSeta}>→</span>
                    <span className={styles.mudancaDepois}>{resultado.mudancaModoUso.depois || '—'}</span>
                  </div>
                </div>
              )}

              {/* Ingredientes */}
              {resultado.ingredientes.length > 0 && (
                <div className={styles.ingredientesDiff}>
                  <span className={styles.mudancaRotulo}>Composição</span>
                  {resultado.ingredientes.map((diff, idx) => {
                    const faseMeta = diff.faseDepois ? FASE_META[diff.faseDepois] : diff.faseAntes ? FASE_META[diff.faseAntes] : null
                    return (
                      <div
                        key={`${diff.ativoId}-${idx}`}
                        className={[
                          styles.diffItem,
                          diff.tipo === 'adicionado' ? styles.adicionado :
                          diff.tipo === 'removido'   ? styles.removido   : styles.alterado,
                        ].join(' ')}
                      >
                        <span className={styles.diffTipo}>
                          {diff.tipo === 'adicionado' ? '+' : diff.tipo === 'removido' ? '−' : '≠'}
                        </span>
                        <span className={styles.diffNome}>{diff.nomeAtivo}</span>
                        <span className={styles.diffConc}>
                          {diff.tipo === 'alterado'
                            ? `${diff.concentracaoAntes}% → ${diff.concentracaoDepois}%`
                            : diff.tipo === 'adicionado'
                            ? `${diff.concentracaoDepois}${diff.unidade}`
                            : `${diff.concentracaoAntes}${diff.unidade}`}
                        </span>
                        {diff.faseDepois && diff.faseAntes && diff.faseDepois !== diff.faseAntes && (
                          <span className={styles.diffFase}>
                            {FASE_META[diff.faseAntes]?.label} → {FASE_META[diff.faseDepois]?.label}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
