-- ============================================================
-- Seed 005: Tenant de Desenvolvimento
-- Biblioteca Cosmetológica Rafa Rabelo
-- APENAS PARA AMBIENTE LOCAL / DEV
-- NÃO EXECUTAR EM PRODUÇÃO
-- ============================================================
-- Este seed cria um tenant fixo para desenvolvimento local.
-- Em produção, o tenant é criado automaticamente pelo trigger
-- on_auth_user_created quando o primeiro usuário se cadastra.
-- ============================================================

DO $$
DECLARE
  v_tenant_id UUID := 'a0000000-0000-0000-0000-000000000001';  -- UUID fixo para dev
BEGIN
  -- Só inserir se não existir (idempotente)
  IF NOT EXISTS (SELECT 1 FROM public.tenants WHERE id = v_tenant_id) THEN

    INSERT INTO public.tenants (id, nome, slug, plano, configuracoes)
    VALUES (
      v_tenant_id,
      'Rafa Rabelo — Biblioteca Dev',
      'rafa-rabelo-dev',
      'mvp',
      '{"aurora_ativo": false, "fuso_horario": "America/Sao_Paulo"}'
    );

    INSERT INTO public.configuracoes_tenant (tenant_id, chave, valor, descricao)
    VALUES
      (v_tenant_id, 'aurora_ativo', 'false'::JSONB, 'Aurora desativada em dev'),
      (v_tenant_id, 'fuso_horario', '"America/Sao_Paulo"'::JSONB, 'Fuso horário'),
      (v_tenant_id, 'idioma', '"pt-BR"'::JSONB, 'Idioma da interface'),
      (v_tenant_id, 'modo_dev', 'true'::JSONB, 'Flag de ambiente de desenvolvimento');

    RAISE NOTICE 'Tenant de desenvolvimento criado: %', v_tenant_id;
  ELSE
    RAISE NOTICE 'Tenant de desenvolvimento já existe. Pulando.';
  END IF;
END;
$$;

-- ─────────────────────────────────────────────
-- Dados de exemplo mínimos para testes
-- ─────────────────────────────────────────────
-- Ativo de exemplo
DO $$
DECLARE
  v_tenant_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_ativo_id  UUID;
  v_familia_id UUID;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.ativos_cosmeticos
    WHERE tenant_id = v_tenant_id AND nome = 'Niacinamida'
  ) THEN
    SELECT id INTO v_familia_id FROM public.familias_quimicas WHERE nome = 'Vitaminas';

    INSERT INTO public.ativos_cosmeticos (
      tenant_id, nome, nome_inci, familia_quimica_id,
      descricao, mecanismo_acao,
      status_epistemico, nivel_acesso,
      ph_minimo, ph_maximo,
      concentracao_minima, concentracao_maxima, concentracao_usual,
      unidade_concentracao
    ) VALUES (
      v_tenant_id,
      'Niacinamida',
      'Niacinamide',
      v_familia_id,
      'Forma amida da vitamina B3 (ácido nicotínico). Solúvel em água, estável em ampla faixa de pH. Um dos ativos mais versáteis e bem estudados da cosmetologia.',
      'Inibe a transferência de melanossomas dos melanócitos aos queratinócitos (despigmentante). Reduz a produção de sebo. Estimula síntese de ceramidas e proteínas da barreira. Ação anti-inflamatória via inibição de citocinas pró-inflamatórias.',
      'validada',
      'privado',
      4.0, 8.0,
      2.0, 20.0, 5.0,
      '%'
    ) RETURNING id INTO v_ativo_id;

    RAISE NOTICE 'Ativo de exemplo criado: Niacinamida (%)', v_ativo_id;
  END IF;
END;
$$;
