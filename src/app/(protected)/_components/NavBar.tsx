// ============================================================
// NavBar — Componente de Navegação
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Server Component: recebe profile do layout pai.
// Exibe perfil no canto + link para logout.
// Sprint 0.2 (Design System) vai estilizar com o sistema de nav completo.
// ============================================================

import Link from 'next/link'
import Image from 'next/image'
import { signOut } from '@/app/login/actions'
import type { Profile } from '@/domain/identity/entities/Profile'

interface NavBarProps {
  profile: Profile | null
}

export function NavBar({ profile }: NavBarProps) {
  const initials = getInitials(profile?.nomeCompleto ?? null)
  const displayName = profile?.nomeCompleto ?? 'Meu Perfil'

  return (
    <header className="navbar" role="banner">
      {/* Identidade da aplicação */}
      <div className="navbar-brand">
        <Link href="/mesa" className="brand-link" aria-label="Ir para Mesa de Pesquisa">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="8" fill="var(--terracota-500)" />
            <path
              d="M12 10h10a6 6 0 0 1 0 12H12V10ZM12 22h12a6 6 0 0 1 0 12H12V22Z"
              fill="white"
              opacity="0.9"
            />
          </svg>
          <span className="brand-name">Biblioteca</span>
        </Link>
      </div>

      {/* Navegação principal — Sprint 3+ preencherá com as rotas reais */}
      <nav className="navbar-nav" aria-label="Navegação principal">
        <Link href="/mesa" className="nav-link">
          Mesa de Pesquisa
        </Link>
        <Link href="/acervo/ativos" className="nav-link">
          Acervo
        </Link>
        <Link href="/clinico/pacientes" className="nav-link">
          Clínico
        </Link>
        <Link href="/formulas" className="nav-link">
          Fórmulas
        </Link>
      </nav>

      {/* Perfil do usuário */}
      <div className="navbar-profile">
        {/* Avatar */}
        <div className="profile-trigger" aria-label={`Perfil: ${displayName}`}>
          {profile?.avatarUrl ? (
            <Image
              src={profile.avatarUrl}
              alt={displayName}
              className="avatar-img"
              width={32}
              height={32}
            />
          ) : (
            <div className="avatar-initials" aria-hidden="true">
              {initials}
            </div>
          )}
          <span className="profile-name">{displayName}</span>
        </div>

        {/* Logout */}
        <form action={signOut}>
          <button
            type="submit"
            className="logout-btn"
            aria-label="Sair da conta"
            title="Sair"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M10 11l3-3-3-3M13 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">Sair</span>
          </button>
        </form>
      </div>

      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          height: 56px;
          padding: 0 var(--space-6);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .navbar-brand {
          flex-shrink: 0;
        }

        .brand-link {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          text-decoration: none;
          color: var(--foreground);
        }

        .brand-name {
          font-family: var(--font-serif);
          font-size: 1.0625rem;
          font-weight: 500;
          letter-spacing: -0.01em;
        }

        .navbar-nav {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          flex: 1;
          padding-left: var(--space-4);
        }

        .nav-link {
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--muted-fg);
          text-decoration: none;
          transition: color var(--transition-fast), background-color var(--transition-fast);
          white-space: nowrap;
        }

        .nav-link:hover {
          color: var(--foreground);
          background: var(--muted);
        }

        .navbar-profile {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-shrink: 0;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          cursor: default;
        }

        .avatar-img {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          object-fit: cover;
          border: 1px solid var(--border);
        }

        .avatar-initials {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-full);
          background: var(--terracota-100);
          color: var(--terracota-700);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          border: 1px solid var(--terracota-200);
          flex-shrink: 0;
        }

        .profile-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--foreground);
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--muted-fg);
          cursor: pointer;
          transition: color var(--transition-fast), background-color var(--transition-fast), border-color var(--transition-fast);
        }

        .logout-btn:hover {
          color: var(--foreground);
          background: var(--muted);
          border-color: var(--border-strong);
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        /* Responsivo — ocultar nav em telas pequenas (Sprint 0.2 vai ter menu mobile) */
        @media (max-width: 768px) {
          .navbar-nav {
            display: none;
          }
          .profile-name {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}

// ─── Helper ────────────────────────────────────
function getInitials(name: string | null): string {
  if (!name) return 'RR'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]!.substring(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}
