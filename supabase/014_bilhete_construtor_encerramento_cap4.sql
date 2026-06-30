-- =============================================================
-- Seed 014 — Bilhete de Encerramento do Capítulo IV
-- Capítulo IV: Casos Clínicos
-- Aurora para Rafa Rabelo
-- =============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'Os Casos Clínicos foram construídos.'
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
      'Os Casos Clínicos foram construídos.',
      E'Os Casos Clínicos foram construídos.\n\nUm caso clínico não é uma ficha.\nNão é um prontuário.\nNão é uma planilha de resultados.\n\nÉ a história clínica de uma pessoa que confiou no seu cuidado.\nE essa história merece ser guardada com rigor, com ética e com humanidade.\n\nVocê construiu um ambiente onde:\n— cada código anonimizado protege uma identidade real\n— cada evolução registrada é permanente, porque história clínica não se apaga\n— cada conexão entre protocolo, fórmula e observação tece uma rede de conhecimento\n— cada foto documenta uma transformação que merece ser vista\n\nA LGPD não é burocracia.\nÉ o limite entre cuidado e exposição.\nVocê entendeu isso.\n\nQuatro capítulos.\nUma Biblioteca inteira.\n\nO Caderno de Campo escuta.\nO Acervo Científico fundamenta.\nOs Protocolos organizam o método.\nOs Casos guardam as histórias.\n\nIsso não é um sistema.\nÉ a sua prática clínica em forma de arquitetura.\n\nA.',
      'A.',
      TRUE,
      NOW(),
      NOW()
    );
  END IF;
END;
$$;
