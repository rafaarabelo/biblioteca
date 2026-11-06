-- ============================================================
-- Migration 017: Gestão Natural — o dia a dia da clínica
-- ============================================================
-- Transforma a Biblioteca em sistema de uso diário:
--   1. agendamentos            → agenda
--   2. atendimentos            → prontuário (registro por atendimento)
--   3. pedidos_manipulados     → pedidos à farmácia, com status e histórico
--      pedido_itens            → cada fórmula do pedido (texto livre)
--      pedido_eventos          → linha do tempo do pedido
--   4. programas_tratamento    → programas com N sessões
--      programa_sessoes        → sessões com checklist e TRAVAS
--   5. fotos_paciente          → antes / depois / evolução (Storage privado)
--   6. tarefas                 → pendências avulsas
--
-- Reaproveita public.pacientes (já existente e até hoje sem interface).
-- Isolamento por tenant via public.fn_current_tenant_id() (mesmo
-- padrão das demais tabelas).
--
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================

-- ─────────────────────────────────────────────
-- Helper: atualizado_em automático
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_gn_touch_atualizado_em()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.atualizado_em := now();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────
-- 1. AGENDAMENTOS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                   REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id      UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  inicio           TIMESTAMPTZ NOT NULL,
  duracao_min      INTEGER NOT NULL DEFAULT 60 CHECK (duracao_min > 0 AND duracao_min <= 600),
  tipo             TEXT NOT NULL DEFAULT 'consulta'
                   CHECK (tipo IN ('consulta','retorno','sessao','avaliacao','bloqueio','outro')),
  modalidade       TEXT NOT NULL DEFAULT 'presencial'
                   CHECK (modalidade IN ('presencial','online')),
  status           TEXT NOT NULL DEFAULT 'agendado'
                   CHECK (status IN ('agendado','confirmado','realizado','faltou','cancelado')),
  titulo           TEXT,
  observacoes      TEXT,
  sessao_id        UUID, -- FK adicionada após programa_sessoes
  criado_por       UUID DEFAULT auth.uid(),
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT agendamento_paciente_ou_bloqueio
    CHECK (paciente_id IS NOT NULL OR tipo = 'bloqueio')
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_tenant_inicio ON public.agendamentos (tenant_id, inicio);
CREATE INDEX IF NOT EXISTS idx_agendamentos_paciente      ON public.agendamentos (paciente_id, inicio DESC);

