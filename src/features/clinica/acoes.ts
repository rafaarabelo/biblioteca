// ============================================================
// Gestão Natural — Server Actions
// ============================================================
// Convenção: ações usadas em <form> recebem (estadoAnterior, formData)
// e devolvem { erro } quando algo dá errado, ou fazem redirect.
// ============================================================

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ctx } from './dados'
import {
  brasiliaParaISO,
  checklistDaSessao,
  listaDeTexto,
  proximoStatusPedido,
  sessaoPodeConcluir,
  somarDias,
  STATUS_PEDIDO,
  type ItemChecklist,
  type PedidoItem,
  type StatusPedido,
} from './dominio'

export type EstadoForm = { erro?: string; ok?: boolean } | null

const db = () => createClient() as any
const txt = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? '').trim()
  return v === '' ? null : v
}

function mensagemErro(e: unknown): string {
  const msg = (e as any)?.message ?? String(e)
  // Travas do banco chegam como "TRAVA: ..."
  const trava = /TRAVA: (.*)/.exec(msg)
  if (trava) return trava[1]!
  if (msg.includes('relation') && msg.includes('does not exist')) {
    return 'As tabelas da Gestão Natural ainda não existem no banco. Aplique a migration supabase/017_gestao_natural.sql.'
  }
  return msg
}

function revalidarPaciente(pacienteId?: string | null) {
  revalidatePath('/hoje')
  if (pacienteId) revalidatePath(`/pacientes/${pacienteId}`)
}

// ── Pacientes ──────────────────────────────────────────────
function dadosPaciente(fd: FormData) {
  return {
    nome: txt(fd, 'nome'),
    telefone: txt(fd, 'telefone'),
    email: txt(fd, 'email'),
    data_nascimento: txt(fd, 'data_nascimento'),
    fototipo: txt(fd, 'fototipo'),
    tipo_pele: txt(fd, 'tipo_pele'),
    gestante: fd.get('gestante') === 'on',
    amamentando: fd.get('amamentando') === 'on',
    alergias_conhecidas: listaDeTexto(fd.get('alergias')),
    medicamentos_uso_continuo: listaDeTexto(fd.get('medicamentos')),
    condicoes_relevantes: listaDeTexto(fd.get('condicoes')),
    observacoes: txt(fd, 'observacoes'),
  }
}

