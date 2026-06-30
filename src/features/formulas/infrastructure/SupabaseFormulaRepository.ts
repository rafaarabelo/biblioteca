import 'server-only'

import { createClient } from '@/lib/supabase/server'
import type { IFormulaRepository } from './IFormulaRepository'
import type {
  FormulaView,
  FormulaDetalheView,
  FormulaFiltros,
  VersaoView,
  IngredienteView,
  ConexaoFormula,
  CriarFormulaInput,
  CriarVersaoInput,
  FormulaComparacao,
  DiferencaIngrediente,
  AtivoDisponivel,
  FaseIncorporacao,
  StatusVersaoFormula,
} from '../types'

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations e joins.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = async () => (await createClient()) as any

// ── Mappers ──────────────────────────────────────────────

function mapIngrediente(row: any): IngredienteView {
  return {
    id:              row.id,
    composicaoId:    row.id,
    ativoId:         row.ativo_id,
    nomeAtivo:       row.ativos_cosmeticos?.nome_inci ?? row.ativos_cosmeticos?.nome ?? '—',
    nomeCientifico:  row.ativos_cosmeticos?.nome_cientifico ?? undefined,
    fase:            row.fase as FaseIncorporacao,
    concentracao:    Number(row.concentracao),
    unidade:         row.unidade ?? '%',
    funcaoNaFormula: row.funcao_na_formula ?? undefined,
    observacoes:     row.observacoes ?? undefined,
    ordem:           row.ordem ?? 0,
  }
}

function mapVersao(row: any): VersaoView {
  return {
    id:              row.id,
    formulaId:       row.formula_id,
    tenantId:        row.tenant_id,
    numeroVersao:    row.numero_versao,
    titulo:          row.titulo,
    objetivo:        row.objetivo ?? undefined,
    descricao:       row.descricao ?? undefined,
    veiculo:         row.veiculo ?? undefined,
    modoPreparo:     row.modo_preparo ?? undefined,
    modoUso:         row.modo_uso ?? undefined,
    instrucoes:      row.instrucoes ?? undefined,
    indicacoes:      row.indicacoes ?? undefined,
    contraindicacoes:row.contraindicacoes ?? undefined,
    validadeDias:    row.validade_dias ?? undefined,
    status:          row.status as StatusVersaoFormula,
    motivoAlteracao: row.motivo_alteracao ?? undefined,
    ingredientes:    (row.composicoes_formula ?? []).map(mapIngrediente),
    criadoEm:        row.criado_em,
    atualizadoEm:    row.atualizado_em,
  }
}

function mapFormulaView(row: any): FormulaView {
  const versaoAtiva = row.versao_ativa
  return {
    id:              row.id,
    tenantId:        row.tenant_id,
    codigoInterno:   row.codigo_interno ?? undefined,
    favorito:        row.favorito ?? false,
    tags:            row.tags ?? [],
    titulo:          versaoAtiva?.titulo ?? '(sem título)',
    objetivo:        versaoAtiva?.objetivo ?? undefined,
    veiculo:         versaoAtiva?.veiculo ?? undefined,
    versaoAtiva:     versaoAtiva?.numero_versao ?? 1,
    statusVersao:    (versaoAtiva?.status ?? 'rascunho') as StatusVersaoFormula,
    totalAtivos:     Number(row.total_ativos ?? 0),
    totalCasos:      Number(row.total_casos ?? 0),
    totalProtocolos: Number(row.total_protocolos ?? 0),
    criadoEm:        row.criado_em,
    atualizadoEm:    row.atualizado_em,
  }
}

// ── Repository ────────────────────────────────────────────

class SupabaseFormulaRepository implements IFormulaRepository {