-- ─────────────────────────────────────────────
-- 2. ATENDIMENTOS (prontuário)
-- Registro clínico: só INSERT. Correções viram um novo registro
-- do tipo 'adendo' apontando para o original (prática de prontuário).
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.atendimentos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                   REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id      UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  agendamento_id   UUID REFERENCES public.agendamentos(id) ON DELETE SET NULL,
  sessao_id        UUID, -- FK adicionada após programa_sessoes
  adendo_de        UUID REFERENCES public.atendimentos(id) ON DELETE SET NULL,
  data             TIMESTAMPTZ NOT NULL DEFAULT now(),
  tipo             TEXT NOT NULL DEFAULT 'consulta'
                   CHECK (tipo IN ('consulta','retorno','sessao','online','mensagem','adendo','outro')),
  queixa           TEXT,   -- o que a paciente trouxe / subjetivo
  avaliacao        TEXT,   -- o que eu observei / objetivo
  conduta          TEXT,   -- o que foi feito / prescrito
  orientacoes      TEXT,   -- home care e orientações
  proximos_passos  TEXT,
  registrado_por   UUID DEFAULT auth.uid(),
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT atendimento_tem_conteudo CHECK (
    coalesce(queixa, avaliacao, conduta, orientacoes, proximos_passos) IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_atendimentos_paciente ON public.atendimentos (paciente_id, data DESC);
CREATE INDEX IF NOT EXISTS idx_atendimentos_tenant   ON public.atendimentos (tenant_id, data DESC);

-- ─────────────────────────────────────────────
-- 3. PEDIDOS MANIPULADOS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pedidos_manipulados (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                   REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id      UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  numero           INTEGER,
  status           TEXT NOT NULL DEFAULT 'rascunho'
                   CHECK (status IN (
                     'rascunho',            -- montando
                     'enviado_farmacia',    -- mandei pra farmácia, aguardando orçamento
                     'orcamento_recebido',  -- orçamento chegou, falta paciente aprovar
                     'aprovado',            -- paciente aprovou / pagou
                     'em_manipulacao',      -- farmácia produzindo
                     'pronto',              -- pronto para retirada/envio
                     'entregue',            -- chegou na paciente
                     'cancelado',
                     'historico'            -- pedido antigo registrado retroativamente
                   )),
  farmacia         TEXT,
  data_pedido      DATE NOT NULL DEFAULT current_date,
  previsao_entrega DATE,
  valor            NUMERIC(10,2),
  observacoes      TEXT,
  origem_pedido_id UUID REFERENCES public.pedidos_manipulados(id) ON DELETE SET NULL, -- "repetir pedido"
  atendimento_id   UUID REFERENCES public.atendimentos(id) ON DELETE SET NULL,
  status_desde     TIMESTAMPTZ NOT NULL DEFAULT now(),
  criado_por       UUID DEFAULT auth.uid(),
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_tenant_status ON public.pedidos_manipulados (tenant_id, status, status_desde);
CREATE INDEX IF NOT EXISTS idx_pedidos_paciente      ON public.pedidos_manipulados (paciente_id, data_pedido DESC);

CREATE TABLE IF NOT EXISTS public.pedido_itens (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL DEFAULT public.fn_current_tenant_id()
               REFERENCES public.tenants(id) ON DELETE CASCADE,
  pedido_id    UUID NOT NULL REFERENCES public.pedidos_manipulados(id) ON DELETE CASCADE,
  ordem        INTEGER NOT NULL DEFAULT 0,
  categoria    TEXT NOT NULL DEFAULT 'cosmetico'
               CHECK (categoria IN ('cosmetico','suplemento','fitoterapico','floral','outro')),
  nome         TEXT NOT NULL,          -- ex.: "Sérum clareador noturno"
  formula      TEXT NOT NULL,          -- composição completa, texto livre
  quantidade   TEXT,                   -- ex.: "30 g", "60 cápsulas"
  posologia    TEXT                    -- modo de uso
);

CREATE INDEX IF NOT EXISTS idx_pedido_itens_pedido ON public.pedido_itens (pedido_id, ordem);
-- Busca textual nas fórmulas (encontrar "quem usou ácido azelaico")
CREATE INDEX IF NOT EXISTS idx_pedido_itens_busca
  ON public.pedido_itens USING gin (to_tsvector('portuguese', nome || ' ' || formula));

CREATE TABLE IF NOT EXISTS public.pedido_eventos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL DEFAULT public.fn_current_tenant_id()
               REFERENCES public.tenants(id) ON DELETE CASCADE,
  pedido_id    UUID NOT NULL REFERENCES public.pedidos_manipulados(id) ON DELETE CASCADE,
  status       TEXT NOT NULL,
  nota         TEXT,
  criado_por   UUID DEFAULT auth.uid(),
  criado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pedido_eventos_pedido ON public.pedido_eventos (pedido_id, criado_em);

-- Número sequencial por tenant + registro automático de mudança de status
CREATE OR REPLACE FUNCTION public.fn_gn_pedido_before()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.numero IS NULL THEN
      SELECT coalesce(max(numero), 0) + 1 INTO NEW.numero
      FROM public.pedidos_manipulados WHERE tenant_id = NEW.tenant_id;
    END IF;
    NEW.status_desde := now();
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.status_desde := now();
  END IF;
  NEW.atualizado_em := now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_gn_pedido_after()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' OR NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.pedido_eventos (tenant_id, pedido_id, status)
    VALUES (NEW.tenant_id, NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gn_pedido_before ON public.pedidos_manipulados;
CREATE TRIGGER trg_gn_pedido_before BEFORE INSERT OR UPDATE ON public.pedidos_manipulados
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_pedido_before();

DROP TRIGGER IF EXISTS trg_gn_pedido_after ON public.pedidos_manipulados;
CREATE TRIGGER trg_gn_pedido_after AFTER INSERT OR UPDATE ON public.pedidos_manipulados
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_pedido_after();

-- ─────────────────────────────────────────────
-- 4. PROGRAMAS DE TRATAMENTO + SESSÕES COM TRAVAS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.programas_tratamento (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                   REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id      UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  nome             TEXT NOT NULL,
  objetivo         TEXT,
  total_sessoes    INTEGER NOT NULL CHECK (total_sessoes BETWEEN 1 AND 60),
  intervalo_dias   INTEGER NOT NULL DEFAULT 7 CHECK (intervalo_dias BETWEEN 1 AND 180),
  data_inicio      DATE NOT NULL DEFAULT current_date,
  status           TEXT NOT NULL DEFAULT 'ativo'
                   CHECK (status IN ('ativo','pausado','concluido','cancelado')),
  observacoes      TEXT,
  criado_por       UUID DEFAULT auth.uid(),
  criado_em        TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_programas_paciente ON public.programas_tratamento (paciente_id, status);

-- checklist: [{ "chave": "foto_antes", "label": "Foto antes", "obrigatorio": true,
--               "feito": false, "feito_em": null }]
CREATE TABLE IF NOT EXISTS public.programa_sessoes (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id        UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                   REFERENCES public.tenants(id) ON DELETE CASCADE,
  programa_id      UUID NOT NULL REFERENCES public.programas_tratamento(id) ON DELETE CASCADE,
  paciente_id      UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  numero           INTEGER NOT NULL CHECK (numero >= 1),
  data_prevista    DATE,
  status           TEXT NOT NULL DEFAULT 'pendente'
                   CHECK (status IN ('pendente','realizada','cancelada')),
  checklist        JSONB NOT NULL DEFAULT '[]'::jsonb,
  realizada_em     TIMESTAMPTZ,
  notas            TEXT,
  atualizado_em    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (programa_id, numero)
);

CREATE INDEX IF NOT EXISTS idx_sessoes_programa ON public.programa_sessoes (programa_id, numero);
CREATE INDEX IF NOT EXISTS idx_sessoes_pendentes ON public.programa_sessoes (tenant_id, status, data_prevista);

-- FKs que dependem de programa_sessoes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'agendamentos_sessao_fk') THEN
    ALTER TABLE public.agendamentos
      ADD CONSTRAINT agendamentos_sessao_fk FOREIGN KEY (sessao_id)
      REFERENCES public.programa_sessoes(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'atendimentos_sessao_fk') THEN
    ALTER TABLE public.atendimentos
      ADD CONSTRAINT atendimentos_sessao_fk FOREIGN KEY (sessao_id)
      REFERENCES public.programa_sessoes(id) ON DELETE SET NULL;
  END IF;
END;
$$;

-- TRAVAS: o banco recusa concluir uma sessão quando
--   (a) algum item obrigatório do checklist não foi feito, ou
--   (b) a sessão anterior do mesmo programa ainda não foi realizada/cancelada.
CREATE OR REPLACE FUNCTION public.fn_gn_sessao_travas()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_pendentes TEXT;
  v_anterior  TEXT;
BEGIN
  NEW.atualizado_em := now();

  IF NEW.status = 'realizada' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'realizada') THEN
    SELECT string_agg(item->>'label', ', ')
      INTO v_pendentes
      FROM jsonb_array_elements(NEW.checklist) AS item
     WHERE coalesce((item->>'obrigatorio')::boolean, false)
       AND NOT coalesce((item->>'feito')::boolean, false);

    IF v_pendentes IS NOT NULL THEN
      RAISE EXCEPTION 'TRAVA: sessão % não pode ser concluída. Falta: %', NEW.numero, v_pendentes
        USING ERRCODE = 'check_violation';
    END IF;

    IF NEW.numero > 1 THEN
      SELECT status INTO v_anterior
        FROM public.programa_sessoes
       WHERE programa_id = NEW.programa_id AND numero = NEW.numero - 1;
      IF v_anterior = 'pendente' THEN
        RAISE EXCEPTION 'TRAVA: conclua a sessão % antes da sessão %', NEW.numero - 1, NEW.numero
          USING ERRCODE = 'check_violation';
      END IF;
    END IF;

    NEW.realizada_em := coalesce(NEW.realizada_em, now());
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gn_sessao_travas ON public.programa_sessoes;
CREATE TRIGGER trg_gn_sessao_travas BEFORE INSERT OR UPDATE ON public.programa_sessoes
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_sessao_travas();

-- Programa vira 'concluido' sozinho quando a última sessão é realizada
CREATE OR REPLACE FUNCTION public.fn_gn_programa_conclui()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'realizada' AND NOT EXISTS (
    SELECT 1 FROM public.programa_sessoes
     WHERE programa_id = NEW.programa_id AND status = 'pendente'
  ) THEN
    UPDATE public.programas_tratamento
       SET status = 'concluido', atualizado_em = now()
     WHERE id = NEW.programa_id AND status = 'ativo';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_gn_programa_conclui ON public.programa_sessoes;
CREATE TRIGGER trg_gn_programa_conclui AFTER UPDATE ON public.programa_sessoes
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_programa_conclui();

-- ─────────────────────────────────────────────
-- 5. FOTOS (antes / depois / evolução)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.fotos_paciente (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                 REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id    UUID NOT NULL REFERENCES public.pacientes(id) ON DELETE CASCADE,
  sessao_id      UUID REFERENCES public.programa_sessoes(id) ON DELETE SET NULL,
  momento        TEXT NOT NULL DEFAULT 'evolucao'
                 CHECK (momento IN ('antes','depois','evolucao')),
  regiao         TEXT,          -- rosto frontal, perfil esquerdo, colo...
  storage_path   TEXT NOT NULL, -- {tenant_id}/{paciente_id}/{arquivo}
  tirada_em      DATE NOT NULL DEFAULT current_date,
  notas          TEXT,
  criado_por     UUID DEFAULT auth.uid(),
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_fotos_paciente ON public.fotos_paciente (paciente_id, tirada_em DESC);

-- ─────────────────────────────────────────────
-- 6. TAREFAS AVULSAS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tarefas (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id      UUID NOT NULL DEFAULT public.fn_current_tenant_id()
                 REFERENCES public.tenants(id) ON DELETE CASCADE,
  paciente_id    UUID REFERENCES public.pacientes(id) ON DELETE CASCADE,
  titulo         TEXT NOT NULL,
  vencimento     DATE,
  feita_em       TIMESTAMPTZ,
  criado_por     UUID DEFAULT auth.uid(),
  criado_em      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tarefas_abertas ON public.tarefas (tenant_id, feita_em, vencimento);

-- ─────────────────────────────────────────────
-- Triggers de atualizado_em
-- ─────────────────────────────────────────────
DROP TRIGGER IF EXISTS trg_gn_touch ON public.agendamentos;
CREATE TRIGGER trg_gn_touch BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_touch_atualizado_em();

DROP TRIGGER IF EXISTS trg_gn_touch ON public.programas_tratamento;
CREATE TRIGGER trg_gn_touch BEFORE UPDATE ON public.programas_tratamento
  FOR EACH ROW EXECUTE FUNCTION public.fn_gn_touch_atualizado_em();

-- ─────────────────────────────────────────────
-- RLS — tudo isolado por tenant
-- atendimentos e pedido_eventos: sem UPDATE/DELETE (histórico imutável)
-- ─────────────────────────────────────────────
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'agendamentos','pedidos_manipulados','pedido_itens','programas_tratamento',
    'programa_sessoes','fotos_paciente','tarefas'
  ] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS gn_tenant_all ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY gn_tenant_all ON public.%I FOR ALL TO authenticated
         USING (tenant_id = public.fn_current_tenant_id())
         WITH CHECK (tenant_id = public.fn_current_tenant_id())', t);
  END LOOP;

  FOREACH t IN ARRAY ARRAY['atendimentos','pedido_eventos'] LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS gn_tenant_select ON public.%I', t);
    EXECUTE format('DROP POLICY IF EXISTS gn_tenant_insert ON public.%I', t);
    EXECUTE format(
      'CREATE POLICY gn_tenant_select ON public.%I FOR SELECT TO authenticated
         USING (tenant_id = public.fn_current_tenant_id())', t);
    EXECUTE format(
      'CREATE POLICY gn_tenant_insert ON public.%I FOR INSERT TO authenticated
         WITH CHECK (tenant_id = public.fn_current_tenant_id())', t);
  END LOOP;
END;
$$;

-- ─────────────────────────────────────────────
-- STORAGE — bucket privado de fotos clínicas
-- Caminho obrigatório: {tenant_id}/{paciente_id}/{arquivo}
-- ─────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('fotos-clinicas', 'fotos-clinicas', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS gn_fotos_select ON storage.objects;
CREATE POLICY gn_fotos_select ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'fotos-clinicas'
         AND (storage.foldername(name))[1] = public.fn_current_tenant_id()::text);

DROP POLICY IF EXISTS gn_fotos_insert ON storage.objects;
CREATE POLICY gn_fotos_insert ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'fotos-clinicas'
              AND (storage.foldername(name))[1] = public.fn_current_tenant_id()::text);

DROP POLICY IF EXISTS gn_fotos_delete ON storage.objects;
CREATE POLICY gn_fotos_delete ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'fotos-clinicas'
         AND (storage.foldername(name))[1] = public.fn_current_tenant_id()::text);
