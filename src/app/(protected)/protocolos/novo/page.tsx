// ============================================================
// Protocolos — Novo Protocolo
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { protocoloService } from '@/features/protocolos/application/ProtocoloService'
import { NovoProtocoloClient } from './NovoProtocoloClient'
import styles from './page.module.css'

export const metadata = {
  title: 'Novo Protocolo',
}

export default async function NovoProtocoloPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const tags = await protocoloService.getTagsTenant(tenantId).catch(() => [])

  return (
    <div className={styles.pagina}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/protocolos" className={styles.breadcrumbLink}>Protocolos</Link>
        <span className={styles.separador} aria-hidden="true">/</span>
        <span className={styles.breadcrumbAtual}>Novo protocolo</span>
      </nav>

      {/* Cabeçalho */}
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>Novo protocolo</h1>
        <p className={styles.subtitulo}>
          Protocolos amadurecem. Comece com o que você sabe. Revise com o que aprender.
        </p>
      </div>

      {/* Formulário */}
      <NovoProtocoloClient tagsDisponiveis={tags} />
    </div>
  )
}
