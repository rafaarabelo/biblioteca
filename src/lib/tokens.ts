// ============================================================
// Design Tokens — TypeScript
// A Biblioteca — Sprint VI (Design Fidelity)
// ============================================================
// Tokens como constantes JS — para uso em lógica de animação,
// cálculos de espaçamento, e contextos que não têm acesso a CSS.
// A fonte da verdade visual permanece em src/styles/design-system.css.
// ============================================================

// ── Paleta Completa ──────────────────────────────────────────

export const cores = {
  terracota: {
    50:  '#FDF4F0',
    100: '#FAE4D8',
    200: '#F4C4A8',
    300: '#ECA07A',
    400: '#E07A52',
    500: '#C45F3A',
    600: '#A34E30',
    700: '#813D26',
    800: '#60301F',
    900: '#401F15',
  },
  oliva: {
    50:  '#F4F6F0',
    100: '#E4EBD8',
    200: '#C8D6B0',
    300: '#A4BA82',
    400: '#7D9A58',
    500: '#5C7A3E',
    600: '#4A6432',
    700: '#3A4F28',
    800: '#2B3A1E',
    900: '#1C2614',
  },
  musgo: {
    50:  '#F0F5F2',
    100: '#D8EAE1',
    200: '#A8CEB8',
    300: '#7AB299',
    400: '#52967E',
    500: '#3A7A65',
    600: '#2E6352',
    700: '#234D40',
    800: '#18372E',
    900: '#0F221D',
  },
  vinho: {
    50:  '#F9F0F2',
    100: '#F0D8DE',
    200: '#D4A0AF',
    300: '#B86A82',
    400: '#9C4460',
    500: '#7A2E48',
    600: '#63253B',
    700: '#4D1D2F',
    800: '#381524',
    900: '#240E18',
  },
  dourado: {
    50:  '#FFFBF0',
    100: '#FFF3D0',
    200: '#FFE49A',
    300: '#E8C96A',
    400: '#C8A43E',
    500: '#A6872A',
    600: '#8A6F20',
    700: '#6E5818',
    800: '#524210',
    900: '#372C0A',
  },
  neutro: {
    0:   '#FEFCF9',
    50:  '#FAF9F7',
    100: '#F4F2EE',
    200: '#E8E4DE',
    300: '#D4CFC7',
    400: '#B8B2A8',
    500: '#908A80',
    600: '#706860',
    700: '#504840',
    800: '#342E28',
    900: '#1A1612',
  },
  papel: {
    creme:    '#F0E7DC',
    algodao:  '#F4EDE4',
    velho:    '#EFE5DA',
    dobra:    '#E5DBCE',
    borda:    '#DED2C2',
    manchado: '#D8CBBA',
    sombra:   '#C9BAA6',
  },
  madeira: {
    clara:     '#C4A882',
    mel:       '#A18A72',
    media:     '#8C5430',
    nogueira:  '#6E4B2E',
    escura:    '#553219',
    profunda:  '#403226',
    sombra:    '#2D2118',
  },
  tinta: {
    preta:  '#2A2118',
    sepia:  '#5C3D22',
    marrom: '#4A3520',
    azul:   '#2C4A6E',
    ferro:  '#3A3A42',
  },
} as const

// ── Tipografia ───────────────────────────────────────────────

export const tipografia = {
  familias: {
    serif:     "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
    serifBody: "'Source Serif 4', 'Spectral', Georgia, serif",
    sans:      "'Instrument Sans', system-ui, -apple-system, sans-serif",
    script:    "'Shadows Into Light', 'Patrick Hand', cursive",
    mono:      "'IBM Plex Mono', 'JetBrains Mono', 'Courier New', monospace",
    legenda:   "'Inter', system-ui, sans-serif",
  },
  escala: {
    '2xs':  '0.625rem',
    xs:     '0.75rem',
    sm:     '0.875rem',
    base:   '1rem',
    md:     '1.125rem',
    lg:     '1.25rem',
    xl:     '1.5rem',
    '2xl':  '1.875rem',
    '3xl':  '2.25rem',
    '4xl':  '3rem',
    '5xl':  '3.75rem',
  },
  pesos: {
    leve:   300,
    normal: 400,
    medio:  500,
    semi:   600,
    bold:   700,
  },
  alturaLinha: {
    apertada: 1.15,
    titulo:   1.25,
    corpo:    1.6,
    relaxada: 1.8,
  },
} as const

// ── Espaçamento ──────────────────────────────────────────────

