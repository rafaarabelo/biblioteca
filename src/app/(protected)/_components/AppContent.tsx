// ============================================================
// AppContent — Casca visual com background por rota
// A Biblioteca
// ============================================================
// Decisão centralizada de background:
//   - /mesa  → fundo de mesa de madeira
//   - demais → fundo de rolo de papel antigo
//   - dia a dia (hoje, agenda, pacientes, pedidos, programas) → fundo liso
// Nenhuma página decide seu próprio fundo. A rota define tudo.
// ============================================================

'use client'

import { usePathname } from 'next/navigation'
import styles from '../layout.module.css'

interface AppContentProps {
  children: React.ReactNode
}

export function AppContent({ children }: AppContentProps) {
  const pathname = usePathname()

  // A Mesa de Pesquisa é a única tela com fundo de madeira.
  // A raiz '/' também resolve para a Mesa (middleware redireciona).
  const isMesa = pathname === '/mesa'

  // Gestão Natural (uso diário): fundo liso, sem fotografia.
  const isDiaADia = ['/', '/hoje', '/agenda', '/pacientes', '/pedidos', '/programas']
    .some((r) => pathname === r || (r !== '/' && pathname.startsWith(r + '/')))

  const classes = [
    styles.appContent,
    isDiaADia ? styles.bgLimpo : isMesa ? styles.bgMesa : styles.bgPapel,
  ].join(' ')

  return <div className={classes}>{children}</div>
}
