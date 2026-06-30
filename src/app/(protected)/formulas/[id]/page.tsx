// /formulas/[id] — Detalhe da Fórmula
// Server Component — Capítulo V

import { notFound }              from 'next/navigation'
import type { Metadata }         from 'next'
import Link                      from 'next/link'
import { formulaService }        from '@/features/formulas/application/FormulaService'
import { FormulaStatus }         from '@/features/formulas/components/FormulaStatus'
import { FormulaComposition }    from '@/features/formulas/components/FormulaComposition'
import { FormulaVersionHistory } from '@/features/formulas/components/FormulaVersionHistory'
import { FormulaComparison }     from '@/features/formulas/components/FormulaComparison'
import { FormulaTimeline }       from '@/features/formulas/components/FormulaTimeline'
import { FormulaConnections }    from '@/features/formulas/components/FormulaConnections'
import { getAuthContext }        from '@/lib/supabase/server'
import { FormulaDetalheClient }  from './FormulaDetalheClient'
import styles from './page.module.css'

export const revalidate = 0

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const auth = await getAuthContext()
    const tenantId = auth?.claims?.tenant_id ?? ''
    const formula  = await formulaService.getById(tenantId, params.id)
    if (!formula) return { title: 'Fórmula' }
    return {
      title: `${formula.titulo} — Fórmulas`,
      description: formula.objetivo ?? 'Formulação cosmetológica',
    }
  } catch {
    return { title: 'Fórmula' }
  }
}

