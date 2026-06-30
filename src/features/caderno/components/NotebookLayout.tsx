// ============================================================
// NotebookLayout — Layout principal do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Usa PhotoLayout para alinhar com a fotografia de fundo.
// Server Component (sem 'use client').
// ============================================================

import type { ReactNode } from 'react'
import { PhotoLayout } from '@/components/layout/PhotoLayout'

interface NotebookLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function NotebookLayout({ header, sidebar, children }: NotebookLayoutProps) {
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
