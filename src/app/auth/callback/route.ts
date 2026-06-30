// ============================================================
// Auth Callback — Route Handler
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Processa o callback do Supabase Auth (magic links, OAuth, etc.)
// Supabase redireciona para esta rota com um `code` na query string.
// Esta rota troca o code por uma sessão e redireciona o usuário.
// ============================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/mesa'
  const errorParam = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // Erro retornado pelo Supabase Auth (ex: link expirado)
  if (errorParam) {
    const errorUrl = new URL('/login', origin)
    errorUrl.searchParams.set(
      'error',
      errorDescription ?? 'Link inválido ou expirado. Solicite um novo.',
    )
    return NextResponse.redirect(errorUrl)
  }

  if (!code) {
    // Sem code — redirecionar para login com mensagem
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', 'Link inválido. Solicite um novo email de recuperação.')
    return NextResponse.redirect(loginUrl)
  }

  // Trocar o code por sessão
  const supabase = createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set(
      'error',
      error.message === 'Token has expired or is invalid'
        ? 'O link expirou. Solicite um novo.'
        : 'Falha ao processar o link. Tente novamente.',
    )
    return NextResponse.redirect(loginUrl)
  }

  // Sanitizar o `next` para evitar open redirect
  const safeNext = next.startsWith('/') ? next : '/mesa'

  return NextResponse.redirect(new URL(safeNext, origin))
}
