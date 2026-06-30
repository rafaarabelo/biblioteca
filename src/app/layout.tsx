// ============================================================
// Root Layout — Next.js App Router
// A Biblioteca — Sprint 3
// ============================================================
// Fontes carregadas via next/font/google: self-hosting automático,
// zero layout shift, sem requisição externa ao Google em runtime.
// Cada fonte expõe uma CSS variable consumida pelo Design System.
// ============================================================

import type { Metadata } from 'next'
import {
  Cormorant_Garamond,
  Source_Serif_4,
  Instrument_Sans,
  Inter,
  Satisfy,
  IBM_Plex_Mono,
} from 'next/font/google'
import './globals.css'

// ── Fontes do Design System ─────────────────────────────────
// Cormorant Garamond: serif editorial para títulos
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Source Serif 4: serif para subtítulos e corpo longo
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
})

// Instrument Sans: sans-serif para UI e textos de interface
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-instrument-sans',
  display: 'swap',
})

// Inter: legendas e notas
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

// Satisfy: manuscrita cursiva para bilhetes e notas pessoais
const satisfy = Satisfy({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-satisfy',
  display: 'swap',
})

// IBM Plex Mono: texto técnico, INCIs, códigos
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

const fontVariables = [
  cormorant.variable,
  sourceSerif.variable,
  instrumentSans.variable,
  inter.variable,
  satisfy.variable,
  ibmPlexMono.variable,
].join(' ')

export const metadata: Metadata = {
  title: {
    default: 'A Biblioteca',
    template: '%s — A Biblioteca',
  },
  description: 'A Biblioteca — uma biblioteca viva de conhecimento cosmetológico de Rafa Rabelo',
  applicationName: 'A Biblioteca',
  openGraph: {
    title: 'A Biblioteca',
    description: 'A Biblioteca — uma biblioteca viva de conhecimento cosmetológico de Rafa Rabelo',
    siteName: 'A Biblioteca',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={fontVariables} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  )
}