  async listar(tenantId: string, filtros: Partial<FormulaFiltros>): Promise<FormulaView[]> {
    const supabase = await getDb()
    const limite = filtros.limite ?? 50
    const offset = filtros.offset ?? 0

    // Buscar fórmulas com versão ativa + contagens
    let query = supabase
      .from('formulas')
      .select(`
        id,
        tenant_id,
        codigo_interno,
        favorito,
        tags,
        criado_em,
        atualizado_em,
        versao_ativa:versoes_formula!inner(
          id, numero_versao, titulo, objetivo, veiculo, status,
          composicoes_formula(id)
        )
      `)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .eq('versoes_formula.status', 'ativa')
      .order('atualizado_em', { ascending: false })
      .range(offset, offset + limite - 1)

    // Filtros
    if (filtros.busca) {
      // busca por título da versão ativa via FTS ou ilike
      query = query.ilike('versoes_formula.titulo', `%${filtros.busca}%`)
    }
    if (filtros.favorito) {
      query = query.eq('favorito', true)
    }
    if (filtros.tags && filtros.tags.length > 0) {
      query = query.overlaps('tags', filtros.tags)
    }

    const { data, error } = await query
    if (error) throw new Error(`FormulaRepository.listar: ${error.message}`)
    if (!data) return []

    return data.map((row: any) => {
      // Versão ativa pode vir como array (inner join retorna array)
      const va = Array.isArray(row.versao_ativa)
        ? row.versao_ativa[0]
        : row.versao_ativa

      // Contar ativos da versão ativa
      const totalAtivos = va?.composicoes_formula?.length ?? 0

      return {
        id:              row.id,
        tenantId:        row.tenant_id,
        codigoInterno:   row.codigo_interno ?? undefined,
        favorito:        row.favorito ?? false,
        tags:            row.tags ?? [],
        titulo:          va?.titulo ?? '(sem título)',
        objetivo:        va?.objetivo ?? undefined,
        veiculo:         va?.veiculo ?? undefined,
        versaoAtiva:     va?.numero_versao ?? 1,
        statusVersao:    (va?.status ?? 'rascunho') as StatusVersaoFormula,
        totalAtivos,
        totalCasos:      0,   // calculado separadamente se necessário
        totalProtocolos: 0,
        criadoEm:        row.criado_em,
        atualizadoEm:    row.atualizado_em,
      }
    })
  }

  async getById(tenantId: string, id: string): Promise<FormulaDetalheView | null> {
    const supabase = await getDb()

    // 1. Buscar fórmula
    const { data: formula, error: errFormula } = await supabase
      .from('formulas')
      .select('id, tenant_id, codigo_interno, favorito, tags, criado_em, atualizado_em')
      .eq('id', id)
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .single()

    if (errFormula || !formula) return null

    // 2. Buscar todas as versões com composição
    const { data: versoes } = await supabase
      .from('versoes_formula')
      .select(`
        id, formula_id, tenant_id, numero_versao, titulo, objetivo, descricao,
        veiculo, modo_preparo, modo_uso, instrucoes, indicacoes, contraindicacoes,
        validade_dias, status, motivo_alteracao, criado_em, atualizado_em,
        composicoes_formula(
          id, ativo_id, fase, concentracao, unidade, funcao_na_formula, observacoes, ordem,
          ativos_cosmeticos(id, nome_inci, nome, nome_cientifico)
        )
      `)
      .eq('formula_id', id)
      .eq('tenant_id', tenantId)
      .order('numero_versao', { ascending: false })

    const versoesMap = (versoes ?? []).map(mapVersao)
    const versaoAtivaObj = versoesMap.find((v: any) => v.status === 'ativa') ?? versoesMap[0]

    // 3. Buscar conexões
    const conexoes = await this.getConexoes(supabase, tenantId, id)

    // 4. Contagens
    const totalAtivos = versaoAtivaObj?.ingredientes.length ?? 0
    const totalCasos   = conexoes.filter((c: any) => c.tipo === 'caso').length
    const totalProts   = conexoes.filter((c: any) => c.tipo === 'protocolo').length

    return {
      id:              formula.id,
      tenantId:        formula.tenant_id,
      codigoInterno:   formula.codigo_interno ?? undefined,
      favorito:        formula.favorito ?? false,
      tags:            formula.tags ?? [],
      titulo:          versaoAtivaObj?.titulo ?? '(sem título)',
      objetivo:        versaoAtivaObj?.objetivo,
      veiculo:         versaoAtivaObj?.veiculo,
      versaoAtiva:     versaoAtivaObj?.numeroVersao ?? 1,
      statusVersao:    versaoAtivaObj?.status ?? 'rascunho',
      totalAtivos,
      totalCasos,
      totalProtocolos: totalProts,
      criadoEm:        formula.criado_em,
      atualizadoEm:    formula.atualizado_em,
      versoes:         versoesMap,
      conexoes,
    }
  }

