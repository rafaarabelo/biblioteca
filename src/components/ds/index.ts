// ============================================================
// Design System — Barrel Export
// A Biblioteca — Sprint VI
// ============================================================
// Importação centralizada de todos os componentes do DS.
// Uso: import { Paper, WoodSurface, Notebook } from '@/components/ds'
// ============================================================

// Superfícies
export { Paper } from './Paper'
export type { PaperVariant, PaperSize, PaperElevation } from './Paper'

export { WoodSurface } from './WoodSurface'
export type { WoodTone, WoodSize } from './WoodSurface'

export { Notebook } from './Notebook'
export type { NotebookVariant, NotebookSize } from './Notebook'

export { Envelope } from './Envelope'
export type { EnvelopeVariant, EnvelopeSize } from './Envelope'

export { Surface } from './Surface'
export type { SurfaceBorder, SurfaceElevation, SurfaceBackground, SurfacePadding } from './Surface'

// Cards
export { EditorialCard } from './EditorialCard'
export type {
  EditorialCardVariant,
  EditorialCardState,
  EditorialCardSize,
  EditorialCardSlots,
  EditorialCardProps,
} from './EditorialCard'

// Decoração
export { Ribbon } from './Ribbon'
export type { RibbonColor, RibbonVariant } from './Ribbon'

export { BotanicalDecoration } from './BotanicalDecoration'
export type { BotanicalMotif, BotanicalPosition, BotanicalSize, BotanicalColor, BotanicalOpacity } from './BotanicalDecoration'

export { Shadow } from './Shadow'
export type { ShadowLevel } from './Shadow'

export { IconContainer } from './IconContainer'
export type { IconSize, IconShape, IconColor, IconVariant } from './IconContainer'

// Tipografia e estrutura
export { DSectionTitle } from './DSectionTitle'
export type { SectionTitleSize, SectionTitleVariant } from './DSectionTitle'

export { DDivider } from './DDivider'
export type { DividerVariant, DividerSpacing } from './DDivider'
