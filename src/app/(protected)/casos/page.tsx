// /casos — Listagem de Casos Clínicos
// Server Component

import { Suspense } from 'react'
import { ClinicalLayout } from '@/features/casos/components/ClinicalLayout'
import { CaseHeader }     from '@/features/casos/components/CaseHeader'
import { CaseLoading }    from '@/features/casos/components/CaseLoading'
import { casoService }    from '@/features/casos/application/CasoService'
import { getAuthContext } from '@/lib/supabase/server'
import { CasoInterativo, CasoSidebarClient } from './CasoInterativo'

export const revalidate = 30

export default async function CasosPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const [casos, tags] = await Promise.all([
    casoService.listar(tenantId, { limite: 50 }),
    casoService.getTagsTenant(tenantId),
  ])

  return (
    <ClinicalLayout
      header={<CaseHeader total={casos.length} />}
      sidebar={<CasoSidebarClient tagsDisponiveis={tags} />}
    >
      <Suspense fallback={<CaseLoading />}>
        <CasoInterativo
          casosIniciais={casos}
          tagsDisponiveis={tags}
        />
      </Suspense>
    </ClinicalLayout>
  )
}
