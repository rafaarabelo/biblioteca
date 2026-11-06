'use client'

import s from '@/features/clinica/ui/clinica.module.css'

export default function ErroClinica({ error, reset }: { error: Error; reset: () => void }) {
  const semTabelas = /does not exist|schema cache|Could not find the table/i.test(error.message)
  return (
    <div className={s.pagina}>
      <div className={s.card}>
        <h1 className={s.titulo} style={{ fontSize: 28 }}>Não consegui carregar esta tela</h1>
        {semTabelas ? (
          <p className={s.aviso} style={{ marginTop: 16 }}>
            As tabelas da Gestão Natural ainda não existem no banco. Rode o arquivo
            <code> supabase/017_gestao_natural.sql </code> no SQL Editor do Supabase e recarregue.
          </p>
        ) : (
          <p className={s.avisoTrava} style={{ marginTop: 16 }}>{error.message}</p>
        )}
        <div className={s.acoes} style={{ marginTop: 16 }}>
          <button type="button" className={s.botao} onClick={reset}>Tentar de novo</button>
        </div>
      </div>
    </div>
  )
}
