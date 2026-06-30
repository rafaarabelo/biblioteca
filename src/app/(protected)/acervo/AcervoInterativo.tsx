// ============================================================
// AcervoInterativo — Client Component do Acervo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Gerencia filtros, busca e estado de listagem no cliente.
// Chama Server Actions com useTransition — sem fetch direto.
// ============================================================

'use client'

import { useEffect, useTransition } from 'react'
import { listarReferencias } from '@/features/acervo/actions/acervoActions'
import { useAcervoFiltros } from '@/features/acervo/hooks/useAcervoFiltros'
import { ReferenceSearch } from '@/features/acervo/components/ReferenceSearch'
import { ReferenceFilters } from '@/features/acervo/components/ReferenceFilters'
import { ReferenceCard } from '@/features/acervo/components/ReferenceCard'
import { ReferenceEmptyState } from '@/features/acervo/components/ReferenceEmptyState'
import { ReferenceLoading } from '@/features/acervo/components/ReferenceLoading'
import type { ReferenciaView } from '@/features/acervo/types'
import { useState } from 'react'
import styles from './AcervoInterativo.module.css'

interface AcervoInterativoProps {
  referenciasIniciais: ReferenciaView[]
  tagsDisponiveis: string[]
}

export function AcervoInterativo({ referenciasIniciais, tagsDisponiveis }: AcervoInterativoProps) {
  const [referencias, setReferencias] = useState<ReferenciaView[]>(referenciasIniciais)
  const [pending, startTransition] = useTransition()

  const {
    filtros,
    filtrosPropagados,
    temFiltrosAtivos,
    setBusca,
    setTipoEstudo,
    setNivelEvidencia,
    setFavorito,
    setOrdenar,
    limpar,
  } = useAcervoFiltros()

  // Rebusca quando filtros propagados mudam (após debounce)
  useEffect(() => {
    startTransition(async () => {
      const resultado = await listarReferencias(filtrosPropagados)
      if (resultado) setReferencias(resultado.referencias)
    })
  }, [filtrosPropagados])

  return (
    <>
      {/* Busca — no topo do conteúdo principal */}
      <ReferenceSearch valor={filtros.busca} onChange={setBusca} />

      {/* Ordenação */}
      <div className={styles.topBar}>
        <span className={styles.contagem}>
          {referencias.length} {referencias.length === 1 ? 'referência' : 'referências'}
        </span>
        <select
          className={styles.ordenar}
          value={filtros.ordenar ?? 'mais_recente'}
          onChange={(e) => setOrdenar(e.target.value as typeof filtros.ordenar)}
          aria-label="Ordenar referências"
        >
          <option value="mais_recente">Mais recentes</option>
          <option value="mais_antigo">Mais antigos</option>
          <option value="titulo_az">Título A–Z</option>
          <option value="nivel_evidencia">Nível de evidência</option>
          <option value="ano_publicacao">Ano de publicação</option>
        </select>
      </div>

      {/* Filtros laterais são renderizados aqui para mobile; no layout real ficam no slot sidebar */}
      <div className={styles.filtrosMobile}>
        <ReferenceFilters
          tipoAtivo={filtros.tipoEstudo}
          nivelAtivo={filtros.nivelEvidencia}
          favoritoAtivo={filtros.favorito}
          tags={tagsDisponiveis}
          temFiltrosAtivos={temFiltrosAtivos}
          onTipo={setTipoEstudo}
          onNivel={setNivelEvidencia}
          onFavorito={setFavorito}
          onLimpar={limpar}
        />
      </div>

      {/* Lista */}
      {pending ? (
        <ReferenceLoading />
      ) : referencias.length === 0 ? (
        <ReferenceEmptyState
          comFiltros={temFiltrosAtivos}
          onLimparFiltros={temFiltrosAtivos ? limpar : undefined}
        />
      ) : (
        <div className={styles.lista}>
          {referencias.map((ref) => (
            <ReferenceCard key={ref.id} referencia={ref} />
          ))}
        </div>
      )}
    </>
  )
}

// Props extras para o slot sidebar (usado pelo layout server)
export function AcervoFiltrosSidebar({ tagsDisponiveis }: { tagsDisponiveis: string[] }) {
  const {
    filtros,
    temFiltrosAtivos,
    setTipoEstudo,
    setNivelEvidencia,
    setFavorito,
    limpar,
  } = useAcervoFiltros()

  return (
    <ReferenceFilters
      tipoAtivo={filtros.tipoEstudo}
      nivelAtivo={filtros.nivelEvidencia}
      favoritoAtivo={filtros.favorito}
      tags={tagsDisponiveis}
      temFiltrosAtivos={temFiltrosAtivos}
      onTipo={setTipoEstudo}
      onNivel={setNivelEvidencia}
      onFavorito={setFavorito}
      onLimpar={limpar}
    />
  )
}
