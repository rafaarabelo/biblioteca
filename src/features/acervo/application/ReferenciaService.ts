// ============================================================
// ReferenciaService — Camada de Aplicação
// Biblioteca Cosmetológica Rafa Rabelo
// Capítulo II — O Acervo Científico
// ============================================================
// import 'server-only': este módulo nunca chega ao cliente.
// Zero SQL. Zero Supabase. Apenas regras de domínio.
// ============================================================

import 'server-only'

import { supabaseReferenciaRepository } from '../infrastructure/SupabaseReferenciaRepository'
import type {
  ReferenciaView,
  ReferenciaDetalheView,
  AcervoListagem,
  AcervoFiltros,
  CriarReferenciaInput,
  AtualizarReferenciaInput,
  SalvarConexoesAcervoInput,
  TipoEstudo,
  NivelEvidencia,
} from '../types'
import { TIPOS_ESTUDO, NIVEIS_EVIDENCIA } from '../types'

// ─────────────────────────────────────────────
// Constantes de Domínio
// ─────────────────────────────────────────────

const TITULO_MINIMO      = 3
const TITULO_MAXIMO      = 500
const DOI_PADRAO         = /^10\.\d{4,}\/\S+$/
const PMID_PADRAO        = /^\d{1,9}$/
const ANO_MINIMO         = 1800
const TAG_MAXIMA_LENGTH  = 50
const TAGS_LIMITE        = 20
const AUTORES_LIMITE     = 50

// ─────────────────────────────────────────────
// Serviço
// ─────────────────────────────────────────────

class ReferenciaService {

  // ─── Helpers estáticos ────────────────────

  /** Peso epistêmico de um tipo de estudo (1-5) */
  static pesoTipoEstudo(tipo: TipoEstudo | null): number {
    if (!tipo) return 0
    return TIPOS_ESTUDO[tipo]?.pesoEpistemico ?? 1
  }

  /** Peso de um nível de evidência (1-6) */
  static pesoNivelEvidencia(nivel: NivelEvidencia | null): number {
    if (!nivel) return 0
    return NIVEIS_EVIDENCIA[nivel]?.peso ?? 1
  }

  /** Formata autores para exibição: "Silva R, Rabelo R" */
  static formatarAutores(autores: string[]): string {
    if (autores.length === 0) return ''
    if (autores.length <= 3) return autores.join(', ')
    return `${autores.slice(0, 3).join(', ')} et al.`
  }

  /** Formata citação curta: "Autores (Ano). Título. Journal." */
  static citacaoCurta(ref: ReferenciaView): string {
    const partes: string[] = []
    if (ref.autores.length > 0) partes.push(ReferenciaService.formatarAutores(ref.autores))
    if (ref.anoPublicacao) partes.push(`(${ref.anoPublicacao})`)
    partes.push(ref.titulo)
    if (ref.journal) partes.push(ref.journal)
    return partes.join('. ') + '.'
  }

  // ─── Validadores privados ─────────────────

  private validarTitulo(titulo: string): void {
    const t = titulo.trim()
    if (t.length < TITULO_MINIMO) {
      throw new Error(`Título deve ter pelo menos ${TITULO_MINIMO} caracteres.`)
    }
    if (t.length > TITULO_MAXIMO) {
      throw new Error(`Título não pode ultrapassar ${TITULO_MAXIMO} caracteres.`)
    }
  }

  private validarDoi(doi: string | null | undefined): void {
    if (!doi) return
    const d = doi.trim()
    if (d && !DOI_PADRAO.test(d)) {
      throw new Error('DOI inválido. Formato esperado: 10.xxxx/xxxxx')
    }
  }

  private validarPmid(pmid: string | null | undefined): void {
    if (!pmid) return
    const p = pmid.trim()
    if (p && !PMID_PADRAO.test(p)) {
      throw new Error('PMID deve conter apenas dígitos (até 9 dígitos).')
    }
  }

