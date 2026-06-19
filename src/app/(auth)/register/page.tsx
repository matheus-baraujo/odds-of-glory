'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthLink, AuthShell } from '@/features/auth/auth-shell'
import { authCallbackUrl } from '@/lib/paths'
import { createBrowserSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const supabase = createBrowserSupabaseClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName || email.split('@')[0] },
          emailRedirectTo: authCallbackUrl(),
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (data.session) {
        router.replace('/lobby/')
        return
      }

      setMessage('Conta criada. Verifique seu email para confirmar o cadastro, depois faça login.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao criar conta.')
    } finally {
      setLoading(false)
    }
  }

  if (!isSupabaseConfigured()) {
    return (
      <AuthShell title="Criar conta" subtitle="Configure o Supabase antes de registrar usuários.">
        <Alert variant="destructive">
          <AlertDescription>Variáveis NEXT_PUBLIC_SUPABASE_* ausentes.</AlertDescription>
        </Alert>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Criar conta"
      subtitle="Registre-se para criar fichas e entrar em salas de jogo."
      footer={
        <p>
          Já tem conta? <AuthLink href="/login/">Entrar</AuthLink>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleRegister} data-testid="register-form">
        {error ? (
          <Alert variant="destructive" data-testid="register-error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        {message ? (
          <Alert data-testid="register-success">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="displayName">Nome de exibição</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            data-testid="register-display-name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            data-testid="register-email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            data-testid="register-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading} data-testid="register-submit">
          {loading ? 'Criando…' : 'Criar conta'}
        </Button>
      </form>
    </AuthShell>
  )
}
