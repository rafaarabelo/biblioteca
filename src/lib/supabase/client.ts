// ============================================================
// Supabase Browser Client
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Usar em: Client Components ("use client")
// NÃO usar em: Server Components, Route Handlers, Server Actions
// Para SSR: usar src/lib/supabase/server.ts
// ============================================================

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Singleton: garante uma única instância por session de browser
let client: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (client) return client

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Variáveis de ambiente Supabase não configuradas. ' +
      'Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local'
    )
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Persistir sessão no localStorage
      persistSession: true,
      // Auto-refresh do token antes de expirar
      autoRefreshToken: true,
      // Detectar mudança de sessão em outras abas
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        // Identificar a origem das requisições no audit_log
        'x-client-info': 'biblioteca-web/0.2.0',
      },
    },
  })

  return client
}

// Conveniência: export default para uso direto em client components simples
// Para a maioria dos casos, prefira importar createClient() e chamar.
export default createClient
