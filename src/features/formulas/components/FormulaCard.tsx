// ============================================================
// FormulaCard — Card de fórmula na listagem
// Capítulo V: Fórmulas
// ============================================================
// Mostra: nome, objetivo, versão, ativos, veículo, status
// NUNCA apresenta como planilha ou tabela administrativa
// ============================================================

import Link from 'next/link'
import { FormulaStatus } from './FormulaStatus'
import type { FormulaView } from '../types'
import styles from './FormulaCard.module.css'

interface FormulaCardProps {
  formula: FormulaView
}

export function FormulaCard({ formula }: FormulaCardProps) {
  const dataAtualizada = new Date(formula.atualizadoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <Link href={`/formulas/${formula.id}`} className={styles.card}>
      {/* Acento lateral */}
      <span className={styles.acento} aria-hidden="true" />

      <div className={styles.corpo}>
        {/* Cabeçalho */}
        <div className={styles.top}>
          <div className={styles.topEsquerda}>
            {formula.codigoInterno && (
              <span className={styles.codigo}>{formula.codigoInterno}</span>
            )}
            {formula.favorito && (
              <span className={styles.favorito} aria-label="Fórmula favoritada">★</span>
            )}
          </div>
          <span className={styles.data}>{dataAtualizada}</span>
        </div>

        {/* Nome */}
        <h3 className={styles.nome}>{formula.titulo}</h3>

        {/* Objetivo */}
        {formula.objetivo && (
          <p className={styles.objetivo}>{formula.objetivo}</p>
        )}

        {/* Veículo */}
        {formula.veiculo && (
          <p className={styles.veiculo}>{formula.veiculo}</p>
        )}

        {/* Rodapé */}
        <div className={styles.rodape}>
          <FormulaStatus status={formula.statusVersao} compacto />

          <div className={styles.metadados}>
            <span className={styles.versao} title="Versão ativa">
              v{formula.versaoAtiva}
            </span>
            {formula.totalAtivos > 0 && (
              <span className={styles.contagem}>
                {formula.totalAtivos} {formula.totalAtivos === 1 ? 'ativo' : 'ativos'}
              </span>
            )}
            {formula.totalCasos > 0 && (
              <span className={styles.contagem} title="Casos clínicos">
                {formula.totalCasos} {formula.totalCasos === 1 ? 'caso' : 'casos'}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {formula.tags && formula.tags.length > 0 && (
          <div className={styles.tags}>
            {formula.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            {formula.tags.length > 3 && (
              <span className={styles.tagExtra}>+{formula.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
