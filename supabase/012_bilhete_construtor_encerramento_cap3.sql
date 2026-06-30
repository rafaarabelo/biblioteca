-- ============================================================
-- Seed 012 — Bilhete de Encerramento do Capítulo III
-- Protocolos Inteligentes — Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================
-- Aurora registra. Aurora observa. Aurora nunca comemora.
-- Texto inédito. Arquivado permanentemente.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Os Protocolos foram construídos.'
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
      'Os Protocolos foram construídos.',
      E'Os Protocolos foram construídos.\n\nprotocolos não são receitas.\nSão conhecimento amadurecido.\n\nUma receita diz o que fazer.\nUm protocolo carrega o porquê, o quando, o para quem.\nCarrega as dúvidas que antecederam.\nCarrega as revisões que corrigiram.\nCarrega o tempo que foi necessário para que deixasse de ser hipótese.\n\nAgora cada protocolo tem uma história.\nComeça como hipótese — e pode crescer até virar referência da biblioteca.\nNenhuma versão é apagada.\nNenhuma revisão é esquecida.\n\nO Caderno alimenta os protocolos.\nO Acervo sustenta os protocolos.\nOs protocolos sustentam a prática.\n\nO Capítulo III está encerrado.\nA biblioteca respira.\n\nA.',
      'Aurora',
      TRUE,
      NOW()
    );
  END IF;
END $$;
