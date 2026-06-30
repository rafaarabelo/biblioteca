// ============================================================
// ProtocolLayout — Layout do Módulo de Protocolos
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Usa PhotoLayout para alinhar com a fotografia de fundo.

import type { ReactNode } from 'react'
import { PhotoLayout } from '@/components/layout/PhotoLayout'

interface ProtocolLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function ProtocolLayout({ header, sidebar, children }: ProtocolLayoutProps) {
  return (
    <PhotoLayout
      header={header}
      sidebar={sidebar}
      columns={2}
    >
      {children}
    </PhotoLayout>
  )
}
