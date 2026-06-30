// ============================================================
// CadernoService — Application Layer do Caderno de Campo
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo I — O Caderno de Campo
// ============================================================
// Zero SQL. Zero imports do Supabase.
// Toda regra de domínio do Caderno vive aqui.
// ============================================================

import 'server-only'
import { SupabaseCadernoRepository } from '../infrastructure/SupabaseCadernoRepository'
import type { ICadernoRepository } from '../repositories/ICadernoRepository'
import type {
  ObservacaoView,
  ObservacaoDetalheView,
  VersaoView,
  CadernoFiltros,
  CadernoListagem,
  CriarObservacaoInput,
  RevisarObservacaoInput,
  SalvarConexoesInput,
  TipoObservacao,
  StatusEpistemicoUI,
} from '../types'

// ─────────────────────────────────────────────
// Regras de domínio
// ─────────────────────────────────────────────

const TITULO_MINIMO = 3
const TITULO_MAXIMO = 300
const CONTEUDO_MINIMO = 5
const TAG_MAXIMA_LENGTH = 50
const TAGS_LIMITE = 20

const TIPOS_VALIDOS: TipoObservacao[] = [
  'observacao', 'hipotese', 'pergunta_clinica',
  'insight', 'lembrete', 'ideia', 'descoberta',
]

// Status que exigem justificativa ao mudar
const STATUS_REQUER_JUSTIFICATIVA: StatusEpistemicoUI[] = [
  'validada', 'refutada', 'arquivada', 'parcialmente_validada',
]

// Pares de status que representam "regressão" epistêmica
// (quando a nova versão tem status menos maduro que a anterior)
const STATUS_ORDEM: Record<StatusEpistemicoUI, number> = {
  hipotese:              1,
  observacao:            2,
  em_observacao:         2,
  parcialmente_validada: 3,
  validada:              4,
  refutada:              4,
  arquivada:             0,
}

// ─────────────────────────────────────────────
// Validações internas
// ─────────────────────────────────────────────

function validarTitulo(titulo: string): void {
  const t = titulo.trim()
  if (t.length < TITULO_MINIMO) throw new Error(`O título precisa ter ao menos ${TITULO_MINIMO} caracteres.`)
  if (t.length > TITULO_MAXIMO) throw new Error(`O título não pode ter mais de ${TITULO_MAXIMO} caracteres.`)
}

function validarConteudo(conteudo: string): void {
  const c = conteudo.trim()
  if (c.length < CONTEUDO_MINIMO) throw new Error(`O conteúdo precisa ter ao menos ${CONTEUDO_MINIMO} caracteres.`)
}

function validarTipo(tipo: string): asserts tipo is TipoObservacao {
  if (!TIPOS_VALIDOS.includes(tipo as TipoObservacao)) {
    throw new Error(`Tipo inválido: "${tipo}". Tipos aceitos: ${TIPOS_VALIDOS.join(', ')}.`)
  }
}

function normalizarTags(tags: string[]): string[] {
  if (tags.length > TAGS_LIMITE) throw new Error(`O limite de tags por observação é ${TAGS_LIMITE}.`)
  return [
    ...new Set(
      tags
        .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
        .filter((t) => t.length > 0 && t.length <= TAG_MAXIMA_LENGTH)
    ),
  ]
}

// ─────────────────────────────────────────────
// Serviço
// ─────────────────────────────────────────────

export class CadernoService {
  private readonly repo: ICadernoRepository

  constructor(repo?: ICadernoRepository) {
    this.repo = repo ?? new SupabaseCadernoRepository()
  }

  // ─── Listagem ──────────────────────────────

  async listar(tenantId: string, filtros: CadernoFiltros = {}): Promise<CadernoListagem> {
    const filtrosNormalizados: CadernoFiltros = {
      ...filtros,
      limite: Math.min(filtros.limite ?? 20, 100),
      pagina: Math.max(filtros.pagina ?? 1, 1),
    }
    return this.repo.listar(tenantId, filtrosNormalizados)
  }

  // ─── Detalhe ───────────────────────────────

  async getById(tenantId: string, observacaoId: string): Promise<ObservacaoDetalheView | null> {
    if (!observacaoId) return null
    return this.repo.getById(tenantId, observacaoId)
  }

  // ─── Versões ───────────────────────────────

  async getVersoes(tenantId: string, observacaoId: string): Promise<VersaoView[]> {
    return this.repo.getVersoes(tenantId, observacaoId)
  }

  // ─── Criação ───────────────────────────────

  async criar(tenantId: string, input: CriarObservacaoInput): Promise<ObservacaoView> {
    validarTitulo(input.titulo)
    validarConteudo(input.conteudo)
    validarTipo(input.tipo)

    const inputNormalizado: CriarObservacaoInput = {
      ...input,
      titulo: input.titulo.trim(),
      conteudo: input.conteudo.trim(),
      tags: normalizarTags(input.tags ?? []),
      statusEpistemico: input.statusEpistemico ?? 'hipotese',
    }

    return this.repo.criar(tenantId, inputNormalizado)
  }

  // ─── Revisão ───────────────────────────────

  async revisar(tenantId: string, input: RevisarObservacaoInput): Promise<ObservacaoView> {
    validarConteudo(input.conteudo)

    // Verificar se justificativa é necessária ao mudar para status mais conclusivo
    if (STATUS_REQUER_JUSTIFICATIVA.includes(input.statusEpistemico)) {
      if (!input.justificativa || input.justificativa.trim().length < 5) {
        throw new Error(
          `Uma justificativa é necessária ao marcar como "${input.statusEpistemico}".`
        )
      }
    }

    const inputNormalizado: RevisarObservacaoInput = {
      ...input,
      conteudo: input.conteudo.trim(),
      justificativa: input.justificativa?.trim() ?? undefined,
      titulo: input.titulo?.trim(),
      tags: input.tags ? normalizarTags(input.tags) : undefined,
    }

    return this.repo.revisar(tenantId, inputNormalizado)
  }

  // ─── Favoritar ─────────────────────────────

  async favoritar(tenantId: string, observacaoId: string, favorito: boolean): Promise<void> {
    await this.repo.favoritar(tenantId, observacaoId, favorito)
  }

  // ─── Arquivar ──────────────────────────────

  async arquivar(tenantId: string, observacaoId: string): Promise<void> {
    await this.repo.arquivar(tenantId, observacaoId)
  }

  // ─── Duplicar ──────────────────────────────

  async duplicar(tenantId: string, observacaoId: string): Promise<ObservacaoView> {
    return this.repo.duplicar(tenantId, observacaoId)
  }

  // ─── Conexões ──────────────────────────────

  async salvarConexoes(tenantId: string, input: SalvarConexoesInput): Promise<void> {
    await this.repo.salvarConexoes(tenantId, input)
  }

  // ─── Tags do Tenant ────────────────────────

  async getTagsTenant(tenantId: string): Promise<string[]> {
    return this.repo.getTagsTenant(tenantId)
  }

  // ─── Helpers de UI ─────────────────────────

  /** Informa se um status exige justificativa ao revisar */
  static requerJustificativa(status: StatusEpistemicoUI): boolean {
    return STATUS_REQUER_JUSTIFICATIVA.includes(status)
  }

  /** Peso epistêmico para ordenar status por maturidade */
  static pesoStatus(status: StatusEpistemicoUI): number {
    return STATUS_ORDEM[status] ?? 0
  }
}

// Singleton — mesma instância em todos os Server Components
export const cadernoService = new CadernoService()
