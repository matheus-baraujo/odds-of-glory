'use client'

import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { useRequireAuth } from '@/features/auth/use-require-auth'

export default function CharactersPage() {
  const { loading, isAuthenticated } = useRequireAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p data-testid="characters-loading">Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-8">
        <h1 className="font-heading text-2xl font-semibold text-[var(--ink)]">Fichas</h1>
        <p className="mt-2 text-sm text-[var(--steel-light)]">
          Editor completo de fichas chega na Fase 2. Por enquanto, esta rota confirma acesso
          autenticado.
        </p>
        <Button className="mt-6" variant="outline" asChild>
          <Link href="/lobby/" data-testid="characters-back-lobby">
            Voltar ao lobby
          </Link>
        </Button>
      </div>
    </div>
  )
}
