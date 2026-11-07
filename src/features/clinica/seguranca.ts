// ============================================================
// Gestão Natural — ativos da Biblioteca dentro do pedido
// ============================================================
// Regras puras: reconhecer ativos escritos em texto livre na
// composição e cruzar com a paciente e entre si.
// ============================================================

export interface AtivoBiblioteca {
  id: string
  nome: string
  inci: string | null
  apelidos: string[]          // outros_nomes + sinônimos
  concMin: number | null
  concUsual: number | null
  concMax: number | null
  unidade: string | null
  phMin: number | null
  phMax: number | null
  restricoes: string | null
  contraindicacoes: { nome: string; severidade: string | null }[]
  incompativeis: { id: string; nome: string; motivo: string | null; severidade: string | null }[]
}

export interface AtivoDetectado {
  ativo: AtivoBiblioteca
  concentracao: number | null
  item: number
}

export type NivelAlerta = 'trava' | 'atencao'

export interface AlertaSeguranca {
  nivel: NivelAlerta
  ativo: string
  mensagem: string
}

export interface PerfilPaciente {
  gestante: boolean
  amamentando: boolean
  alergias: string[]
  condicoes: string[]
  medicamentos: string[]
  fototipo: string | null
  idade: number | null
}

export function normalizar(t: string): string {
  return t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9%.,\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escaparRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Todas as formas de escrever o ativo, da mais longa para a mais curta. */
function formasDoAtivo(a: AtivoBiblioteca): string[] {
  return Array.from(new Set([a.nome, a.inci ?? '', ...a.apelidos].map(normalizar)))
    .filter((f) => f.length >= 4)
    .sort((x, y) => y.length - x.length)
}

/**
 * Encontra ativos da Biblioteca no texto livre de cada fórmula,
 * com a concentração escrita logo depois do nome ("Niacinamida 4%").
 */
export function detectarAtivos(formulas: string[], ativos: AtivoBiblioteca[]): AtivoDetectado[] {
  const achados: AtivoDetectado[] = []
  formulas.forEach((formula, item) => {
    const texto = ' ' + normalizar(formula) + ' '
    const ocupado: [number, number][] = []
    for (const ativo of ativos) {
      for (const forma of formasDoAtivo(ativo)) {
        const re = new RegExp(`(?<=[\\s(,;/-])${escaparRegex(forma)}(?=[\\s),;:/-])([^\\n%]{0,14}?(\\d+(?:[.,]\\d+)?)\\s*%)?`)
        const m = re.exec(texto)
        if (!m) continue
        const ini = m.index
        const fim = ini + forma.length
        if (ocupado.some(([a, b]) => ini < b && fim > a)) continue // já coberto por nome mais longo
        ocupado.push([ini, fim])
        const conc = m[2] ? Number(m[2].replace(',', '.')) : null
        achados.push({ ativo, concentracao: Number.isFinite(conc) ? conc : null, item })
        break
      }
    }
  })
  return achados
}

const contem = (lista: { nome: string }[], termo: string) =>
  lista.some((c) => normalizar(c.nome).includes(normalizar(termo)))

export function avaliarSeguranca(
  detectados: AtivoDetectado[],
  paciente: PerfilPaciente | null,
): AlertaSeguranca[] {
  const alertas: AlertaSeguranca[] = []
  const vistos = new Set<string>()

  for (const { ativo, concentracao } of detectados) {
    const ci = ativo.contraindicacoes

    if (paciente) {
      if (paciente.gestante && contem(ci, 'gestac')) {
        alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: 'contraindicado na gestação, e a paciente está gestante' })
      }
      if (paciente.amamentando && contem(ci, 'amament')) {
        alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: 'contraindicado na amamentação, e a paciente está amamentando' })
      }
      const formas = formasDoAtivo(ativo)
      for (const alergia of paciente.alergias) {
        const al = normalizar(alergia)
        if (al.length >= 4 && formas.some((f) => f.includes(al) || al.includes(f))) {
          alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: `a paciente tem alergia registrada a "${alergia}"` })
        }
      }
      if (paciente.idade !== null && paciente.idade < 12 && contem(ci, 'crianca menor de 12')) {
        alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: 'contraindicado para menores de 12 anos' })
      }
      if (paciente.condicoes.some((c) => normalizar(c).includes('rosacea')) && contem(ci, 'rosacea')) {
        alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'pode agravar rosácea, e a paciente tem rosácea registrada' })
      }
      if (paciente.medicamentos.some((m) => /retino|isotretino|adapaleno|tretino/.test(normalizar(m))) && contem(ci, 'retinoides prescritos')) {
        alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'potencializa irritação com o retinoide que a paciente usa' })
      }
      if (paciente.fototipo && ['I', 'II'].includes(paciente.fototipo) && contem(ci, 'fototipo i e ii')) {
        alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'fotossensibilizante em fototipo claro: reforçar fotoproteção' })
      }
    }

    if (concentracao !== null) {
      if (ativo.concMax !== null && concentracao > ativo.concMax) {
        alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: `${fmtNum(concentracao)}% está acima da máxima da Biblioteca (${fmtNum(ativo.concMax)}%)` })
      } else if (ativo.concMin !== null && concentracao < ativo.concMin) {
        alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: `${fmtNum(concentracao)}% está abaixo da mínima eficaz (${fmtNum(ativo.concMin)}%)` })
      }
    }

    for (const inc of ativo.incompativeis) {
      const chave = [ativo.id, inc.id].sort().join(':')
      if (vistos.has(chave)) continue
      if (detectados.some((d) => d.ativo.id === inc.id)) {
        vistos.add(chave)
        alertas.push({
          nivel: inc.severidade === 'severa' || inc.severidade === 'alta' ? 'trava' : 'atencao',
          ativo: `${ativo.nome} + ${inc.nome}`,
          mensagem: `incompatíveis no mesmo pedido${inc.motivo ? `: ${inc.motivo}` : ''}`,
        })
      }
    }
  }

  // remove duplicados e põe as travas primeiro
  const unicos = Array.from(new Map(alertas.map((a) => [`${a.ativo}|${a.mensagem}`, a])).values())
  return unicos.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === 'trava' ? -1 : 1))
}

export function linhaDoAtivo(a: AtivoBiblioteca): string {
  const conc = a.concUsual ?? a.concMin
  return conc !== null ? `${a.nome} ${fmtNum(conc)}${a.unidade && a.unidade !== '%' ? ` ${a.unidade}` : '%'}` : a.nome
}

export function faixaDoAtivo(a: AtivoBiblioteca): string | null {
  if (a.concMin === null && a.concMax === null) return null
  return `${a.concMin !== null ? fmtNum(a.concMin) : '?'} a ${a.concMax !== null ? fmtNum(a.concMax) : '?'}%`
}

function fmtNum(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}