  private async getConexoes(
    supabase: any,
    tenantId: string,
    formulaId: string
  ): Promise<ConexaoFormula[]> {
    const conexoes: ConexaoFormula[] = []

    // Observações relacionadas
    const { data: obs } = await supabase
      .from('observacao_formulas')
      .select('observacao_id, observacoes(id, titulo, versoes_observacao(conteudo, is_versao_atual))')
      .eq('formula_id', formulaId)
      .eq('tenant_id', tenantId)
      .limit(10)

    for (const row of obs ?? []) {
      const o = (row as any).observacoes
      if (!o) continue
      const versaoAtual = o.versoes_observacao?.find((v: any) => v.is_versao_atual)
      conexoes.push({
        tipo:      'observacao',
        id:        o.id,
        titulo:    o.titulo,
        subtitulo: versaoAtual?.conteudo?.slice(0, 60) + '…',
        href:      `/caderno/${o.id}`,
      })
    }

    // Referências científicas
    const { data: refs } = await supabase
      .from('referencia_formulas')
      .select('referencia_id, referencias_cientificas(id, titulo)')
      .eq('formula_id', formulaId)
      .eq('tenant_id', tenantId)
      .limit(10)

    for (const row of refs ?? []) {
      const r = (row as any).referencias_cientificas
      if (!r) continue
      conexoes.push({
        tipo:   'referencia',
        id:     r.id,
        titulo: r.titulo || 'Referência científica',
        href:   `/acervo/${r.id}`,
      })
    }

    // Casos clínicos via prescricoes_caso
    const { data: prescs } = await supabase
      .from('prescricoes_caso')
      .select('caso_id, versao_formula_id, casos_clinicos(id, codigo_anonimizado, objetivo_principal)')
      .eq('tenant_id', tenantId)
      .in(
        'versao_formula_id',
        // Precisamos dos IDs de versoes desta fórmula — busca por subquery seria ideal
        // Aqui fazemos join via case
        ['_placeholder_']  // será sobrescrito abaixo
      )
      .limit(20)

    // Buscar IDs das versões desta fórmula para o filtro acima
    const { data: versaoIds } = await supabase
      .from('versoes_formula')
      .select('id')
      .eq('formula_id', formulaId)
      .eq('tenant_id', tenantId)

    if (versaoIds && versaoIds.length > 0) {
      const ids = versaoIds.map((v: any) => v.id)
      const { data: prescsReal } = await supabase
        .from('prescricoes_caso')
        .select('caso_id, casos_clinicos(id, codigo_anonimizado, objetivo_principal)')
        .eq('tenant_id', tenantId)
        .in('versao_formula_id', ids)
        .limit(10)

      const casoVistos = new Set<string>()
      for (const row of prescsReal ?? []) {
        const c = (row as any).casos_clinicos
        if (!c || casoVistos.has(c.id)) continue
        casoVistos.add(c.id)
        conexoes.push({
          tipo:      'caso',
          id:        c.id,
          titulo:    c.objetivo_principal ?? c.codigo_anonimizado ?? 'Caso clínico',
          subtitulo: c.codigo_anonimizado,
          href:      `/casos/${c.id}`,
        })
      }
    }

    // Protocolos que incluem esta fórmula nas fases
    // fases_protocolo.formulas_indicadas contém array de versoes_formula.id
    if (versaoIds && versaoIds.length > 0) {
      const ids = versaoIds.map((v: any) => v.id)
      const { data: fases } = await supabase
        .from('fases_protocolo')
        .select('versao_protocolo_id, versoes_protocolo(protocolo_id, titulo, status)')
        .eq('tenant_id', tenantId)
        .overlaps('formulas_indicadas', ids)
        .limit(10)

      const protVistos = new Set<string>()
      for (const row of fases ?? []) {
        const vp = (row as any).versoes_protocolo
        if (!vp || protVistos.has(vp.protocolo_id) || vp.status !== 'ativa') continue
        protVistos.add(vp.protocolo_id)
        conexoes.push({
          tipo:  'protocolo',
          id:    vp.protocolo_id,
          titulo: vp.titulo,
          href:  `/protocolos/${vp.protocolo_id}`,
        })
      }
    }

    return conexoes
  }

