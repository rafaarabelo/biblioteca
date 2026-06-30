// ============================================================
// ProtocolConnections — Painel de Conexões do Protocolo
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Grupos: referências, observações, ativos, fórmulas, casos
// ============================================================

import Link from 'next/link'
import type { ConexaoProtocolo, TipoConexaoProtocolo } from '../types'
import styles from './ProtocolConnections.module.css'

interface ProtocolConnectionsProps {
  conexoes: ConexaoProtocolo[]
}

interface TipoMeta {
  label: string
  labelPlural: string
  icone: string
}

const TIPO_META: Record<TipoConexaoProtocolo, TipoMeta> = {
  referencia: { label: 'Referência', labelPlural: 'Referências científicas', icone: '📄' },
  observacao: { label: 'Observação', labelPlural: 'Observações', icone: '○' },
  ativo:      { label: 'Ativo', labelPlural: 'Ativos utilizados', icone: '⬡' },
  formula:    { label: 'Fórmula', labelPlural: 'Fórmulas relacionadas', icone: '⚗' },
  caso:       { label: 'Caso', labelPlural: 'Casos clínicos', icone: '◇' },
}

const ORDEM: TipoConexaoProtocolo[] = ['observacao', 'ativo', 'formula', 'referencia', 'caso']

export function ProtocolConnections({ conexoes }: ProtocolConnectionsProps) {
  if (conexoes.length === 0) {
    return (
      <p className={styles.vazio}>Sem conexões registradas.</p>
    )
  }

  const porTipo = ORDEM.reduce<Record<string, ConexaoProtocolo[]>>((acc, tipo) => {
    acc[tipo] = conexoes.filter((c) => c.tipo === tipo)
    return acc
  }, {})

  return (
    <section className={styles.wrapper} aria-label="Conexões do protocolo">
      {ORDEM.map((tipo) => {
        const grupo = porTipo[tipo] ?? []
        if (grupo.length === 0) return null
        const meta = TIPO_META[tipo]!

        return (
          <div key={tipo} className={styles.grupo}>
            <h3 className={styles.grupoTitulo}>
              <span aria-hidden="true">{meta.icone}</span>
              {meta.labelPlural}
              <span className={styles.grupoContador}>{grupo.length}</span>
            </h3>
            <ul className={styles.lista}>
              {grupo.map((c) => (
                <li key={c.id}>
                  <Link href={c.href} className={styles.item}>
                    <span className={styles.itemTitulo}>{c.titulo}</span>
                    {c.subtitulo && (
                      <span className={styles.itemSub}>{c.subtitulo}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}
