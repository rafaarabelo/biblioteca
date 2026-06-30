// ============================================================
// Animações — Constantes e Configurações
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 3
// ============================================================
// A Biblioteca transmite calma. Todos os movimentos são lentos
// e intencionais. Nenhuma animação chama atenção por si mesma.
// ============================================================

// Durações (ms)
export const duration = {
  instant:  100,
  fast:     150,
  normal:   250,
  slow:     400,
  bilhete:  600,   // Abertura do Bilhete Aurora — deliberadamente mais lenta
  entrada:  700,   // Elementos entrando na viewport
  pagina:   350,   // Transição entre páginas
} as const

// Curvas de easing
export const easing = {
  // Movimentos naturais
  standard:    'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  decelerate:  'cubic-bezier(0.00, 0.00, 0.20, 1.00)',  // Elementos chegando
  accelerate:  'cubic-bezier(0.40, 0.00, 1.00, 1.00)',  // Elementos saindo

  // Específicos
  bilhete:     'cubic-bezier(0.16, 1, 0.3, 1)',  // Spring suave para o bilhete
  hover:       'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  ripple:      'cubic-bezier(0.00, 0.36, 0.58, 1.00)',
} as const

// Transições CSS prontas para uso inline
export const transition = {
  fast:    `${duration.fast}ms ${easing.standard}`,
  normal:  `${duration.normal}ms ${easing.standard}`,
  slow:    `${duration.slow}ms ${easing.standard}`,
  bilhete: `${duration.bilhete}ms ${easing.bilhete}`,
} as const

// Keyframes CSS (como strings para inserção em <style>)
export const keyframes = {
  fadeUp: `
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
  `,
  paperUnfold: `
    @keyframes paperUnfold {
      from { opacity: 0; transform: scaleY(0.95) translateY(-4px); }
      to   { opacity: 1; transform: scaleY(1) translateY(0); }
    }
  `,
} as const

// Delays para animações em cascata (stagger)
export function staggerDelay(index: number, base = 60): string {
  return `${index * base}ms`
}
