import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background:  'var(--background)',
        foreground:  'var(--foreground)',
        surface:     'var(--surface)',
        border:      'var(--border)',
        muted:       'var(--muted)',
        'muted-fg':  'var(--muted-fg)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover:   'var(--primary-hover)',
          fg:      'var(--primary-fg)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          fg:      'var(--secondary-fg)',
        },
      },
      fontFamily: {
        serif:  ['var(--font-serif)'],
        sans:   ['var(--font-sans)'],
        mono:   ['var(--font-mono)'],
        script: ['var(--font-script)'],
      },
      transitionTimingFunction: {
        'biblioteca': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
}

export default config
