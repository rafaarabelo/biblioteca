// ============================================================
// Forgot Password Page — Next.js App Router
// Biblioteca Cosmetológica Rafa Rabelo — Sprint 2
// ============================================================

'use client'

import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { requestPasswordReset, type ResetPasswordFormState } from '../login/actions'

const initialState: ResetPasswordFormState = {}

// ─────────────────────────────────────────────
// Campos do formulário — lê o estado de envio
// via useFormStatus (React 18 / Next 14).
// Precisa ser um componente filho do <form>.
// ─────────────────────────────────────────────
function ResetFields({ state }: { state: ResetPasswordFormState }) {
  const { pending } = useFormStatus()

  return (
    <>
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
          aria-describedby={state.error ? 'reset-error' : undefined}
        />
      </div>

      {state.error && (
        <div id="reset-error" className="form-error" role="alert" aria-live="assertive">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3M8 11h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {state.error}
        </div>
      )}

      <button
        type="submit"
        className="btn-primary"
        disabled={pending}
        aria-busy={pending}
      >
        {pending ? (
          <>
            <span className="btn-spinner" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          'Enviar instruções'
        )}
      </button>
    </>
  )
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useFormState(requestPasswordReset, initialState)

  return (
    <div className="page-root">
      <div className="page-card">
        {/* Cabeçalho */}
        <header className="page-header">
          <Link href="/login" className="back-link" aria-label="Voltar para o login">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Voltar
          </Link>
          <h1 className="page-title">Recuperar acesso</h1>
          <p className="page-subtitle">
            Informe seu email e enviaremos as instruções para redefinir sua senha.
          </p>
        </header>

        {/* Formulário */}
        {state.success ? (
          <div className="success-message" role="status" aria-live="polite">
            <div className="success-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="var(--success-bg)" stroke="var(--success)" strokeWidth="1.5" />
                <path d="M7.5 12l3 3 6-6" stroke="var(--success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="success-text">
              {state.message ?? 'Se o email estiver cadastrado, você receberá as instruções em breve.'}
            </p>
            <Link href="/login" className="btn-secondary" style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
              Voltar para o login
            </Link>
          </div>
        ) : (
          <form action={formAction} noValidate>
            <ResetFields state={state} />
          </form>
        )}
      </div>

      <style>{`
        .page-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--space-4);
          background-color: var(--background);
        }

        .page-card {
          width: 100%;
          max-width: 400px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-3);
        }

        .page-header {
          margin-bottom: var(--space-6);
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: var(--space-1);
          font-size: 0.875rem;
          color: var(--muted-fg);
          text-decoration: none;
          margin-bottom: var(--space-4);
          transition: color var(--transition-fast);
        }

        .back-link:hover {
          color: var(--foreground);
        }

        .page-title {
          font-family: var(--font-serif);
          font-size: 1.375rem;
          font-weight: 500;
          color: var(--foreground);
          margin-bottom: var(--space-2);
          letter-spacing: -0.01em;
        }

        .page-subtitle {
          font-size: 0.9rem;
          color: var(--muted-fg);
          line-height: 1.5;
        }

        .form-field {
          margin-bottom: var(--space-4);
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--foreground);
          margin-bottom: var(--space-1);
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
          transition: background-color var(--transition-fast);
          margin-top: var(--space-2);
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-hover);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: 0.5625rem var(--space-4);
          background: var(--muted);
          color: var(--foreground);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color var(--transition-fast);
          text-align: center;
        }

        .btn-secondary:hover {
          background: var(--border);
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

        .success-message {
          text-align: center;
          padding: var(--space-4) 0;
        }

        .success-icon {
          margin-bottom: var(--space-3);
        }

        .success-text {
          font-size: 0.9375rem;
          color: var(--foreground);
          line-height: 1.5;
        }
      `}</style>
    </div>
  )
}
