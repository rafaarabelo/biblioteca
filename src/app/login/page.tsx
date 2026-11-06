// ============================================================
// Login Page — Next.js App Router
// A Biblioteca — Sprint 2
// ============================================================

'use client'

import { Suspense } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, type LoginFormState } from './actions'

const initialState: LoginFormState = {}

// ─────────────────────────────────────────────
// Campos do formulário — lê o estado de envio
// via useFormStatus (React 18 / Next 14).
// Precisa ser um componente filho do <form>.
// ─────────────────────────────────────────────
function LoginFields({ state, next }: { state: LoginFormState; next: string }) {
  const { pending } = useFormStatus()

  return (
    <>
      <input type="hidden" name="next" value={next} />

      <div className="form-field">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="seu@email.com"
          className="form-input"
          disabled={pending}
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </div>

      <div className="form-field">
        <div className="form-label-row">
          <label htmlFor="password" className="form-label">
            Senha
          </label>
          <Link href="/forgot-password" className="form-label-link" tabIndex={0}>
            Esqueceu a senha?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="form-input"
          disabled={pending}
          aria-describedby={state.error ? 'login-error' : undefined}
        />
      </div>

      {/* Mensagem de erro */}
      {state.error && (
        <div id="login-error" className="form-error" role="alert" aria-live="assertive">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}

      {/* Botão */}
      <button
        type="submit"
        className="btn-primary"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Entrando...
          </>
        ) : (
          'Entrar'
        )}
      </button>
    </>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const [state, formAction] = useFormState(signIn, initialState)
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/hoje'

  return (
    <div className="login-root">
      <div className="login-card">
        {/* Marca */}
        <header className="login-header">
          <div className="login-logo" aria-label="A Biblioteca">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="40" height="40" rx="8" fill="var(--terracota-500)" />
              <path
                d="M12 10h10a6 6 0 0 1 0 12H12V10ZM12 22h12a6 6 0 0 1 0 12H12V22Z"
                fill="white"
                opacity="0.9"
              />
            </svg>
          </div>
          <h1 className="login-title">A Biblioteca</h1>
          <p className="login-subtitle">Acesse seu acervo científico</p>
        </header>

        {/* Formulário */}
        <form action={formAction} noValidate>
          <LoginFields state={state} next={next} />
        </form>
      </div>

      {/* Rodapé */}
      <footer className="login-footer">
        <p>Acesso restrito. Plataforma privada de Rafa Rabelo.</p>
      </footer>

      <style>{`
        .login-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          background-color: var(--background);
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-3);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .login-logo {
          display: inline-flex;
          margin-bottom: var(--space-4);
        }

        .login-title {
          font-family: var(--font-serif);
          font-size: 1.375rem;
          font-weight: 500;
          color: var(--foreground);
          margin-bottom: var(--space-1);
          letter-spacing: -0.01em;
        }

        .login-subtitle {
          font-size: 0.875rem;
          color: var(--muted-fg);
        }

        .form-field {
          margin-bottom: var(--space-4);
        }

        .form-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-1);
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--foreground);
          margin-bottom: var(--space-1);
        }

        .form-label-row .form-label {
          margin-bottom: 0;
        }

        .form-label-link {
          font-size: 0.8125rem;
          color: var(--primary);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .form-label-link:hover {
          color: var(--primary-hover);
          text-decoration: underline;
        }

        .form-input {
          width: 100%;
          padding: 0.625rem var(--space-3);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--background);
          color: var(--foreground);
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
          outline: none;
        }

        .form-input::placeholder {
          color: var(--muted-fg);
        }

        .form-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(196, 95, 58, 0.12);
        }

        .form-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-error {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--error-bg);
          color: var(--error);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          margin-bottom: var(--space-4);
          border: 1px solid rgba(192, 57, 43, 0.15);
        }

        .btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          padding: 0.6875rem var(--space-4);
          background: var(--primary);
          color: var(--primary-fg);
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-sans);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast), transform var(--transition-fast);
          margin-top: var(--space-2);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .btn-primary:active:not(:disabled) {
          transform: scale(0.99);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-footer {
          margin-top: var(--space-6);
          text-align: center;
        }

        .login-footer p {
          font-size: 0.75rem;
          color: var(--muted-fg);
        }
      `}</style>
    </div>
  )
}
