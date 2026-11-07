// ============================================================
// Gestão Natural — leitura de dados (server-only)
// ============================================================

import 'server-only'
import type { AtivoBiblioteca, NivelUsoSeguro, PerfilPaciente } from './seguranca'
import { createClient, getAuthContext } from '@/lib/supabase/server'
import {
  hojeISO,
  idade,
  somarDias,
  type Agendamento,
  type Atendimento,
  type Foto,
  type Paciente,
  type Pedido,
  type PedidoEvento,
  type PedidoItem,
  type Programa,
  type Sessao,
  type Tarefa,
  STATUS_PEDIDO_ENCERRADO,
} from './dominio'

// As tabelas novas ainda não estão no supabase.generated.ts
// (rode `npm run types:gen` depois de aplicar a migration 017).
// Mesmo padrão dos demais repositórios do projeto.
const db = () => createClient() as any

export async function ctx() {
  const auth = await getAuthContext()
  const tenantId: string = auth?.claims?.tenant_id ?? ''
  if (!tenantId) throw new Error('Sessão expirada. Entre novamente.')
  return { tenantId, userId: auth!.user.id as string }
}

// ── Mappers ────────────────────────────────────────────────
function mapPaciente(r: any): Paciente {
  return {
    id: r.id,
    nome: r.nome ?? '(sem nome)',
    codigoInterno: r.codigo_interno,
    telefone: r.telefone,
    email: r.email,
    dataNascimento: r.data_nascimento,
    fototipo: r.fototipo,
    tipoPele: r.tipo_pele,
    gestante: !!r.gestante,
    amamentando: !!r.amamentando,
    alergias: r.alergias_conhecidas ?? [],
    medicamentos: r.medicamentos_uso_continuo ?? [],
    condicoes: r.condicoes_relevantes ?? [],
    observacoes: r.observacoes,
    criadoEm: r.criado_em,
  }
}

function mapItem(r: any): PedidoItem {
  return {
    id: r.id,
    categoria: r.categoria,
    nome: r.nome,
    formula: r.formula,
    quantidade: r.quantidade,
    posologia: r.posologia,
  }
}

function mapPedido(r: any): Pedido {
  const itens = [...(r.pedido_itens ?? [])].sort((a: any, b: any) => a.ordem - b.ordem)
  return {
    id: r.id,
    numero: r.numero,
    pacienteId: r.paciente_id,
    pacienteNome: r.pacientes?.nome ?? '(paciente)',
    pacienteTelefone: r.pacientes?.telefone ?? null,
    status: r.status,
    farmacia: r.farmacia,
    dataPedido: r.data_pedido,
    previsaoEntrega: r.previsao_entrega,
    valor: r.valor === null ? null : Number(r.valor),
    observacoes: r.observacoes,
    statusDesde: r.status_desde,
    origemPedidoId: r.origem_pedido_id,
    itens: itens.map(mapItem),
  }
}

function mapSessao(r: any): Sessao {
  return {
    id: r.id,
    programaId: r.programa_id,
    numero: r.numero,
    dataPrevista: r.data_prevista,
    status: r.status,
    checklist: Array.isArray(r.checklist) ? r.checklist : [],
    realizadaEm: r.realizada_em,
    notas: r.notas,
  }
}

function mapPrograma(r: any): Programa {
  return {
    id: r.id,
    pacienteId: r.paciente_id,
    pacienteNome: r.pacientes?.nome,
    nome: r.nome,
    objetivo: r.objetivo,
    totalSessoes: r.total_sessoes,
    intervaloDias: r.intervalo_dias,
    dataInicio: r.data_inicio,
    status: r.status,
    observacoes: r.observacoes,
    sessoes: [...(r.programa_sessoes ?? [])].map(mapSessao).sort((a, b) => a.numero - b.numero),
  }
}

