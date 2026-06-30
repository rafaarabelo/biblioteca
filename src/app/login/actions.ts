// ============================================================
// Login — Server Actions
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Server Actions são executados no servidor — acessam secrets,
// fazem chamadas ao banco, e retornam resultados para o cliente.
// ============================================================

'use server'

import { redirect } from 'next/navigation'
import { createAuthService } from '@/application/identity/AuthService'

export interface LoginFormState {
  error?: string
  success?: boolean
}

// ─────────────────────────────────────────────
// Action: signIn
// ─────────────────────────────────────────────
export async function signIn(
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString() ?? ''
  const next = formData.get('next')?.toString() ?? '/mesa'

  const authService = createAuthService()
  const result = await authService.signIn({ email, password })

  if (!result.success) {
    return { error: result.error ?? 'Falha no login.' }
  }

  // Redirecionar para a página solicitada (ou mesa)
  redirect(next)
}

// ─────────────────────────────────────────────
// Action: signOut
// ─────────────────────────────────────────────
export async function signOut(): Promise<void> {
  const authService = createAuthService()
  await authService.signOut()
  redirect('/login')
}

// ─────────────────────────────────────────────
// Action: requestPasswordReset
// ─────────────────────────────────────────────
export interface ResetPasswordFormState {
  error?: string
  success?: boolean
  message?: string
}

export async function requestPasswordReset(
  _prevState: ResetPasswordFormState,
  formData: FormData,
): Promise<ResetPasswordFormState> {
  const email = formData.get('email')?.toString().trim() ?? ''

  const authService = createAuthService()
  const result = await authService.requestPasswordReset({ email })

  if (!result.success) {
    return { error: result.error ?? 'Falha ao enviar email.' }
  }

  return {
    success: true,
    message: 'Se o email estiver cadastrado, você receberá as instruções em breve.',
  }
}
