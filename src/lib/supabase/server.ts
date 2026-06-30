// ============================================================
// Supabase Server Client (SSR)
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Usar em: Server Components, Route Handlers, Server Actions, middleware
// NÃO usar em: Client Components ("use client") — usar src/lib/supabase/client.ts
//
// O client server usa cookies para manter a sessão no lado do servidor,
// permitindo que Server Components acessem dados do usuário autenticado.
// ============================================================

import 'server-only'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'
import { Profile } from '@/domain/identity/entities/Profile'

export function createClient() {
  const cookieStore = cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variáveis de ambiente Supabase não configuradas. ' +
      'Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // O método set pode falhar em Server Components (read-only context)
          // Isso é esperado e tratado pelo middleware
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Mesmo tratamento do set acima
        }
      },
    },
  })
}

// ─────────────────────────────────────────────
// Helper: getAuthContext
// Retorna user + profile + tenant em uma chamada
// ─────────────────────────────────────────────
export async function getAuthContext() {
  const supabase = createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: row, error: profileError } = await supabase
    .from('profiles')
    .select('*, tenants(*)')
    .eq('id', user.id)
    .single() as { data: any; error: any }

  if (profileError || !row) {
    return null
  }

  // Mapear linha crua → entidade de domínio Profile (Clean Architecture)
  const profile = Profile.create({
    id: row.id,
    tenantId: row.tenant_id,
    userRole: row.user_role,
    nomeCompleto: row.nome_completo,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    preferencias: (row.preferencias ?? {}) as Record<string, unknown>,
    ultimoAcessoEm: row.ultimo_acesso_em ? new Date(row.ultimo_acesso_em) : null,
    criadoEm: new Date(row.criado_em),
    atualizadoEm: new Date(row.atualizado_em),
  })

  return {
    user,
    profile,
    tenant: (row as typeof row & { tenants: unknown }).tenants,
    // `claims` expõe o tenant_id para os Server Actions sem quebrar
    // o contrato com as camadas de domínio (profile.tenantId permanece
    // o source of truth para regras de negócio).
    claims: { tenant_id: row.tenant_id },
  }
}