  async criar(tenantId: string, userId: string, input: CriarFormulaInput): Promise<string> {
    const supabase = await getDb()

    // 1. Criar entidade-pai
    const { data: formula, error: errF } = await supabase
      .from('formulas')
      .insert({
        tenant_id:     tenantId,
        codigo_interno: input.codigoInterno || null,
        tags:          input.tags ?? [],
        favorito:      false,
        nivel_acesso:  'privado',
      })
      .select('id')
      .single()

    if (errF || !formula) throw new Error(`FormulaRepository.criar: ${errF?.message}`)

    // 2. Criar versão 1 (ativa)
    const { data: versao, error: errV } = await supabase
      .from('versoes_formula')
      .insert({
        formula_id:      formula.id,
        tenant_id:       tenantId,
        numero_versao:   1,
        titulo:          input.titulo,
        objetivo:        input.objetivo ?? null,
        veiculo:         input.veiculo ?? null,
        descricao:       input.descricao ?? null,
        modo_preparo:    input.modoPreparo ?? null,
        modo_uso:        input.modoUso ?? null,
        instrucoes:      input.instrucoes ?? null,
        indicacoes:      input.indicacoes ?? null,
        contraindicacoes: input.contraindicacoes ?? null,
        validade_dias:   input.validadeDias ?? null,
        status:          'ativa',
        motivo_alteracao: null,
      })
      .select('id')
      .single()

    if (errV || !versao) throw new Error(`FormulaRepository.criar (versao): ${errV?.message}`)

    // 3. Inserir ingredientes
    if (input.ingredientes.length > 0) {
      const composicoes = input.ingredientes.map((ing: any, idx: number) => ({
        versao_formula_id: versao.id,
        tenant_id:         tenantId,
        ativo_id:          ing.ativoId,
        fase:              ing.fase,
        concentracao:      ing.concentracao,
        unidade:           ing.unidade || '%',
        funcao_na_formula: ing.funcaoNaFormula || null,
        observacoes:       ing.observacoes || null,
        ordem:             ing.ordem ?? idx,
      }))

      const { error: errC } = await supabase
        .from('composicoes_formula')
        .insert(composicoes)

      if (errC) throw new Error(`FormulaRepository.criar (composicoes): ${errC.message}`)
    }

    return formula.id
  }

  async criarVersao(tenantId: string, userId: string, input: CriarVersaoInput): Promise<string> {
    const supabase = await getDb()

    // 1. Encontrar versão ativa atual e seu número
    const { data: versaoAtual } = await supabase
      .from('versoes_formula')
      .select('id, numero_versao')
      .eq('formula_id', input.formulaId)
      .eq('tenant_id', tenantId)
      .eq('status', 'ativa')
      .single()

    // 2. Desativar versão atual (substituída)
    if (versaoAtual) {
      await supabase
        .from('versoes_formula')
        .update({ status: 'substituida', atualizado_em: new Date().toISOString() })
        .eq('id', versaoAtual.id)
    }

    const proximoNumero = (versaoAtual?.numero_versao ?? 0) + 1

    // 3. Criar nova versão ativa
    const { data: novaVersao, error: errV } = await supabase
      .from('versoes_formula')
      .insert({
        formula_id:       input.formulaId,
        tenant_id:        tenantId,
        numero_versao:    proximoNumero,
        titulo:           input.titulo,
        objetivo:         input.objetivo ?? null,
        veiculo:          input.veiculo ?? null,
        descricao:        input.descricao ?? null,
        modo_preparo:     input.modoPreparo ?? null,
        modo_uso:         input.modoUso ?? null,
        instrucoes:       input.instrucoes ?? null,
        indicacoes:       input.indicacoes ?? null,
        contraindicacoes: input.contraindicacoes ?? null,
        validade_dias:    input.validadeDias ?? null,
        status:           'ativa',
        motivo_alteracao: input.motivoAlteracao,
      })
      .select('id')
      .single()

    if (errV || !novaVersao) throw new Error(`FormulaRepository.criarVersao: ${errV?.message}`)

    // 4. Inserir ingredientes da nova versão
    if (input.ingredientes.length > 0) {
      const composicoes = input.ingredientes.map((ing: any, idx: number) => ({
        versao_formula_id: novaVersao.id,
        tenant_id:         tenantId,
        ativo_id:          ing.ativoId,
        fase:              ing.fase,
        concentracao:      ing.concentracao,
        unidade:           ing.unidade || '%',
        funcao_na_formula: ing.funcaoNaFormula || null,
        observacoes:       ing.observacoes || null,
        ordem:             ing.ordem ?? idx,
      }))

      await supabase.from('composicoes_formula').insert(composicoes)
    }

    // 5. Atualizar atualizado_em da fórmula-pai
    await supabase
      .from('formulas')
      .update({ atualizado_em: new Date().toISOString() })
      .eq('id', input.formulaId)
      .eq('tenant_id', tenantId)

    return novaVersao.id
  }

  async favoritar(tenantId: string, id: string, favorito: boolean): Promise<void> {
    const supabase = await getDb()
    await supabase
      .from('formulas')
      .update({ favorito })
      .eq('id', id)
      .eq('tenant_id', tenantId)
  }

  async arquivar(tenantId: string, id: string): Promise<void> {
    const supabase = await getDb()
    await supabase
      .from('formulas')
      .update({ archived_at: new Date().toISOString() })
      .eq('id', id)
      .eq('tenant_id', tenantId)
  }

  async getTagsTenant(tenantId: string): Promise<string[]> {
    const supabase = await getDb()
    const { data } = await supabase
      .from('formulas')
      .select('tags')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)

