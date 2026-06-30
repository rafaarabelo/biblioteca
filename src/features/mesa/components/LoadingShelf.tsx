// ============================================================
// LoadingShelf — Seção completa da Mesa sendo preparada
// Biblioteca Cosmetológica Rafa Rabelo
// Sprint 4 — Mesa conectada ao banco
// ============================================================
// Usado como fallback do Suspense em mesa/loading.tsx.
// Mostra o esqueleto de toda a Mesa durante o carregamento:
// saudação, busca, bilhete, seções com cards.
//
// Não usa Suspense nem hooks — é um Server Component.
// ============================================================

import styles from './LoadingShelf.module.css'
import { LoadingPaper } from './LoadingPaper'
import { LoadingCard } from './LoadingCard'

export function LoadingShelf() {
  return (
    <div className={styles.page} aria-hidden="true" aria-label="Mesa sendo preparada">

      {/* ─── Saudação ─────────────────────────────── */}
      <section className={styles.saudacao}>
        <div className={[styles.linha, styles.linhaH1].join(' ')} />
        <div className={[styles.linha, styles.linhaFrase].join(' ')} />
      </section>

      {/* ─── Busca ────────────────────────────────── */}
      <div className={styles.searchPlaceholder} />

      {/* ─── Hero ─────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.bilheteCol}>
          {/* SectionTitle placeholder */}
          <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
          <LoadingPaper />
        </div>

        {/* Manifesto placeholder */}
        <div className={styles.manifesto}>
          <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
          <div className={styles.manifestoLinhas}>
            <div className={[styles.linha, styles.linhaTexto].join(' ')} />
            <div className={[styles.linha, styles.linhaTexto, styles.linhaTextoMed].join(' ')} />
            <div className={[styles.linha, styles.linhaTexto, styles.linhaTextoCurta].join(' ')} />
          </div>
        </div>
      </div>

      {/* ─── Divisor ──────────────────────────────── */}
      <div className={styles.divisor} />

      {/* ─── Em andamento (3 cards) ───────────────── */}
      <section className={styles.secao}>
        <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
        <div className={styles.grid3}>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </section>

      {/* ─── Divisor ──────────────────────────────── */}
      <div className={styles.divisor} />

      {/* ─── Observações + Fórmulas (2 colunas) ──── */}
      <div className={styles.doisCol}>
        <section className={styles.secao}>
          <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
          <div className={styles.stack}>
            <LoadingCard compact />
            <LoadingCard compact />
            <LoadingCard compact />
          </div>
        </section>
        <section className={styles.secao}>
          <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
          <div className={styles.stack}>
            <LoadingCard compact />
            <LoadingCard compact />
            <LoadingCard compact />
          </div>
        </section>
      </div>

      {/* ─── Divisor ──────────────────────────────── */}
      <div className={styles.divisor} />

      {/* ─── Artigos (3 cards) ────────────────────── */}
      <section className={styles.secao}>
        <div className={[styles.linha, styles.linhaSectionTitle].join(' ')} />
        <div className={styles.grid3}>
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </div>
      </section>

    </div>
  )
}
