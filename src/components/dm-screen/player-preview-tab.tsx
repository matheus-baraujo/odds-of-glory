'use client'

import { useMemo } from 'react'

import { PlayerGameLayout } from '@/components/room/player-game-layout'
import {
  createPlayerPreviewMessages,
  createPlayerPreviewSheet,
} from '@/lib/room/player-preview-mock'

type PlayerPreviewTabProps = {
  roomId: string
  roomName: string
  roomCode: string
}

export function PlayerPreviewTab({ roomId, roomName, roomCode }: PlayerPreviewTabProps) {
  const sheet = useMemo(() => createPlayerPreviewSheet(), [])
  const messages = useMemo(() => createPlayerPreviewMessages(roomId), [roomId])

  return (
    <div className="max-h-[calc(100vh-14rem)] overflow-auto">
      <PlayerGameLayout
        embedded
        roomName={roomName}
        roomCode={roomCode}
        sheet={sheet}
        readOnly
        chatMessages={messages}
        chatDisabled
        showLobbyLink={false}
        previewBanner="Visualização de layout — dados de exemplo"
      />
    </div>
  )
}
