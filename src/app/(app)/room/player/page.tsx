import { Suspense } from 'react'

import { PlayerRoomClient } from './player-room-client'

export default function PlayerRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
          <p className="text-[var(--steel-light)]" data-testid="player-room-loading">
            Carregando sala…
          </p>
        </div>
      }
    >
      <PlayerRoomClient />
    </Suspense>
  )
}
