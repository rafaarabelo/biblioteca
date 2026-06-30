// /formulas/nova — Nova Fórmula
// Server Component — Capítulo V

import type { Metadata }     from 'next'
import { NovaFormulaClient } from './NovaFormulaClient'

export const metadata: Metadata = {
  title: 'Nova Fórmula — A Biblioteca',
  description: 'Registrar nova formulação cosmetológica.',
}

export default function NovaFormulaPage() {
  return <NovaFormulaClient />
}
