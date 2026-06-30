// ============================================================
// ObservationConnections — Painel de Conexões
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Seletores simples agora.
// Arquitetura preparada para conexões inteligentes no futuro.
// ============================================================

import type { ConexaoCaderno } from '../types'
import styles from './ObservationConnections.module.css'

interface ObservationConnectionsProps {
  conexoes: ConexaoCaderno[]
}

const TIPO_META: Record<ConexaoCaderno['tipo'], { label: string; icone: string }> = {
  ativo:      { label: 'Ativo',        icone: '⚗️' },
  formula:    { label: 'Fórmula',      icone: '🧪' },
  referencia: { label: 'Referência',   icone: '📄' },
  caso:       { label: 'Caso Clínico', icone: '🧬' },
  protocolo:  { label: 'Protocolo',    icone: '📋' },
  colecao:    { label: 'Coleção',      icone: '📚' },
}

const GRUPOS: ConexaoCaderno['tipo'][] = [
  'ativo', 'formula', 'referencia', 'caso', 'protocolo', 'colecao',
]

export function ObservationConnections({ conexoes }: ObservationConnectionsProps) {
  // Agrupar por tipo
  const porTipo = GRUPOS.reduce<Record<string, ConexaoCaderno[]>>((acc, tipo) => {
    const lista = conexoes.filter((c) => c.tipo === tipo)
    if (lista.length > 0) acc[tipo] = lista
    return acc
  }, {})

  const temConexoes = conexoes.length > 0

  return (
    <div className={styles.painel}>
      <h3 className={styles.titulo}>Conexões</h3>

      {!temConexoes ? (
        <p className={styles.vazio}>
          Esta observação ainda não está conectada a outras entidades da Biblioteca.
        </p>
      ) : (
        <div className={styles.grupos}>
          {Object.entries(porTipo).map(([tipo, lista]) => {
            const meta = TIPO_META[tipo as ConexaoCaderno['tipo']]!
            return (
              <div key={tipo} className={styles.grupo}>
                <div className={styles.grupoLabel}>
                  <span className={styles.grupoIcone} aria-hidden="true">{meta.icone}</span>
                  {meta.label}
                  <span className={styles.grupoCont}>{lista.length}</span>
                </div>
                <ul className={styles.lista}>
                  {lista.map((conexao) => (
                    <li key={conexao.id} className={styles.item}>
                      <span className={styles.itemLabel}>{conexao.label}</span>
                      {conexao.nota && (
                        <span className={styles.itemNota}>{conexao.nota}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}

      {/* Nota sobre futuro */}
      <p className={styles.futuro}>
        Conexões inteligentes baseadas em padrões — em construção.
      </p>
    </div>
  )
}
