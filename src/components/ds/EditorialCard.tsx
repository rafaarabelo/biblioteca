// ============================================================
// EditorialCard — Coração visual de A Biblioteca
// Sprint VI — Onda 2
// ============================================================
// Componente base slot-based para toda a experiência editorial.
// ZERO dependências de domínio. Todos os slots opcionais.
// Nunca importa nada de features/ (Fórmulas, Casos, etc.)
// ============================================================

import { forwardRef } from 'react'
import type { ReactNode, HTMLAttributes, KeyboardEvent } from 'react'
import styles from './EditorialCard.module.css'

// ─────────────────────────────────────────────
// Tipos públicos
// ─────────────────────────────────────────────

export type EditorialCardVariant =
  | 'paper'
  | 'paper-soft'
  | 'paper-aged'
  | 'paper-note'
  | 'paper-card'
  | 'editorial'
  | 'minimal'
  | 'notebook'
  | 'archive'

export type EditorialCardState =
  | 'default'
  | 'hover'
  | 'selected'
  | 'active'
  | 'disabled'
  | 'loading'
  | 'favorite'

export type EditorialCardSize = 'compact' | 'normal' | 'spacious'

// ─────────────────────────────────────────────
// Slots
// ─────────────────────────────────────────────

export interface EditorialCardSlots {
  /** Decoração externa (Ribbon, BotanicalDecoration, corner fold, wax seal) */
  decoration?: ReactNode
  /** Fita/ribbon sobreposta */
  ribbon?: ReactNode
  /** Elemento à esquerda (acento, ícone, barra lateral) */
  leading?: ReactNode
  /** Elemento à direita (ação, favorito, trailing icon) */
  trailing?: ReactNode
  /** Overline / eyebrow text (tipo, código, categoria) */
  eyebrow?: ReactNode
  /** Título principal */
  title?: ReactNode
  /** Subtítulo / objetivo */
  subtitle?: ReactNode
  /** Conteúdo principal livre */
  body?: ReactNode
  /** Metadados (dl, chips, labels) */
  metadata?: ReactNode
  /** Tags / pills */
  tags?: ReactNode
  /** Badge de status */
  status?: ReactNode
  /** Rodapé com ações ou info complementar */
  footer?: ReactNode
  /** Barra de ações (botões) */
  actions?: ReactNode
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface EditorialCardProps
  extends Omit<HTMLAttributes<HTMLElement>, 'title'>,
    EditorialCardSlots {
  /** Variante visual */
  variant?: EditorialCardVariant
  /** Tamanho do padding */
  size?: EditorialCardSize
  /** Estado visual explícito (além de :hover/:active CSS) */
  state?: EditorialCardState
  /** Torna o card clicável (cursor, hover elevation) */
  interactive?: boolean
  /** Tag HTML semântica */
  as?: 'div' | 'article' | 'li' | 'section' | 'aside'
  /** Cor de acento para leading bar (aceita qualquer token CSS) */
  accentColor?: string
  /** href para navegação (renderiza internamente com onClick/onKeyDown) */
  href?: string
  /** Callback de clique */
  onCardClick?: () => void
}

// ─────────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────────

export const EditorialCard = forwardRef<HTMLElement, EditorialCardProps>(function EditorialCard(
    {
      // Variantes
      variant = 'paper',
      size = 'normal',
      state = 'default',
      interactive = false,
      as: Tag = 'article',
      accentColor,
      href,
      onCardClick,

      // Slots
      decoration,
      ribbon,
      leading,
      trailing,
      eyebrow,
      title,
      subtitle,
      body,
      metadata,
      tags,
      status,
      footer,
      actions,

      // HTML
      className,
      children,
      style,
      ...props
    },
    ref
  ) {
    // ── Classes ──────────────────────────────
    const classes = [
      styles.card,
      styles[`variant_${variant.replace('-', '_')}`],
      styles[`size_${size}`],
      state !== 'default' && styles[`state_${state}`],
      interactive && styles.interactive,
      (leading || accentColor) && styles.hasLeading,
      trailing && styles.hasTrailing,
      className,
    ]
      .filter(Boolean)
      .join(' ')

    // ── Estilo inline (apenas accent) ───────
    const computedStyle = accentColor
      ? { ...style, '--card-accent': accentColor } as React.CSSProperties
      : style

    // ── Keyboard handler ────────────────────
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
      if (interactive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        onCardClick?.()
      }
      if (props.onKeyDown) {
        (props.onKeyDown as (e: KeyboardEvent<HTMLElement>) => void)(e)
      }
    }

    // ── Acessibilidade ──────────────────────
    const a11yProps = interactive
      ? {
          role: 'button' as const,
          tabIndex: 0,
          'aria-disabled': state === 'disabled' || undefined,
          'aria-pressed': state === 'selected' || undefined,
        }
      : {}

    // ── Render ──────────────────────────────
    const hasHeader = !!(eyebrow || title || subtitle || status)
    const hasBody = !!(body || metadata || tags)
    const hasFooter = !!(footer || actions)

    return (
      <Tag
        ref={ref as any}
        className={classes}
        style={computedStyle}
        onClick={interactive ? onCardClick : undefined}
        onKeyDown={interactive ? handleKeyDown : undefined}
        {...a11yProps}
        {...props}
      >
          {/* Camada de luz (::before via CSS) */}

          {/* Decoração (posição absoluta) */}
          {decoration && (
            <div className={styles.slot_decoration} aria-hidden="true">
              {decoration}
            </div>
          )}

          {/* Ribbon (posição absoluta) */}
          {ribbon && (
            <div className={styles.slot_ribbon} aria-hidden="true">
              {ribbon}
            </div>
          )}

          {/* Layout principal */}
          <div className={styles.layout}>
            {/* Leading (barra lateral, ícone) */}
            {leading && (
              <div
                className={styles.slot_leading}
                aria-hidden="true"
              >
                {leading}
              </div>
            )}

            {/* Corpo central */}
            <div className={styles.content}>
              {/* Header */}
              {hasHeader && (
                <header className={styles.slot_header}>
                  {eyebrow && (
                    <div className={styles.slot_eyebrow}>{eyebrow}</div>
                  )}
                  {title && (
                    <div className={styles.slot_title}>{title}</div>
                  )}
                  {subtitle && (
                    <div className={styles.slot_subtitle}>{subtitle}</div>
                  )}
                  {status && (
                    <div className={styles.slot_status}>{status}</div>
                  )}
                </header>
              )}

              {/* Body */}
              {hasBody && (
                <div className={styles.slot_body}>
                  {body}
                  {metadata && (
                    <div className={styles.slot_metadata}>{metadata}</div>
                  )}
                  {tags && (
                    <div className={styles.slot_tags}>{tags}</div>
                  )}
                </div>
              )}

              {/* Children (escape hatch livre) */}
              {children && (
                <div className={styles.slot_children}>{children}</div>
              )}

              {/* Footer */}
              {hasFooter && (
                <footer className={styles.slot_footer}>
                  {footer}
                  {actions && (
                    <div className={styles.slot_actions}>{actions}</div>
                  )}
                </footer>
              )}
            </div>

            {/* Trailing (favorito, chevron, ação) */}
            {trailing && (
              <div className={styles.slot_trailing}>
                {trailing}
              </div>
            )}
          </div>
        </Tag>
    )
  }
)

EditorialCard.displayName = 'EditorialCard'
