-- =============================================================
-- Seed 015 — Bilhete de Abertura do Capítulo V
-- Capítulo V: Fórmulas
-- Aurora para Rafa Rabelo
-- =============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Nenhuma fórmula nasce pronta.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      id,
      tenant_id,
      tipo,
      titulo,
      conteudo,
      assinatura,
      arquivado,
      lido_em,
      criado_em
    )
    VALUES (
      gen_random_uuid(),
      'a0000000-0000-0000-0000-000000000001',
      'marco',
      'Nenhuma fórmula nasce pronta.',
      E'Nenhuma fórmula nasce pronta.\nCada versão carrega a memória das anteriores.\nO que muda não é apenas a composição.\nMuda também aquilo que aprendemos com ela.\n\nA.',
      'A.',
      TRUE,
      NOW(),
      NOW()
    );
  END IF;
END;
$$;
