// ============================================================
// Protocolos — Detalhe do Protocolo
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo III
// ============================================================

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { protocoloService } from '@/features/protocolos/application/ProtocoloService'
import { ProtocolEvidence } from '@/features/protocolos/components/ProtocolEvidence'
import { ProtocolSequence } from '@/features/protocolos/components/ProtocolSequence'
import { ProtocolResumoEtapas } from '@/features/protocolos/components/ProtocolResumoEtapas'
import { ProtocolContraindications } from '@/features/protocolos/components/ProtocolContraindications'
import { ProtocolConnections } from '@/features/protocolos/components/ProtocolConnections'
import { ProtocolTimeline } from '@/features/protocolos/components/ProtocolTimeline'
import { ProtocolVersionHistory } from '@/features/protocolos/components/ProtocolVersionHistory'
import { ProtocoloDetalheClient } from './ProtocoloDetalheClient'
import { ProtocoloDetalheTabs } from './ProtocoloDetalheTabs'
import type { AbaProtocolo } from './ProtocoloDetalheTabs'
import styles from './page.module.css'

export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const protocolo = await protocoloService.getById(tenantId, params.id).catch(() => null)
  if (!protocolo) return { title: 'Protocolo não encontrado' }
  return { title: `${protocolo.titulo} · Protocolos` }
}

