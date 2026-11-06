// ============================================================
// Protected Layout — Sprint 3 (atualizado)
// A Biblioteca
// ============================================================
// Justificativa para mudança (Sprint 2 → Sprint 3):
// Sprint 2 usava NavBar horizontal como stub temporário (comentado no
// próprio arquivo: "Sprint 0.2 vai estilizar com o sistema de nav completo").
// Sprint 3 É o sprint de design — substituído por Sidebar + TopBar
// conforme especificado no roadmap: "Sidebar permanente. Header discreto."
// O NavBar.tsx permanece intacto (Sprint 2 frozen).
// ============================================================

import { redirect } from 'next/navigation'
import { getAuthContext } from '@/lib/supabase/server'
import { Sidebar } from '@/components/ui/Sidebar'
import { TopBar } from '@/components/ui/TopBar'
import { MobileNav } from '@/components/ui/MobileNav'
import { AppContent } from './_components/AppContent'
import styles from './layout.module.css'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = await getAuthContext()

  if (!auth) {
    redirect('/login')
  }

  // Profile é uma entidade de domínio (classe). Client Components só aceitam
  // objetos simples, então extraímos apenas os campos que a Sidebar usa.
  const sidebarProfile = {
    nomeCompleto: auth.profile.nomeCompleto,
    userRole: auth.profile.userRole,
  }

  return (
    <div className={styles.appShell}>
      {/* Sidebar lateral permanente */}
      <Sidebar profile={sidebarProfile} />

      {/* Área principal: background escolhido pela rota (AppContent) */}
      <AppContent>
        <TopBar titulo="Gestão Natural" />

        <main className={styles.appMain} id="main-content" tabIndex={-1}>
          {children}
        </main>
      </AppContent>

      {/* Celular: a Sidebar some, a barra inferior assume */}
      <MobileNav />
    </div>
  )
}
