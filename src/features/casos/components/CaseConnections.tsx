// ============================================================
// CaseConnections — Conexões do caso com o ecossistema
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Conexões: observações, protocolos, fórmulas, referências, ativos
// Mesmo padrão visual de ProtocolConnections.
// ============================================================

import Link from 'next/link'
import type { ConexaoCaso } from '../types'
import styles from './CaseConnections.module.css'

interface CaseConnectionsProps {
  conexoes: ConexaoCaso[]
}

const TIPO_CONFIG: Record<string, { label: string; href: string; cor: string }> = {
  observacao: { label: 'Observação', href: '/caderno',    cor: 'var(--amarelo-600, #ca8a04)' },
  protocolo:  { label: 'Protocolo',  href: '/protocolos', cor: 'var(--verde-600, #16a34a)' },
  formula:    { label: 'Fórmula',    href: '/formulas',   cor: 'var(--roxo-600, #7c3aed)' },
  referencia: { label: 'Referência', href: '/acervo',     cor: 'var(--terracota-500)' },
  ativo:      { label: 'Ativo',      href: '/clinico',    cor: 'var(--texto-secundario)' },
}

export function CaseConnections({ conexoes }: CaseConnectionsProps) {
  if (conexoes.length === 0) {
    return (
      <p className={styles.vazio}>
        Nenhuma conexão registrada.
      </p>
    )
  }

  // Agrupar por tipo
  const grupos = conexoes.reduce<Record<string, ConexaoCaso[]>>((acc, cx) => {
    acc[cx.tipo] = acc[cx.tipo] ?? []
    acc[cx.tipo]?.push(cx)
    return acc
  }, {})

  return (
    <div className={styles.conexoes}>
      {Object.entries(grupos).map(([tipo, lista]) => {
        const cfg = TIPO_CONFIG[tipo] ?? { label: tipo, href: '/', cor: 'var(--texto-terciario)' }
        return (
          <div key={tipo} className={styles.grupo}>
            <h4 className={styles.grupoTitulo} style={{ '--cor': cfg.cor } as React.CSSProperties}>
              {cfg.label}
              <span className={styles.grupoCount}>{lista.length}</span>
            </h4>
            <ul className={styles.lista}>
              {lista.map((cx) => (
                <li key={`${cx.tipo}-${cx.id}`}>
                  <Link href={cx.href} className={styles.item}>
                    <span className={styles.itemTitulo}>{cx.titulo}</span>
                    {cx.subtitulo && (
                      <span className={styles.itemSub}>{cx.subtitulo}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
