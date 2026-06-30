// ============================================================
// Caderno de Campo — Página Principal
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Server Component. Dados reais via cadernoService.
// Nenhum mock. Nenhum import do Supabase.
// ============================================================

import { Suspense } from 'react'
import { getAuthContext } from '@/lib/supabase/server'
import { cadernoService } from '@/features/caderno/application/CadernoService'
import { NotebookLayout } from '@/features/caderno/components/NotebookLayout'
import { NotebookHeader } from '@/features/caderno/components/NotebookHeader'
import { NotebookEmptyState } from '@/features/caderno/components/NotebookEmptyState'
import { NotebookLoading } from '@/features/caderno/components/NotebookLoading'
import { ObservationCard } from '@/features/caderno/components/ObservationCard'
import { CadernoInterativo } from './CadernoInterativo'

export const metadata = {
  title: 'Caderno de Campo',
}

// Revalidação a cada 30s: registros do Caderno mudam com frequência moderada
export const revalidate = 30

export default async function CadernoPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  // Busca inicial — primeiras 20 observações, mais recentes primeiro
  const [listagem, tags] = await Promise.all([
    cadernoService.listar(tenantId, { limite: 20, ordenar: 'mais_recente' })
      .catch(() => null),
    cadernoService.getTagsTenant(tenantId).catch(() => []),
  ])

  const total = listagem?.total ?? 0

  return (
    <Suspense fallback={<NotebookLoading />}>
      <NotebookLayout
        header={<NotebookHeader totalObservacoes={total} />}
        sidebar={
          <CadernoInterativo
            modo="sidebar"
            tagsDisponiveis={tags}
            tipoAtivo={null}
            statusAtivo={null}
          />
        }
      >
        {/* Busca integrada */}
        <CadernoInterativo modo="busca" />

        {/* Lista de observações */}
        {listagem && listagem.observacoes.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
            {listagem.observacoes.map((obs) => (
              <ObservationCard key={obs.id} observacao={obs} />
            ))}
          </div>
        ) : (
          <NotebookEmptyState tipo="caderno" />
        )}
      </NotebookLayout>
    </Suspense>
  )
}
