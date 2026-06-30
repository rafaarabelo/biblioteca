// ============================================================
// Protocolos — Página Principal
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================
// Server Component. Dados reais via protocoloService.
// Nenhum mock. Nenhum import do Supabase.
// ============================================================

import { Suspense } from 'react'
import { getAuthContext } from '@/lib/supabase/server'
import { protocoloService } from '@/features/protocolos/application/ProtocoloService'
import { ProtocolLayout } from '@/features/protocolos/components/ProtocolLayout'
import { ProtocolHeader } from '@/features/protocolos/components/ProtocolHeader'
import { ProtocolLoading } from '@/features/protocolos/components/ProtocolLoading'
import { ProtocoloInterativo, ProtocoloSidebar } from './ProtocoloInterativo'

export const metadata = {
  title: 'Protocolos Inteligentes',
}

// Revalidação a cada 30s
export const revalidate = 30

export default async function ProtocolosPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const [protocolos, tags] = await Promise.all([
    protocoloService.listar(tenantId, { limite: 20, ordenar: 'recente' }).catch(() => []),
    protocoloService.getTagsTenant(tenantId).catch(() => []),
  ])

  const total = protocolos.length

  return (
    <Suspense fallback={<ProtocolLoading />}>
      <ProtocolLayout
        header={<ProtocolHeader total={total} />}
        sidebar={<ProtocoloSidebar tagsDisponiveis={tags} />}
      >
        <ProtocoloInterativo
          protocolosIniciais={protocolos}
          tagsDisponiveis={tags}
        />
      </ProtocolLayout>
    </Suspense>
  )
}
