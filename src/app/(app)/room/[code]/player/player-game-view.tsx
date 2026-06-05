'use client'

import Link from 'next/link'

import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { ChatPanel } from '@/components/chat/chat-panel'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-provider'
import { useCharacterSheet } from '@/features/characters/use-character-sheet'
import { useRoomChat } from '@/features/chat/use-room-chat'
import type { GameRoom } from '@/features/rooms/api'

type PlayerGameViewProps = {
  room: GameRoom
  characterId: string
}

export function PlayerGameView({ room, characterId }: PlayerGameViewProps) {
  const { user } = useAuth()
  const { sheet, updateSheet, saving, lastSaved } = useCharacterSheet(characterId)
  const { messages, loading: chatLoading, handleInput } = useRoomChat(room.id, user?.id ?? null)

  if (!sheet) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
        <p>Carregando ficha…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-4 lg:px-6">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_380px] lg:gap-6">
        <div className="flex min-h-[calc(100vh-2rem)] flex-col rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-4 lg:p-6">
          <header className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--gold)]">
                {room.name} · {room.code}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/lobby/">Lobby</Link>
            </Button>
          </header>
          <CharacterSheetEditor
            sheet={sheet}
            onChange={updateSheet}
            saving={saving}
            lastSaved={lastSaved}
          />
        </div>

        <div className="lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <ChatPanel
            messages={messages}
            loading={chatLoading}
            currentUserId={user?.id}
            onSend={handleInput}
          />
        </div>
      </div>
    </div>
  )
}
