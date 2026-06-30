// ============================================================
// ScientificLibraryLayout — Layout do Acervo Científico
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Usa PhotoLayout para alinhar com a fotografia de fundo.
// Server Component.
// ============================================================

import type { ReactNode } from 'react'
import { PhotoLayout } from '@/components/layout/PhotoLayout'

interface ScientificLibraryLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function ScientificLibraryLayout({
  header,
  sidebar,
  children,
}: ScientificLibraryLayoutProps) {
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
