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
  /** Vem de metadados.gestacao/lactacao (import) ou do vínculo com a contraindicação. null = sem informação. */
  gestacao: NivelUsoSeguro | null
  lactacao: NivelUsoSeguro | null
  /** false enquanto a Rafa não revisou o cadastro: concentração vira aviso, não trava. */
  revisado: boolean
  contraindicacoes: { nome: string; severidade: string | null }[]
  incompativeis: { id: string; nome: string; motivo: string | null; severidade: string | null }[]
}

export type NivelUsoSeguro = 'liberado' | 'orientacao' | 'contraindicado'

export interface AtivoDetectado {
  ativo: AtivoBiblioteca
  concentracao: number | null
  item: number
  /** Lido por semelhança (erro de digitação). Texto original em `escrito`. */
  aproximado?: boolean
  escrito?: string
}

function distancia(a: string, b: string): number {
  const m = a.length, n = b.length
  if (Math.abs(m - n) > 2) return 3
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const cur = [i]
    for (let j = 1; j <= n; j++) {
      cur[j] = Math.min(prev[j]! + 1, cur[j - 1]! + 1, prev[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = cur
  }
  return prev[n]!
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
    .replace(/-/g, ' ')
    .replace(/[^a-z0-9%.,\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function escaparRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** "Zinc PCA / Zinc gluconate" e "Nome (outro nome)" viram formas separadas. */
export function variantes(texto: string | null): string[] {
  if (!texto) return []
  const partes = texto.split(/\s*[\/;]\s*/)
  const dentro = Array.from(texto.matchAll(/\(([^)]+)\)/g)).map((m) => m[1]!)
  const semParenteses = partes.map((p) => p.replace(/\([^)]*\)/g, ' '))
  return [...partes, ...semParenteses, ...dentro].map((p) => p.trim()).filter(Boolean)
}

/** Todas as formas de escrever o ativo, da mais longa para a mais curta. */
function formasDoAtivo(a: AtivoBiblioteca): string[] {
  const todas = [...variantes(a.nome), ...variantes(a.inci), ...a.apelidos.flatMap(variantes)]
  return Array.from(new Set(todas.map(normalizar)))
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

    // Segunda passada: linhas que não casaram com nada, tolerando erro de digitação.
    for (const linha of formula.split(/\n/)) {
      const nl = normalizar(linha)
      if (nl.length < 8) continue
      const coberta = achados.some(
        (d) => d.item === item && formasDoAtivo(d.ativo).some((f) => nl.includes(f)),
      )
      if (coberta) continue
      const candidato = nl.replace(/\d+(?:[.,]\d+)?\s*%.*$/, '').replace(/\bqsp\b.*$/, '').trim()
      if (candidato.length < 8) continue
      let melhor: { ativo: AtivoBiblioteca; d: number } | null = null
      for (const ativo of ativos) {
        for (const forma of formasDoAtivo(ativo)) {
          if (forma.length < 8) continue
          const limite = forma.length >= 10 ? 2 : 1
          const d = distancia(candidato, forma)
          if (d <= limite && (!melhor || d < melhor.d)) melhor = { ativo, d }
        }
      }
      if (melhor) {
        const c = /(\d+(?:[.,]\d+)?)\s*%/.exec(nl)
        achados.push({
          ativo: melhor.ativo,
          concentracao: c ? Number(c[1]!.replace(',', '.')) : null,
          item,
          aproximado: true,
          escrito: linha.trim().replace(/\s*\d+(?:[.,]\d+)?\s*%.*$/, ''),
        })
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

  for (const { ativo, concentracao, aproximado, escrito } of detectados) {
    const ci = ativo.contraindicacoes
    if (aproximado) {
      alertas.push({ nivel: 'atencao', ativo: escrito ?? ativo.nome, mensagem: `li como "${ativo.nome}" por semelhança. Confira a grafia, os alertas abaixo valem para esse ativo` })
    }

    if (paciente) {
      const gest: NivelUsoSeguro | null = contem(ci, 'gestac') ? 'contraindicado' : ativo.gestacao
      const lact: NivelUsoSeguro | null = contem(ci, 'amament') ? 'contraindicado' : ativo.lactacao

      if (paciente.gestante) {
        if (gest === 'contraindicado') {
          alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: 'contraindicado na gestação, e a paciente está gestante' })
        } else if (gest === 'orientacao') {
          alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'na gestação só com orientação profissional, e a paciente está gestante' })
        } else if (gest === null) {
          alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'a Biblioteca não tem informação sobre uso na gestação, e a paciente está gestante' })
        }
      }
      if (paciente.amamentando) {
        if (lact === 'contraindicado') {
          alertas.push({ nivel: 'trava', ativo: ativo.nome, mensagem: 'contraindicado na amamentação, e a paciente está amamentando' })
        } else if (lact === null && gest === 'contraindicado') {
          alertas.push({ nivel: 'atencao', ativo: ativo.nome, mensagem: 'contraindicado na gestação e sem dado sobre amamentação: confirmar antes de usar' })
        }
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
      // Cadastro não revisado nunca trava por concentração: a faixa pode estar errada.
      const nivelConc: NivelAlerta = ativo.revisado ? 'trava' : 'atencao'
      if (ativo.concMax !== null && concentracao > ativo.concMax) {
        alertas.push({ nivel: nivelConc, ativo: ativo.nome, mensagem: `${fmtNum(concentracao)}% está acima da máxima da Biblioteca (${fmtNum(ativo.concMax)}%)${ativo.revisado ? '' : ', cadastro ainda não revisado'}` })
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
  const conc = a.concUsual
  return conc !== null ? `${a.nome} ${fmtNum(conc)}${a.unidade && a.unidade !== '%' ? ` ${a.unidade}` : '%'}` : a.nome
}

export function faixaDoAtivo(a: AtivoBiblioteca): string | null {
  if (a.concMin === null && a.concMax === null) return null
  return `${a.concMin !== null ? fmtNum(a.concMin) : '?'} a ${a.concMax !== null ? fmtNum(a.concMax) : '?'}%`
}

function fmtNum(n: number) {
  return n.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
}
