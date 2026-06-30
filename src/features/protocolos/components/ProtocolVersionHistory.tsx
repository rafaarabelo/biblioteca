// ============================================================
// ProtocolVersionHistory — Histórico Completo de Versões
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Cada versão: número, data, autor, justificativa da revisão.
// Revisões nunca são deletadas. Rastro permanente.
// ============================================================

import type { VersaoProtocoloView } from '../types'
import { MATURIDADES_PROTOCOLO } from '../types'
import styles from './ProtocolVersionHistory.module.css'

interface ProtocolVersionHistoryProps {
  versoes: VersaoProtocoloView[]        // todas as versões, incluindo ativa
}

function formatarData(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ProtocolVersionHistory({ versoes }: ProtocolVersionHistoryProps) {
  // Mais recente primeiro
  const ordenadas = [...versoes].sort((a, b) => b.numeroVersao - a.numeroVersao)

  if (versoes.length === 0) return null

  return (
    <section className={styles.wrapper} aria-label="Histórico de versões">
      <h2 className={styles.titulo}>Histórico de revisões</h2>
      <ol className={styles.lista} reversed>
        {ordenadas.map((v) => {
          const maturidadeMeta = MATURIDADES_PROTOCOLO[v.maturidade]
          const isAtiva = v.status === 'ativa'

          return (
            <li key={v.id} className={[styles.versao, isAtiva ? styles.versaoAtiva : ''].filter(Boolean).join(' ')}>
              {/* Cabeçalho da versão */}
              <div className={styles.versaoCabecalho}>
                <span className={styles.versaoNumero}>v{v.numeroVersao}</span>
                {isAtiva && <span className={styles.versaoAtivaBadge}>atual</span>}
                <span className={styles.versaoData}>{formatarData(v.criadoEm)}</span>
              </div>

              {/* Maturidade no momento */}
              <div className={styles.maturidade}>
                <span
                  className={styles.maturidadePonto}
                  style={{ backgroundColor: maturidadeMeta.cor }}
                  aria-hidden="true"
                />
                <span className={styles.maturidadeLabel}>{maturidadeMeta.label}</span>
              </div>

              {/* Autor */}
              {v.autor && (
                <p className={styles.autor}>{v.autor}</p>
              )}

              {/* Justificativa da revisão */}
              {v.motivoAlteracao && (
                <blockquote className={styles.justificativa}>
                  {v.motivoAlteracao}
                </blockquote>
              )}

              {/* Fio de conexão — exceto na primeira versão */}
              {v.numeroVersao > 1 && (
                <div className={styles.fio} aria-hidden="true" />
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}
