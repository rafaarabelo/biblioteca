// CasoInterativo + CasoSidebarClient — Client wrappers para /casos

'use client'

import { useEffect, useState, useTransition } from 'react'
import { useCasoFiltros } from '@/features/casos/hooks/useCasoFiltros'
import { listarCasos } from '@/features/casos/actions/casoActions'
import { CaseSearch }   from '@/features/casos/components/CaseSearch'
import { CaseCard }     from '@/features/casos/components/CaseCard'
import { CaseLoading }  from '@/features/casos/components/CaseLoading'
import { CaseFilters }  from '@/features/casos/components/CaseFilters'
import type { CasoView } from '@/features/casos/types'

// ── Listagem interativa ────────────────────────────────────

interface CasoInterativoProps {
  casosIniciais: CasoView[]
  tagsDisponiveis: string[]
}

export function CasoInterativo({ casosIniciais, tagsDisponiveis }: CasoInterativoProps) {
  const { filtros, filtrosPropagados, setBusca } = useCasoFiltros()
  const [casos, setCasos] = useState<CasoView[]>(casosIniciais)
  const [, startTransition] = useTransition()
  const [buscando, setBuscando] = useState(false)

  useEffect(() => {
    setBuscando(true)
    startTransition(async () => {
      const resultado = await listarCasos(filtrosPropagados)
      setCasos(resultado ?? [])
      setBuscando(false)
    })
  }, [filtrosPropagados])

  return (
    <div>
      {/* Busca */}
      <div style={{ marginBottom: 'var(--spacing-4)' }}>
        <CaseSearch valor={filtros.busca} onChange={setBusca} />
      </div>

      {/* Resultados */}
      {buscando ? (
        <CaseLoading />
      ) : casos.length === 0 ? (
        <CasoEstadoVazio temFiltro={!!filtros.busca || !!filtros.status || filtros.favorito} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
          {casos.map((caso) => (
            <CaseCard key={caso.id} caso={caso} />
          ))}
        </div>
      )}
    </div>
  )
}

function CasoEstadoVazio({ temFiltro }: { temFiltro: boolean }) {
  return (
    <div style={{
      padding: 'var(--spacing-8) 0',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-3)',
    }}>
      <p style={{ fontSize: 'var(--texto-sm)', color: 'var(--texto-secundario)', margin: 0 }}>
        {temFiltro
          ? 'Nenhum caso encontrado com os filtros aplicados.'
          : 'Nenhum caso clínico registrado ainda.'}
      </p>
      {!temFiltro && (
        <p style={{ fontSize: 'var(--texto-xs)', color: 'var(--texto-terciario)', fontStyle: 'italic', margin: 0 }}>
          Todo caso clínico começa como uma pessoa.
        </p>
      )}
    </div>
  )
}

// ── Sidebar de filtros ─────────────────────────────────────

interface CasoSidebarClientProps {
  tagsDisponiveis: string[]
}

export function CasoSidebarClient({ tagsDisponiveis }: CasoSidebarClientProps) {
  const {
    filtros,
    temFiltrosAtivos,
    setStatus,
    setFavorito,
    setTags,
    limpar,
  } = useCasoFiltros()

  return (
    <CaseFilters
      status={filtros.status}
      favorito={filtros.favorito}
      tags={filtros.tags}
      tagsDisponiveis={tagsDisponiveis}
      temFiltrosAtivos={temFiltrosAtivos}
      onStatus={setStatus}
      onFavorito={setFavorito}
      onTags={setTags}
      onLimpar={limpar}
    />
  )
}
