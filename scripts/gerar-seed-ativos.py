#!/usr/bin/env python3
"""
Gera o seed SQL dos ativos a partir do export JSON da Biblioteca
(kind "biblioteca:actives").

Uso:
    python3 -I scripts/gerar-seed-ativos.py export.json supabase/018_ativos_importados.sql

O que este script faz de proposito, e por que:

* Faixa de concentracao e pH: o export tem valores padrao repetidos em massa
  (ex.: 179 ativos com "2 a 5%"). Par que aparece 20 vezes ou mais, ou com
  minimo maior ou igual ao maximo, e tratado como "nao preenchido" e NAO vira
  faixa. Faixa falsa gera alerta falso, e alerta falso ensina a ignorar alerta.
* Gestacao e lactacao: derivadas do texto, com a regra do mais restritivo.
  Frase de seguranca ("Segura em gestantes") nunca conta como contraindicacao.
* Nomes repetidos (ignorando acento) sao mesclados em um so ativo.
* Tudo entra com metadados.revisado = false. O sistema trata esses dados como
  nao revisados (alerta de concentracao vira "atencao", nao "trava").
"""
import collections
import json
import re
import sys
import unicodedata

FONTE = "export biblioteca:actives"
LIMITE_PAR_PADRAO = 20

# Texto exportado -> nome em public.contraindicacoes_cosmeticas (supabase/004)
MAPA_CONTRA = {
    "feridas abertas": "Pele com feridas abertas",
    "pele muito irritada ou com feridas abertas": "Pele com feridas abertas",
    "alergia a compositae (raro)": "Alergia conhecida a Asteraceae (Compostas)",
    "criancas < 3 anos": "Criança menor de 3 anos",
    "evitar exposicao solar (fototoxicidade potencial)": "Exposição solar imediata pós-aplicação",
}
ORDEM = {None: 0, "liberado": 1, "orientacao": 2, "contraindicado": 3}


def norm(s: str) -> str:
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return re.sub(r"\s+", " ", s.lower()).strip()


def mais_restritivo(a, b):
    return a if ORDEM[a] >= ORDEM[b] else b


def gestacao(r):
    """liberado | orientacao | contraindicado | None (sem informacao)."""
    st = None
    m = re.search(r"Gestante:\s*(.*)", r["notes"] or "")
    clausula = norm(m.group(1)) if m else ""
    if clausula.startswith("sim"):
        st = "liberado"
    if re.search(r"contraindicad|evitar", clausula):
        st = "contraindicado"
    if re.search(r"cautela|orienta|moderad|altas? concentra|elevad", clausula):
        st = "orientacao"

    for c in r["contraindications"]:
        c = norm(c)
        if c in ("gestantes", "gravidez em alto risco"):
            st = mais_restritivo(st, "contraindicado")
        elif c.startswith("gestantes") and re.search(r"moderad|altas? concentra", c):
            st = mais_restritivo(st, "orientacao")

    texto = norm(" ".join([r["notes"] or "", r["description"] or "", *r["contraindications"]]))
    if st is None and re.search(r"segur[oa]s? em gestantes", texto):
        st = "liberado"
    return st


def lactacao(r):
    texto = norm(" ".join([r["notes"] or "", *r["contraindications"]]))
    if "lactantes" in [norm(c) for c in r["contraindications"]] or re.search(
        r"contraindicado na gestacao e lactacao", texto
    ):
        return "contraindicado"
    return None


def pares_padrao(itens, ka, kb):
    c = collections.Counter((r[ka], r[kb]) for r in itens)
    return {p for p, n in c.items() if n >= LIMITE_PAR_PADRAO}


def faixa(a, b, padroes):
    if a is None or b is None or a >= b or b <= 0 or (a, b) in padroes:
        return None
    return a, b


def sql_literal(s):
    return "$gn$" + s + "$gn$"


