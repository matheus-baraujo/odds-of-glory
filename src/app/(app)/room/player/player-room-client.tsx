'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { useAuth } from '@/features/auth/auth-provider'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import { listCharacters } from '@/features/characters/api'
import {
  getRoomByCode,
  getRoomParticipant,
  setParticipantCharacter,
  type GameRoom,
} from '@/features/rooms/api'
import { roomMasterPath } from '@/lib/paths'
import type { CharacterRow } from '@/types/character-sheet'

import { PlayerGameView } from './player-game-view'

export function PlayerRoomClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')?.toUpperCase() ?? null

  const { user } = useAuth()
  const { loading: authLoading, isAuthenticated } = useRequireAuth()

  const [room, setRoom] = useState<GameRoom | null>(null)
  const [characters, setCharacters] = useState<CharacterRow[]>([])
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsCharacter, setNeedsCharacter] = useState(false)

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
        if (!participant) {
          setError('Você não está nesta sala.')
          return
        }

        if (participant.session_role === 'master') {
          router.replace(roomMasterPath(code))
          return
        }

        setRoom(roomData)
        const chars = await listCharacters()
        setCharacters(chars)

        if (participant.character_id) {
          setSelectedCharacterId(participant.character_id)
        } else {
          setNeedsCharacter(true)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar sala.')
      } finally {
        setLoading(false)
      }
    })()
  }, [code, isAuthenticated, user, router])

  const confirmCharacter = async (characterId: string) => {
    if (!room) return
    await setParticipantCharacter(room.id, characterId)
    setSelectedCharacterId(characterId)
    setNeedsCharacter(false)
  }

  if (!code) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--parchment-dark)]">
        <p className="text-[var(--crimson)]" data-testid="player-room-missing-code">
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
        <p className="text-[var(--steel-light)]" data-testid="player-room-loading">
          Carregando sala…
        </p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (error || !room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--parchment-dark)]">
        <p className="text-[var(--crimson)]" data-testid="player-room-error">
          {error ?? 'Sala não encontrada.'}
        </p>
        <Button variant="outline" asChild>
          <Link href="/lobby/">Voltar ao lobby</Link>
        </Button>
      </div>
    )
  }

  if (needsCharacter || !selectedCharacterId) {
    return (
      <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
        <div className="mx-auto max-w-md">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/lobby/">← Lobby</Link>
          </Button>
          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardHeader>
              <CardTitle className="font-heading">Escolha sua ficha</CardTitle>
              <CardDescription>
                Sala {room.code} — {room.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {characters.length === 0 ? (
                <div className="space-y-3">
                  <p className="text-base text-[var(--steel-light)]">
                    Você ainda não tem fichas. Crie uma antes de entrar na mesa.
                  </p>
                  <Button asChild>
                    <Link href="/characters/new/" data-testid="player-create-character">
                      Criar ficha
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Select
                    data-testid="player-character-select"
                    value={selectedCharacterId ?? ''}
                    onChange={(e) => setSelectedCharacterId(e.target.value || null)}
                  >
                    <option value="">Selecione…</option>
                    {characters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (Tier {c.tier})
                      </option>
                    ))}
                  </Select>
                  <Button
                    className="w-full"
                    disabled={!selectedCharacterId}
                    data-testid="player-confirm-character"
                    onClick={() => selectedCharacterId && void confirmCharacter(selectedCharacterId)}
                  >
                    Confirmar ficha
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <PlayerGameView room={room} characterId={selectedCharacterId} />
}
