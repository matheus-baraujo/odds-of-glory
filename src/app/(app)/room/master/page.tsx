import { Suspense } from 'react'

import { MasterRoomClient } from './master-room-client'

export default function MasterRoomPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
          <p data-testid="master-room-loading">Carregando sala…</p>
        </div>
      }
    >
      <MasterRoomClient />
    </Suspense>
  )
}
