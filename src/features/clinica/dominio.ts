// ============================================================
// Gestão Natural — domínio do dia a dia da clínica
// ============================================================
// Tipos, rótulos e regras puras (sem acesso a banco).
// Pode ser importado tanto no servidor quanto no cliente.
// ============================================================

// ── Pacientes ──────────────────────────────────────────────
export interface Paciente {
  id: string
  nome: string
  codigoInterno: string
  telefone: string | null
  email: string | null
  dataNascimento: string | null
  fototipo: string | null
  tipoPele: string | null
  gestante: boolean
  amamentando: boolean
  alergias: string[]
  medicamentos: string[]
  condicoes: string[]
  observacoes: string | null
  criadoEm: string
}

// ── Agenda ─────────────────────────────────────────────────
export const TIPOS_AGENDAMENTO = {
  consulta: 'Consulta',
  retorno: 'Retorno',
  sessao: 'Sessão de programa',
  avaliacao: 'Avaliação',
  bloqueio: 'Bloqueio de agenda',
  outro: 'Outro',
} as const
export type TipoAgendamento = keyof typeof TIPOS_AGENDAMENTO

export const STATUS_AGENDAMENTO = {
  agendado: 'Agendado',
  confirmado: 'Confirmado',
  realizado: 'Realizado',
  faltou: 'Faltou',
  cancelado: 'Cancelado',
} as const
export type StatusAgendamento = keyof typeof STATUS_AGENDAMENTO

export interface Agendamento {
  id: string
  pacienteId: string | null
  pacienteNome: string | null
  pacienteTelefone: string | null
  inicio: string
  duracaoMin: number
  tipo: TipoAgendamento
  modalidade: 'presencial' | 'online'
  status: StatusAgendamento
  titulo: string | null
  observacoes: string | null
  sessaoId: string | null
  temAtendimento: boolean
}

// ── Prontuário ─────────────────────────────────────────────
export const TIPOS_ATENDIMENTO = {
  consulta: 'Consulta',
  retorno: 'Retorno',
  sessao: 'Sessão',
  online: 'Atendimento online',
  mensagem: 'Conduta por mensagem',
  adendo: 'Adendo / correção',
  outro: 'Outro',
} as const
export type TipoAtendimento = keyof typeof TIPOS_ATENDIMENTO

export interface Atendimento {
  id: string
  pacienteId: string
  data: string
  tipo: TipoAtendimento
  queixa: string | null
  avaliacao: string | null
  conduta: string | null
  orientacoes: string | null
  proximosPassos: string | null
  adendoDe: string | null
  sessaoId: string | null
}

// ── Pedidos manipulados ────────────────────────────────────
export const STATUS_PEDIDO = {
  rascunho: 'Rascunho',
  enviado_farmacia: 'Enviado à farmácia',
  orcamento_recebido: 'Orçamento recebido',
  aprovado: 'Aprovado pela paciente',
  em_manipulacao: 'Em manipulação',
  pronto: 'Pronto',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
  historico: 'Histórico (registro antigo)',
} as const
export type StatusPedido = keyof typeof STATUS_PEDIDO

/** Fluxo normal, na ordem. "cancelado" e "historico" ficam fora. */
export const FLUXO_PEDIDO: StatusPedido[] = [
  'rascunho',
  'enviado_farmacia',
  'orcamento_recebido',
  'aprovado',
  'em_manipulacao',
  'pronto',
  'entregue',
]

export const STATUS_PEDIDO_ENCERRADO: StatusPedido[] = ['entregue', 'cancelado', 'historico']

/**
 * A tarefa que cada status pede de mim. É isso que transforma o pedido
 * em tarefa: o sistema sempre diz qual é o próximo passo e há quanto
 * tempo ele está parado.
 */
export const PROXIMA_ACAO_PEDIDO: Record<StatusPedido, string | null> = {
  rascunho: 'Revisar e enviar à farmácia',
  enviado_farmacia: 'Cobrar orçamento da farmácia',
  orcamento_recebido: 'Passar orçamento para a paciente',
  aprovado: 'Confirmar com a farmácia que pode manipular',
  em_manipulacao: 'Acompanhar prazo de manipulação',
  pronto: 'Combinar retirada ou envio com a paciente',
  entregue: null,
  cancelado: null,
  historico: null,
}

