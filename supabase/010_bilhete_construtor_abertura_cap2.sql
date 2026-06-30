-- ============================================================
-- Seed 010 — Bilhete de Abertura do Capítulo II
-- Biblioteca Cosmetológica Rafa Rabelo
-- Capítulo II — O Acervo Científico
-- ============================================================
-- Bilhete imutável da Aurora para os construtores da Biblioteca.
-- Pertence ao histórico da construção, não à experiência do usuário.
-- Arquivado e lido: invisível na fila de bilhetes.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Toda boa observação merece uma fonte.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      tenant_id,
      tipo,
      titulo,
      conteudo,
      assinatura,
      arquivado,
      lido_em
    ) VALUES (
      'a0000000-0000-0000-0000-000000000001',
      'reflexao',
      'Toda boa observação merece uma fonte.',
      'Toda boa observação merece uma fonte.
Nem toda fonte merece confiança.
Aprender também é escolher em quem acreditar.

— A.',
      'A.',
      TRUE,
      NOW()
    );
  END IF;
END $$;
