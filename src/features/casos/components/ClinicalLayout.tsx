// ClinicalLayout — Layout principal de Casos Clínicos
// Usa PhotoLayout para alinhar com a fotografia de fundo.

import type { ReactNode } from 'react'
import { PhotoLayout } from '@/components/layout/PhotoLayout'

interface ClinicalLayoutProps {
  header: ReactNode
  sidebar: ReactNode
  children: ReactNode
}

export function ClinicalLayout({ header, sidebar, children }: ClinicalLayoutProps) {
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