def main(entrada, saida):
    dados = json.load(open(entrada, encoding="utf-8"))
    if dados.get("kind") != "biblioteca:actives":
        sys.exit(f"Arquivo inesperado: kind={dados.get('kind')!r}")
    itens = dados["items"]

    pad_uso = pares_padrao(itens, "usageMin", "usageMax")
    pad_ph = pares_padrao(itens, "phMin", "phMax")

    grupos = collections.OrderedDict()
    for r in itens:
        grupos.setdefault(norm(r["commonName"]), []).append(r)

    ativos, mesclados = [], []
    estat = collections.Counter()
    for chave, grupo in grupos.items():
        base = grupo[0]
        nome = re.sub(r"\s+", " ", base["commonName"]).strip()
        outros = []
        gest, lact = None, None
        contras, tags, notas, refs = [], [], [], []
        faixas_uso, faixas_ph = [], []
        for r in grupo:
            gest = mais_restritivo(gest, gestacao(r))
            lact = mais_restritivo(lact, lactacao(r))
            for c in r["contraindications"]:
                c = c.strip()
                if c and not norm(c).startswith("nenhuma") and c not in contras:
                    contras.append(c)
            tags += [t for t in r["tags"] if t not in tags]
            if r["notes"] and r["notes"] not in notas:
                notas.append(r["notes"])
            refs += [x for x in r["refs"] if x not in refs]
            faixas_uso.append(faixa(r["usageMin"], r["usageMax"], pad_uso))
            faixas_ph.append(faixa(r["phMin"], r["phMax"], pad_ph))
            if r is not base:
                for alias in (r["inciName"], r["commonName"]):
                    if alias.strip() and norm(alias) not in (norm(nome), norm(base["inciName"])) and alias not in outros:
                        outros.append(alias.strip())
        if len(grupo) > 1:
            mesclados.append(nome)

        def unica(lista):
            vistas = {f for f in lista}
            return vistas.pop() if len(vistas) == 1 else None

        uso = unica(faixas_uso)
        ph = unica(faixas_ph)
        estat["uso_ok" if uso else "uso_descartado"] += 1
        estat["ph_ok" if ph else "ph_descartado"] += 1
        estat[f"gest_{gest}"] += 1

        meta = {
            "fonte": FONTE,
            "revisado": False,
            "categoria": base["category"],
            "origem": base["origin"],
            "tags": tags,
            "indicacoes": sorted({i for r in grupo for i in r["indications"]}),
            "contraindicacoes_exportadas": contras,
            "notas": " | ".join(notas),
            "referencias": refs,
            "uso_exportado": {"min": base["usageMin"], "max": base["usageMax"], "aproveitado": bool(uso)},
        }
        if gest:
            meta["gestacao"] = gest
        if lact:
            meta["lactacao"] = lact
        if len(grupo) > 1:
            meta["mesclado_de"] = [r["commonName"] for r in grupo]

        vinculos = []
        if gest == "contraindicado":
            vinculos.append("Gestação")
        if lact == "contraindicado":
            vinculos.append("Amamentação")
        for c in contras:
            alvo = MAPA_CONTRA.get(norm(c))
            if alvo and alvo not in vinculos:
                vinculos.append(alvo)

        ativos.append({
            "nome": nome,
            "nome_inci": base["inciName"].strip() or None,
            "outros_nomes": outros,
            "descricao": (base["description"] or "").strip() or None,
            "mecanismo_acao": (base["mechanism"] or "").strip() or None,
            "concentracao_minima": uso[0] if uso else None,
            "concentracao_maxima": uso[1] if uso else None,
            "ph_minimo": ph[0] if ph else None,
            "ph_maximo": ph[1] if ph else None,
            "solubilidade": (base["solubility"] or "").strip() or None,
            "metadados": meta,
            "vinculos": vinculos,
        })

    corpo = json.dumps(ativos, ensure_ascii=False, separators=(",", ":"))
    assert "$gn$" not in corpo
    sql = f"""-- ============================================================
-- Seed 018: Ativos importados do export da Biblioteca
-- Gerado por scripts/gerar-seed-ativos.py  (nao editar a mao)
-- Fonte: {FONTE}, exportado em {dados.get('exportedAt')}
-- ============================================================
-- Todos entram com metadados.revisado = false. Faixas de concentracao e pH
-- que eram valor padrao do export foram descartadas (ficam em
-- metadados.uso_exportado). Rodar de novo e seguro: ativos que ja existem
-- (mesmo nome, sem diferenciar maiusculas e acentos) sao pulados.
-- ============================================================

DO $$
DECLARE
  -- Dona dos dados: o tenant dela recebe os ativos.
  v_email    TEXT := 'a.rafaelarabelo@gmail.com';
  v_tenant   UUID;
  v_novos    INTEGER;
BEGIN
  SELECT p.tenant_id INTO v_tenant
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
   WHERE lower(u.email) = lower(v_email)
   LIMIT 1;

  IF v_tenant IS NULL THEN
    RAISE EXCEPTION 'Nao achei o usuario % em auth.users/profiles. Crie o usuario antes de importar os ativos.', v_email;
  END IF;

  CREATE TEMP TABLE _ativos_import ON COMMIT DROP AS
  SELECT * FROM jsonb_to_recordset({sql_literal(corpo)}::jsonb) AS x(
    nome TEXT, nome_inci TEXT, outros_nomes TEXT[], descricao TEXT, mecanismo_acao TEXT,
    concentracao_minima NUMERIC, concentracao_maxima NUMERIC, ph_minimo NUMERIC, ph_maximo NUMERIC,
    solubilidade TEXT, metadados JSONB, vinculos TEXT[]
  );

  WITH inseridos AS (
    INSERT INTO public.ativos_cosmeticos (
      tenant_id, nome, nome_inci, outros_nomes, descricao, mecanismo_acao,
      status_epistemico, nivel_acesso, concentracao_minima, concentracao_maxima,
      unidade_concentracao, ph_minimo, ph_maximo, solubilidade, metadados
    )
    SELECT v_tenant, i.nome, i.nome_inci, COALESCE(i.outros_nomes, '{{}}'), i.descricao, i.mecanismo_acao,
           'em_observacao', 'privado', i.concentracao_minima, i.concentracao_maxima,
           '%', i.ph_minimo, i.ph_maximo, i.solubilidade, i.metadados
      FROM _ativos_import i
     WHERE NOT EXISTS (
       SELECT 1 FROM public.ativos_cosmeticos a
        WHERE a.tenant_id = v_tenant
          AND lower(unaccent(a.nome)) = lower(unaccent(i.nome))
     )
    RETURNING id, nome
  )
  INSERT INTO public.ativo_contraindicacoes (ativo_id, contraindicacao_id)
  SELECT ins.id, c.id
    FROM inseridos ins
    JOIN _ativos_import i ON i.nome = ins.nome
    CROSS JOIN LATERAL unnest(COALESCE(i.vinculos, '{{}}')) AS v(nome_contra)
    JOIN public.contraindicacoes_cosmeticas c ON c.nome = v.nome_contra
  ON CONFLICT DO NOTHING;

  SELECT count(*) INTO v_novos FROM public.ativos_cosmeticos
   WHERE tenant_id = v_tenant AND metadados->>'fonte' = '{FONTE}';
  RAISE NOTICE 'Ativos importados neste tenant (total da fonte): %', v_novos;
END;
$$;
"""
    open(saida, "w", encoding="utf-8").write(sql)

    r = sys.stderr.write
    r(f"\nentrada: {len(itens)} itens -> {len(ativos)} ativos ({len(itens)-len(ativos)} mesclados)\n")
    r(f"mesclados: {mesclados}\n")
    r(f"pares de uso tratados como padrao: {sorted(pad_uso)}\n")
    r(f"pares de pH tratados como padrao: {sorted(pad_ph)}\n")
    for k, v in sorted(estat.items(), key=lambda kv: str(kv[0])):
        r(f"  {k}: {v}\n")
    r(f"vinculos com contraindicacoes: {sum(len(a['vinculos']) for a in ativos)}\n")
    r(f"tamanho do SQL: {len(sql)//1024} KB\n")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
