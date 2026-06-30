-- ============================================================
-- Seed 006: Usuário Owner — Ambiente de Desenvolvimento
-- Biblioteca Cosmetológica Rafa Rabelo
-- ============================================================
-- ATENÇÃO: APENAS PARA DEV LOCAL. NUNCA EXECUTAR EM PRODUÇÃO.
-- Em produção, criar o usuário via Supabase Dashboard:
--   Authentication > Users > Invite user
--   Email: a.rafaelarabelo@gmail.com
--   Role: owner (definida pelo trigger on_auth_user_created)
-- ============================================================
--
-- Como funciona:
--   1. Insere diretamente em auth.users (disponível apenas em dev local)
--   2. O trigger on_auth_user_created (migration 011) cria automaticamente:
--      - Um novo tenant para o usuário
--      - O profile com user_role = 'owner'
--      - Configurações padrão do tenant
--
-- Credenciais de desenvolvimento:
--   Email:  dev@biblioteca.local
--   Senha:  Biblioteca@2026!  (alterar após primeiro login)
--
-- Para fazer login local:
--   supabase start
--   Acessar http://localhost:3000/login
--   Usar as credenciais acima
--
-- Para criar o usuário owner de produção:
--   Supabase Dashboard > Authentication > Users > Add user
--   Email: a.rafaelarabelo@gmail.com
--   Password: (definir senha segura)
--   O trigger cria profile + tenant automaticamente.
-- ============================================================

DO $$
DECLARE
  v_user_id     UUID := 'b0000000-0000-0000-0000-000000000001';  -- UUID fixo para dev
  v_tenant_id   UUID;
BEGIN
  -- Só inserir se não existir (idempotente)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_user_id) THEN

    -- Inserir usuário no schema auth do Supabase
    -- NOTA: bcrypt hash de 'Biblioteca@2026!'
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'dev@biblioteca.local',
      crypt('Biblioteca@2026!', gen_salt('bf')),
      NOW(),  -- email já confirmado em dev
      '{"provider": "email", "providers": ["email"]}'::JSONB,
      '{"full_name": "Rafa Rabelo (Dev)"}'::JSONB,
      NOW(),
      NOW(),
      'authenticated',
      'authenticated'
    );

    -- O trigger on_auth_user_created cuida do resto:
    -- Cria tenant + configuracoes_tenant + profile automaticamente.

    -- Recuperar o tenant criado pelo trigger
    SELECT tenant_id INTO v_tenant_id
    FROM public.profiles
    WHERE id = v_user_id;

    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Usuário owner de dev criado com sucesso.';
    RAISE NOTICE 'User ID:   %', v_user_id;
    RAISE NOTICE 'Tenant ID: %', v_tenant_id;
    RAISE NOTICE 'Email:     dev@biblioteca.local';
    RAISE NOTICE 'Senha:     Biblioteca@2026!';
    RAISE NOTICE 'ALTERAR A SENHA APÓS O PRIMEIRO LOGIN.';
    RAISE NOTICE '=======================================================';

  ELSE
    RAISE NOTICE 'Usuário owner de dev já existe (id: %). Pulando.', v_user_id;
  END IF;
END;
$$;

-- ─────────────────────────────────────────────
-- Verificação pós-seed
-- ─────────────────────────────────────────────
-- Execute esta query para confirmar que tudo foi criado corretamente:
--
-- SELECT
--   u.email,
--   p.user_role,
--   p.nome_completo,
--   t.nome AS tenant_nome,
--   t.slug AS tenant_slug
-- FROM auth.users u
-- JOIN public.profiles p ON p.id = u.id
-- JOIN public.tenants t ON t.id = p.tenant_id
-- WHERE u.email = 'dev@biblioteca.local';
