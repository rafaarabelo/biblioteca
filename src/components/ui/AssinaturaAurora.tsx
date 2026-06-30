// ============================================================
// AssinaturaAurora — Assinatura Animada da Aurora
// Biblioteca Cosmetológica Rafa Rabelo
// ============================================================
// A assinatura aparece letra por letra, como se acabasse de
// ser escrita. Só anima quando o bilhete está aberto.
// A última letra é a que finaliza — o "A." ou "✿" chegam
// por último, criando o momento de reconhecimento.
// ============================================================

'use client'

import { useState, useEffect } from 'react'
import styles from './BilheteAurora.module.css'

interface AssinaturaAuroraProps {
  /** Texto da assinatura. "A." para primeira visita, "— Aurora ✿" no padrão. */
  texto?: string
  /** Controla quando a animação deve iniciar. */
  visivel: boolean
}

export function AssinaturaAurora({
  texto = '— Aurora ✿',
  visivel,
}: AssinaturaAuroraProps) {
  const [animando, setAnimando] = useState(false)

  useEffect(() => {
    if (!visivel) {
      setAnimando(false)
      return
    }
    // Aguarda a expansão do bilhete terminar (~600ms) antes de começar a escrever
    const t = setTimeout(() => setAnimando(true), 650)
    return () => clearTimeout(t)
  }, [visivel])

  return (
    <div className={styles.assinaturaWrap}>
      <span
        className={styles.assinaturaTexto}
        aria-label={texto}
        role="text"
      >
        {texto.split('').map((char, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={[
              styles.sigChar,
              animando ? styles.sigCharVisivel : '',
            ].filter(Boolean).join(' ')}
            style={animando ? { animationDelay: `${i * 50}ms` } : undefined}
          >
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </div>
  )
}