  private validarAno(ano: number | null | undefined): void {
    if (ano === null || ano === undefined) return
    const anoAtual = new Date().getFullYear()
    if (ano < ANO_MINIMO || ano > anoAtual + 1) {
      throw new Error(`Ano de publicação inválido: ${ano}.`)
    }
  }

  private validarAutores(autores: string[] | undefined): void {
    if (!autores) return
    if (autores.length > AUTORES_LIMITE) {
      throw new Error(`Número de autores não pode ultrapassar ${AUTORES_LIMITE}.`)
    }
  }

  private normalizarTags(tags: string[] | undefined): string[] {
    if (!tags?.length) return []
    const normalizadas = [
      ...new Set(
        tags
          .map((t) => t.trim().toLowerCase())
          .filter((t) => t.length > 0 && t.length <= TAG_MAXIMA_LENGTH)
      ),
    ]
    if (normalizadas.length > TAGS_LIMITE) {
      throw new Error(`Número de tags não pode ultrapassar ${TAGS_LIMITE}.`)
    }
    return normalizadas
  }

  // ─── Operações ────────────────────────────

  async listar(tenantId: string, filtros: AcervoFiltros = {}): Promise<AcervoListagem> {
    return supabaseReferenciaRepository.listar(tenantId, filtros)
  }

  async getById(tenantId: string, id: string): Promise<ReferenciaDetalheView | null> {
    return supabaseReferenciaRepository.getById(tenantId, id)
  }

  async getByDoi(tenantId: string, doi: string): Promise<ReferenciaView | null> {
    this.validarDoi(doi)
    return supabaseReferenciaRepository.getByDoi(tenantId, doi.trim())
  }

  async getByPmid(tenantId: string, pmid: string): Promise<ReferenciaView | null> {
    this.validarPmid(pmid)
    return supabaseReferenciaRepository.getByPmid(tenantId, pmid.trim())
  }

  async criar(tenantId: string, input: CriarReferenciaInput): Promise<ReferenciaView> {
    this.validarTitulo(input.titulo)
    this.validarDoi(input.doi)
    this.validarPmid(input.pmid)
    this.validarAno(input.anoPublicacao)
    this.validarAutores(input.autores)

    // DOI único por tenant — verificar antes de criar
    if (input.doi) {
      const existente = await supabaseReferenciaRepository.getByDoi(tenantId, input.doi.trim())
      if (existente) {
        throw new Error(`Já existe uma referência com este DOI: ${input.doi}`)
      }
    }

    const tagsNormalizadas = this.normalizarTags(input.tags)
    return supabaseReferenciaRepository.criar(tenantId, { ...input, tags: tagsNormalizadas })
  }

  async atualizar(tenantId: string, input: AtualizarReferenciaInput): Promise<ReferenciaView> {
    if (input.titulo !== undefined)       this.validarTitulo(input.titulo)
    if (input.doi    !== undefined)       this.validarDoi(input.doi)
    if (input.pmid   !== undefined)       this.validarPmid(input.pmid)
    if (input.anoPublicacao !== undefined) this.validarAno(input.anoPublicacao)
    if (input.autores !== undefined)      this.validarAutores(input.autores)

    if (input.tags !== undefined) {
      input = { ...input, tags: this.normalizarTags(input.tags) }
    }

    return supabaseReferenciaRepository.atualizar(tenantId, input)
  }

  async favoritar(tenantId: string, referenciaId: string, favorito: boolean): Promise<void> {
    return supabaseReferenciaRepository.favoritar(tenantId, referenciaId, favorito)
  }

  async arquivar(tenantId: string, referenciaId: string): Promise<void> {
    return supabaseReferenciaRepository.arquivar(tenantId, referenciaId)
  }

  async salvarConexoes(tenantId: string, input: SalvarConexoesAcervoInput): Promise<void> {
    if (!input.referenciaId) throw new Error('referenciaId obrigatório')
    return supabaseReferenciaRepository.salvarConexoes(tenantId, input)
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    return supabaseReferenciaRepository.getTagsTenant(tenantId)
  }
}

// Singleton seguro (server-only)
export const referenciaService = new ReferenciaService()
