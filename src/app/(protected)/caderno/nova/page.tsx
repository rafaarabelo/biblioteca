// ============================================================
// Caderno de Campo — Nova Observação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Editor limpo para registrar uma nova observação.
// Após registrar, redireciona para /caderno/[id].
// ============================================================

import Link from 'next/link'
import { NovaObservacaoEditor } from '@/features/caderno/components/ObservationEditor'
import styles from './page.module.css'

export const metadata = {
  title: 'Nova Observação — Caderno de Campo',
}

export default function NovaCadernoPage() {
  return (
    <div className={styles.pagina}>
      {/* Navegação de retorno */}
      <nav className={styles.nav} aria-label="Retornar ao Caderno">
        <Link href="/caderno" className={styles.voltar}>
          ← Caderno de Campo
        </Link>
      </nav>

      {/* Editor */}
      <NovaObservacaoEditor />
    </div>
  )
}
