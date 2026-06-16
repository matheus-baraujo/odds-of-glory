'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLink, AuthShell } from '@/features/auth/auth-shell'
import { withBasePath } from '@/lib/paths'
import { createBrowserSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'

const AUTH_NEXT_KEY = 'auth_next'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/lobby/'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleEmailLogin(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        return
      }
      router.replace(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao entrar.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setError(null)
    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      sessionStorage.setItem(AUTH_NEXT_KEY, next)
      const redirectTo = `${window.location.origin}${withBasePath('/auth/callback/')}`
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
      if (authError) setError(authError.message)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar login com Google.')
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <AuthShell title="Entrar" subtitle="Configure as variáveis de ambiente do Supabase para continuar.">
        <Alert variant="destructive">
          <AlertDescription>
            Copie <code className="text-sm">.env.example</code> para{' '}
            <code className="text-sm">.env.local</code> e preencha{' '}
            <code className="text-sm">NEXT_PUBLIC_SUPABASE_URL</code> e{' '}
            <code className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </AlertDescription>
        </Alert>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Entrar"
      subtitle="Acesse sua mesa no Odds of Glory com email ou Google."
      footer={
        <p>
          Ainda não tem conta? <AuthLink href="/register/">Criar conta</AuthLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleEmailLogin} data-testid="login-form">
        {error ? (
          <Alert variant="destructive" data-testid="login-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="login-email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="login-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading} data-testid="login-submit">
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[var(--parchment-deep)]" />
        </div>
        <div className="relative flex justify-center text-sm uppercase tracking-wider">
          <span className="bg-[var(--parchment)] px-2 text-[var(--steel-light)]">ou</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={loading}
        onClick={handleGoogleLogin}
        data-testid="login-google"
      >
        Continuar com Google
      </Button>
    </AuthShell>
  )
}