export default async function FormulaDetalhePage({ params }: Props) {
  const auth = await getAuthContext()
  const tenantId = auth?.claims?.tenant_id ?? ''
  const formula  = await formulaService.getById(tenantId, params.id)

  if (!formula) notFound()

  // Versão ativa
  const versaoAtiva = formula.versoes.find((v) => v.status === 'ativa') ?? formula.versoes[0]

  const dataAtualizacao = new Date(formula.atualizadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const dataCriacao = new Date(formula.criadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  return (
    <div className={styles.pagina}>

      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb} aria-label="Navegação">
        <Link href="/formulas" className={styles.breadcrumbLink}>Fórmulas</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
        <span className={styles.breadcrumbAtual}>
          {formula.codigoInterno ?? formula.titulo.slice(0, 24)}
        </span>
      </nav>

      {/* ── Grid principal ── */}
      <div className={styles.grid}>

        {/* ══════════════════════════════════
            Coluna principal
        ══════════════════════════════════ */}
        <main className={styles.principal}>

          {/* Cabeçalho */}
          <div className={styles.cabecalho}>
            <div className={styles.cabecalhoTop}>
              {formula.codigoInterno && (
                <span className={styles.codigo}>{formula.codigoInterno}</span>
              )}
              <FormulaStatus status={formula.statusVersao} />
            </div>

            <h1 className={styles.titulo}>{formula.titulo}</h1>

            {formula.objetivo && (
              <p className={styles.objetivo}>{formula.objetivo}</p>
            )}

            {formula.tags.length > 0 && (
              <div className={styles.tags}>
                {formula.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>

          {/* Meta da versão ativa */}
          {versaoAtiva && (
            <div className={styles.versaoMeta}>
              <div className={styles.versaoMetaItem}>
                <span className={styles.versaoMetaLabel}>Versão</span>
                <p className={styles.versaoMetaValor}>v{versaoAtiva.numeroVersao}</p>
              </div>
              {versaoAtiva.veiculo && (
                <div className={styles.versaoMetaItem}>
                  <span className={styles.versaoMetaLabel}>Veículo</span>
                  <p className={styles.versaoMetaValor}>{versaoAtiva.veiculo}</p>
                </div>
              )}
              {versaoAtiva.validadeDias && (
                <div className={styles.versaoMetaItem}>
                  <span className={styles.versaoMetaLabel}>Validade</span>
                  <p className={styles.versaoMetaValor}>{versaoAtiva.validadeDias} dias</p>
                </div>
              )}
              <div className={styles.versaoMetaItem}>
                <span className={styles.versaoMetaLabel}>Ativos</span>
                <p className={styles.versaoMetaValor}>{formula.totalAtivos}</p>
              </div>
            </div>
          )}

          {/* Composição */}
          {versaoAtiva && versaoAtiva.ingredientes.length > 0 && (
            <section className={styles.secao} aria-label="Composição">
              <h2 className={styles.secaoTitulo}>Composição</h2>
              <FormulaComposition ingredientes={versaoAtiva.ingredientes} />
            </section>
          )}

          {/* Modo de preparo */}
          {versaoAtiva?.modoPreparo && (
            <section className={styles.secao} aria-label="Modo de preparo">
              <h2 className={styles.secaoTitulo}>Modo de preparo</h2>
              <p className={styles.textoSecao}>{versaoAtiva.modoPreparo}</p>
            </section>
          )}

          {/* Modo de uso */}
          {versaoAtiva?.modoUso && (
            <section className={styles.secao} aria-label="Modo de uso">
              <h2 className={styles.secaoTitulo}>Modo de uso</h2>
              <p className={styles.textoSecao}>{versaoAtiva.modoUso}</p>
            </section>
          )}

          {/* Instruções / observações */}
          {versaoAtiva?.instrucoes && (
            <section className={styles.secao} aria-label="Observações">
              <h2 className={styles.secaoTitulo}>Observações</h2>
              <p className={styles.textoSecao}>{versaoAtiva.instrucoes}</p>
            </section>
          )}

          {/* Histórico de versões */}
          {formula.versoes.length > 0 && (
            <section className={styles.secao} aria-label="Histórico de versões">
              <h2 className={styles.secaoTitulo}>Histórico de versões</h2>
              <FormulaVersionHistory versoes={formula.versoes} />
            </section>
          )}

          {/* Comparação entre versões */}
          {formula.versoes.length >= 2 && (
            <section className={styles.secao} aria-label="Comparação entre versões">
              <h2 className={styles.secaoTitulo}>Alterações entre versões</h2>
              <FormulaComparison versoes={formula.versoes} />
            </section>
          )}

          {/* Timeline cronológica */}
          <section className={styles.secao} aria-label="Linha do tempo">
            <h2 className={styles.secaoTitulo}>Linha do tempo</h2>
            <FormulaTimeline versoes={formula.versoes} />
          </section>

        </main>

        {/* ══════════════════════════════════
            Coluna lateral
        ══════════════════════════════════ */}
        <aside className={styles.lateral} aria-label="Ações e conexões da fórmula">

          {/* Ações (client) */}
          <div className={styles.lateralBloco}>
            <FormulaDetalheClient formula={formula} />
          </div>

          {/* Metadados */}
          <div className={styles.lateralBloco}>
            <h3 className={styles.lateralTitulo}>Informações</h3>
            <dl className={styles.meta}>
              <dt className={styles.metaTerm}>Criada em</dt>
              <dd className={styles.metaDesc}>{dataCriacao}</dd>

              <dt className={styles.metaTerm}>Atualizada</dt>
              <dd className={styles.metaDesc}>{dataAtualizacao}</dd>

              <dt className={styles.metaTerm}>Versões</dt>
              <dd className={styles.metaDesc}>{formula.versoes.length}</dd>

              {formula.totalCasos > 0 && (
                <>
                  <dt className={styles.metaTerm}>Casos</dt>
                  <dd className={styles.metaDesc}>{formula.totalCasos}</dd>
                </>
              )}

              {formula.totalProtocolos > 0 && (
                <>
                  <dt className={styles.metaTerm}>Protocolos</dt>
                  <dd className={styles.metaDesc}>{formula.totalProtocolos}</dd>
                </>
              )}
            </dl>
          </div>

          {/* Indicações */}
          {versaoAtiva?.indicacoes && (
            <div className={styles.lateralBloco}>
              <h3 className={styles.lateralTitulo}>Indicações</h3>
              <p className={styles.textoSecao} style={{ fontSize: 'var(--texto-xs)' }}>
                {versaoAtiva.indicacoes}
              </p>
            </div>
          )}

          {/* Contraindicações */}
          {versaoAtiva?.contraindicacoes && (
            <div className={styles.lateralBloco}>
              <h3 className={styles.lateralTitulo}>Contraindicações</h3>
              <p className={styles.textoSecao} style={{ fontSize: 'var(--texto-xs)' }}>
                {versaoAtiva.contraindicacoes}
              </p>
            </div>
          )}

          {/* Conexões */}
          {formula.conexoes.length > 0 && (
            <div className={styles.lateralBloco}>
              <h3 className={styles.lateralTitulo}>Conexões</h3>
              <FormulaConnections conexoes={formula.conexoes} />
            </div>
          )}

        </aside>
      </div>
    </div>
  )
}