function mapAgendamento(r: any): Agendamento {
  return {
    id: r.id,
    pacienteId: r.paciente_id,
    pacienteNome: r.pacientes?.nome ?? null,
    pacienteTelefone: r.pacientes?.telefone ?? null,
    inicio: r.inicio,
    duracaoMin: r.duracao_min,
    tipo: r.tipo,
    modalidade: r.modalidade,
    status: r.status,
    titulo: r.titulo,
    observacoes: r.observacoes,
    sessaoId: r.sessao_id,
    temAtendimento: (r.atendimentos ?? []).length > 0,
  }
}

const SELECT_PEDIDO = '*, pacientes(nome, telefone), pedido_itens(*)'
const SELECT_AGENDA = '*, pacientes(nome, telefone), atendimentos(id)'

// ── Pacientes ──────────────────────────────────────────────
export async function listarPacientes(busca?: string): Promise<Paciente[]> {
  const { tenantId } = await ctx()
  let q = db()
    .from('pacientes')
    .select('*')
    .eq('tenant_id', tenantId)
    .is('archived_at', null)
    .order('nome', { ascending: true })
    .limit(300)
  if (busca?.trim()) {
    const b = busca.trim().replace(/[%,]/g, ' ')
    q = q.or(`nome.ilike.%${b}%,telefone.ilike.%${b}%,codigo_interno.ilike.%${b}%,email.ilike.%${b}%`)
  }
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPaciente)
}

export async function obterPaciente(id: string): Promise<Paciente | null> {
  const { tenantId } = await ctx()
  const { data } = await db().from('pacientes').select('*').eq('tenant_id', tenantId).eq('id', id).maybeSingle()
  return data ? mapPaciente(data) : null
}

// ── Prontuário ─────────────────────────────────────────────
export async function listarAtendimentos(pacienteId: string): Promise<Atendimento[]> {
  const { tenantId } = await ctx()
  const { data, error } = await db()
    .from('atendimentos')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('paciente_id', pacienteId)
    .order('data', { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []).map((r: any) => ({
    id: r.id,
    pacienteId: r.paciente_id,
    data: r.data,
    tipo: r.tipo,
    queixa: r.queixa,
    avaliacao: r.avaliacao,
    conduta: r.conduta,
    orientacoes: r.orientacoes,
    proximosPassos: r.proximos_passos,
    adendoDe: r.adendo_de,
    sessaoId: r.sessao_id,
  }))
}

// ── Pedidos ────────────────────────────────────────────────
export async function listarPedidos(opts: {
  pacienteId?: string
  abertos?: boolean
  busca?: string
} = {}): Promise<Pedido[]> {
  const { tenantId } = await ctx()

  let idsBusca: string[] | null = null
  if (opts.busca?.trim()) {
    const b = opts.busca.trim().replace(/[%,]/g, ' ')
    const { data: itens } = await db()
      .from('pedido_itens')
      .select('pedido_id')
      .eq('tenant_id', tenantId)
      .or(`nome.ilike.%${b}%,formula.ilike.%${b}%`)
      .limit(500)
    idsBusca = Array.from(new Set((itens ?? []).map((i: any) => i.pedido_id as string)))
    if (idsBusca.length === 0) return []
  }

  let q = db()
    .from('pedidos_manipulados')
    .select(SELECT_PEDIDO)
    .eq('tenant_id', tenantId)
    .order('data_pedido', { ascending: false })
    .order('numero', { ascending: false })
    .limit(300)
  if (opts.pacienteId) q = q.eq('paciente_id', opts.pacienteId)
  if (opts.abertos) q = q.not('status', 'in', `(${STATUS_PEDIDO_ENCERRADO.join(',')})`)
  if (idsBusca) q = q.in('id', idsBusca)

  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPedido)
}

