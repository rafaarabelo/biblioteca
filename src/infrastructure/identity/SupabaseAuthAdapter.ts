// ============================================================
// SupabaseAuthAdapter — Implementação de IAuthProvider
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Camada de infraestrutura: traduz entre o domínio (IAuthProvider)
// e o Supabase GoTrue. Nenhuma regra de negócio mora aqui.
// ============================================================

import type {
  IAuthProvider,
  AuthUser,
  AuthSession,
  SignInResult,
  SignOutResult,
  ResetPasswordResult,
} from '@/domain/identity/ports/IAuthProvider'
import { createClient } from '@/lib/supabase/server'

export class SupabaseAuthAdapter implements IAuthProvider {
  async signInWithPassword(email: string, password: string): Promise<SignInResult> {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { session: null, user: null, error: this.translateError(error.message) }
    }

    if (!data.user || !data.session) {
      return { session: null, user: null, error: 'Login falhou. Verifique suas credenciais.' }
    }

    return {
      session: this.mapSession(data.session),
      user: this.mapUser(data.user),
      error: null,
    }
  }

  async signOut(): Promise<SignOutResult> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    return { error: error?.message ?? null }
  }

  async resetPassword(
    email: string,
    options?: { redirectTo?: string },
  ): Promise<ResetPasswordResult> {
    const supabase = createClient()

    const redirectTo = options?.redirectTo ??
      `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/atualizar-senha`

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    })

    if (error) {
      return { error: this.translateError(error.message) }
    }

    return { error: null }
  }

  async getUser(): Promise<AuthUser | null> {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) return null

    return this.mapUser(user)
  }

  async getSession(): Promise<AuthSession | null> {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session) return null

    return this.mapSession(session)
  }

  async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    return { error: error ? this.translateError(error.message) : null }
  }

  // ─────────────────────────────────────────────
  // Mappers: Supabase types → Domain types
  // ─────────────────────────────────────────────

  private mapUser(user: {
    id: string
    email?: string | null
    email_confirmed_at?: string | null
    last_sign_in_at?: string | null
    created_at: string
  }): AuthUser {
    return {
      id: user.id,
      email: user.email ?? '',
      emailConfirmedAt: user.email_confirmed_at ? new Date(user.email_confirmed_at) : null,
      lastSignInAt: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
      createdAt: new Date(user.created_at),
    }
  }

  private mapSession(session: {
    access_token: string
    refresh_token: string
    expires_at?: number | null
    user: {
      id: string
      email?: string | null
      email_confirmed_at?: string | null
      last_sign_in_at?: string | null
      created_at: string
    }
  }): AuthSession {
    return {
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
      expiresAt: session.expires_at ?? 0,
      user: this.mapUser(session.user),
    }
  }

  // ─────────────────────────────────────────────
  // Tradução de erros para português
  // ─────────────────────────────────────────────

  private translateError(message: string): string {
    const translations: Record<string, string> = {
      'Invalid login credentials': 'Email ou senha incorretos.',
      'Email not confirmed': 'Confirme seu email antes de entrar.',
      'User not found': 'Usuário não encontrado.',
      'Password should be at least 6 characters': 'A senha deve ter ao menos 6 caracteres.',
      'Signup is disabled': 'Cadastro de novos usuários está desabilitado.',
      'Too many requests': 'Muitas tentativas. Aguarde alguns minutos e tente novamente.',
      'Token has expired or is invalid': 'O link expirou. Solicite um novo.',
      'New password should be different from the old password': 'A nova senha deve ser diferente da atual.',
    }

    return translations[message] ?? 'Ocorreu um erro. Tente novamente.'
  }
}