export default async function ProtocoloDetalhePage({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''

  const [protocolo, tags] = await Promise.all([
    protocoloService.getById(tenantId, params.id).catch(() => null),
    protocoloService.getTagsTenant(tenantId).catch(() => []),
  ])

  if (!protocolo) notFound()

  // notFound() throws — protocolo é não-nulo daqui em diante.
  // TypeScript não estreita o tipo em closures, então usamos asserção explícita.
  const p = protocolo!
  const versaoAtiva = p.versaoAtiva
  const fases = versaoAtiva?.fases ?? []
  const historicoVersoes = p.historicoVersoes ?? []

  // Separa conexões por tipo para a sidebar
  const conexoesCasos    = p.conexoes.filter((c) => c.tipo === 'caso')
  const conexoesRefs     = p.conexoes.filter((c) => c.tipo === 'referencia')
  const conexoesFmulas   = p.conexoes.filter((c) => c.tipo === 'formula')
  const temRecursos      = conexoesCasos.length > 0 || conexoesRefs.length > 0 || conexoesFmulas.length > 0

  // Conteúdo de cada aba
  function renderAba(aba: AbaProtocolo) {
    switch (aba) {

      case 'visao-geral':
        return (
          <>
            {/* Resumo */}
            {versaoAtiva?.descricao && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Resumo do Protocolo</h2>
                <p className={styles.texto}>{versaoAtiva.descricao}</p>
              </section>
            )}

            {/* Objetivos terapêuticos — maturidade + duração + frequência */}
            {(versaoAtiva?.objetivo || versaoAtiva?.duracaoSemanas || versaoAtiva?.frequenciaSessoes) && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Objetivos Terapêuticos</h2>
                {versaoAtiva.objetivo && (
                  <p className={styles.textoItalico}>{versaoAtiva.objetivo}</p>
                )}
                <div className={styles.chips}>
                  <ProtocolEvidence maturidade={p.maturidade} compacto />
                  {versaoAtiva.duracaoSemanas && (
                    <span className={styles.chip}>{versaoAtiva.duracaoSemanas} semanas</span>
                  )}
                  {versaoAtiva.frequenciaSessoes && (
                    <span className={styles.chip}>{versaoAtiva.frequenciaSessoes}</span>
                  )}
                </div>
              </section>
            )}

            {/* Resumo das etapas — timeline horizontal */}
            {fases.length > 0 && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Resumo das Etapas</h2>
                <ProtocolResumoEtapas fases={fases} />
              </section>
            )}

            {/* Indicações */}
            {versaoAtiva?.indicacoes && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Indicações</h2>
                <p className={styles.texto}>{versaoAtiva.indicacoes}</p>
              </section>
            )}

            {/* Condições relacionadas — tags */}
            {p.tags && p.tags.length > 0 && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Condições Relacionadas</h2>
                <div className={styles.tags}>
                  {p.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </section>
            )}
          </>
        )

      case 'etapas':
        return (
          <section className={styles.secao}>
            <h2 className={styles.secaoTitulo}>Sequência de aplicação</h2>
            <ProtocolSequence fases={fases} />
          </section>
        )

      case 'ingredientes':
        return (
          <div className={styles.emBreve}>
            <span className={styles.emBreveIcone} aria-hidden="true">⚗</span>
            <p className={styles.emBreveTexto}>
              O mapeamento de ingredientes por fase estará disponível em breve.
            </p>
          </div>
        )

      case 'evolucao':
        return (
          <>
            <section className={styles.secao}>
              <h2 className={styles.secaoTitulo}>Linha do tempo</h2>
              <ProtocolTimeline
                criadoEm={p.criadoEm}
                atualizadoEm={p.atualizadoEm}
                totalVersoes={p.totalVersoes}
              />
            </section>
            {historicoVersoes.length > 0 && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Histórico de revisões</h2>
                <ProtocolVersionHistory versoes={historicoVersoes} />
              </section>
            )}
          </>
        )

      case 'reflexoes':
        return (
          <>
            <ProtocolContraindications contraindicacoes={versaoAtiva?.contraindicacoes ?? null} />
            {versaoAtiva?.observacoesImportantes && (
              <section className={styles.secao}>
                <h2 className={styles.secaoTitulo}>Observações clínicas</h2>
                <blockquote className={styles.obs}>
                  {versaoAtiva.observacoesImportantes}
                </blockquote>
              </section>
            )}
            {!versaoAtiva?.contraindicacoes && !versaoAtiva?.observacoesImportantes && (
              <p className={styles.textoVazio}>Nenhuma reflexão registrada nesta versão.</p>
            )}
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.pagina}>

      {/* ── Breadcrumb + Header ───────────────── */}
      <div className={styles.cabecalhoArea}>
        <nav className={styles.nav} aria-label="Navegação">
          <Link href="/protocolos" className={styles.voltar}>← Protocolos de Uso</Link>
        </nav>

        <div className={styles.headerPrincipal}>
          <div className={styles.headerEsquerda}>
            {p.codigoInterno && (
              <span className={styles.codigo}>{p.codigoInterno}</span>
            )}
            <h1 className={styles.titulo}>{p.titulo}</h1>
            {versaoAtiva?.objetivo && (
              <p className={styles.objetivo}>{versaoAtiva.objetivo}</p>
            )}
          </div>

          <div className={styles.headerAcoes}>
            <ProtocoloDetalheClient protocolo={p} tagsDisponiveis={tags} />
          </div>
        </div>

        <div className={styles.maturidadeRow}>
          <ProtocolEvidence maturidade={p.maturidade} />
        </div>
      </div>

      {/* ── Grid: Conteúdo + Lateral ─────────── */}
      <div className={styles.grid}>

        {/* COLUNA PRINCIPAL — tabs */}
        <article className={styles.principal}>
          <ProtocoloDetalheTabs>
            {(aba) => renderAba(aba)}
          </ProtocoloDetalheTabs>
        </article>

        {/* COLUNA LATERAL */}
        <aside className={styles.lateral}>

          {/* Implementação Recomendada */}
          {(versaoAtiva?.duracaoSemanas || versaoAtiva?.frequenciaSessoes || p.totalCasos > 0) && (
            <section className={styles.secaoLateral}>
              <h2 className={styles.secaoTituloLateral}>Implementação Recomendada</h2>
              <ul className={styles.implementacao}>
                {versaoAtiva?.duracaoSemanas && (
                  <li className={styles.implementacaoItem}>
                    <span className={styles.implDot} data-color="green" aria-hidden="true" />
                    <span className={styles.implLabel}>Duração</span>
                    <span className={styles.implValor}>{versaoAtiva.duracaoSemanas} semanas</span>
                  </li>
                )}
                {versaoAtiva?.frequenciaSessoes && (
                  <li className={styles.implementacaoItem}>
                    <span className={styles.implDot} data-color="amber" aria-hidden="true" />
                    <span className={styles.implLabel}>Frequência</span>
                    <span className={styles.implValor}>{versaoAtiva.frequenciaSessoes}</span>
                  </li>
                )}
                {versaoAtiva?.autor && (
                  <li className={styles.implementacaoItem}>
                    <span className={styles.implDot} data-color="gray" aria-hidden="true" />
                    <span className={styles.implLabel}>Autoria</span>
                    <span className={styles.implValor}>{versaoAtiva.autor}</span>
                  </li>
                )}
                {p.totalCasos > 0 && (
                  <li className={styles.implementacaoItem}>
                    <span className={styles.implDot} data-color="blue" aria-hidden="true" />
                    <span className={styles.implLabel}>Casos clínicos</span>
                    <span className={styles.implValor}>{p.totalCasos}</span>
                  </li>
                )}
                <li className={styles.implementacaoItem}>
                  <span className={styles.implDot} data-color="gray" aria-hidden="true" />
                  <span className={styles.implLabel}>Versão</span>
                  <span className={styles.implValor}>v{versaoAtiva?.numeroVersao ?? 1}</span>
                </li>
              </ul>
            </section>
          )}

          {/* Recursos Relacionados */}
          {temRecursos && (
            <section className={styles.secaoLateral}>
              <h2 className={styles.secaoTituloLateral}>Recursos Relacionados</h2>
              <ul className={styles.recursos}>
                {conexoesRefs.length > 0 && (
                  <li className={styles.recursoItem}>
                    <Link href="/acervo" className={styles.recursoLink}>
                      <span className={styles.recursoIcone} aria-hidden="true">📄</span>
                      <span>Acervo Científico</span>
                      <span className={styles.recursoContador}>{conexoesRefs.length}</span>
                      <span className={styles.recursoArrow} aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
                {conexoesCasos.length > 0 && (
                  <li className={styles.recursoItem}>
                    <Link href="/casos" className={styles.recursoLink}>
                      <span className={styles.recursoIcone} aria-hidden="true">🧬</span>
                      <span>Casos Clínicos</span>
                      <span className={styles.recursoContador}>{conexoesCasos.length}</span>
                      <span className={styles.recursoArrow} aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
                {conexoesFmulas.length > 0 && (
                  <li className={styles.recursoItem}>
                    <Link href="/formulas" className={styles.recursoLink}>
                      <span className={styles.recursoIcone} aria-hidden="true">⚗</span>
                      <span>Fórmulas</span>
                      <span className={styles.recursoContador}>{conexoesFmulas.length}</span>
                      <span className={styles.recursoArrow} aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Anotações da Aurora */}
          <section className={styles.secaoLateral}>
            <h2 className={styles.secaoTituloLateral}>Anotações da Aurora</h2>
            <div className={styles.auroraCard}>
              <p className={styles.auroraTexto}>
                Observe os padrões entre sessões antes de ajustar o protocolo.
                Os sinais sutis também são dados.
              </p>
              <footer className={styles.auroraAssinatura}>A.</footer>
            </div>
          </section>

          {/* Conexões completas (outros tipos) */}
          {p.conexoes.length > 0 && (
            <section className={styles.secaoLateral}>
              <h2 className={styles.secaoTituloLateral}>Conexões</h2>
              <ProtocolConnections conexoes={p.conexoes} />
            </section>
          )}

        </aside>
      </div>
    </div>
  )
}
