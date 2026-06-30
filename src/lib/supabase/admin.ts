// ============================================================
// Supabase Admin Client (Service Role)
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// ATENÇÃO: Este client usa a service_role key — bypassa RLS completamente.
// Usar APENAS em:
//   - Edge Functions (server-side, nunca exposto ao browser)
//   - Server Actions que precisam de operações administrativas
//   - Scripts de migração e seed
//   - LGPD delete (Sprint 5.3 — requer bypass de RLS)
//   - Aurora pipeline (Sprint 11 — aurora_context e bilhetes_aurora)
//
// NUNCA:
//   - Exportar para código client-side
//   - Usar em Client Components
//   - Logar a service_role key
// ============================================================

import 'server-only'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Singleton: uma instância por processo do servidor
let adminClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function createAdminClient() {
  if (adminClient) return adminClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY não configurada. ' +
      'Esta variável é necessária para operações administrativas e nunca deve ser exposta ao cliente.'
    )
  }

  adminClient = createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      // Admin client nunca persiste sessão — opera como service
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'x-client-info': 'biblioteca-admin/0.2.0',
      },
    },
  })

  return adminClient
}

// ─────────────────────────────────────────────
// Helper: createAdminClientForEdgeFunction
// Para uso em Edge Functions onde não há singleton
// ─────────────────────────────────────────────
export function createAdminClientForEdgeFunction(
  supabaseUrl: string,
  serviceRoleKey: string,
) {
  return createSupabaseClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
