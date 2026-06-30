// /formulas — Listagem de Fórmulas
// Server Component — Capítulo V

import { Suspense }        from 'react'
import type { Metadata }   from 'next'
import { FormulaLayout }   from '@/features/formulas/components/FormulaLayout'
import { FormulaHeader }   from '@/features/formulas/components/FormulaHeader'
import { FormulaLoading }  from '@/features/formulas/components/FormulaLoading'
import { formulaService }  from '@/features/formulas/application/FormulaService'
import { getAuthContext }  from '@/lib/supabase/server'
import { FormulaInterativo, FormulaSidebarClient } from './FormulaInterativo'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Fórmulas — A Biblioteca',
  description: 'Formulações cosméticas com histórico completo de versões.',
}

export default async function FormulasPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const [formulas, tags] = await Promise.all([
    formulaService.listar(tenantId, { limite: 50 }),
    formulaService.getTagsTenant(tenantId),
  ])

  return (
    <FormulaLayout
      header={<FormulaHeader total={formulas.length} />}
      sidebar={<FormulaSidebarClient tagsDisponiveis={tags} />}
    >
      <Suspense fallback={<FormulaLoading />}>
        <FormulaInterativo
          formulasIniciais={formulas}
          tagsDisponiveis={tags}
        />
      </Suspense>
    </FormulaLayout>
  )
}
