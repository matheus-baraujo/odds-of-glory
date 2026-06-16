import { Suspense } from 'react'

import { MasterRoomClient } from './master-room-client'

export default function MasterRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
          <p className="text-[var(--steel-light)]" data-testid="master-room-loading">
            Carregando sala…
          </p>
        </div>
      }
    >
      <MasterRoomClient />
    </Suspense>
  )
}
