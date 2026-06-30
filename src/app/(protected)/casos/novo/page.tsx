// /casos/novo — Novo caso clínico
// Server Component

import Link             from 'next/link'
import { casoService }    from '@/features/casos/application/CasoService'
import { getAuthContext } from '@/lib/supabase/server'
import { NovoCasoClient } from './NovoCasoClient'
import styles from './novo.module.css'

export default async function NovoCasoPage() {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const tags = await casoService.getTagsTenant(tenantId)

  return (
    <div className={styles.pagina}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/casos" className={styles.breadcrumbLink}>Casos Clínicos</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <span className={styles.breadcrumbAtual}>Novo caso</span>
      </nav>

      {/* Cabeçalho */}
      <div className={styles.cabecalho}>
        <h1 className={styles.titulo}>Novo caso clínico</h1>
        <p className={styles.subtitulo}>
          Cada caso começa com uma escuta. Registre o que você observa, não o que você supõe.
        </p>
      </div>

      {/* Formulário */}
      <NovoCasoClient tagsDisponiveis={tags} />
    </div>
  )
}