export async function obterPedido(id: string): Promise<{ pedido: Pedido; eventos: PedidoEvento[] } | null> {
  const { tenantId } = await ctx()
  const { data } = await db()
    .from('pedidos_manipulados')
    .select(SELECT_PEDIDO)
    .eq('tenant_id', tenantId)
    .eq('id', id)
    .maybeSingle()
  if (!data) return null
  const { data: ev } = await db()
    .from('pedido_eventos')
    .select('status, nota, criado_em')
    .eq('pedido_id', id)
    .order('criado_em', { ascending: true })
  return {
    pedido: mapPedido(data),
    eventos: (ev ?? []).map((e: any) => ({ status: e.status, nota: e.nota, criadoEm: e.criado_em })),
  }
}

export async function listarFarmacias(): Promise<string[]> {
  const { tenantId } = await ctx()
  const { data } = await db()
    .from('pedidos_manipulados')
    .select('farmacia')
    .eq('tenant_id', tenantId)
    .not('farmacia', 'is', null)
    .limit(500)
  return Array.from(new Set((data ?? []).map((r: any) => String(r.farmacia).trim()).filter(Boolean))).sort() as string[]
}

// ── Programas ──────────────────────────────────────────────
export async function listarProgramas(opts: { pacienteId?: string; ativos?: boolean } = {}): Promise<Programa[]> {
  const { tenantId } = await ctx()
  let q = db()
    .from('programas_tratamento')
    .select('*, pacientes(nome), programa_sessoes(*)')
    .eq('tenant_id', tenantId)
    .order('data_inicio', { ascending: false })
  if (opts.pacienteId) q = q.eq('paciente_id', opts.pacienteId)
  if (opts.ativos) q = q.eq('status', 'ativo')
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapPrograma)
}

export async function obterPrograma(id: string): Promise<Programa | null> {
  const { tenantId } = await ctx()
  const { data } = await db()
    .from('programas_tratamento')
    .select('*, pacientes(nome), programa_sessoes(*)')
    .eq('tenant_id', tenantId)
    .eq('id', id)
    .maybeSingle()
  return data ? mapPrograma(data) : null
}

// ── Fotos ──────────────────────────────────────────────────
export async function listarFotos(pacienteId: string): Promise<Foto[]> {
  const { tenantId } = await ctx()
  const client = db()
  const { data, error } = await client
    .from('fotos_paciente')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('paciente_id', pacienteId)
    .order('tirada_em', { ascending: true })
  if (error) throw new Error(error.message)
  const linhas = data ?? []
  const urls: Record<string, string> = {}
  if (linhas.length) {
    const { data: assinadas } = await client.storage
      .from('fotos-clinicas')
      .createSignedUrls(linhas.map((r: any) => r.storage_path), 60 * 60)
    for (const s of assinadas ?? []) if (s.path && s.signedUrl) urls[s.path] = s.signedUrl
  }
  return linhas.map((r: any) => ({
    id: r.id,
    pacienteId: r.paciente_id,
    sessaoId: r.sessao_id,
    momento: r.momento,
    regiao: r.regiao,
    storagePath: r.storage_path,
    tiradaEm: r.tirada_em,
    notas: r.notas,
    url: urls[r.storage_path] ?? null,
  }))
}

// ── Agenda ─────────────────────────────────────────────────
export async function listarAgenda(deISO: string, ateISO: string, pacienteId?: string): Promise<Agendamento[]> {
  const { tenantId } = await ctx()
  let q = db()
    .from('agendamentos')
    .select(SELECT_AGENDA)
    .eq('tenant_id', tenantId)
    .gte('inicio', deISO)
    .lt('inicio', ateISO)
    .order('inicio', { ascending: true })
  if (pacienteId) q = q.eq('paciente_id', pacienteId)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map(mapAgendamento)
}

export async function proximosAgendamentosPaciente(pacienteId: string): Promise<Agendamento[]> {
  const { tenantId } = await ctx()
  const { data } = await db()
    .from('agendamentos')
    .select(SELECT_AGENDA)
    .eq('tenant_id', tenantId)
    .eq('paciente_id', pacienteId)
    .gte('inicio', new Date(Date.now() - 86_400_000).toISOString())
    .not('status', 'eq', 'cancelado')
    .order('inicio', { ascending: true })
    .limit(10)
  return (data ?? []).map(mapAgendamento)
}