/** Dias parado no mesmo status antes de virar alerta. */
export const PRAZO_ALERTA_PEDIDO: Partial<Record<StatusPedido, number>> = {
  rascunho: 1,
  enviado_farmacia: 1,
  orcamento_recebido: 2,
  aprovado: 1,
  em_manipulacao: 5,
  pronto: 2,
}

export function proximoStatusPedido(atual: StatusPedido): StatusPedido | null {
  const i = FLUXO_PEDIDO.indexOf(atual)
  if (i < 0 || i >= FLUXO_PEDIDO.length - 1) return null
  return FLUXO_PEDIDO[i + 1] ?? null
}

export const CATEGORIAS_ITEM = {
  cosmetico: 'Cosmético',
  suplemento: 'Suplemento',
  fitoterapico: 'Fitoterápico',
  floral: 'Floral',
  outro: 'Outro',
} as const
export type CategoriaItem = keyof typeof CATEGORIAS_ITEM

export interface PedidoItem {
  id?: string
  categoria: CategoriaItem
  nome: string
  formula: string
  quantidade: string | null
  posologia: string | null
}

export interface Pedido {
  id: string
  numero: number | null
  pacienteId: string
  pacienteNome: string
  pacienteTelefone: string | null
  status: StatusPedido
  farmacia: string | null
  dataPedido: string
  previsaoEntrega: string | null
  valor: number | null
  observacoes: string | null
  statusDesde: string
  origemPedidoId: string | null
  itens: PedidoItem[]
}

export interface PedidoEvento {
  status: StatusPedido
  nota: string | null
  criadoEm: string
}

export function diasDesde(iso: string, agora = new Date()): number {
  const ms = agora.getTime() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ms / 86_400_000))
}

export function pedidoAtrasado(p: Pick<Pedido, 'status' | 'statusDesde' | 'previsaoEntrega'>, agora = new Date()): boolean {
  if (STATUS_PEDIDO_ENCERRADO.includes(p.status)) return false
  if (p.previsaoEntrega && p.status !== 'pronto' && new Date(p.previsaoEntrega + 'T23:59:59') < agora) return true
  const prazo = PRAZO_ALERTA_PEDIDO[p.status]
  return prazo !== undefined && diasDesde(p.statusDesde, agora) >= prazo
}

/** Texto pronto para colar no WhatsApp da farmácia. */
export function textoPedidoFarmacia(p: Pedido): string {
  const linhas: string[] = []
  linhas.push(`*Pedido #${p.numero ?? ''}* · Paciente: ${p.pacienteNome}`)
  linhas.push('')
  p.itens.forEach((it, i) => {
    linhas.push(`*${i + 1}. ${it.nome}*${it.quantidade ? ` (${it.quantidade})` : ''}`)
    linhas.push(it.formula.trim())
    if (it.posologia) linhas.push(`Modo de uso: ${it.posologia}`)
    linhas.push('')
  })
  if (p.observacoes) linhas.push(`Obs.: ${p.observacoes}`)
  return linhas.join('\n').trim()
}

/** Texto para a paciente: o que foi prescrito e como usar (sem composição). */
export function textoPedidoPaciente(p: Pedido): string {
  const primeiroNome = p.pacienteNome.split(' ')[0]
  const linhas: string[] = [`Oi, ${primeiroNome}! Seguem seus manipulados:`, '']
  p.itens.forEach((it) => {
    linhas.push(`• *${it.nome}*${it.posologia ? `: ${it.posologia}` : ''}`)
  })
  if (p.farmacia) linhas.push('', `Farmácia: ${p.farmacia}`)
  return linhas.join('\n')
}

export function linkWhatsApp(telefone: string | null, texto: string): string {
  const numero = (telefone ?? '').replace(/\D/g, '')
  const comDdi = numero.length === 10 || numero.length === 11 ? `55${numero}` : numero
  const base = comDdi ? `https://wa.me/${comDdi}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(texto)}`
}

// ── Programas de tratamento ────────────────────────────────
export const STATUS_PROGRAMA = {
  ativo: 'Em andamento',
  pausado: 'Pausado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
} as const
export type StatusPrograma = keyof typeof STATUS_PROGRAMA

export interface ItemChecklist {
  chave: string
  label: string
  obrigatorio: boolean
  feito: boolean
  feito_em: string | null
}

export interface Sessao {
  id: string
  programaId: string
  numero: number
  dataPrevista: string | null
  status: 'pendente' | 'realizada' | 'cancelada'
  checklist: ItemChecklist[]
  realizadaEm: string | null
  notas: string | null
}

