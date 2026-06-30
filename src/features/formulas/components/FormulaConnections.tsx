// ============================================================
// FormulaConnections — Conexões com o ecossistema
// Capítulo V: Fórmulas
// ============================================================
// Observações, protocolos, casos, referências.
// Uma fórmula existe dentro de um ecossistema de conhecimento.
// ============================================================

import Link from 'next/link'
import type { ConexaoFormula, TipoConexaoFormula } from '../types'
import styles from './FormulaConnections.module.css'

interface FormulaConnectionsProps {
  conexoes: ConexaoFormula[]
}

const TIPO_META: Record<TipoConexaoFormula, { label: string; plural: string; cor: string }> = {
  observacao: { label: 'Observação',          plural: 'Observações',          cor: '#0ea5e9' },
  protocolo:  { label: 'Protocolo',           plural: 'Protocolos',           cor: '#8b5cf6' },
  caso:       { label: 'Caso clínico',        plural: 'Casos clínicos',       cor: 'var(--terracota-500, #b45309)' },
  referencia: { label: 'Referência científica', plural: 'Referências científicas', cor: '#16a34a' },
}

const ORDEM_TIPOS: TipoConexaoFormula[] = ['caso', 'protocolo', 'observacao', 'referencia']

export function FormulaConnections({ conexoes }: FormulaConnectionsProps) {
  if (!conexoes || conexoes.length === 0) {
    return (
      <div className={styles.vazio}>
        <p className={styles.vazioTexto}>Nenhuma conexão registrada.</p>
      </div>
    )
  }

  // Agrupar por tipo
  const porTipo = conexoes.reduce<Record<TipoConexaoFormula, ConexaoFormula[]>>(
    (acc, c) => {
      if (!acc[c.tipo]) acc[c.tipo] = []
      acc[c.tipo].push(c)
      return acc
    },
    {} as Record<TipoConexaoFormula, ConexaoFormula[]>
  )

  const tiposPresentes = ORDEM_TIPOS.filter((t) => (porTipo[t] ?? []).length > 0)

  return (
    <div className={styles.conexoes}>
      {tiposPresentes.map((tipo) => {
        const meta = TIPO_META[tipo]!
        const items = porTipo[tipo] ?? []
        return (
          <section key={tipo} className={styles.grupo}>
            <div
              className={styles.grupoHeader}
              style={{ '--conn-cor': meta.cor } as React.CSSProperties}
            >
              <span className={styles.grupoLabel}>{meta.plural}</span>
              <span className={styles.grupoContagem}>{items.length}</span>
            </div>
            <ul className={styles.lista}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <Link href={item.href} className={styles.link}>
                    <span className={styles.linkTitulo}>{item.titulo}</span>
                    {item.subtitulo && (
                      <span className={styles.linkSub}>{item.subtitulo}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