// ── Tarefas ────────────────────────────────────────────────
export async function listarTarefasAbertas(pacienteId?: string): Promise<Tarefa[]> {
  const { tenantId } = await ctx()
  let q = db()
    .from('tarefas')
    .select('*, pacientes(nome)')
    .eq('tenant_id', tenantId)
    .is('feita_em', null)
    .order('vencimento', { ascending: true, nullsFirst: false })
    .limit(100)
  if (pacienteId) q = q.eq('paciente_id', pacienteId)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return (data ?? []).map((r: any) => ({
    id: r.id,
    titulo: r.titulo,
    pacienteId: r.paciente_id,
    pacienteNome: r.pacientes?.nome ?? null,
    vencimento: r.vencimento,
    feitaEm: r.feita_em,
  }))
}

// ── Painel "Hoje" ──────────────────────────────────────────
export interface SessaoPendente {
  sessao: Sessao
  programaId: string
  programaNome: string
  pacienteId: string
  pacienteNome: string
  totalSessoes: number
  agendada: boolean
}

export async function painelHoje() {
  const { tenantId } = await ctx()
  const hoje = hojeISO()
  const inicioHoje = new Date(`${hoje}T00:00:00-03:00`).toISOString()
  const fimHoje = new Date(`${somarDias(hoje, 1)}T00:00:00-03:00`).toISOString()
  const seteDiasAtras = new Date(`${somarDias(hoje, -7)}T00:00:00-03:00`).toISOString()

  const [agendaHoje, semRegistro, pedidosAbertos, tarefas, programas] = await Promise.all([
    listarAgenda(inicioHoje, fimHoje),
    // Atendimentos dos últimos 7 dias que ficaram sem desfecho ou sem prontuário
    db()
      .from('agendamentos')
      .select(SELECT_AGENDA)
      .eq('tenant_id', tenantId)
      .gte('inicio', seteDiasAtras)
      .lt('inicio', inicioHoje)
      .in('status', ['agendado', 'confirmado', 'realizado'])
      .neq('tipo', 'bloqueio')
      .order('inicio', { ascending: true })
      .then((r: any) => (r.data ?? []).map(mapAgendamento).filter(
        (a: Agendamento) => a.status !== 'realizado' || !a.temAtendimento,
      )),
    listarPedidos({ abertos: true }),
    listarTarefasAbertas(),
    listarProgramas({ ativos: true }),
  ])

  // Próxima sessão pendente de cada programa ativo
  const idsSessao = new Set<string>()
  const { data: agSessoes } = await db()
    .from('agendamentos')
    .select('sessao_id')
    .eq('tenant_id', tenantId)
    .not('sessao_id', 'is', null)
    .not('status', 'in', '(cancelado,faltou)')
  for (const a of agSessoes ?? []) idsSessao.add(a.sessao_id)

  const sessoesPendentes: SessaoPendente[] = []
  for (const p of programas) {
    const prox = p.sessoes.find((s) => s.status === 'pendente')
    if (!prox) continue
    sessoesPendentes.push({
      sessao: prox,
      programaId: p.id,
      programaNome: p.nome,
      pacienteId: p.pacienteId,
      pacienteNome: p.pacienteNome ?? '',
      totalSessoes: p.totalSessoes,
      agendada: idsSessao.has(prox.id),
    })
  }
  sessoesPendentes.sort((a, b) => (a.sessao.dataPrevista ?? '').localeCompare(b.sessao.dataPrevista ?? ''))

  return { hoje, agendaHoje, semRegistro: semRegistro as Agendamento[], pedidosAbertos, tarefas, sessoesPendentes }
}

// ── Ativos da Biblioteca ───────────────────────────────────

