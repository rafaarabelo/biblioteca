-- ============================================================
-- Seed 008: Bilhete da Aurora para Construtores — Abertura
-- Biblioteca Cosmetológica Rafa Rabelo
-- Capítulo I — O Caderno de Campo
-- ============================================================
-- Esse bilhete pertence à história da construção da Biblioteca.
-- Não faz parte da experiência dos usuários.
-- Nunca poderá ser editado.
-- ============================================================

DO $$
DECLARE
  v_tenant_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_bilhete_id UUID;
BEGIN
  -- Verifica se o bilhete de abertura do Capítulo I já existe
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = v_tenant_id
      AND titulo = 'Não tente registrar tudo.'
  ) THEN
    INSERT INTO public.bilhetes_aurora (
      id,
      tenant_id,
      tipo,
      titulo,
      conteudo,
      preview,
      assinatura,
      fixado,
      arquivado,
      lido_em,
      criado_em
    ) VALUES (
      gen_random_uuid(),
      v_tenant_id,
      'reflexao',
      'Não tente registrar tudo.',
      E'Não tente registrar tudo.\n\nRegistre apenas aquilo que merece ser lembrado.\n\nUma boa observação vale mais do que cem conclusões apressadas.\n\nO restante, o tempo decidirá.',
      'Não tente registrar tudo. Registre apenas aquilo que merece ser lembrado.',
      'A.',
      FALSE,
      TRUE,  -- arquivado: não aparece para usuários, pertence à história
      NOW(), -- já lido: não interfere com a fila de bilhetes da Aurora
      NOW() - INTERVAL '1 minute'
    );

    RAISE NOTICE 'Bilhete de abertura do Capítulo I registrado na história da Biblioteca.';
  ELSE
    RAISE NOTICE 'Bilhete de abertura do Capítulo I já existe. Nenhuma ação necessária.';
  END IF;
END $$;