export const espacamento = {
  px:  '1px',
  0:   '0',
  0.5: '0.125rem',
  1:   '0.25rem',
  1.5: '0.375rem',
  2:   '0.5rem',
  3:   '0.75rem',
  4:   '1rem',
  5:   '1.25rem',
  6:   '1.5rem',
  7:   '1.75rem',
  8:   '2rem',
  10:  '2.5rem',
  12:  '3rem',
  14:  '3.5rem',
  16:  '4rem',
  20:  '5rem',
  24:  '6rem',
} as const

// ── Raios de Borda ───────────────────────────────────────────

export const raios = {
  nenhum: '0',
  xs:     '2px',
  sm:     '4px',
  md:     '8px',
  lg:     '12px',
  xl:     '16px',
  '2xl':  '24px',
  total:  '9999px',
} as const

// ── Sombras ──────────────────────────────────────────────────

export const sombras = {
  0: 'none',
  1: '-1px 1px 3px rgba(84, 50, 25, 0.05)',
  2: '-1px 2px 4px rgba(84, 50, 25, 0.06)',
  3: '-2px 4px 10px rgba(84, 50, 25, 0.08), -1px 2px 4px rgba(84, 50, 25, 0.04)',
  4: '-3px 8px 20px rgba(84, 50, 25, 0.10), -1px 3px 8px rgba(84, 50, 25, 0.05)',
  5: '-4px 14px 30px rgba(84, 50, 25, 0.12), -2px 6px 12px rgba(84, 50, 25, 0.05)',
  6: '-6px 24px 48px rgba(84, 50, 25, 0.16), -2px 8px 16px rgba(84, 50, 25, 0.06)',
  papel:    '-2px 3px 8px rgba(84, 50, 25, 0.10), -1px 1px 3px rgba(84, 50, 25, 0.06)',
  caderno:  '-3px 6px 16px rgba(84, 50, 25, 0.12), -1px 2px 5px rgba(84, 50, 25, 0.06)',
  envelope: '-2px 4px 12px rgba(84, 50, 25, 0.14), 0 1px 3px rgba(84, 50, 25, 0.08)',
} as const

// ── Transições ───────────────────────────────────────────────

export const transicoes = {
  rapida:   '120ms ease',
  normal:   '200ms ease',
  media:    '300ms ease',
  lenta:    '400ms ease-out',
  suave:    '500ms cubic-bezier(0.25, 0.1, 0.25, 1)',
  hover:    '150ms ease',
  expandir: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  mola:     '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

// ── Z-Index ──────────────────────────────────────────────────

export const zIndex = {
  mesa:      0,
  papel:     10,
  caderno:   20,
  card:      30,
  flutuante: 40,
  dropdown:  50,
  sticky:    60,
  overlay:   70,
  modal:     80,
  toast:     90,
  tooltip:   100,
} as const

// ── Layout ───────────────────────────────────────────────────

export const layout = {
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl': '1536px',
  },
  container: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1100px',
    '2xl': '1280px',
  },
  sidebar: {
    largura: '240px',
    colapsada: '64px',
  },
} as const

// ── Opacidade ────────────────────────────────────────────────

export const opacidade = {
  0:   0,
  5:   0.05,
  10:  0.10,
  20:  0.20,
  30:  0.30,
  40:  0.40,
  50:  0.50,
  60:  0.60,
  70:  0.70,
  80:  0.80,
  90:  0.90,
  100: 1,
  desabilitado: 0.45,
  placeholder:  0.55,
  sutil:        0.70,
} as const

// ── Re-exportações (retrocompatibilidade) ────────────────────

/** @deprecated Use `cores.terracota`, `cores.musgo`, etc. */
export const colors = {
  terracota: cores.terracota,
  salvia: cores.musgo,
  ambar: cores.dourado,
  neutro: cores.neutro,
} as const

/** @deprecated Use `espacamento` */
export const spacing = espacamento

/** @deprecated Use `raios` */
export const radius = raios

/** @deprecated Use `tipografia.familias` */
export const typography = {
  fontSerif:  tipografia.familias.serif,
  fontSans:   tipografia.familias.sans,
  fontMono:   tipografia.familias.mono,
  fontScript: tipografia.familias.script,
} as const

/** @deprecated Use `cores.papel` */
export const papel = {
  background: cores.papel.creme,
  lines:      'rgba(196, 95, 58, 0.10)',
  fold:       'rgba(180, 160, 120, 0.35)',
  shadow:     'rgba(90, 70, 40, 0.18)',
  ink:        cores.tinta.preta,
  signatureInk: cores.tinta.sepia,
} as const
