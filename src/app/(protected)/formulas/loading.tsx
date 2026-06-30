// /formulas — Loading state — Capítulo V

import { FormulaLoading } from '@/features/formulas/components/FormulaLoading'
import styles from './loading.module.css'

export default function FormulasLoading() {
  return (
    <div className={styles.pagina}>
      <div className={styles.header}>
        <div className={styles.pulso} style={{ width: 200, height: 28 }} />
      </div>
      <div className={styles.corpo}>
        <div className={styles.sidebar}>
          <div className={styles.pulso} style={{ height: 80 }} />
          <div className={styles.pulso} style={{ height: 120 }} />
          <div className={styles.pulso} style={{ height: 60 }} />
        </div>
        <div className={styles.conteudo}>
          <FormulaLoading quantidade={5} />
        </div>
      </div>
    </div>
  )
}