/** Todos os ativos da Biblioteca com o que importa para prescrever. */
export async function carregarAtivosBiblioteca(): Promise<AtivoBiblioteca[]> {
  const { tenantId } = await ctx()
  const { data, error } = await db()
    .from('ativos_cosmeticos')
    .select(`
      id, nome, nome_inci, outros_nomes, concentracao_minima, concentracao_usual, concentracao_maxima,
      unidade_concentracao, ph_minimo, ph_maximo, restricoes_regulatorias, metadados,
      sinonimos_ativo(sinonimo),
      ativo_contraindicacoes(contraindicacoes_cosmeticas(nome, severidade)),
      ativo_incompativeis!ativo_incompativeis_ativo_id_fkey(motivo, severidade, ativo_incompativel_id,
        incompativel:ativos_cosmeticos!ativo_incompativeis_ativo_incompativel_id_fkey(id, nome))
    `)
    .eq('tenant_id', tenantId)
    .is('archived_at', null)
    .order('nome')
    .limit(2000)
  if (error) {
    // Sem as relações (nome de FK diferente no banco): carrega o básico.
    const { data: basico, error: e2 } = await db()
      .from('ativos_cosmeticos')
      .select('id, nome, nome_inci, outros_nomes, concentracao_minima, concentracao_usual, concentracao_maxima, unidade_concentracao, ph_minimo, ph_maximo, restricoes_regulatorias, metadados')
      .eq('tenant_id', tenantId)
      .is('archived_at', null)
      .order('nome')
      .limit(2000)
    if (e2) return []
    return (basico ?? []).map((r: any) => mapAtivo(r))
  }
  return (data ?? []).map((r: any) => mapAtivo(r))
}

function nivelUso(v: unknown): NivelUsoSeguro | null {
  return v === 'liberado' || v === 'orientacao' || v === 'contraindicado' ? v : null
}

function mapAtivo(r: any): AtivoBiblioteca {
  const n = (v: any) => (v === null || v === undefined ? null : Number(v))
  return {
    id: r.id,
    nome: r.nome,
    inci: r.nome_inci ?? null,
    apelidos: [...(r.outros_nomes ?? []), ...((r.sinonimos_ativo ?? []).map((s: any) => s.sinonimo))].filter(Boolean),
    concMin: n(r.concentracao_minima),
    concUsual: n(r.concentracao_usual),
    concMax: n(r.concentracao_maxima),
    unidade: r.unidade_concentracao ?? null,
    phMin: n(r.ph_minimo),
    phMax: n(r.ph_maximo),
    restricoes: r.restricoes_regulatorias ?? null,
    gestacao: nivelUso(r.metadados?.gestacao),
    lactacao: nivelUso(r.metadados?.lactacao),
    revisado: r.metadados?.revisado === true,
    contraindicacoes: (r.ativo_contraindicacoes ?? [])
      .map((c: any) => c.contraindicacoes_cosmeticas)
      .filter(Boolean)
      .map((c: any) => ({ nome: c.nome, severidade: c.severidade ?? null })),
    incompativeis: (r.ativo_incompativeis ?? [])
      .filter((i: any) => i.incompativel)
      .map((i: any) => ({ id: i.incompativel.id, nome: i.incompativel.nome, motivo: i.motivo ?? null, severidade: i.severidade ?? null })),
  }
}

export function perfilDaPaciente(p: Paciente): PerfilPaciente {
  return {
    gestante: p.gestante,
    amamentando: p.amamentando,
    alergias: p.alergias,
    condicoes: p.condicoes,
    medicamentos: p.medicamentos,
    fototipo: p.fototipo,
    idade: idade(p.dataNascimento),
  }
}

/** Lista enxuta para a busca de ativos no editor de pedido. */
export async function opcoesAtivos() {
  const { linhaDoAtivo, faixaDoAtivo, normalizar } = await import('./seguranca')
  const ativos = await carregarAtivosBiblioteca()
  return ativos.map((a) => ({
    id: a.id,
    nome: a.nome,
    linha: linhaDoAtivo(a),
    faixa: faixaDoAtivo(a),
    busca: normalizar([a.nome, a.inci ?? '', ...a.apelidos].join(' ')),
  }))
}
