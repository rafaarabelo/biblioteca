// /casos/[id] — Detalhe do Caso Clínico
// Server Component

import { notFound }             from 'next/navigation'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { casoService }          from '@/features/casos/application/CasoService'
import { CaseSummary }          from '@/features/casos/components/CaseSummary'
import { CaseStatus }           from '@/features/casos/components/CaseStatus'
import { CaseTimeline }         from '@/features/casos/components/CaseTimeline'
import { ClinicalPhotoGallery } from '@/features/casos/components/ClinicalPhotoGallery'
import { CaseConnections }      from '@/features/casos/components/CaseConnections'
import { CaseHistory }          from '@/features/casos/components/CaseHistory'
import { getAuthContext }       from '@/lib/supabase/server'
import { CasoDetalheClient }    from './CasoDetalheClient'
import styles                   from './page.module.css'

export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const auth = await getAuthContext()
    const tenantId = auth?.claims?.tenant_id ?? ''
    const caso = await casoService.getById(tenantId, params.id)
    if (!caso) return { title: 'Caso clínico' }
    return {
      title: `${caso.codigoAnonimizado ?? 'Caso'} — Casos Clínicos`,
      description: caso.objetivoPrincipal ?? 'Caso clínico registrado',
    }
  } catch {
    return { title: 'Caso clínico' }
  }
}

export default async function CasoDetalhePage({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const caso = await casoService.getById(tenantId, params.id)

  if (!caso) notFound()

  const dataInicio = new Date(caso.abertoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const dataAtualizacao = new Date(caso.atualizadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <div className={styles.pagina}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/casos" className={styles.breadcrumbLink}>Casos Clínicos</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <span className={styles.breadcrumbAtual}>
          {caso.codigoAnonimizado ?? `Caso #${params.id.slice(-6).toUpperCase()}`}
        </span>
      </nav>

      {/* Layout principal: 1fr 300px */}
      <div className={styles.grid}>

        {/* ── Coluna principal ── */}
        <main className={styles.principal}>
          {/* Cabeçalho */}
          <div className={styles.cabecalho}>
            <div className={styles.cabecalhoTop}>
              <span className={styles.codigo}>
                {caso.codigoAnonimizado ?? `#${params.id.slice(-6).toUpperCase()}`}
              </span>
              <CaseStatus status={caso.status} />
            </div>

            {caso.objetivoPrincipal && (
              <h1 className={styles.titulo}>{caso.objetivoPrincipal}</h1>
            )}

            {caso.queixaPrincipal && (
              <p className={styles.queixa}>{caso.queixaPrincipal}</p>
            )}

            {/* Tags */}
            {caso.tags && caso.tags.length > 0 && (
              <div className={styles.tags}>
                {caso.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Resumo clínico */}
          <section className={styles.secao} aria-label="Resumo clínico">
            <CaseSummary caso={caso} />
          </section>

          {/* Timeline de evoluções */}
          <section className={styles.secao} aria-label="Evolução clínica">
            <h2 className={styles.secaoTitulo}>Evolução clínica</h2>
            <CaseTimeline evolucoes={caso.evolucoes} />
          </section>

          {/* Fotos clínicas */}
          <section className={styles.secao} aria-label="Documentação fotográfica">
            <h2 className={styles.secaoTitulo}>Documentação fotográfica</h2>
            <ClinicalPhotoGallery fotos={caso.fotos} casoId={caso.id} />
          </section>

          {/* Conexões */}
          <section className={styles.secao} aria-label="Conexões clínicas">
            <h2 className={styles.secaoTitulo}>Conexões</h2>
            <CaseConnections conexoes={caso.conexoes} />
          </section>
        </main>

        {/* ── Lateral ── */}
        <aside className={styles.lateral} aria-label="Ações e informações do caso">

          {/* Ações (client) */}
          <div className={styles.lateralBloco}>
            <CasoDetalheClient caso={caso} />
          </div>

          {/* Metadados */}
          <div className={styles.lateralBloco}>
            <h3 className={styles.lateralTitulo}>Informações</h3>
            <dl className={styles.meta}>
              <dt className={styles.metaTerm}>Início</dt>
              <dd className={styles.metaDesc}>{dataInicio}</dd>

              <dt className={styles.metaTerm}>Última atualização</dt>
              <dd className={styles.metaDesc}>{dataAtualizacao}</dd>

              <dt className={styles.metaTerm}>Registros</dt>
              <dd className={styles.metaDesc}>{caso.totalEvolucoes}</dd>

              <dt className={styles.metaTerm}>Fotos</dt>
              <dd className={styles.metaDesc}>{caso.totalFotos}</dd>

              {caso.encerradoEm && (
                <>
                  <dt className={styles.metaTerm}>Encerrado em</dt>
                  <dd className={styles.metaDesc}>
                    {new Date(caso.encerradoEm).toLocaleDateString('pt-BR')}
                  </dd>
                </>
              )}
            </dl>
          </div>

          {/* Histórico compacto */}
          {caso.evolucoes.length > 0 && (
            <div className={styles.lateralBloco}>
              <h3 className={styles.lateralTitulo}>Histórico</h3>
              <CaseHistory evolucoes={caso.evolucoes} />
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