export interface Programa {
  id: string
  pacienteId: string
  pacienteNome?: string
  nome: string
  objetivo: string | null
  totalSessoes: number
  intervaloDias: number
  dataInicio: string
  status: StatusPrograma
  observacoes: string | null
  sessoes: Sessao[]
}

/**
 * As "tarefas invisíveis" de cada sessão viram checklist.
 * Itens obrigatórios são TRAVAS: o banco não deixa concluir a sessão sem eles.
 *  - 1ª sessão: termo de consentimento + foto antes + anamnese revisada
 *  - todas: procedimento registrado no prontuário + orientações de home care
 *  - a cada 4 sessões e na última: foto de acompanhamento / foto depois
 */
export function checklistDaSessao(numero: number, total: number): ItemChecklist[] {
  const item = (chave: string, label: string, obrigatorio = true): ItemChecklist => ({
    chave, label, obrigatorio, feito: false, feito_em: null,
  })
  const lista: ItemChecklist[] = []
  if (numero === 1) {
    lista.push(item('consentimento', 'Termo de consentimento assinado'))
    lista.push(item('anamnese', 'Anamnese revisada (alergias, gestação, medicamentos)'))
    lista.push(item('foto_antes', 'Foto ANTES registrada'))
  }
  lista.push(item('prontuario', 'Procedimento registrado no prontuário'))
  lista.push(item('home_care', 'Orientações de home care enviadas'))
  if (numero === total) {
    lista.push(item('foto_depois', 'Foto DEPOIS registrada'))
    lista.push(item('reavaliacao', 'Reavaliação e próximo passo combinados'))
  } else if (numero > 1 && numero % 4 === 0) {
    lista.push(item('foto_evolucao', 'Foto de acompanhamento', false))
  }
  return lista
}

export function sessaoPodeConcluir(s: Pick<Sessao, 'checklist'>): { ok: boolean; faltando: string[] } {
  const faltando = s.checklist.filter((i) => i.obrigatorio && !i.feito).map((i) => i.label)
  return { ok: faltando.length === 0, faltando }
}

// ── Fotos ──────────────────────────────────────────────────
export interface Foto {
  id: string
  pacienteId: string
  sessaoId: string | null
  momento: 'antes' | 'depois' | 'evolucao'
  regiao: string | null
  storagePath: string
  tiradaEm: string
  notas: string | null
  url: string | null
}

// ── Tarefas ────────────────────────────────────────────────
export interface Tarefa {
  id: string
  titulo: string
  pacienteId: string | null
  pacienteNome: string | null
  vencimento: string | null
  feitaEm: string | null
}

// ── Formatação ─────────────────────────────────────────────
const TZ = 'America/Sao_Paulo'

export function fmtData(iso: string | null | undefined): string {
  if (!iso) return '·'
  const d = iso.length === 10 ? new Date(iso + 'T12:00:00') : new Date(iso)
  return d.toLocaleDateString('pt-BR', { timeZone: TZ, day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function fmtDataCurta(iso: string): string {
  const d = iso.length === 10 ? new Date(iso + 'T12:00:00') : new Date(iso)
  return d.toLocaleDateString('pt-BR', { timeZone: TZ, weekday: 'short', day: '2-digit', month: 'short' })
}

export function fmtHora(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
}

export function fmtMoeda(v: number | null): string {
  if (v === null || v === undefined) return '·'
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/** Data de hoje (YYYY-MM-DD) no fuso de Brasília. */
export function hojeISO(agora = new Date()): string {
  return agora.toLocaleDateString('en-CA', { timeZone: TZ })
}

export function somarDias(isoDate: string, dias: number): string {
  const d = new Date(isoDate + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString().slice(0, 10)
}

/** Converte "YYYY-MM-DD" + "HH:MM" (horário de Brasília) para ISO UTC. */
export function brasiliaParaISO(data: string, hora: string): string {
  // Brasília não tem horário de verão desde 2019: UTC-3 fixo.
  return new Date(`${data}T${hora}:00-03:00`).toISOString()
}

export function idade(dataNascimento: string | null): number | null {
  if (!dataNascimento) return null
  const n = new Date(dataNascimento + 'T12:00:00')
  const h = new Date()
  let a = h.getFullYear() - n.getFullYear()
  const m = h.getMonth() - n.getMonth()
  if (m < 0 || (m === 0 && h.getDate() < n.getDate())) a--
  return a
}

export function listaDeTexto(v: FormDataEntryValue | null): string[] {
  return String(v ?? '')
    .split(/[,;\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
}
