// ============================================================
// Sidebar — Estante Editorial
// A Biblioteca — Sprint VI, Onda 3
// ============================================================
// Não é um menu. É um móvel.
// Uma estante de madeira com papéis organizados.
// ZERO dependências de domínio (exceto rotas).
// ZERO cores hardcoded.
// ============================================================

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  IconMesa,
  IconCaderno,
  IconAcervo,
  IconFormula,
  IconProtocolo,
  IconCaso,
  IconConfig,
  IconAjuda,
  IconSignOut,
  IconHoje,
  IconAgenda,
  IconPacientes,
  IconPedido,
} from '@/components/icons'
import { Paper } from '@/components/ds/Paper'
import { Ribbon } from '@/components/ds/Ribbon'
import { BotanicalDecoration } from '@/components/ds/BotanicalDecoration'
import { signOut } from '@/app/login/actions'
import styles from './Sidebar.module.css'

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: string
}

export interface SidebarProfile {
  nomeCompleto: string | null
  userRole: string | null
}

interface SidebarProps {
  profile: SidebarProfile | null
}

// ─────────────────────────────────────────────
// Dados de navegação
// ─────────────────────────────────────────────

// O dia a dia vem primeiro: é o que se usa toda hora.
export const NAV_DIA_A_DIA: NavItem[] = [
  { href: '/hoje',       label: 'Hoje',                 icon: <IconHoje size={20} /> },
  { href: '/agenda',     label: 'Agenda',               icon: <IconAgenda size={20} /> },
  { href: '/pacientes',  label: 'Pacientes',            icon: <IconPacientes size={20} /> },
  { href: '/pedidos',    label: 'Pedidos manipulados',  icon: <IconPedido size={20} /> },
]

const NAV_DISPONIVEL: NavItem[] = [
  { href: '/mesa',       label: 'Mesa de Pesquisa',     icon: <IconMesa size={20} /> },
  { href: '/caderno',    label: 'Caderno de Campo',     icon: <IconCaderno size={20} /> },
  { href: '/acervo',     label: 'Acervo Científico',    icon: <IconAcervo size={20} /> },
  { href: '/formulas',   label: 'Fórmulas',             icon: <IconFormula size={20} /> },
  { href: '/protocolos', label: 'Protocolos de Uso',    icon: <IconProtocolo size={20} /> },
  { href: '/casos',      label: 'Casos Clínicos',       icon: <IconCaso size={20} /> },
]

// ─────────────────────────────────────────────
// Logo Botânico SVG
// ─────────────────────────────────────────────

function LogoBotanico() {
  return (
    <svg
      className={styles.logoSvg}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      {/* Folha estilizada */}
      <path
        d="M16 3C16 3 6 10 6 19c0 5.5 4.5 10 10 10s10-4.5 10-10C26 10 16 3 16 3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Nervuras */}
      <path
        d="M16 8v18M12 14c1.5 1.5 3 2 4 2M20 16c-1.5 1.5-3 2-4 2M12 20c1.5 1 3 1.5 4 1.5M20 22c-1.5 1-3 1.5-4 1.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────
// Item de navegação
// ─────────────────────────────────────────────

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  const isDisabled = !!item.badge

  const classes = [
    styles.navItem,
    active && styles.navItemAtivo,
    isDisabled && styles.navItemDesabilitado,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Link
      href={isDisabled ? '#' : item.href}
      className={classes}
      aria-current={active ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={isDisabled ? (e) => e.preventDefault() : undefined}
    >
      <span className={styles.navItemIcone}>{item.icon}</span>
      <span className={styles.navItemLabel}>{item.label}</span>
      {item.badge && (
        <span className={styles.navItemBadge} aria-label={`${item.label}: ${item.badge}`}>
          {item.badge}
        </span>
      )}
    </Link>
  )
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/mesa') return pathname === '/mesa' || pathname === '/'
    return pathname.startsWith(href)
  }

  const initials = getInitials(profile?.nomeCompleto ?? null)

  return (
    <aside className={styles.sidebar} aria-label="Navegação principal da Biblioteca">

      {/* ── Cabeçalho: Placa da Biblioteca ─────── */}
      <div className={styles.cabecalho}>
        <Link href="/hoje" className={styles.cabecalhoLink} aria-label="Início — Hoje">
          <div className={styles.logo}>
            <LogoBotanico />
          </div>
          <div className={styles.cabecalhoTexto}>
            <span className={styles.titulo}>Gestão Natural</span>
            <span className={styles.subtitulo}>Clínica e biblioteca</span>
          </div>
        </Link>
      </div>

      {/* ── Navegação principal ────────────────── */}
      <nav className={styles.nav} aria-label="Seções">
        <span className={styles.navGrupoLabel}>dia a dia</span>
        <div className={styles.navGrupo} role="list">
          {NAV_DIA_A_DIA.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>

        <div className={styles.navDivisor} aria-hidden="true" />

        <span className={styles.navGrupoLabel}>biblioteca</span>
        <div className={styles.navGrupo} role="list">
          {NAV_DISPONIVEL.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item.href)} />
          ))}
        </div>
      </nav>

      {/* ── Aurora — Bilhete de papel preso à estante ─────────── */}
      <Paper
        variant="algodao"
        size="compacto"
        elevation="normal"
        className={styles.aurora}
        role="complementary"
        aria-label="Assistente Aurora"
      >
        <Ribbon color="terracota" variant="marcador" className={styles.auroraRibbon}>
          aurora
        </Ribbon>
        <p className={styles.auroraTitulo}>Aurora</p>
        <p className={styles.auroraTexto}>
          Sua assistente de pesquisa está aqui para ajudar.
        </p>
        <BotanicalDecoration
          motif="ramo"
          position="bottomLeft"
          size="sm"
          color="oliva"
          opacity="sutil"
        />
      </Paper>

      {/* ── Rodapé ────────────────────────────── */}
      <div className={styles.rodape}>
        {/* Perfil */}
        <div className={styles.perfil}>
          <div className={styles.avatar} aria-hidden="true">
            {initials}
          </div>
          <div className={styles.perfilInfo}>
            <span className={styles.perfilNome}>
              {extrairNomeExibicao(profile?.nomeCompleto ?? null)}
            </span>
            <span className={styles.perfilRole}>
              {profile?.userRole ?? 'pesquisadora'}
            </span>
          </div>
        </div>

        {/* Ações discretas */}
        <div className={styles.rodapeAcoes}>
          <button
            type="button"
            className={styles.rodapeBotao}
            aria-label="Configurações"
            title="Configurações"
          >
            <IconConfig size={15} aria-hidden />
          </button>
          <button
            type="button"
            className={styles.rodapeBotao}
            aria-label="Ajuda"
            title="Ajuda"
          >
            <IconAjuda size={15} aria-hidden />
          </button>
          <form action={signOut} style={{ display: 'contents' }}>
            <button
              type="submit"
              className={styles.rodapeBotao}
              aria-label="Sair da conta"
              title="Sair"
            >
              <IconSignOut size={15} aria-hidden />
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}

// ─────────────────────────────────────────────
// Utilidade
// ─────────────────────────────────────────────

function getInitials(name: string | null): string {
  if (!name) return 'RR'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]!.substring(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/** Extrai primeiro nome legível — nunca mostrar login, username ou email */
function extrairNomeExibicao(nomeCompleto: string | null): string {
  if (!nomeCompleto) return 'Rafa'

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
