-- ============================================================
-- Seed 013 — Bilhete de Abertura do Capítulo IV
-- Casos Clínicos — Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================
-- Aurora registra. Aurora observa. Aurora nunca comemora.
-- Texto inédito. Arquivado permanentemente.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Todo caso clínico começa como uma pessoa.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      tenant_id,
      tipo,
      titulo,
      conteudo,
      assinatura,
      arquivado,
      lido_em
    )
    VALUES (
      'a0000000-0000-0000-0000-000000000001',
      'reflexao',
      'Todo caso clínico começa como uma pessoa.',
      E'Todo caso clínico começa como uma pessoa.\nNunca permita que ela se transforme apenas em um registro.\n\nA.',
      'Aurora',
      TRUE,
      NOW()
    );
  END IF;
END $$;
