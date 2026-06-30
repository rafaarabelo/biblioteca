// ============================================================
// IAuthProvider — Port (Interface)
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Port para operações de autenticação.
// Implementação: SupabaseAuthAdapter (que usa GoTrue internamente)
// O domínio não conhece Supabase — apenas este contrato.
// ============================================================

export interface AuthUser {
  id: string
  email: string
  emailConfirmedAt: Date | null
  lastSignInAt: Date | null
  createdAt: Date
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  expiresAt: number
  user: AuthUser
}

export interface SignInResult {
  session: AuthSession | null
  user: AuthUser | null
  error: string | null
}

export interface SignOutResult {
  error: string | null
}

export interface ResetPasswordResult {
  error: string | null
}

export interface IAuthProvider {
  /**
   * Login com email e senha
   */
  signInWithPassword(email: string, password: string): Promise<SignInResult>

  /**
   * Logout — invalida sessão atual
   */
  signOut(): Promise<SignOutResult>

  /**
   * Envia magic link para reset de senha
   */
  resetPassword(
    email: string,
    options?: { redirectTo?: string },
  ): Promise<ResetPasswordResult>

  /**
   * Retorna o usuário atualmente autenticado
   * Retorna null se não autenticado
   */
  getUser(): Promise<AuthUser | null>

  /**
   * Retorna a sessão atual com tokens
   * Retorna null se não autenticado
   */
  getSession(): Promise<AuthSession | null>

  /**
   * Atualiza a senha do usuário autenticado
   */
  updatePassword(newPassword: string): Promise<{ error: string | null }>
}
