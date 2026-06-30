// ============================================================
// AuthService — Application Service
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Camada de aplicação: orquestra o domínio para casos de uso de auth.
// Não contém regras de negócio — delega ao domínio e à infraestrutura.
//
// Use Cases implementados:
//   - signIn: Login com email + senha
//   - signOut: Logout com limpeza de sessão
//   - requestPasswordReset: Magic link para reset de senha
//   - updatePassword: Atualização de senha após reset
// ============================================================

import type { IAuthProvider } from '@/domain/identity/ports/IAuthProvider'
import type { IProfileRepository } from '@/domain/identity/ports/IProfileRepository'
import { SupabaseAuthAdapter } from '@/infrastructure/identity/SupabaseAuthAdapter'
import { SupabaseProfileRepository } from '@/infrastructure/identity/SupabaseProfileRepository'
import { eventBus } from '@/infrastructure/eventBus/EventBus'
import {
  createUserSignedInEvent,
  createUserSignedOutEvent,
} from '@/domain/identity/events/IdentityEvents'
import type { AuthUser, AuthSession } from '@/domain/identity/ports/IAuthProvider'

// ─────────────────────────────────────────────
// DTOs de entrada / saída
// ─────────────────────────────────────────────
export interface SignInDto {
  email: string
  password: string
}

export interface SignInResult {
  success: boolean
  user?: AuthUser
  session?: AuthSession
  error?: string
}

export interface RequestPasswordResetDto {
  email: string
}

export interface RequestPasswordResetResult {
  success: boolean
  error?: string
}

export interface UpdatePasswordDto {
  newPassword: string
  confirmPassword: string
}

export interface UpdatePasswordResult {
  success: boolean
  error?: string
}

// ─────────────────────────────────────────────
// AuthService
// ─────────────────────────────────────────────
export class AuthService {
  private readonly authProvider: IAuthProvider
  private readonly profileRepo: IProfileRepository

  constructor(
    authProvider?: IAuthProvider,
    profileRepo?: IProfileRepository,
  ) {
    // Injeção de dependências com defaults (simple DI para MVP)
    this.authProvider = authProvider ?? new SupabaseAuthAdapter()
    this.profileRepo = profileRepo ?? new SupabaseProfileRepository()
  }

  // ─── Use Case: Sign In ────────────────────

  async signIn(dto: SignInDto): Promise<SignInResult> {
    // Validação básica de entrada
    if (!dto.email || !dto.password) {
      return { success: false, error: 'Email e senha são obrigatórios.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(dto.email)) {
      return { success: false, error: 'Email inválido.' }
    }

    // Executar autenticação
    const result = await this.authProvider.signInWithPassword(dto.email, dto.password)

    if (result.error || !result.user || !result.session) {
      return { success: false, error: result.error ?? 'Falha no login.' }
    }

    // Atualizar último acesso (não-bloqueante)
    void this.profileRepo.touchLastAccess(result.user.id)

    // Buscar profile para enriquecer o evento
    const profile = await this.profileRepo.findById(result.user.id)

    // Emitir evento de domínio (ADR-007: Aurora desacoplada)
    if (profile) {
      await eventBus.publish(
        createUserSignedInEvent({
          userId: result.user.id,
          email: result.user.email,
          tenantId: profile.tenantId,
          userRole: profile.userRole,
        }),
      )
    }

    return {
      success: true,
      user: result.user,
      session: result.session,
    }
  }

  // ─── Use Case: Sign Out ───────────────────

  async signOut(): Promise<{ success: boolean; error?: string }> {
    // Buscar usuário antes de deslogar (para o evento)
    const currentUser = await this.authProvider.getUser()
    const profile = currentUser ? await this.profileRepo.findById(currentUser.id) : null

    const result = await this.authProvider.signOut()

    if (result.error) {
      return { success: false, error: result.error }
    }

    // Emitir evento de domínio
    if (currentUser && profile) {
      await eventBus.publish(
        createUserSignedOutEvent({
          userId: currentUser.id,
          tenantId: profile.tenantId,
        }),
      )
    }

    return { success: true }
  }

  // ─── Use Case: Request Password Reset ────

  async requestPasswordReset(dto: RequestPasswordResetDto): Promise<RequestPasswordResetResult> {
    if (!dto.email) {
      return { success: false, error: 'Email é obrigatório.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(dto.email)) {
      return { success: false, error: 'Email inválido.' }
    }

    const result = await this.authProvider.resetPassword(dto.email)

    // Nota de segurança: mesmo que o email não exista, retornamos sucesso
    // para não vazar informação sobre quais emails estão cadastrados.
    if (result.error && result.error !== 'User not found') {
      return { success: false, error: result.error }
    }

    return { success: true }
  }

  // ─── Use Case: Update Password ────────────

  async updatePassword(dto: UpdatePasswordDto): Promise<UpdatePasswordResult> {
    if (dto.newPassword !== dto.confirmPassword) {
      return { success: false, error: 'As senhas não coincidem.' }
    }

    if (dto.newPassword.length < 8) {
      return { success: false, error: 'A senha deve ter ao menos 8 caracteres.' }
    }

    // Validação de força de senha
    const hasUpperCase = /[A-Z]/.test(dto.newPassword)
    const hasNumber = /[0-9]/.test(dto.newPassword)
    if (!hasUpperCase || !hasNumber) {
      return {
        success: false,
        error: 'A senha deve conter ao menos uma letra maiúscula e um número.',
      }
    }

    const result = await this.authProvider.updatePassword(dto.newPassword)

    if (result.error) {
      return { success: false, error: result.error }
    }

    return { success: true }
  }

  // ─── Helper: Get Current User ─────────────

  async getCurrentUser() {
    return this.authProvider.getUser()
  }

  async getCurrentSession() {
    return this.authProvider.getSession()
  }
}

// Singleton para uso em Server Actions (nova instância por request no Next.js)
export function createAuthService() {
  return new AuthService()
}
