// ============================================================
// Mesa de Pesquisa — Master Screen
// A Biblioteca — Sprint VI, Onda 5 (Direção de Arte)
// ============================================================

import Link from 'next/link'
import { getAuthContext } from '@/lib/supabase/server'
import { mesaService } from '@/features/mesa/application/MesaService'
import { BilheteAurora } from '@/components/ui/BilheteAurora'
import { EditorialCard } from '@/components/ds/EditorialCard'
import { DSectionTitle } from '@/components/ds/DSectionTitle'
import { DDivider } from '@/components/ds/DDivider'
import { Paper } from '@/components/ds/Paper'
import { Notebook } from '@/components/ds/Notebook'
import { Envelope } from '@/components/ds/Envelope'
import { Ribbon } from '@/components/ds/Ribbon'
import { BotanicalDecoration } from '@/components/ds/BotanicalDecoration'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { MesaSessionManager } from '@/features/mesa/components/MesaSessionManager'
import { NotasRapidas } from '@/features/mesa/components/NotasRapidas'
import styles from './page.module.css'

export const metadata = {
  title: 'Mesa de Pesquisa',
}

export const revalidate = 60

const BADGE_MAP: Record<string, 'terracota' | 'salvia' | 'ambar' | 'neutro'> = {
  green: 'salvia',
  amber: 'ambar',
  red: 'terracota',
  blue: 'neutro',
  purple: 'neutro',
  gray: 'neutro',
}

const ICONE_TIPO: Record<string, string> = {
  observacao: '🔬',
  formula: '⚗️',
  artigo: '📄',
  caso: '🧬',
  protocolo: '📋',
  ativo: '🌿',
}

const EYEBROW_TIPO: Record<string, string> = {
  observacao: 'Última Observação',
  formula: 'Fórmula em desenvolvimento',
  artigo: 'Artigo em leitura',
  caso: 'Em acompanhamento',
  protocolo: 'Protocolo',
  ativo: 'Ativo',
}

