'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { AuthShell } from '@/features/auth/auth-shell'
import { createBrowserSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'

function AuthCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/lobby/'
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setError('Supabase não configurado.')
      return
    }

    const supabase = createBrowserSupabaseClient()

    async function finishAuth() {
      const code = searchParams.get('code')

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          setError(exchangeError.message)
          return
        }
        router.replace(next)
        return
      }

      const { data, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        setError(sessionError.message)
        return
      }

      if (data.session) {
        router.replace(next)
        return
      }

      setError('Sessão não encontrada. Tente entrar novamente.')
    }

    void finishAuth()
  }, [router, searchParams, next])

  return (
    <AuthShell title="Autenticando" subtitle="Finalizando login com PKCE…">
      {error ? (
        <Alert variant="destructive" data-testid="auth-callback-error">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <p className="text-center text-sm text-[var(--steel-light)]" data-testid="auth-callback-loading">
          Aguarde…
        </p>
      )}
    </AuthShell>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <AuthShell title="Autenticando" subtitle="Carregando…">
          <p className="text-center text-sm text-[var(--steel-light)]">Aguarde…</p>
        </AuthShell>
      }
    >
      <AuthCallbackInner />
    </Suspense>
  )
}
