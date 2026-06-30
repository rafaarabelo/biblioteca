// ============================================================
// ReferenciaDetalheClient — Client Component do detalhe
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// Gerencia estado de edição, favorito e arquivamento.
// Renderizado em 3 modos: 'favorito' | 'conteudo' | 'acoes'
// ============================================================

'use client'

import { useRouter } from 'next/navigation'
import { useEditarReferencia, useAcoesReferencia } from '@/features/acervo/hooks/useReferenciaEditor'
import { ReferenceEditor } from '@/features/acervo/components/ReferenceEditor'
import type { ReferenciaDetalheView } from '@/features/acervo/types'
import type { EditorCampos } from '@/features/acervo/components/ReferenceEditor'
import styles from './ReferenciaDetalheClient.module.css'

type SetEditorFn = <K extends keyof EditorCampos>(campo: K, valor: EditorCampos[K]) => void

interface ReferenciaDetalheClientProps {
  referencia: ReferenciaDetalheView
  modo: 'favorito' | 'conteudo' | 'acoes'
}

export function ReferenciaDetalheClient({ referencia, modo }: ReferenciaDetalheClientProps) {
  const router = useRouter()

  const { favorito, alternarFavorito, arquivar, pending: pendingFav } =
    useAcoesReferencia(referencia.id, referencia.favorito)

  const { estado: edicao, abrir, fechar, set, salvar, pending: pendingEdicao } =
    useEditarReferencia(referencia)

  // ─── Modo: botão de favorito ────────────────────────────────
  if (modo === 'favorito') {
    return (
      <button
        type="button"
        className={[styles.favBtn, favorito ? styles.favAtivo : ''].filter(Boolean).join(' ')}
        onClick={alternarFavorito}
        disabled={pendingFav}
        aria-label={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        title={favorito ? 'Favorito — clique para remover' : 'Adicionar aos favoritos'}
      >
        {favorito ? '★' : '☆'}
      </button>
    )
  }

  // ─── Modo: ações laterais (editar, arquivar) ────────────────
  if (modo === 'acoes') {
    const handleArquivar = async () => {
      if (!confirm('Arquivar esta referência? Ela sairá do acervo principal.')) return
      const ok = await arquivar()
      if (ok) router.push('/acervo')
    }

    return (
      <div className={styles.acoes}>
        <button
          type="button"
          className={styles.btnEditar}
          onClick={abrir}
        >
          Editar referência
        </button>
        <button
          type="button"
          className={styles.btnArquivar}
          onClick={handleArquivar}
        >
          Arquivar
        </button>
      </div>
    )
  }

  // ─── Modo: conteúdo principal ────────────────────────────────
  if (edicao.aberta) {
    return (
      <div className={styles.editorWrapper}>
        <h2 className={styles.editorTitulo}>Editar referência</h2>
        <ReferenceEditor
          campos={{
            ...edicao,
            registrando: false,
            salvando: pendingEdicao || edicao.salvando,
          }}
          modoEdicao
          onSet={set as unknown as SetEditorFn}
          onSalvar={salvar}
          onCancelar={fechar}
        />
      </div>
    )
  }

  return (
    <div className={styles.conteudo}>

      {/* Abstract */}
      {referencia.abstract && (
        <section className={styles.bloco}>
          <h2 className={styles.blocoTitulo}>Resumo</h2>
          <div className={styles.abstract}>
            {referencia.abstract.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Conclusões */}
      {referencia.conclusoesPrincipais && (
        <section className={styles.bloco}>
          <h2 className={styles.blocoTitulo}>Principais conclusões</h2>
          <div className={styles.texto}>
            {referencia.conclusoesPrincipais.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Limitações */}
      {referencia.limitacoes && (
        <section className={styles.bloco}>
          <h2 className={styles.blocoTitulo}>Limitações</h2>
          <div className={[styles.texto, styles.limitacoes].join(' ')}>
            {referencia.limitacoes.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Notas pessoais */}
      {referencia.notasPessoais && (
        <section className={styles.bloco}>
          <h2 className={styles.blocoTitulo}>Notas pessoais</h2>
          <div className={[styles.texto, styles.notasPessoais].join(' ')}>
            {referencia.notasPessoais.split('\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      )}

      {/* Vazio — sem conteúdo ainda */}
      {!referencia.abstract &&
       !referencia.conclusoesPrincipais &&
       !referencia.limitacoes &&
       !referencia.notasPessoais && (
        <p className={styles.vazio}>
          Esta referência ainda não tem conteúdo detalhado.{' '}
          <button type="button" onClick={abrir} className={styles.linkEditar}>
            Adicionar agora
          </button>
        </p>
      )}
    </div>
  )
}
