// ============================================================
// SupabaseProfileRepository — Implementação de IProfileRepository
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Camada de infraestrutura: traduz entre o domínio (Profile entity)
// e o Supabase PostgreSQL. Nenhuma regra de negócio mora aqui.
// ============================================================

import type { IProfileRepository } from '@/domain/identity/ports/IProfileRepository'
import { Profile } from '@/domain/identity/entities/Profile'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

// noUncheckedIndexedAccess + PostgREST types produzem 'never' em mutations.
// Este helper centraliza o cast — nenhum componente toca aqui.
const getDb = () => createClient() as any

export class SupabaseProfileRepository implements IProfileRepository {

  async findById(userId: string): Promise<Profile | null> {
    const supabase = getDb()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null

    return this.toDomain(data)
  }

  async findByTenantId(tenantId: string): Promise<Profile[]> {
    const supabase = getDb()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', tenantId)

    if (error || !data) return []

    return data.map((row: any) => this.toDomain(row))
  }

  async save(profile: Profile): Promise<Profile> {
    const supabase = getDb()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        nome_completo: profile.nomeCompleto,
        avatar_url: profile.avatarUrl,
        bio: profile.bio,
        preferencias: profile.preferencias,
        ultimo_acesso_em: profile.ultimoAcessoEm?.toISOString() ?? null,
      })
      .eq('id', profile.id)
      .select()
      .single()

    if (error || !data) {
      throw new Error(`Falha ao salvar profile: ${error?.message}`)
    }

    return this.toDomain(data)
  }

  async touchLastAccess(userId: string): Promise<void> {
    const supabase = getDb()

    const { error } = await supabase
      .from('profiles')
      .update({ ultimo_acesso_em: new Date().toISOString() })
      .eq('id', userId)

    if (error) {
      // Não lançar: atualização de último acesso não deve bloquear o login
      console.error('[ProfileRepository] Falha ao atualizar último acesso:', error.message)
    }
  }

  async hasRole(userId: string, role: string): Promise<boolean> {
    const supabase = getDb()

    const { data, error } = await supabase
      .from('profiles')
      .select('user_role')
      .eq('id', userId)
      .single()

    if (error || !data) return false

    return data.user_role === role
  }

  // ─────────────────────────────────────────────
  // Mapper: Database Row → Domain Entity
  // ─────────────────────────────────────────────
  private toDomain(row: ProfileRow): Profile {
    return Profile.create({
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
  }
}
