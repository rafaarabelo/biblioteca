// ============================================================
// Ícones — Biblioteca SVG
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 3
// ============================================================
// Ícones minimalistas de linha, 1.5px stroke, sem fill.
// Todos usam currentColor para herdar a cor do contexto.
// ============================================================

interface IconProps {
  size?: number
  className?: string
  'aria-hidden'?: boolean
}

const defaults: IconProps = { size: 18, 'aria-hidden': true }

export function IconMesa({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <rect x="2" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 15h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 13v2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconAcervo({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M3 4h2v12H3zM7 4h2v12H7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M11 4l4 1.5v11L11 15V4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function IconFormula({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M6 2v6.5L3 14a1 1 0 0 0 .9 1.5h10.2A1 1 0 0 0 15 14l-3-5.5V2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 2h6M7.5 10.5h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconClinico({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconAurora({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.1 4.1l1.4 1.4M12.5 12.5l1.4 1.4M4.1 13.9l1.4-1.4M12.5 5.5l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function IconSearch({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 13l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconMoon({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M15 10.5A6.5 6.5 0 0 1 7.5 3a6.5 6.5 0 1 0 7.5 7.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  )
}

export function IconSun({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 1v2M9 15v2M1 9h2M15 9h2M3.2 3.2l1.4 1.4M13.4 13.4l1.4 1.4M3.2 14.8l1.4-1.4M13.4 4.6l1.4-1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconChevronRight({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M7 5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconClose({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconSignOut({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M7 3H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M12 13l3-4-3-4M15 9H7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconFlask({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M7 2v5.5L4 13a1 1 0 0 0 .9 1.5h8.2A1 1 0 0 0 14 13l-3-5.5V2M7 2h4M8 11h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArticle({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <rect x="3" y="2" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 6h6M6 9h6M6 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconObservation({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 9h1M14.5 9h1M9 2.5v1M9 14.5v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconProducao({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <rect x="2" y="8" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="7" y="5" width="4" height="11" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="12" y="2" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

// Caderno de Campo — espiral lateral + linhas de escrita
export function IconCaderno({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      {/* Corpo do caderno */}
      <rect x="5" y="2" width="11" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      {/* Espiral (3 argolas) */}
      <path d="M5 5H3M5 9H3M5 13H3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Linhas de escrita */}
      <path d="M8 6.5h5M8 9h5M8 11.5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Protocolo Inteligente — lista numerada com seta de progresso
export function IconProtocolo({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      {/* Linhas de sequência */}
      <path d="M7 5h7M7 9h7M7 13h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Numeração / marcadores */}
      <circle cx="4" cy="5" r="1.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="9" r="1.2" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="13" r="1.2" stroke="currentColor" strokeWidth="1.2" />
      {/* Seta de progresso */}
      <path d="M14 11l2 2-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Conexões — rede de nós interligados
export function IconConexoes({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="5" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="4" cy="13" r="2" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="14" cy="13" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.5 6.5L5.5 11.5M10.5 6.5l2 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

// Configurações — engrenagem sutil
export function IconConfig({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 2v2M9 14v2M2 9h2M14 9h2M4.2 4.2l1.4 1.4M12.4 12.4l1.4 1.4M4.2 13.8l1.4-1.4M12.4 5.6l1.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Ajuda — ponto de interrogação em círculo
export function IconAjuda({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7 7a2 2 0 0 1 3.9.6c0 1.2-1.9 1.4-1.9 2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="9" cy="12.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

// Ativo Cosmético — frasco conta-gotas
export function IconAtivo({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M7 2h4M9 2v3M6 5h6l1 8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1l1-8z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 9.5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Veículo Cosmético — pote/jar
export function IconVeiculo({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <rect x="3" y="7" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M5 7V5.5a4 4 0 0 1 8 0V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M6 11h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

// Caso Clínico — pasta clínica com linha de evolução (timeline)
export function IconCaso({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      {/* Pasta/dossiê */}
      <path d="M2 5a1 1 0 0 1 1-1h5l1.5 1.5H15a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      {/* Linha de evolução (timeline interna) */}
      <path d="M5 10h2M5 12.5h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Marcadores */}
      <circle cx="8.5" cy="10" r="1" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="11" cy="12.5" r="1" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8.5 10.8V11.7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

// ── Gestão Natural ─────────────────────────────

export function IconHoje({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 1.8v1.6M9 14.6v1.6M1.8 9h1.6M14.6 9h1.6M3.9 3.9l1.1 1.1M13 13l1.1 1.1M3.9 14.1L5 13M13 5l1.1-1.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconAgenda({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <rect x="2.5" y="3.5" width="13" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.5 7h13M6 2v3M12 2v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconPacientes({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3 16c.6-3 3-4.6 6-4.6s5.4 1.6 6 4.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export function IconPedido({ size = 18, ...p }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" {...p}>
      <path d="M7 2h4M7.5 2v2.5L5 7.5V15a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 13 15V7.5l-2.5-3V2" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M5 10.5h8" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}
