'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/features/auth/auth-provider'
import { useRequireAuth } from '@/features/auth/use-require-auth'

export default function LobbyPage() {
  const router = useRouter()
  const { signOut, profile, user } = useAuth()
  const { loading, isAuthenticated } = useRequireAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
        <p className="text-sm text-[var(--steel-light)]" data-testid="lobby-loading">
          Carregando…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const displayName =
    profile?.display_name ?? user?.user_metadata?.display_name ?? user?.email ?? 'Jogador'

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-heading text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
              Odds of Glory
            </p>
            <h1 className="font-heading mt-2 text-3xl font-semibold text-[var(--ink)]">
              Lobby da Mesa
            </h1>
            <p className="mt-1 text-sm text-[var(--steel-light)]">
              Olá, {displayName}. Escolha seu papel nesta sessão.
            </p>
          </div>
          <Button variant="outline" onClick={() => void signOut()} data-testid="lobby-sign-out">
            Sair
          </Button>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardHeader>
              <CardTitle className="font-heading text-[var(--ink)]">Mestre</CardTitle>
              <CardDescription>
                Crie uma sala, gerencie a sessão e consulte as fichas dos jogadores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                data-testid="lobby-master"
                onClick={() => router.push('/lobby/?role=master')}
              >
                Entrar como Mestre
              </Button>
              <p className="mt-3 text-xs text-[var(--steel-light)]">
                Salas completas chegam na Fase 3. Por ora, confirme seu papel aqui.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardHeader>
              <CardTitle className="font-heading text-[var(--ink)]">Jogador</CardTitle>
              <CardDescription>
                Entre com um código de sala, escolha sua ficha e jogue com chat e rolagens.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="secondary"
                className="w-full"
                data-testid="lobby-player"
                onClick={() => router.push('/lobby/?role=player')}
              >
                Entrar como Jogador
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/characters/" data-testid="lobby-characters">
                  Minhas fichas
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