    const all: string[] = (data ?? []).flatMap((r: any) => r.tags ?? [])
    return [...new Set(all)].sort()
  }

  async getAtivosDisponiveis(tenantId: string, busca?: string): Promise<AtivoDisponivel[]> {
    const supabase = await getDb()
    let query = supabase
      .from('ativos_cosmeticos')
      .select('id, nome_inci, nome, nome_cientifico')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .order('nome_inci', { ascending: true })
      .limit(50)

    if (busca) {
      query = query.or(`nome_inci.ilike.%${busca}%,nome.ilike.%${busca}%`)
    }

    const { data } = await query
    return (data ?? []).map((row: any) => ({
      id:              row.id,
      nome:            row.nome_inci ?? row.nome ?? '—',
      nomeINCIDisplay: row.nome_inci,
      categoria:       undefined,
    }))
  }

  async compararVersoes(
    tenantId: string,
    versaoAId: string,
    versaoBId: string
  ): Promise<FormulaComparacao> {
    const supabase = await getDb()

    const fetchVersao = async (vid: string) => {
      const { data } = await supabase
        .from('versoes_formula')
        .select(`
          id, numero_versao, titulo, veiculo, modo_uso, motivo_alteracao, criado_em,
          composicoes_formula(
            ativo_id, fase, concentracao, unidade,
            ativos_cosmeticos(nome_inci, nome)
          )
        `)
        .eq('id', vid)
        .eq('tenant_id', tenantId)
        .single()
      return data
    }

    const [rawA, rawB] = await Promise.all([fetchVersao(versaoAId), fetchVersao(versaoBId)])
    if (!rawA || !rawB) throw new Error('Versão não encontrada')

    type CompItem = { ativo_id: string; nome: string; fase: FaseIncorporacao; concentracao: number; unidade: string }

    const toMap = (compArr: any[]): Map<string, CompItem> => {
      const m = new Map<string, CompItem>()
      for (const c of compArr ?? []) {
        const nome = c.ativos_cosmeticos?.nome_inci ?? c.ativos_cosmeticos?.nome ?? c.ativo_id
        m.set(c.ativo_id, { ativo_id: c.ativo_id, nome, fase: c.fase, concentracao: Number(c.concentracao), unidade: c.unidade })
      }
      return m
    }

    const mapA = toMap(rawA.composicoes_formula)
    const mapB = toMap(rawB.composicoes_formula)
    const allKeys = new Set([...mapA.keys(), ...mapB.keys()])

    const diffs: DiferencaIngrediente[] = []
    for (const key of allKeys) {
      const a = mapA.get(key)
      const b = mapB.get(key)
      if (a && !b) {
        diffs.push({ ativoId: key, nomeAtivo: a.nome, tipo: 'removido', concentracaoAntes: a.concentracao, unidade: a.unidade, faseAntes: a.fase })
      } else if (!a && b) {
        diffs.push({ ativoId: key, nomeAtivo: b.nome, tipo: 'adicionado', concentracaoDepois: b.concentracao, unidade: b.unidade, faseDepois: b.fase })
      } else if (a && b && (a.concentracao !== b.concentracao || a.fase !== b.fase)) {
        diffs.push({
          ativoId: key, nomeAtivo: a.nome, tipo: 'alterado',
          concentracaoAntes: a.concentracao, concentracaoDepois: b.concentracao,
          unidade: b.unidade,
          faseAntes: a.fase, faseDepois: b.fase,
        })
      }
    }

    return {
      versaoA: { id: rawA.id, numeroVersao: rawA.numero_versao, titulo: rawA.titulo, criadoEm: rawA.criado_em, motivoAlteracao: rawA.motivo_alteracao },
      versaoB: { id: rawB.id, numeroVersao: rawB.numero_versao, titulo: rawB.titulo, criadoEm: rawB.criado_em, motivoAlteracao: rawB.motivo_alteracao },
      ingredientes: diffs,
      mudancaVeiculo: rawA.veiculo !== rawB.veiculo && (rawA.veiculo || rawB.veiculo)
        ? { antes: rawA.veiculo ?? '', depois: rawB.veiculo ?? '' }
        : undefined,
      mudancaModoUso: rawA.modo_uso !== rawB.modo_uso && (rawA.modo_uso || rawB.modo_uso)
        ? { antes: rawA.modo_uso ?? '', depois: rawB.modo_uso ?? '' }
        : undefined,
      semMudancas: diffs.length === 0 && rawA.veiculo === rawB.veiculo && rawA.modo_uso === rawB.modo_uso,
    }
  }
}

export const supabaseFormulaRepository = new SupabaseFormulaRepository()
