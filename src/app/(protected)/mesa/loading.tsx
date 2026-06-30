// ============================================================
// Mesa de Pesquisa — Loading State (Next.js Convention)
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Este arquivo é reconhecido automaticamente pelo App Router.
// É renderizado enquanto page.tsx (Server Component) carrega.
// Substitui o estado vazio inicial por esqueletos com forma.
//
// Usa LoadingShelf: espelha o layout exato da Mesa real.
// A sensação deve ser de "a Biblioteca sendo organizada",
// não de "dados sendo carregados".
// ============================================================

import { LoadingShelf } from '@/features/mesa/components/LoadingShelf'

export default function MesaLoading() {
  return <LoadingShelf />
}
