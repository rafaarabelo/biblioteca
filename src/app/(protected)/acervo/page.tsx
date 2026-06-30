// ============================================================
// Acervo Científico — Página Principal
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Server Component. Dados reais via referenciaService.
// Nenhum mock. Nenhum import do Supabase.
// ============================================================

import { Suspense } from 'react'
import { getAuthContext } from '@/lib/supabase/server'
import { referenciaService } from '@/features/acervo/application/ReferenciaService'
import { ScientificLibraryLayout } from '@/features/acervo/components/ScientificLibraryLayout'
import { ReferenceHeader } from '@/features/acervo/components/ReferenceHeader'
import { ReferenceLoading } from '@/features/acervo/components/ReferenceLoading'
import { AcervoInterativo, AcervoFiltrosSidebar } from './AcervoInterativo'

export const metadata = {
  title: 'Acervo Científico',
}

// Revalidação a cada 30s: acervo muda com frequência moderada
export const revalidate = 30

export default async function AcervoPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const [listagem, tags] = await Promise.all([
    referenciaService.listar(tenantId, { limite: 30, ordenar: 'mais_recente' })
      .catch(() => null),
    referenciaService.getTagsTenant(tenantId).catch(() => []),
  ])

  const referencias = listagem?.referencias ?? []
  const total = listagem?.total ?? 0

  return (
    <Suspense fallback={<ReferenceLoading />}>
      <ScientificLibraryLayout
        header={<ReferenceHeader totalReferencias={total} />}
        sidebar={<AcervoFiltrosSidebar tagsDisponiveis={tags} />}
      >
        <AcervoInterativo
          referenciasIniciais={referencias}
          tagsDisponiveis={tags}
        />
      </ScientificLibraryLayout>
    </Suspense>
  )
}
