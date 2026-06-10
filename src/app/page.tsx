'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-provider'

export default function HomePage() {
  const router = useRouter()
  const { user, loading, configured } = useAuth()

  useEffect(() => {
    if (loading) return
    if (user) {
      router.replace('/lobby/')
    }
  }, [user, loading, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--parchment-dark)] px-4">
      <div className="max-w-lg text-center">
        <p className="font-heading text-sm uppercase tracking-[0.35em] text-[var(--gold)]">
          Odds of Glory
        </p>
        <h1 className="font-heading mt-3 text-4xl font-semibold text-[var(--ink)]">
          Mesa virtual
        </h1>
        <p className="mt-4 text-base text-[var(--steel-light)]">
          Fichas, salas de jogo, chat e rolagens d6 em tempo real.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild data-testid="home-login">
            <Link href="/login/">Entrar</Link>
          </Button>
          <Button variant="outline" asChild data-testid="home-register">
            <Link href="/register/">Criar conta</Link>
          </Button>
        </div>
        {!configured ? (
          <p className="mt-6 text-sm text-[var(--steel-light)]">
            Supabase não configurado — copie .env.example para .env.local.
          </p>
        ) : null}
      </div>
    </div>
  )
}
