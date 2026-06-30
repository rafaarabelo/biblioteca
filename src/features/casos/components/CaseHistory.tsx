// CaseHistory — Lista compacta de evoluções para sidebar

import type { EvolucaoView } from '../types'
import styles from './CaseHistory.module.css'

interface CaseHistoryProps {
  evolucoes: EvolucaoView[]
}

const TIPO_ICONE: Record<string, string> = {
  consulta:            '◈',
  retorno:             '◉',
  avaliacao_resultado: '◎',
  intercorrencia:      '◈',
  encerramento:        '●',
  outro:               '○',
}

export function CaseHistory({ evolucoes }: CaseHistoryProps) {
  if (evolucoes.length === 0) {
    return <p className={styles.vazio}>Sem registros ainda.</p>
  }

  return (
    <ol className={styles.lista} aria-label="Histórico resumido">
      {evolucoes.map((ev, idx) => {
        const data = new Date(ev.dataAtendimento).toLocaleDateString('pt-BR', {
          day: '2-digit', month: 'short',
        })
        const tipo = ev.tipo as string
        const icone = TIPO_ICONE[tipo] ?? '○'
        const trecho = ev.descricao.slice(0, 60) + (ev.descricao.length > 60 ? '…' : '')

        return (
          <li key={ev.id} className={styles.item}>
            <span className={styles.numero}>#{idx + 1}</span>
            <div className={styles.corpo}>
              <div className={styles.topo}>
                <span className={styles.icone} aria-hidden="true">{icone}</span>
                <time className={styles.data}>{data}</time>
              </div>
              <p className={styles.trecho}>{trecho}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
