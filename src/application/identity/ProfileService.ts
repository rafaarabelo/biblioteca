// ============================================================
// ProfileService — Application Service
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Use Cases para gestão de perfil de usuário.
// ============================================================

import type { IProfileRepository } from '@/domain/identity/ports/IProfileRepository'
import type { Profile } from '@/domain/identity/entities/Profile'
import { SupabaseProfileRepository } from '@/infrastructure/identity/SupabaseProfileRepository'
import { eventBus } from '@/infrastructure/eventBus/EventBus'
import { createProfileUpdatedEvent } from '@/domain/identity/events/IdentityEvents'

// ─────────────────────────────────────────────
// DTOs
// ─────────────────────────────────────────────
export interface GetProfileResult {
  profile: Profile | null
  error?: string
}

export interface UpdateProfileDto {
  userId: string
  nomeCompleto?: string | null
  bio?: string | null
  avatarUrl?: string | null
}

export interface UpdateProfileResult {
  success: boolean
  profile?: Profile
  error?: string
}

// ─────────────────────────────────────────────
// ProfileService
// ─────────────────────────────────────────────
export class ProfileService {
  private readonly profileRepo: IProfileRepository

  constructor(profileRepo?: IProfileRepository) {
    this.profileRepo = profileRepo ?? new SupabaseProfileRepository()
  }

  // ─── Use Case: Get Profile ─────────────────

  async getProfile(userId: string): Promise<GetProfileResult> {
    if (!userId) {
      return { profile: null, error: 'userId é obrigatório.' }
    }

    const profile = await this.profileRepo.findById(userId)

    if (!profile) {
      return { profile: null, error: 'Perfil não encontrado.' }
    }

    return { profile }
  }

  // ─── Use Case: Update Profile ──────────────

  async updateProfile(dto: UpdateProfileDto): Promise<UpdateProfileResult> {
    if (!dto.userId) {
      return { success: false, error: 'userId é obrigatório.' }
    }

    const profile = await this.profileRepo.findById(dto.userId)

    if (!profile) {
      return { success: false, error: 'Perfil não encontrado.' }
    }

    // Aplicar mutações (cada uma retorna nova instância — imutabilidade do domínio)
    const updatedFields: string[] = []
    let updated = profile

    if (dto.nomeCompleto !== undefined) {
      updated = updated.withNomeCompleto(dto.nomeCompleto)
      updatedFields.push('nome_completo')
    }

    if (dto.bio !== undefined) {
      updated = updated.withBio(dto.bio)
      updatedFields.push('bio')
    }

    if (dto.avatarUrl !== undefined) {
      updated = updated.withAvatarUrl(dto.avatarUrl)
      updatedFields.push('avatar_url')
    }

    if (updatedFields.length === 0) {
      return { success: true, profile }
    }

    // Persistir
    const saved = await this.profileRepo.save(updated)

    // Emitir evento de domínio
    await eventBus.publish(
      createProfileUpdatedEvent({
        userId: dto.userId,
        tenantId: saved.tenantId,
        fields: updatedFields,
      }),
    )

    return { success: true, profile: saved }
  }

  // ─── Use Case: Check Permission ────────────

  async canAccessClinicalData(userId: string): Promise<boolean> {
    const profile = await this.profileRepo.findById(userId)
    return profile?.canAccessClinicalData() ?? false
  }

  async isOwnerOrAdmin(userId: string): Promise<boolean> {
    const profile = await this.profileRepo.findById(userId)
    return profile?.isOwnerOrAdmin() ?? false
  }
}

export function createProfileService() {
  return new ProfileService()
}
