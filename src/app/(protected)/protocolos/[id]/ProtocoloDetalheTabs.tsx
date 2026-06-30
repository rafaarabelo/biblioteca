'use client'

import { useState } from 'react'
import styles from './ProtocoloDetalheTabs.module.css'

export type AbaProtocolo =
  | 'visao-geral'
  | 'etapas'
  | 'ingredientes'
  | 'evolucao'
  | 'reflexoes'

const ABAS: { id: AbaProtocolo; label: string }[] = [
  { id: 'visao-geral',   label: 'Visão geral' },
  { id: 'etapas',        label: 'Etapas' },
  { id: 'ingredientes',  label: 'Ingredientes' },
  { id: 'evolucao',      label: 'Evolução histórica' },
  { id: 'reflexoes',     label: 'Reflexões' },
]

interface Props {
  children: (aba: AbaProtocolo) => React.ReactNode
}

export function ProtocoloDetalheTabs({ children }: Props) {
  const [aba, setAba] = useState<AbaProtocolo>('visao-geral')

  return (
    <div className={styles.wrapper}>
      <nav className={styles.tabNav} aria-label="Seções do protocolo" role="tablist">
        {ABAS.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={aba === item.id}
            aria-controls={`painel-${item.id}`}
            id={`tab-${item.id}`}
            className={[
              styles.tab,
              aba === item.id ? styles.tabAtiva : '',
            ].filter(Boolean).join(' ')}
            onClick={() => setAba(item.id)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        role="tabpanel"
        id={`painel-${aba}`}
        aria-labelledby={`tab-${aba}`}
        className={styles.painel}
      >
        {children(aba)}
      </div>
    </div>
  )
}
