'use client'

// ============================================================
// MobileNav — barra inferior no celular
// No celular a Sidebar some; sem isto não havia navegação nenhuma.
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconAgenda, IconHoje, IconMesa, IconPacientes, IconPedido } from '@/components/icons'
import styles from './MobileNav.module.css'

const ITENS = [
  { href: '/hoje', label: 'Hoje', icon: IconHoje },
  { href: '/agenda', label: 'Agenda', icon: IconAgenda },
  { href: '/pacientes', label: 'Pacientes', icon: IconPacientes },
  { href: '/pedidos', label: 'Pedidos', icon: IconPedido },
  { href: '/mesa', label: 'Biblioteca', icon: IconMesa },
]

const BIBLIOTECA = ['/mesa', '/caderno', '/acervo', '/formulas', '/protocolos', '/casos']

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className={styles.barra} aria-label="Navegação">
      {ITENS.map(({ href, label, icon: Icon }) => {
        const ativo = href === '/mesa'
          ? BIBLIOTECA.some((r) => pathname.startsWith(r))
          : pathname.startsWith(href) || (href === '/pacientes' && pathname.startsWith('/programas'))
        return (
          <Link key={href} href={href} className={`${styles.item} ${ativo ? styles.ativo : ''}`} aria-current={ativo ? 'page' : undefined}>
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