function formatarHora(iso: string): string {
  try {
    const d = new Date(iso)
    const agora = new Date()
    const hoje = agora.toDateString() === d.toDateString()
    const ontem = new Date(agora.getTime() - 86400000).toDateString() === d.toDateString()
    if (hoje) return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    if (ontem) return `Ontem ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
  } catch { return '' }
}

/** Extrai primeiro nome legível — nunca mostrar login, username ou email */
function extrairPrimeiroNome(nomeCompleto: string | null | undefined): string {
  if (!nomeCompleto) return 'Rafa'

  // Se parece email, pegar parte antes do @
  let raw = nomeCompleto.includes('@')
    ? nomeCompleto.split('@')[0]!
    : nomeCompleto

  // Se começa com prefixo curto (ex: "a.rafaelarabelo"), ignorar o prefixo
  if (/^[a-z]{1,2}[._]/.test(raw)) {
    const parts = raw.split(/[._]/)
    const rest = parts.slice(1).sort((a, b) => b.length - a.length)[0]
    if (rest && rest.length > 1) raw = rest
  } else if (raw.includes('.') || raw.includes('_')) {
    raw = raw.split(/[._]/)[0]!
  }

  // Se tem espaços, pegar o primeiro token que não seja inicial (ex: "A." ou "M.")
  const palavras = raw.split(/\s+/)
  const primeiroNome = palavras.find(p => p.length > 2 || (p.length === 2 && !p.endsWith('.')))
    ?? palavras.find(p => p.length >= 2)
    ?? palavras[0]!

  // Remover ponto final se houver
  const limpo = primeiroNome.replace(/\.$/, '')

  // Capitalizar
  const nome = limpo.charAt(0).toUpperCase() + limpo.slice(1).toLowerCase()

  return nome || 'Rafa'
}

export default async function MesaPage() {
  const auth = await getAuthContext()
  const nome = extrairPrimeiroNome(auth?.profile?.nomeCompleto)
  const tenantId = auth?.claims?.tenant_id ?? ''
  const userId = auth?.user?.id ?? ''

  const mesa = await mesaService.getMesaView(tenantId, userId)

  const hora = new Date().getHours()
  const periodo = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'

  const stats = mesa.cadernoStats

  // ── Constrói os 5 cards de "O que merece sua atenção hoje" ──
  // Cada slot tem um tipo semântico da referência
  const cardAtencao = mesa.emAndamento.slice(0, 4)

  return (
    <div className={styles.page}>
      <MesaSessionManager />

      {/* ─── Decoração botânica de canto — ambiência ─── */}
      <div className={styles.decoracaoCanto} aria-hidden="true">
        <BotanicalDecoration motif="folha" position="topRight" size="lg" color="oliva" opacity="sutil" />
      </div>

      {/* ─── Saudação ─────────────────────────── */}
      <section className={styles.saudacao} aria-label="Saudação">
        <div className={styles.saudacaoTexto}>
          <h1 className={styles.titulo}>{periodo}, {nome}.</h1>
          <p className={styles.frase}>
            Que hoje a curiosidade guie suas descobertas.
          </p>
        </div>

        {/* Busca alinhada com a saudação */}
        <Paper variant="algodao" size="compacto" elevation="normal" className={styles.searchPaper}>
          <label className={styles.searchLabel}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Buscar na Biblioteca..."
              aria-label="Pesquisar na Biblioteca"
            />
            <span className={styles.searchKbd} aria-hidden="true">⌘ K</span>
          </label>
        </Paper>
      </section>

      {/* ─── O que merece sua atenção hoje ─── */}
      <section aria-label="O que merece sua atenção hoje" className={styles.atencaoSection}>
        <div className={styles.secaoHeader}>
          <h2 className={styles.secaoTitulo}>O que merece sua atenção hoje</h2>
          <span className={styles.secaoLinha} aria-hidden="true" />
          <Link href="/caderno" className={styles.sectionLink}>ver tudo →</Link>
        </div>

        <div className={styles.atencaoScroll}>
          {/* Cards de entidades em andamento */}
          {cardAtencao.map((item, i) => (
            <Paper
              key={item.id}
              variant="algodao"
              elevation="elevado"
              className={[styles.atencaoCard, styles[`atencaoCard_${i}`]].filter(Boolean).join(' ')}
            >
              <Ribbon color={i === 0 ? 'terracota' : i === 1 ? 'musgo' : i === 2 ? 'dourado' : 'oliva'} variant="marcador">
                {EYEBROW_TIPO[item.type] ?? item.type}
              </Ribbon>
              <p className={styles.atencaoCardTitulo}>{item.titulo}</p>
              {item.subtitulo && (
                <p className={styles.atencaoCardSub}>{item.subtitulo}</p>
              )}
              <div className={styles.atencaoCardFooter}>
                {item.badge && (
                  <Badge variant={BADGE_MAP[item.badgeColor ?? 'gray'] ?? 'neutro'} size="sm">
                    {item.badge}
                  </Badge>
                )}
                <span className={styles.atencaoCardData}>{formatarHora(item.atualizadoEm)}</span>
              </div>
            </Paper>
          ))}

          {/* Bilhete da Aurora como Envelope */}
          {mesa.bilhete ? (
            <Envelope variant="aberto" size="compacto" seal className={styles.atencaoEnvelope}>
              <p className={styles.envelopeTitulo}>Bilhete da Aurora</p>
              <p className={styles.envelopePreview}>{mesa.bilhete.preview}</p>
              <Link href="/mesa" className={styles.envelopeLink}>Ver todos os bilhetes →</Link>
            </Envelope>
          ) : (
            <Paper variant="algodao" elevation="normal" className={styles.atencaoCard}>
              <Ribbon color="terracota" variant="marcador">Bilhete da Aurora</Ribbon>
              <p className={styles.atencaoCardTitulo} style={{ fontStyle: 'italic', opacity: 0.6 }}>
                Aurora ainda não escreveu hoje.
              </p>
              <BotanicalDecoration motif="flor" position="bottomRight" size="sm" opacity="sutil" />
            </Paper>
          )}

          {/* Empty state se não há dados */}
          {cardAtencao.length === 0 && (
            <Paper variant="algodao" elevation="plano" className={styles.atencaoVazio}>
              <p className={styles.atencaoVazioTexto}>
                Fórmulas, casos e observações em andamento aparecerão aqui.
              </p>
            </Paper>
          )}
        </div>
      </section>

      {/* ─── Atividades recentes + Caderno de Campo ─── */}
      <div className={styles.atividadesCaderno}>

        {/* Atividades recentes */}
        <section aria-label="Atividades recentes" className={styles.atividadesSection}>
          <div className={styles.secaoHeader}>
            <h2 className={styles.secaoTitulo}>Atividades recentes</h2>
            <span className={styles.secaoLinha} aria-hidden="true" />
            <Link href="/caderno" className={styles.sectionLink}>ver tudo →</Link>
          </div>

          {mesa.atividades.length > 0 ? (
            <div className={styles.atividadesList}>
              {mesa.atividades.map((ativ, i) => (
                <Link
                  key={`${ativ.tipo}-${ativ.id}`}
                  href={ativ.href ?? '#'}
                  className={styles.atividadeItem}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <span className={styles.atividadeHora}>{formatarHora(ativ.realizadaEm)}</span>
                  <span className={styles.atividadeIcone} aria-hidden="true">
                    {ICONE_TIPO[ativ.tipo] ?? '◦'}
                  </span>
                  <span className={styles.atividadeDescricao}>{ativ.descricao}</span>
                  <Badge variant={BADGE_MAP[ativ.badgeColor] ?? 'neutro'} size="sm">
                    {ativ.badgeLabel}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : (
            <Paper variant="algodao" size="compacto" elevation="plano" className={styles.atividadesVazio}>
              <p className={styles.atividadesVazioTexto}>
                Suas atividades recentes aparecerão aqui.
              </p>
            </Paper>
          )}
        </section>

        {/* Caderno de Campo */}
        <section aria-label="Caderno de Campo" className={styles.cadernoPanel}>
          <div className={styles.secaoHeader}>
            <h2 className={styles.secaoTitulo}>Caderno de Campo</h2>
            <Link href="/caderno" className={styles.sectionLink}>Acessar →</Link>
          </div>


          <Paper variant="algodao" elevation="normal" className={styles.cadernoPaper}>
            <BotanicalDecoration motif="ramo" position="bottomRight" size="sm" opacity="sutil" />

            {stats.total > 0 ? (
              <ul className={styles.cadernoStats} aria-label="Distribuição por status epistêmico">
                {[
                  { label: 'Hipóteses',           valor: stats.hipoteses,            cor: 'amber' },
                  { label: 'Em observação',        valor: stats.emObservacao,         cor: 'blue' },
                  { label: 'Parc. validadas',      valor: stats.parcialmenteValidadas, cor: 'purple' },
                  { label: 'Validadas',            valor: stats.validadas,            cor: 'green' },
                  { label: 'Refutadas',            valor: stats.refutadas,            cor: 'red' },
                  { label: 'Arquivadas',           valor: stats.arquivadas,           cor: 'gray' },
                ].map(({ label, valor, cor }) => (
                  <li key={label} className={styles.cadernoStatItem}>
                    <span className={styles.cadernoStatDot} data-color={cor} aria-hidden="true" />
                    <span className={styles.cadernoStatLabel}>{label}</span>
                    <span className={styles.cadernoStatNum}>{valor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.cadernoVazio}>
                Suas observações aparecerão aqui após o primeiro registro.
              </p>
            )}

            <blockquote className={styles.cadernoNota}>
              <p>Cada observação é uma semente.</p>
              <p>O tempo e o método dirão o que ela pode se tornar.</p>
              <footer className={styles.cadernoNotaAssinatura}>A.</footer>
            </blockquote>
          </Paper>
        </section>
      </div>

      {/* ─── Conexões inteligentes + Notas rápidas ─── */}
      <div className={styles.conexoesNotas}>

        {/* Conexões inteligentes — fluxo visual */}
        <section aria-label="Conexões inteligentes" className={styles.conexoesSection}>
          <div className={styles.secaoHeader}>
            <h2 className={styles.secaoTitulo}>Conexões inteligentes</h2>
            <span className={styles.secaoLinha} aria-hidden="true" />
            <Link href="/conexoes" className={styles.sectionLink}>Explorar conexões →</Link>
          </div>
          <p className={styles.conexoesSubtitulo}>
            Relações recentes entre áreas da sua pesquisa
          </p>

          {mesa.pesquisando.length >= 2 ? (
            <div className={styles.fluxoConexoes} aria-label="Grafo de conhecimento">
              {mesa.pesquisando.slice(0, 4).map((chip, i) => (
                <div key={chip.id} className={styles.fluxoNodoWrapper}>
                  <Link href={chip.href ?? '#'} className={styles.fluxoNodo}>
                    <span className={styles.fluxoNodoIcone} aria-hidden="true">
                      {ICONE_TIPO[chip.tipo] ?? '◦'}
                    </span>
                    <span className={styles.fluxoNodoTexto}>{chip.label}</span>
                    <span className={styles.fluxoNodoTipo}>{chip.tipo}</span>
                  </Link>
                  {i < Math.min(mesa.pesquisando.length - 1, 3) && (
                    <span className={styles.fluxoSeta} aria-hidden="true">→</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Paper variant="velho" elevation="plano" className={styles.conexoesPlaceholder}>
              <BotanicalDecoration motif="espiral" position="center" size="md" opacity="sutil" />
              <p className={styles.conexoesPlaceholderTexto}>
                Conexões entre ativos, fórmulas, artigos e casos aparecerão aqui
                conforme você explora a Biblioteca.
              </p>
            </Paper>
          )}
        </section>

        {/* Notas rápidas — Notebook */}
        <section aria-label="Notas rápidas" className={styles.notasSection}>
          <div className={styles.secaoHeader}>
            <h2 className={styles.secaoTitulo}>Notas rápidas</h2>
            <span className={styles.sectionLink}>Nova nota +</span>
          </div>
          <p className={styles.conexoesSubtitulo}>Capture pensamentos antes que se percam</p>
          <Notebook variant="pautado" size="normal" className={styles.notasNotebook}>
            <NotasRapidas />
          </Notebook>
        </section>
      </div>

      {/* ─── Aurora + Manifesto ── seção editorial secundária ─── */}
      <section className={styles.hero} aria-label="Aurora e manifesto">
        <div className={styles.bilheteCol}>
          <DSectionTitle size="sm" variant="semLinha">Aurora</DSectionTitle>
          {mesa.bilhete ? (
            <BilheteAurora bilhete={mesa.bilhete} />
          ) : (
            <Paper variant="algodao" elevation="normal" className={styles.auroraPaper}>
              <Ribbon color="terracota" variant="marcador">nova</Ribbon>
              <p className={styles.auroraVazio}>Aurora ainda não escreveu hoje.</p>
              <BotanicalDecoration motif="ramo" position="bottomRight" size="sm" opacity="sutil" />
            </Paper>
          )}
        </div>

        <article className={styles.manifesto} aria-label="Manifesto da Biblioteca">
          <Paper variant="velho" elevation="normal" className={styles.manifestoPaper}>
            <BotanicalDecoration motif="folha" position="topRight" size="md" opacity="sutil" />
            <DSectionTitle size="sm" variant="ornamento">A Biblioteca</DSectionTitle>
            <blockquote className={styles.manifestoTexto}>
              <p>
                A cosmetologia é uma ciência de fronteiras.
                Entre o visível e o molecular, entre a formulação e a escuta,
                entre o dado e a intuição clínica.
              </p>
              <p>
                A Biblioteca existe para transformar conhecimento fragmentado
                em sabedoria aplicada.
              </p>
              <p>
                Cada ativo tem história. Cada fórmula, intenção.
                Cada paciente, uma hipótese em movimento.
              </p>
            </blockquote>
            <footer className={styles.manifestoAssinatura}>
              <span className={styles.manifestoSig}>Rafa Rabelo</span>
              <span className={styles.manifestoCredencial}>Biomédica · Cosmetologia Natural Científica</span>
            </footer>
          </Paper>
        </article>
      </section>

      <div aria-hidden="true" style={{ height: 'var(--esp-8)' }} />
    </div>
  )
}
