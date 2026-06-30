// FormulaLayout — Layout principal de Fórmulas
// Capítulo V: Fórmulas
// Usa PhotoLayout para alinhar com a fotografia de fundo.

import type { ReactNode } from 'react'
import { PhotoLayout } from '@/components/layout/PhotoLayout'

interface FormulaLayoutProps {
  header:   ReactNode
  sidebar:  ReactNode
  children: ReactNode
}

export function FormulaLayout({ header, sidebar, children }: FormulaLayoutProps) {
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
