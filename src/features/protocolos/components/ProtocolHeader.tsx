// ============================================================
// ProtocolHeader — Cabeçalho do Módulo de Protocolos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import Link from 'next/link'
import styles from './ProtocolHeader.module.css'

interface ProtocolHeaderProps {
  total: number
}

export function ProtocolHeader({ total }: ProtocolHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titulo}>
        <h1 className={styles.h1}>Protocolos Inteligentes</h1>
        {total > 0 && (
          <span className={styles.contador} aria-label={`${total} protocolos`}>
            {total}
          </span>
        )}
      </div>
      <Link href="/protocolos/novo" className={styles.novo}>
        Novo protocolo
      </Link>
    </div>
  )
}
