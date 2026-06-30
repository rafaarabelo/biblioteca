// ============================================================
// EvolutionCard — Registro único de evolução clínica
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Evoluções são permanentes e imutáveis.
// Este componente NÃO tem botão de editar.
// É história clínica, não formulário.
// ============================================================

import Link from 'next/link'
import type { EvolucaoView } from '../types'
import styles from './EvolutionCard.module.css'

interface EvolutionCardProps {
  evolucao: EvolucaoView
  posicao?: number  // número na timeline
}

const TIPO_LABELS: Record<string, string> = {
  consulta:            'Consulta',
  retorno:             'Retorno',
  avaliacao_resultado: 'Avaliação de resultado',
  intercorrencia:      'Intercorrência',
  encerramento:        'Encerramento',
  outro:               'Registro',
}

const TIPO_ICONE: Record<string, string> = {
  consulta:            '◈',
  retorno:             '◉',
  avaliacao_resultado: '◎',
  intercorrencia:      '◈',
  encerramento:        '●',
  outro:               '○',
}

const SATISFACAO_LABELS: Record<number, string> = {
  1: 'Muito insatisfeito',
  2: 'Insatisfeito',
  3: 'Neutro',
  4: 'Satisfeito',
  5: 'Muito satisfeito',
}

export function EvolutionCard({ evolucao, posicao }: EvolutionCardProps) {
  const data = new Date(evolucao.dataAtendimento).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
  const tipo = evolucao.tipo as string
  const icone = TIPO_ICONE[tipo] ?? '○'
  const label = TIPO_LABELS[tipo] ?? 'Registro'
  const satisfacao = typeof evolucao.satisfacaoPaciente === 'number'
    ? evolucao.satisfacaoPaciente
    : null

  return (
    <article className={styles.card}>
      {/* Cabeçalho */}
      <div className={styles.cabecalho}>
        <div className={styles.meta}>
          <span className={styles.icone} aria-hidden="true">{icone}</span>
          <span className={styles.tipo}>{label}</span>
          {posicao !== undefined && (
            <span className={styles.posicao} aria-label={`Registro ${posicao}`}>
              #{posicao}
            </span>
          )}
        </div>
        <time className={styles.data} dateTime={evolucao.dataAtendimento}>
          {data}
        </time>
      </div>

      {/* Descrição principal */}
      <div className={styles.descricao}>
        <p className={styles.texto}>{evolucao.descricao}</p>
      </div>

      {/* Observações clínicas */}
      {evolucao.observacoesClinices && (
        <div className={styles.secao}>
          <h4 className={styles.secaoTitulo}>Observações clínicas</h4>
          <p className={styles.secaoTexto}>{evolucao.observacoesClinices}</p>
        </div>
      )}

      {/* Resultados observados */}
      {evolucao.resultados && (
        <div className={styles.secao}>
          <h4 className={styles.secaoTitulo}>Resultados observados</h4>
          <p className={styles.secaoTexto}>{evolucao.resultados}</p>
        </div>
      )}

      {/* Reações adversas — destaque visual */}
      {evolucao.reacoesAdversas && (
        <div className={[styles.secao, styles.secaoAlerta].join(' ')}>
          <h4 className={styles.secaoTitulo}>Reações adversas</h4>
          <p className={styles.secaoTexto}>{evolucao.reacoesAdversas}</p>
        </div>
      )}

      {/* Rodapé */}
      <div className={styles.rodape}>
        {/* Satisfação */}
        {satisfacao !== null && (
          <div className={styles.satisfacao} title={SATISFACAO_LABELS[satisfacao]}>
            <span className={styles.satisfacaoLabel}>Satisfação:</span>
            <div className={styles.satisfacaoDots}>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={[styles.dot, n <= satisfacao ? styles.dotAtivo : ''].filter(Boolean).join(' ')}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        )}

        {/* Protocolo vinculado */}
        {evolucao.versaoProtocoloId && (
          <Link
            href={`/protocolos/${evolucao.versaoProtocoloId}`}
            className={styles.protocolo}
          >
            Ver protocolo
          </Link>
        )}
      </div>
    </article>
  )
}
