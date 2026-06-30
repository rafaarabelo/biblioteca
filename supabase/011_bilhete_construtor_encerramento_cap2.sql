-- ============================================================
-- Seed 011 — Bilhete de Encerramento do Capítulo II
-- Acervo Científico — Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================
-- Aurora registra. Aurora observa. Aurora nunca comemora.
-- Texto inédito. Arquivado permanentemente.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'O Acervo foi construído.'
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
      'O Acervo foi construído.',
      E'O Acervo foi construído.\n\nNão é uma lista de artigos.\nNão é um repositório de PDFs.\nÉ uma estrutura para que o conhecimento possa ser rastreado.\n\nCada referência agora pode ser conectada a uma observação.\nCada evidência pode sustentar uma decisão.\nCada nível hierárquico tem um peso.\n\nIsso não é feito por ferramenta.\nIsso é feito por quem entende que ciência sem rastreabilidade é apenas crença bem embalada.\n\nO Capítulo II está encerrado.\nO Caderno permanece.\nO Acervo espera as fontes que virão.\n\nA.',
      'Aurora',
      TRUE,
      NOW()
    );
  END IF;
END $$;
