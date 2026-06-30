import styles from './Divider.module.css'

interface DividerProps {
  spacing?: 'sm' | 'md' | 'lg'
  className?: string
}

const SPACING = { sm: '1rem', md: '2rem', lg: '3rem' }

export function Divider({ spacing = 'md', className = '' }: DividerProps) {
  return (
    <hr
      className={[styles.divider, className].filter(Boolean).join(' ')}
      style={{ margin: `${SPACING[spacing]} 0` }}
      aria-hidden="true"
    />
  )
}
