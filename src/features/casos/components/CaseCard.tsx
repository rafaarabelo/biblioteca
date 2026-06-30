// ============================================================
// CaseCard — Card de Caso Clínico na listagem
// Biblioteca Cosmetológica Rafa Rabelo — Capítulo IV
// ============================================================
// Nunca mostrar CPF, telefone, nome completo.
// Apenas: código anonimizado, objetivo, status, datas, contagens.
// ============================================================

import Link from 'next/link'
import { CaseStatus } from './CaseStatus'
import type { CasoView } from '../types'
import styles from './CaseCard.module.css'

interface CaseCardProps {
  caso: CasoView
}

export function CaseCard({ caso }: CaseCardProps) {
  const dataInicio = new Date(caso.abertoEm).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  })

  return (
    <Link href={`/casos/${caso.id}`} className={styles.card}>
      {/* Acento lateral colorido por status */}
      <span
        className={styles.acento}
        aria-hidden="true"
      />

      <div className={styles.corpo}>
        {/* Cabeçalho do card */}
        <div className={styles.top}>
          <div className={styles.topEsquerda}>
            <span className={styles.codigo}>
              {caso.codigoAnonimizado ?? `#${caso.id.slice(-6).toUpperCase()}`}
            </span>
            {caso.favorito && (
              <span className={styles.favorito} aria-label="Caso favoritado">★</span>
            )}
          </div>
          <span className={styles.data}>{dataInicio}</span>
        </div>

        {/* Objetivo */}
        {caso.objetivoPrincipal && (
          <h3 className={styles.objetivo}>{caso.objetivoPrincipal}</h3>
        )}

        {/* Queixa */}
        {caso.queixaPrincipal && (
          <p className={styles.queixa}>{caso.queixaPrincipal}</p>
        )}

        {/* Rodapé */}
        <div className={styles.rodape}>
          <CaseStatus status={caso.status} compacto />

          <div className={styles.contagens}>
            {caso.totalEvolucoes > 0 && (
              <span className={styles.contagem} title="Registros de evolução">
                {caso.totalEvolucoes} {caso.totalEvolucoes === 1 ? 'registro' : 'registros'}
              </span>
            )}
            {caso.totalFotos > 0 && (
              <span className={styles.contagem} title="Fotos clínicas">
                {caso.totalFotos} {caso.totalFotos === 1 ? 'foto' : 'fotos'}
              </span>
            )}
          </div>
        </div>

        {/* Tags */}
        {caso.tags && caso.tags.length > 0 && (
          <div className={styles.tags}>
            {caso.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
            {caso.tags.length > 3 && (
              <span className={styles.tagExtra}>+{caso.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
