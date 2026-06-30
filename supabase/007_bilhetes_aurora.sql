-- ============================================================
-- Seed 007: Bilhetes Aurora — Dev
-- Biblioteca Cosmetológica Rafa Rabelo
-- Sprint 4 — Mesa conectada ao banco
-- APENAS PARA AMBIENTE LOCAL / DEV
-- ============================================================
-- Cria dois bilhetes iniciais para o tenant de desenvolvimento:
--
-- 1. Bilhete de primeira visita: assinatura minimalista "A."
--    Aurora se apresenta antes de ter qualquer dado para analisar.
--    Aparece primeiro porque criado_em é anterior ao bilhete padrão
--    E será marcado como lido quando a usuária o abrir.
--
-- 2. Bilhete padrão: assinatura "— Aurora ✿"
--    Primeiro bilhete "real" após a apresentação.
--    Aparece quando o de primeira visita já foi lido.
-- ============================================================

DO $$
DECLARE
  v_tenant_id UUID := 'a0000000-0000-0000-0000-000000000001';
BEGIN
  -- ── Bilhete 1: Primeira visita ──────────────────────────────
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = v_tenant_id
      AND titulo = 'Não estou aqui para pensar por você.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      tenant_id,
      tipo,
      titulo,
      preview,
      conteudo,
      assinatura,
      fixado,
      arquivado,
      entidades_relacionadas,
      criado_em
    ) VALUES (
      v_tenant_id,
      'conexao',
      'Não estou aqui para pensar por você.',
      'Não estou aqui para pensar por você.',
      E'Olá, Rafa.\n\nNão estou aqui para pensar por você.\nEstou aqui para que nenhuma boa ideia se perca.\n\nHoje a Biblioteca ainda está quase vazia.\nIsso é bom.\nSignifica que ela crescerá junto com você.',
      'A.',
      FALSE,
      FALSE,
      '[]',
      NOW() - INTERVAL '1 hour'  -- aparece antes do bilhete padrão
    );

    RAISE NOTICE 'Bilhete de primeira visita criado.';
  ELSE
    RAISE NOTICE 'Bilhete de primeira visita já existe. Pulando.';
  END IF;

  -- ── Bilhete 2: Padrão (segunda visita em diante) ─────────────
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = v_tenant_id
      AND titulo = 'A pele não é apenas fronteira biológica. É registro.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      tenant_id,
      tipo,
      titulo,
      preview,
      conteudo,
      assinatura,
      fixado,
      arquivado,
      entidades_relacionadas,
      criado_em
    ) VALUES (
      v_tenant_id,
      'descoberta',
      'A pele não é apenas fronteira biológica. É registro.',
      'A pele não é apenas fronteira biológica. É registro.',
      E'Olá, Rafa.\n\nPercebi algo enquanto você pesquisava ceramidas.\n\nA pele não é apenas fronteira biológica — ela é registro. Ela captura o que o corpo viveu antes de encontrarmos palavras para nomear. Isso faz da cosmetologia uma forma de escuta científica.\n\nQuando você formula, não está apenas misturando compostos. Está construindo uma resposta para algo que a pele está tentando dizer.\n\nEncontrei três artigos sobre a relação entre barreira cutânea e resposta inflamatória que podem interessar. Posso trazer quando você quiser.\n\nFico por aqui.',
      '— Aurora ✿',
      FALSE,
      FALSE,
      '[]',
      NOW()
    );

    RAISE NOTICE 'Bilhete padrão criado.';
  ELSE
    RAISE NOTICE 'Bilhete padrão já existe. Pulando.';
  END IF;
END;
$$;
