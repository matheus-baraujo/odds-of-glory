'use client'

import Link from 'next/link'
import { Suspense } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/features/auth/auth-provider'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import { createRoom, joinRoom } from '@/features/rooms/api'
import { roomMasterPath, roomPlayerPath } from '@/lib/paths'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

function LobbyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role')
  const { signOut, profile, user } = useAuth()
  const { loading, isAuthenticated } = useRequireAuth()

  const [roomName, setRoomName] = useState('Nova sessão')
  const [roomCode, setRoomCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
        <p className="text-base text-[var(--steel-light)]" data-testid="lobby-loading">
          Carregando…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const displayName =
    profile?.display_name ?? user?.user_metadata?.display_name ?? user?.email ?? 'Jogador'

  const handleCreateRoom = async () => {
    setBusy(true)
    setError(null)
    try {
      const room = await createRoom(roomName.trim() || 'Nova sessão')
      router.push(roomMasterPath(room.code))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar sala.')
      setBusy(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      setError('Informe o código da sala.')
      return
    }
    setBusy(true)
    setError(null)
    try {
      const room = await joinRoom(roomCode)
      const isMaster = room.master_id === user?.id
      router.push(isMaster ? roomMasterPath(room.code) : roomPlayerPath(room.code))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar na sala.')
      setBusy(false)
    }
  }

  if (role === 'master') {
    return (
      <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
        <div className="mx-auto max-w-lg">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/lobby/">← Voltar</Link>
          </Button>
          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardHeader>
              <CardTitle className="font-heading">Criar sala</CardTitle>
              <CardDescription>
                Você receberá um código de 6 caracteres para convidar jogadores.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="room-name">Nome da sessão</Label>
                <Input
                  id="room-name"
                  data-testid="room-name-input"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              {error && <p className="text-base text-[var(--crimson)]">{error}</p>}
              <Button
                className="w-full"
                disabled={busy}
                data-testid="create-room-submit"
                onClick={() => void handleCreateRoom()}
              >
                {busy ? 'Criando…' : 'Criar sala'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (role === 'player') {
    return (
      <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
        <div className="mx-auto max-w-lg">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/lobby/">← Voltar</Link>
          </Button>
          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardHeader>
              <CardTitle className="font-heading">Entrar na sala</CardTitle>
              <CardDescription>
                Digite o código de 6 caracteres fornecido pelo mestre.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="room-code">Código</Label>
                <Input
                  id="room-code"
                  data-testid="room-code-input"
                  value={roomCode}
                  maxLength={6}
                  className="uppercase tracking-widest"
                  placeholder="ABC123"
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                />
              </div>
              {error && <p className="text-base text-[var(--crimson)]">{error}</p>}
              <Button
                className="w-full"
                disabled={busy}
                data-testid="join-room-submit"
                onClick={() => void handleJoinRoom()}
              >
                {busy ? 'Entrando…' : 'Entrar na sala'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.35em] text-[var(--gold)]">
              Odds of Glory
            </p>
            <h1 className="font-heading mt-2 text-3xl font-semibold text-[var(--ink)]">
              Lobby da Mesa
            </h1>
            <p className="mt-1 text-base text-[var(--steel-light)]">
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

export default function LobbyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
          <p data-testid="lobby-loading">Carregando…</p>
        </div>
      }
    >
      <LobbyContent />
    </Suspense>
  )
}
