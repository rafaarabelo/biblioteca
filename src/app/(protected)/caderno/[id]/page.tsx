// ============================================================
// Caderno de Campo — Detalhe da Observação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Server Component. Dados reais via cadernoService.
// Revisa via Client Component (RevisaoEditor).
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { cadernoService } from '@/features/caderno/application/CadernoService'
import { TIPOS_OBSERVACAO } from '@/features/caderno/types'
import { ObservationTimeline } from '@/features/caderno/components/ObservationTimeline'
import { ObservationConnections } from '@/features/caderno/components/ObservationConnections'
import { ObservationStatus } from '@/features/caderno/components/ObservationStatus'
import { ObservacaoDetalheClient } from './ObservacaoDetalheClient'
import styles from './page.module.css'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 0 // detalhe sempre fresco

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const obs = await cadernoService.getById(tenantId, id).catch(() => null)
  return {
    title: obs ? `${obs.titulo} — Caderno de Campo` : 'Observação',
  }
}

export default async function ObservacaoPage({ params }: Props) {
  const { id } = await params
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const obs = await cadernoService.getById(tenantId, id)
  if (!obs) notFound()

  const tipoMeta = TIPOS_OBSERVACAO[obs.tipo]

  return (
    <div className={styles.pagina}>
      {/* Navegação de retorno */}
      <nav className={styles.nav} aria-label="Navegação">
        <Link href="/caderno" className={styles.voltar}>
          ← Caderno de Campo
        </Link>
      </nav>

      <div className={styles.corpo}>
        {/* ─── Coluna principal ────────────────── */}
        <article className={styles.principal} aria-label="Observação">
          {/* Tipo + favorito */}
          <div className={styles.metaTopo}>
            <span className={styles.tipo}>
              <span className={styles.tipoIcone} aria-hidden="true">{tipoMeta.icone}</span>
              {tipoMeta.label}
            </span>
            {obs.favorito && (
              <span className={styles.favorito} title="Favorito" aria-label="Favorito">★</span>
            )}
          </div>

          {/* Título */}
          <h1 className={styles.titulo}>{obs.titulo}</h1>

          {/* Status + data */}
          <div className={styles.metaStatus}>
            <ObservationStatus status={obs.statusEpistemico} />
            <time className={styles.data} dateTime={obs.atualizadoEm}>
              {formatarData(obs.atualizadoEm)}
            </time>
            {obs.totalVersoes > 1 && (
              <span className={styles.versoes}>
                {obs.totalVersoes} versões
              </span>
            )}
          </div>

          {/* Tags */}
          {obs.tags.length > 0 && (
            <div className={styles.tags} aria-label="Tags">
              {obs.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}

          {/* Conteúdo atual — com revisão integrada */}
          <ObservacaoDetalheClient observacao={obs} />
        </article>

        {/* ─── Painel lateral ──────────────────── */}
        <aside className={styles.lateral} aria-label="Painel lateral">
          {/* Linha do tempo */}
          <section>
            <ObservationTimeline
              versoes={obs.versoes}
              criadoEm={obs.criadoEm}
            />
          </section>

          {/* Conexões */}
          <section>
            <ObservationConnections conexoes={obs.conexoes} />
          </section>
        </aside>
      </div>
    </div>
  )
}

function formatarData(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}