export async function criarPaciente(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  let id: string
  try {
    const { tenantId } = await ctx()
    const dados = dadosPaciente(fd)
    if (!dados.nome) return { erro: 'Informe o nome da paciente.' }
    const codigo = 'P' + Date.now().toString(36).toUpperCase().slice(-6)
    const { data, error } = await db()
      .from('pacientes')
      .insert({ ...dados, tenant_id: tenantId, codigo_interno: codigo })
      .select('id')
      .single()
    if (error) throw error
    id = data.id
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidatePath('/pacientes')
  redirect(`/pacientes/${id}`)
}

export async function atualizarPaciente(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const id = String(fd.get('id'))
  try {
    const { tenantId } = await ctx()
    const dados = dadosPaciente(fd)
    if (!dados.nome) return { erro: 'Informe o nome da paciente.' }
    const { error } = await db().from('pacientes').update(dados).eq('tenant_id', tenantId).eq('id', id)
    if (error) throw error
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidatePath('/pacientes')
  redirect(`/pacientes/${id}`)
}

// ── Prontuário ─────────────────────────────────────────────
export async function registrarAtendimento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const pacienteId = String(fd.get('paciente_id'))
  try {
    const { tenantId } = await ctx()
    const data = txt(fd, 'data')
    const hora = txt(fd, 'hora') ?? '12:00'
    const linha = {
      tenant_id: tenantId,
      paciente_id: pacienteId,
      agendamento_id: txt(fd, 'agendamento_id'),
      sessao_id: txt(fd, 'sessao_id'),
      adendo_de: txt(fd, 'adendo_de'),
      data: data ? brasiliaParaISO(data, hora) : new Date().toISOString(),
      tipo: txt(fd, 'tipo') ?? 'consulta',
      queixa: txt(fd, 'queixa'),
      avaliacao: txt(fd, 'avaliacao'),
      conduta: txt(fd, 'conduta'),
      orientacoes: txt(fd, 'orientacoes'),
      proximos_passos: txt(fd, 'proximos_passos'),
    }
    if (!linha.queixa && !linha.avaliacao && !linha.conduta && !linha.orientacoes && !linha.proximos_passos) {
      return { erro: 'Escreva pelo menos um campo do atendimento.' }
    }
    const { error } = await db().from('atendimentos').insert(linha)
    if (error) throw error

    // Fecha o ciclo: agendamento vira "realizado"; sessão marca "prontuário"
    if (linha.agendamento_id) {
      await db().from('agendamentos').update({ status: 'realizado' })
        .eq('tenant_id', tenantId).eq('id', linha.agendamento_id)
    }
    if (linha.sessao_id) await marcarChecklistInterno(tenantId, linha.sessao_id, 'prontuario', true)
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidarPaciente(pacienteId)
  revalidatePath('/agenda')
  return { ok: true }
}

// ── Agenda ─────────────────────────────────────────────────
export async function criarAgendamento(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const pacienteId = txt(fd, 'paciente_id')
  const voltar = txt(fd, 'voltar')
  try {
    const { tenantId } = await ctx()
    const data = txt(fd, 'data')
    const hora = txt(fd, 'hora')
    if (!data || !hora) return { erro: 'Informe data e horário.' }
    const tipo = txt(fd, 'tipo') ?? 'consulta'
    if (!pacienteId && tipo !== 'bloqueio') return { erro: 'Escolha a paciente (ou marque como bloqueio de agenda).' }
    const { error } = await db().from('agendamentos').insert({
      tenant_id: tenantId,
      paciente_id: pacienteId,
      inicio: brasiliaParaISO(data, hora),
      duracao_min: Number(txt(fd, 'duracao_min') ?? 60),
      tipo,
      modalidade: txt(fd, 'modalidade') ?? 'presencial',
      titulo: txt(fd, 'titulo'),
      observacoes: txt(fd, 'observacoes'),
      sessao_id: txt(fd, 'sessao_id'),
    })
    if (error) throw error
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidarPaciente(pacienteId)
  revalidatePath('/agenda')
  if (voltar) redirect(voltar)
  return { ok: true }
}

export async function mudarStatusAgendamento(id: string, status: string) {
  const { tenantId } = await ctx()
  const { data, error } = await db().from('agendamentos').update({ status })
    .eq('tenant_id', tenantId).eq('id', id).select('paciente_id').single()
  if (error) return { erro: mensagemErro(error) }
  revalidarPaciente(data?.paciente_id)
  revalidatePath('/agenda')
  return { ok: true }
}

// ── Pedidos manipulados ────────────────────────────────────
export interface PedidoPayload {
  id?: string
  pacienteId: string
  status: StatusPedido
  farmacia: string | null
  dataPedido: string
  previsaoEntrega: string | null
  valor: number | null
  observacoes: string | null
  origemPedidoId?: string | null
  itens: PedidoItem[]
}

export async function salvarPedido(p: PedidoPayload): Promise<{ erro?: string; id?: string }> {
  let id = p.id
  try {
    const { tenantId } = await ctx()
    const itens = p.itens.filter((i) => i.nome.trim() || i.formula.trim())
    if (!p.pacienteId) return { erro: 'Escolha a paciente.' }
    if (itens.length === 0) return { erro: 'Adicione pelo menos uma fórmula.' }
    if (itens.some((i) => !i.nome.trim() || !i.formula.trim())) {
      return { erro: 'Cada item precisa de nome e composição.' }
    }
    if (!(p.status in STATUS_PEDIDO)) return { erro: 'Status inválido.' }

    const linha = {
      tenant_id: tenantId,
      paciente_id: p.pacienteId,
      status: p.status,
      farmacia: p.farmacia?.trim() || null,
      data_pedido: p.dataPedido,
      previsao_entrega: p.previsaoEntrega || null,
      valor: p.valor,
      observacoes: p.observacoes?.trim() || null,
      origem_pedido_id: p.origemPedidoId ?? null,
    }

    if (id) {
      const { error } = await db().from('pedidos_manipulados').update(linha).eq('tenant_id', tenantId).eq('id', id)
      if (error) throw error
      const { error: e2 } = await db().from('pedido_itens').delete().eq('tenant_id', tenantId).eq('pedido_id', id)
      if (e2) throw e2
    } else {
      const { data, error } = await db().from('pedidos_manipulados').insert(linha).select('id').single()
      if (error) throw error
      id = data.id as string
    }

    const { error: e3 } = await db().from('pedido_itens').insert(
      itens.map((i, ordem) => ({
        tenant_id: tenantId,
        pedido_id: id,
        ordem,
        categoria: i.categoria,
        nome: i.nome.trim(),
        formula: i.formula.trim(),
        quantidade: i.quantidade?.trim() || null,
        posologia: i.posologia?.trim() || null,
      })),
    )
    if (e3) throw e3
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidatePath('/pedidos')
  revalidarPaciente(p.pacienteId)
  return { id }
}

export async function mudarStatusPedido(id: string, status: StatusPedido | 'proximo', nota?: string) {
  try {
    const { tenantId } = await ctx()
    const { data: atual, error } = await db().from('pedidos_manipulados')
      .select('status, paciente_id').eq('tenant_id', tenantId).eq('id', id).single()
    if (error) throw error
    const novo = status === 'proximo' ? proximoStatusPedido(atual.status) : status
    if (!novo) return { erro: 'Esse pedido já está no último passo.' }
    const { error: e2 } = await db().from('pedidos_manipulados').update({ status: novo })
      .eq('tenant_id', tenantId).eq('id', id)
    if (e2) throw e2
    if (nota?.trim()) {
      await db().from('pedido_eventos').insert({ tenant_id: tenantId, pedido_id: id, status: novo, nota: nota.trim() })
    }
    revalidatePath('/pedidos')
    revalidatePath(`/pedidos/${id}`)
    revalidarPaciente(atual.paciente_id)
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

export async function anotarPedido(id: string, nota: string) {
  try {
    const { tenantId } = await ctx()
    const { data: atual } = await db().from('pedidos_manipulados')
      .select('status').eq('tenant_id', tenantId).eq('id', id).single()
    const { error } = await db().from('pedido_eventos')
      .insert({ tenant_id: tenantId, pedido_id: id, status: atual?.status ?? 'rascunho', nota })
    if (error) throw error
    revalidatePath(`/pedidos/${id}`)
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

// ── Programas de tratamento ────────────────────────────────
export async function criarPrograma(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const pacienteId = String(fd.get('paciente_id'))
  let id: string
  try {
    const { tenantId } = await ctx()
    const total = Number(fd.get('total_sessoes') ?? 0)
    const intervalo = Number(fd.get('intervalo_dias') ?? 7)
    const inicio = txt(fd, 'data_inicio') ?? new Date().toISOString().slice(0, 10)
    const nome = txt(fd, 'nome')
    if (!nome) return { erro: 'Dê um nome ao programa.' }
    if (!(total >= 1 && total <= 60)) return { erro: 'Número de sessões entre 1 e 60.' }

    const { data, error } = await db().from('programas_tratamento').insert({
      tenant_id: tenantId,
      paciente_id: pacienteId,
      nome,
      objetivo: txt(fd, 'objetivo'),
      total_sessoes: total,
      intervalo_dias: intervalo,
      data_inicio: inicio,
      observacoes: txt(fd, 'observacoes'),
    }).select('id').single()
    if (error) throw error
    id = data.id

    const sessoes = Array.from({ length: total }, (_, i) => ({
      tenant_id: tenantId,
      programa_id: id,
      paciente_id: pacienteId,
      numero: i + 1,
      data_prevista: somarDias(inicio, i * intervalo),
      checklist: checklistDaSessao(i + 1, total),
    }))
    const { error: e2 } = await db().from('programa_sessoes').insert(sessoes)
    if (e2) throw e2
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidarPaciente(pacienteId)
  redirect(`/programas/${id}`)
}

async function marcarChecklistInterno(tenantId: string, sessaoId: string, chave: string, feito: boolean) {
  const { data: s, error } = await db().from('programa_sessoes')
    .select('checklist, status').eq('tenant_id', tenantId).eq('id', sessaoId).single()
  if (error) throw error
  const lista: ItemChecklist[] = (s.checklist ?? []).map((i: ItemChecklist) =>
    i.chave === chave ? { ...i, feito, feito_em: feito ? new Date().toISOString() : null } : i,
  )
  const { error: e2 } = await db().from('programa_sessoes').update({ checklist: lista })
    .eq('tenant_id', tenantId).eq('id', sessaoId)
  if (e2) throw e2
}

export async function marcarItemChecklist(sessaoId: string, programaId: string, chave: string, feito: boolean) {
  try {
    const { tenantId } = await ctx()
    await marcarChecklistInterno(tenantId, sessaoId, chave, feito)
    revalidatePath(`/programas/${programaId}`)
    revalidatePath('/hoje')
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

export async function concluirSessao(sessaoId: string, programaId: string, notas?: string) {
  try {
    const { tenantId } = await ctx()
    const { data: s, error } = await db().from('programa_sessoes')
      .select('checklist, numero').eq('tenant_id', tenantId).eq('id', sessaoId).single()
    if (error) throw error
    const verif = sessaoPodeConcluir({ checklist: s.checklist ?? [] })
    if (!verif.ok) return { erro: `Ainda falta: ${verif.faltando.join(', ')}` }
    const { error: e2 } = await db().from('programa_sessoes')
      .update({ status: 'realizada', notas: notas?.trim() || null })
      .eq('tenant_id', tenantId).eq('id', sessaoId)
    if (e2) throw e2
    revalidatePath(`/programas/${programaId}`)
    revalidatePath('/hoje')
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

export async function mudarStatusPrograma(programaId: string, status: string) {
  try {
    const { tenantId } = await ctx()
    const { data, error } = await db().from('programas_tratamento').update({ status })
      .eq('tenant_id', tenantId).eq('id', programaId).select('paciente_id').single()
    if (error) throw error
    revalidatePath(`/programas/${programaId}`)
    revalidarPaciente(data?.paciente_id)
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

// ── Fotos ──────────────────────────────────────────────────
export async function registrarFoto(input: {
  pacienteId: string
  sessaoId: string | null
  programaId: string | null
  momento: 'antes' | 'depois' | 'evolucao'
  regiao: string | null
  storagePath: string
  tiradaEm: string
}) {
  try {
    const { tenantId } = await ctx()
    if (!input.storagePath.startsWith(`${tenantId}/${input.pacienteId}/`)) {
      return { erro: 'Caminho de arquivo inválido.' }
    }
    const { error } = await db().from('fotos_paciente').insert({
      tenant_id: tenantId,
      paciente_id: input.pacienteId,
      sessao_id: input.sessaoId,
      momento: input.momento,
      regiao: input.regiao,
      storage_path: input.storagePath,
      tirada_em: input.tiradaEm,
    })
    if (error) throw error
    // A foto em si cumpre a tarefa do checklist
    if (input.sessaoId) {
      const chave = input.momento === 'antes' ? 'foto_antes' : input.momento === 'depois' ? 'foto_depois' : 'foto_evolucao'
      await marcarChecklistInterno(tenantId, input.sessaoId, chave, true)
    }
    revalidarPaciente(input.pacienteId)
    if (input.programaId) revalidatePath(`/programas/${input.programaId}`)
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}

// ── Tarefas ────────────────────────────────────────────────
export async function criarTarefa(_: EstadoForm, fd: FormData): Promise<EstadoForm> {
  const pacienteId = txt(fd, 'paciente_id')
  try {
    const { tenantId } = await ctx()
    const titulo = txt(fd, 'titulo')
    if (!titulo) return { erro: 'Escreva a tarefa.' }
    const { error } = await db().from('tarefas').insert({
      tenant_id: tenantId,
      titulo,
      paciente_id: pacienteId,
      vencimento: txt(fd, 'vencimento'),
    })
    if (error) throw error
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
  revalidarPaciente(pacienteId)
  return { ok: true }
}

export async function concluirTarefa(id: string) {
  try {
    const { tenantId } = await ctx()
    const { data, error } = await db().from('tarefas').update({ feita_em: new Date().toISOString() })
      .eq('tenant_id', tenantId).eq('id', id).select('paciente_id').single()
    if (error) throw error
    revalidarPaciente(data?.paciente_id)
    return { ok: true }
  } catch (e) {
    return { erro: mensagemErro(e) }
  }
}
