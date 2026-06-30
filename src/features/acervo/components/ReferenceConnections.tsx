// ============================================================
// ReferenceConnections — Conexões da Referência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Espelha ObservationConnections do Caderno, mas para referências.
// Grupos: observacao / ativo / formula / protocolo / caso / producao
// ============================================================

import type { ConexaoAcervo } from '../types'
import styles from './ReferenceConnections.module.css'

interface ReferenceConnectionsProps {
  conexoes: ConexaoAcervo[]
}

type TipoConexao = ConexaoAcervo['tipo']

const TIPO_META: Record<TipoConexao, { label: string; icone: string; href: (id: string) => string }> = {
  ativo:      { label: 'Ativo',         icone: '🧪', href: (id) => `/ativos/${id}` },
  formula:    { label: 'Fórmula',       icone: '⚗️', href: (id) => `/formulas/${id}` },
  protocolo:  { label: 'Protocolo',     icone: '📋', href: (id) => `/protocolos/${id}` },
  caso:       { label: 'Caso Clínico',  icone: '🗂️', href: (id) => `/casos/${id}` },
  observacao: { label: 'Observação',    icone: '📓', href: (id) => `/caderno/${id}` },
  referencia: { label: 'Referência',    icone: '📚', href: (id) => `/acervo/${id}` },
}

const ORDEM: TipoConexao[] = ['observacao', 'ativo', 'formula', 'protocolo', 'caso', 'referencia']

export function ReferenceConnections({ conexoes }: ReferenceConnectionsProps) {
  if (conexoes.length === 0) {
    return (
      <div className={styles.vazio}>
        <p className={styles.vazioTexto}>
          Nenhuma conexão registrada.
        </p>
        <p className={styles.futuro}>
          Esta referência ainda não está conectada a observações, ativos, fórmulas ou protocolos.
        </p>
      </div>
    )
  }

  // Agrupa por tipo
  const porTipo = Object.fromEntries(
    ORDEM.map((tipo) => [tipo, conexoes.filter((c) => c.tipo === tipo)])
  ) as Record<TipoConexao, ConexaoAcervo[]>

  return (
    <div className={styles.wrapper}>
      {ORDEM.map((tipo) => {
        const grupo = porTipo[tipo]
        if (grupo.length === 0) return null
        const meta = TIPO_META[tipo]!

        return (
          <section key={tipo} className={styles.grupo}>
            <h4 className={styles.grupoTitulo}>
              <span aria-hidden="true">{meta.icone}</span>
              {meta.label} ({grupo.length})
            </h4>
            <ul className={styles.lista}>
              {grupo.map((conexao) => (
                <li key={conexao.id}>
                  <a href={meta.href(conexao.id)} className={styles.item}>
                    <span className={styles.itemLabel}>{conexao.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
