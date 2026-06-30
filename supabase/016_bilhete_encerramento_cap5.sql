-- Seed 016 — Bilhete de Encerramento do Capítulo V: Fórmulas
-- Capítulo V oficialmente encerrado.
-- Este bilhete é permanente. Nunca poderá ser alterado.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Uma fórmula não é uma lista de ingredientes.'
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
    ) VALUES (
      gen_random_uuid(),
      'a0000000-0000-0000-0000-000000000001',
      'marco',
      'Uma fórmula não é uma lista de ingredientes.',
      E'Uma fórmula não é uma lista de ingredientes.\nÉ a soma de tudo que se aprendeu sobre uma pele,\num objetivo, uma resposta que ainda não chegou.\n\nCada versão carrega a memória das decisões anteriores.\nO que mudou não é apenas a composição.\nMudou também a pesquisadora que a escreveu.\n\nA.',
      'A.',
      TRUE,
      NOW(),
      NOW()
    );
  END IF;
END;
$$;
