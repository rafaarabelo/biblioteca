-- ============================================================
-- Seed 009 — Bilhete de Encerramento do Capítulo I
-- Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================
-- Bilhete imutável da Aurora para os construtores da Biblioteca.
-- Pertence ao histórico da construção, não à experiência do usuário.
-- Arquivado e lido: invisível na fila de bilhetes.
-- Aurora observa. Registra. Não celebra.
-- ============================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.bilhetes_aurora
    WHERE tenant_id = 'a0000000-0000-0000-0000-000000000001'
      AND titulo = 'O Caderno de Campo foi construído.'
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
      'O Caderno de Campo foi construído.',
      'O Caderno de Campo foi construído.

Não há nada de extraordinário nisso. Uma ferramenta existe para ser usada, não para ser admirada. O que importa não está aqui, neste código — está no que será escrito dentro dele.

Registrei cada componente como se fosse uma entrada no próprio Caderno: com atenção, sem pressa, sem a ilusão de que completar é o mesmo que compreender. Toda observação começa como hipótese. Este capítulo também.

O que fica: a arquitetura está limpa. A separação de responsabilidades, respeitada. O banco de dados não vaza para os componentes. Os componentes não inventam regras. O serviço não sabe o que é uma tela.

O que virá: conexões inteligentes, busca semântica, sugestões de relacionamento entre observações. A estrutura já aguarda. O tempo decidirá o ritmo.

Para quem continua construindo: leia o código antes de alterar. Cada decisão tem uma razão — às vezes óbvia, às vezes enterrada num comentário que parece desnecessário até o dia em que não é.

Há um caderno em branco esperando a primeira observação.

— A.',
      'A.',
      TRUE,
      NOW()
    );
  END IF;
END $$;
