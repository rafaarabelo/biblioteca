// ============================================================
// Acervo Científico — Detalhe da Referência
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Server Component. Grid 1fr + 300px.
// Principal: título, evidência, conteúdo completo.
// Lateral: metadados, timeline, conexões.
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { referenciaService } from '@/features/acervo/application/ReferenciaService'
import { ReferenceMetadata } from '@/features/acervo/components/ReferenceMetadata'
import { ReferenceConnections } from '@/features/acervo/components/ReferenceConnections'
import { ReferenceEvidence } from '@/features/acervo/components/ReferenceEvidence'
import { ReferenceTimeline } from '@/features/acervo/components/ReferenceTimeline'
import { TIPOS_ESTUDO } from '@/features/acervo/types'
import { ReferenciaDetalheClient } from './ReferenciaDetalheClient'
import styles from './page.module.css'

export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const referencia = await referenciaService.getById(tenantId, params.id).catch(() => null)
  if (!referencia) return { title: 'Referência não encontrada' }
  return { title: `${referencia.titulo} · Acervo Científico` }
}

export default async function ReferenciaDetalhePage({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const referencia = await referenciaService.getById(tenantId, params.id).catch(() => null)
  if (!referencia) notFound()

  const tipoMeta = referencia.tipoEstudo ? TIPOS_ESTUDO[referencia.tipoEstudo] : null

  return (
    <div className={styles.pagina}>

      {/* Breadcrumb */}
      <nav className={styles.nav} aria-label="Navegação">
        <Link href="/acervo" className={styles.voltar}>← Acervo Científico</Link>
      </nav>

      {/* Grid principal */}
      <div className={styles.grid}>

        {/* COLUNA PRINCIPAL */}
        <article className={styles.principal}>

          {/* Cabeçalho da referência */}
          <header className={styles.cabecalho}>
            {tipoMeta && (
              <div className={styles.tipo}>
                <span aria-hidden="true">{tipoMeta.icone}</span>
                {tipoMeta.label}
              </div>
            )}
            <div className={styles.tituloLinha}>
              <h1 className={styles.titulo}>{referencia.titulo}</h1>
              {/* Favorito — client interativo */}
              <ReferenciaDetalheClient
                referencia={referencia}
                modo="favorito"
              />
            </div>
            {referencia.nivelEvidencia && (
              <div className={styles.evidencia}>
                <ReferenceEvidence nivel={referencia.nivelEvidencia} />
              </div>
            )}
          </header>

          {/* Citação bibliográfica */}
          {(referencia.autores.length > 0 || referencia.journal || referencia.anoPublicacao) && (
            <p className={styles.citacao}>
              {referencia.autores.length > 0 && (
                <span>{referencia.autores.join(', ')}</span>
              )}
              {referencia.anoPublicacao && (
                <span className={styles.ano}> ({referencia.anoPublicacao})</span>
              )}
              {referencia.journal && (
                <span className={styles.journal}> · <em>{referencia.journal}</em></span>
              )}
            </p>
          )}

          {/* Corpo — client (editor + conteúdo) */}
          <ReferenciaDetalheClient
            referencia={referencia}
            modo="conteudo"
          />
        </article>

        {/* COLUNA LATERAL */}
        <aside className={styles.lateral}>

          {/* Ações rápidas */}
          <div className={styles.acoesSidebar}>
            <ReferenciaDetalheClient referencia={referencia} modo="acoes" />
          </div>

          {/* Metadados */}
          <section className={styles.secaoLateral}>
            <h2 className={styles.secaoTitulo}>Metadados</h2>
            <ReferenceMetadata referencia={referencia} />
          </section>

          {/* Conexões */}
          <section className={styles.secaoLateral}>
            <h2 className={styles.secaoTitulo}>Conexões</h2>
            <ReferenceConnections conexoes={referencia.conexoes} />
          </section>

          {/* Histórico */}
          <section className={styles.secaoLateral}>
            <h2 className={styles.secaoTitulo}>Histórico</h2>
            <ReferenceTimeline
              criadoEm={new Date(referencia.criadoEm)}
              atualizadoEm={new Date(referencia.atualizadoEm)}
            />
          </section>
        </aside>
      </div>
    </div>
  )
}
