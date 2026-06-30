// ============================================================
// Middleware de Autenticação — Next.js
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================
// Responsável por:
//   1. Refresh automático do token Supabase em cada request
//   2. Proteção de rotas: redirecionar não-autenticados para /login
//   3. Redirecionar autenticados para fora de /login e /forgot-password
//
// O middleware não valida permissões — apenas presença de sessão.
// Validação de roles acontece nos Server Components e Server Actions.
// ============================================================

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que NÃO precisam de autenticação
const PUBLIC_ROUTES = [
  '/login',
  '/forgot-password',
  '/auth/callback',
  '/auth/confirm',
]

// Rotas de assets estáticos (nunca interceptar)
const STATIC_PATTERNS = [
  '/_next/',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
]

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname.startsWith(route))
}

function isStaticAsset(pathname: string): boolean {
  return STATIC_PATTERNS.some((pattern) => pathname.startsWith(pattern))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Nunca interceptar assets estáticos
  if (isStaticAsset(pathname)) {
    return NextResponse.next()
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Criar client Supabase com cookie management para o middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Setar cookie no request e na response (para refresh token)
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    },
  )

  // Refresh do token (mantém sessão ativa)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthenticated = !!user

  // ─── Lógica de redirecionamento ────────────

  // 1. Usuário não autenticado tenta acessar rota protegida
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    const redirectUrl = new URL('/login', request.url)
    // Preservar a URL original para redirect pós-login
    if (pathname !== '/') {
      redirectUrl.searchParams.set('next', pathname)
    }
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Usuário autenticado tenta acessar /login ou /forgot-password
  if (isAuthenticated && (pathname === '/login' || pathname === '/forgot-password')) {
    return NextResponse.redirect(new URL('/mesa', request.url))
  }

  // 3. Raiz / redireciona para /mesa (autenticado) ou /login (não autenticado)
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/mesa', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return response
}

// Configuração do matcher — quais paths o middleware intercepta
export const config = {
  matcher: [
    /*
     * Interceptar todos os paths EXCETO:
     * - _next/static (arquivos estáticos do Next.js)
     * - _next/image (otimização de imagem)
     * - favicon.ico
     * - Arquivos com extensão (png, jpg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
