// CasoDetalheClient — Ações do caso e modal de evolução (client)
// ============================================================
// Contém: favoritar optimistically + modal de nova evolução
// ============================================================

'use client'

import { useState }           from 'react'
import { useAcoesCaso, useNovaEvolucao } from '@/features/casos/hooks/useCasoEditor'
import type { CasoDetalheView }          from '@/features/casos/types'
import styles from './detalhe.module.css'

// Sub-componente: formulário de nova evolução ──────────────

import { useRef }          from 'react'
import type { EvolucaoEditorCampos } from '@/features/casos/types'

interface ModalEvolucaoProps {
  caso: CasoDetalheView
  onFechar: () => void
}

const TIPO_OPCOES = [
  { value: 'consulta',            label: 'Consulta'             },
  { value: 'retorno',             label: 'Retorno'              },
  { value: 'avaliacao_resultado', label: 'Avaliação de resultado'},
  { value: 'intercorrencia',      label: 'Intercorrência'       },
  { value: 'encerramento',        label: 'Encerramento'         },
  { value: 'outro',               label: 'Outro registro'       },
]

function ModalEvolucao({ caso, onFechar }: ModalEvolucaoProps) {
  const { campos, erro, salvando, onSet, onSalvar } = useNovaEvolucao(caso)

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Nova evolução">
      <div className={styles.modal}>
        <div className={styles.modalCabecalho}>
          <h2 className={styles.modalTitulo}>Nova evolução</h2>
          <button
            type="button"
            className={styles.modalFechar}
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className={styles.modalCorpo}>
          {/* Tipo + Data */}
          <div className={styles.modalGrid}>
            <div className={styles.modalCampo}>
              <label className={styles.modalLabel} htmlFor="ev-tipo">Tipo de registro</label>
              <select
                id="ev-tipo"
                className={styles.modalSelect}
                value={campos.tipo}
                onChange={(e) => onSet({ tipo: e.target.value as EvolucaoEditorCampos['tipo'] })}
              >
                {TIPO_OPCOES.map((op) => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
            <div className={styles.modalCampo}>
              <label className={styles.modalLabel} htmlFor="ev-data">Data do atendimento</label>
              <input
                id="ev-data"
                type="datetime-local"
                className={styles.modalInput}
                value={campos.dataAtendimento}
                onChange={(e) => onSet({ dataAtendimento: e.target.value })}
              />
            </div>
          </div>

          {/* Descrição */}
          <div className={styles.modalCampo}>
            <label className={styles.modalLabel} htmlFor="ev-descricao">
              Descrição clínica <span style={{ color: 'var(--terracota-500)' }}>*</span>
            </label>
            <textarea
              id="ev-descricao"
              className={styles.modalTextarea}
              value={campos.descricao}
              onChange={(e) => onSet({ descricao: e.target.value })}
              placeholder="O que você observou neste atendimento? Seja específico."
              rows={5}
              required
            />
          </div>

          {/* Observações clínicas */}
          <div className={styles.modalCampo}>
            <label className={styles.modalLabel} htmlFor="ev-obs">Observações clínicas</label>
            <textarea
              id="ev-obs"
              className={styles.modalTextarea}
              value={campos.observacoesClinices}
              onChange={(e) => onSet({ observacoesClinices: e.target.value })}
              placeholder="Condição da pele, resposta ao protocolo, achados relevantes."
              rows={3}
            />
          </div>

          {/* Resultados observados */}
          <div className={styles.modalCampo}>
            <label className={styles.modalLabel} htmlFor="ev-resultados">Resultados observados</label>
            <textarea
              id="ev-resultados"
              className={styles.modalTextarea}
              value={campos.resultados}
              onChange={(e) => onSet({ resultados: e.target.value })}
              placeholder="Mudanças percebidas desde a última consulta."
              rows={2}
            />
          </div>

          {/* Reações adversas */}
          <div className={styles.modalCampo}>
            <label className={styles.modalLabel} htmlFor="ev-reacoes">
              Reações adversas
              <span className={styles.modalLabelHint}>Se houver, registre aqui</span>
            </label>
            <textarea
              id="ev-reacoes"
              className={styles.modalTextarea}
              value={campos.reacoesAdversas}
              onChange={(e) => onSet({ reacoesAdversas: e.target.value })}
              placeholder="Irritação, vermelhidão, descamação, desconforto..."
              rows={2}
            />
          </div>

          {/* Satisfação */}
          <div className={styles.modalCampo}>
            <label className={styles.modalLabel}>Satisfação percebida</label>
            <div className={styles.satisfacaoOpcoes}>
              {[
                { v: '1', l: 'Muito insatisfeito' },
                { v: '2', l: 'Insatisfeito' },
                { v: '3', l: 'Neutro' },
                { v: '4', l: 'Satisfeito' },
                { v: '5', l: 'Muito satisfeito' },
              ].map(({ v, l }) => (
                <button
                  key={v}
                  type="button"
                  className={[
                    styles.satisfacaoBtn,
                    campos.satisfacaoPaciente === v ? styles.satisfacaoBtnAtivo : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => onSet({ satisfacaoPaciente: campos.satisfacaoPaciente === v ? '' : v })}
                  title={l}
                  aria-pressed={campos.satisfacaoPaciente === v}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Aviso de imutabilidade */}
          <p className={styles.avisoImutavel}>
            ⚠ Evoluções são permanentes e imutáveis após salvas. Revise antes de confirmar.
          </p>

          {/* Erro */}
          {erro && <p className={styles.erro} role="alert">{erro}</p>}
        </div>

        <div className={styles.modalRodape}>
          <button type="button" className={styles.modalCancelar} onClick={onFechar}>
            Cancelar
          </button>
          <button
            type="button"
            className={styles.modalSalvar}
            onClick={onSalvar}
            disabled={salvando}
          >
            {salvando ? 'Registrando...' : 'Registrar evolução'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────

interface CasoDetalheClientProps {
  caso: CasoDetalheView
}

export function CasoDetalheClient({ caso }: CasoDetalheClientProps) {
  const { favorito, onFavoritar } = useAcoesCaso(caso.id, caso.favorito)
  const [modalAberto, setModalAberto] = useState(false)

  return (
    <>
      {/* Ações na lateral */}
      <div className={styles.acoes}>
        <button
          type="button"
          className={[styles.acao, favorito ? styles.acaoFavorito : ''].filter(Boolean).join(' ')}
          onClick={() => onFavoritar(!favorito)}
          aria-pressed={favorito}
          title={favorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          {favorito ? '★' : '☆'} {favorito ? 'Favoritado' : 'Favoritar'}
        </button>
        <button
          type="button"
          className={[styles.acao, styles.acaoPrincipal].join(' ')}
          onClick={() => setModalAberto(true)}
        >
          + Registrar evolução
        </button>
      </div>

      {/* Modal de nova evolução */}
      {modalAberto && (
        <ModalEvolucao
          caso={caso}
          onFechar={() => setModalAberto(false)}
        />
      )}
    </>
  )
}
