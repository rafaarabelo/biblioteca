// ============================================================
// ProtocolSequence — Sequência de Aplicação (Fases)
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// As fases têm ordem, nome, descrição e instruções.
// A visual é de etapas numeradas — não de checklist.
// ============================================================

import type { FaseProtocoloView } from '../types'
import styles from './ProtocolSequence.module.css'

interface ProtocolSequenceProps {
  fases: FaseProtocoloView[]
}

export function ProtocolSequence({ fases }: ProtocolSequenceProps) {
  if (!fases || fases.length === 0) {
    return (
      <p className={styles.vazio}>Nenhuma fase registrada nesta versão.</p>
    )
  }

  const fasesOrdenadas = [...fases].sort((a, b) => a.ordem - b.ordem)

  return (
    <section className={styles.wrapper} aria-label="Sequência de aplicação">
      <ol className={styles.lista}>
        {fasesOrdenadas.map((fase, idx) => (
          <li key={fase.id} className={styles.fase}>
            {/* Número da fase */}
            <span className={styles.numero} aria-hidden="true">{idx + 1}</span>

            <div className={styles.conteudo}>
              <h3 className={styles.nome}>{fase.nome}</h3>

              {fase.duracaoSemanas && (
                <span className={styles.duracao}>
                  {fase.duracaoSemanas} semana{fase.duracaoSemanas !== 1 ? 's' : ''}
                </span>
              )}

              {fase.descricao && (
                <p className={styles.descricao}>{fase.descricao}</p>
              )}

              {fase.instrucoes && (
                <div className={styles.instrucoes}>
                  <h4 className={styles.instrucoesLabel}>Instruções</h4>
                  <p className={styles.instrucoesTexto}>{fase.instrucoes}</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
