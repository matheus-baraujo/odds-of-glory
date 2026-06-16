'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { DmScreen } from '@/components/dm-screen/dm-screen'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-provider'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import {
  getRoomByCode,
  getRoomParticipant,
  listRoomParticipants,
  type GameRoom,
  type RoomParticipant,
} from '@/features/rooms/api'

export function MasterRoomClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')?.toUpperCase() ?? null

  const { user } = useAuth()
  const { loading: authLoading, isAuthenticated } = useRequireAuth()

  const [room, setRoom] = useState<GameRoom | null>(null)
  const [participants, setParticipants] = useState<RoomParticipant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated || !user || !code) return

    void (async () => {
      try {
        const roomData = await getRoomByCode(code)
        if (!roomData) {
          setError('Sala não encontrada.')
          return
        }

        const participant = await getRoomParticipant(roomData.id, user.id)
        if (!participant || participant.session_role !== 'master') {
          setError('Acesso negado — apenas o mestre pode ver esta tela.')
          return
        }

        setRoom(roomData)
        const parts = await listRoomParticipants(roomData.id)
        setParticipants(parts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sala.')
      } finally {
        setLoading(false)
      }
    })()
  }, [code, isAuthenticated, user])

  if (!code) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--parchment-dark)]">
        <p className="text-[var(--crimson)]" data-testid="master-room-missing-code">
          Informe o código da sala na URL.
        </p>
        <Button variant="outline" asChild>
          <Link href="/lobby/">Voltar ao lobby</Link>
        </Button>
      </div>
    )
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
        <p className="text-[var(--steel-light)]" data-testid="master-room-loading">
          Carregando sala…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (error || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--parchment-dark)]">
        <p className="text-[var(--crimson)]" data-testid="master-room-error">
          {error ?? 'Sala não encontrada.'}
        </p>
        <Button variant="outline" asChild>
          <Link href="/lobby/">Voltar ao lobby</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-heading text-sm uppercase tracking-[0.35em] text-[var(--gold)]">
              Odds of Glory
            </p>
            <h1 className="font-heading mt-2 text-2xl font-semibold text-[var(--ink)]">
              {room.name}
            </h1>
            <p className="mt-1 text-base text-[var(--steel-light)]">
              Código:{' '}
              <span className="font-mono tracking-widest text-[var(--ink)]" data-testid="room-code">
                {room.code}
              </span>
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push('/lobby/')}>
            ← Lobby
          </Button>
        </header>

        <div className="min-h-[calc(100vh-10rem)] rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-4 lg:p-6">
          <DmScreen
            roomId={room.id}
            sessionState={room.session_state}
            participants={participants}
            onSessionUpdate={(state) => setRoom((r) => (r ? { ...r, session_state: state } : r))}
          />
        </div>
      </div>
    </div>
  )
}
