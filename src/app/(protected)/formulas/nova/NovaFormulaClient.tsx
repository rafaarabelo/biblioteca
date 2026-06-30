'use client'

// NovaFormulaClient — Página de criação de fórmula
// Capítulo V: Fórmulas

import Link from 'next/link'
import { useNovaFormula } from '@/features/formulas/hooks/useFormulaEditor'
import { FormulaEditor }  from '@/features/formulas/components/FormulaEditor'
import styles from './NovaFormulaClient.module.css'

export function NovaFormulaClient() {
  const {
    campos, erro, registrando,
    onSet, onSalvar,
    adicionarIngrediente, removerIngrediente, atualizarIngrediente,
  } = useNovaFormula()

  return (
    <div className={styles.pagina}>
      <div className={styles.cabecalho}>
        <Link href="/formulas" className={styles.voltar}>
          ← Fórmulas
        </Link>
        <h1 className={styles.titulo}>Nova fórmula</h1>
        <p className={styles.subtitulo}>
          Toda fórmula começa como uma hipótese. Registre o que você sabe agora.
          As versões seguintes guardarão o que você aprenderá.
        </p>
      </div>

      <FormulaEditor
        modo="formula"
        campos={campos}
        onSet={onSet}
        adicionarIngrediente={adicionarIngrediente}
        removerIngrediente={removerIngrediente}
        atualizarIngrediente={atualizarIngrediente}
        onSalvar={onSalvar}
        registrando={registrando}
        erro={erro}
      />
    </div>
  )
}
