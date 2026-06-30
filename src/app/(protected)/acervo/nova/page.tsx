// ============================================================
// Acervo Científico — Nova Referência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================

import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { referenciaService } from '@/features/acervo/application/ReferenciaService'
import { NovaReferenciaClient } from './NovaReferenciaClient'
import styles from './page.module.css'

export const metadata = {
  title: 'Registrar Referência · Acervo Científico',
}

export default async function NovaReferenciaPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const tags = await referenciaService.getTagsTenant(tenantId).catch(() => [])

  return (
    <div className={styles.pagina}>
      <nav className={styles.nav}>
        <Link href="/acervo" className={styles.voltar}>← Acervo Científico</Link>
      </nav>
      <header className={styles.header}>
        <h1 className={styles.titulo}>Registrar referência</h1>
        <p className={styles.subtitulo}>
          Toda boa observação merece uma fonte.
        </p>
      </header>
      <NovaReferenciaClient tagsDisponiveis={tags} />
    </div>
  )
}
