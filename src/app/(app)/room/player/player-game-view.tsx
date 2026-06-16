'use client'

import { PlayerGameLayout } from '@/components/room/player-game-layout'
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
        <p className="text-[var(--steel-light)]">Carregando ficha…</p>
      </div>
    )
  }

  return (
    <PlayerGameLayout
      roomName={room.name}
      roomCode={room.code}
      sheet={sheet}
      onSheetChange={updateSheet}
      chatMessages={messages}
      chatLoading={chatLoading}
      currentUserId={user?.id}
      onChatSend={handleInput}
      saving={saving}
      lastSaved={lastSaved}
    />
  )
}
