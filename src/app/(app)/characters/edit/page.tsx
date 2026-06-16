import { Suspense } from 'react'

import { CharacterEditClient } from './character-edit-client'

export default function CharacterEditPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
          <p data-testid="character-sheet-loading">Carregando ficha…</p>
        </div>
      }
    >
      <CharacterEditClient />
    </Suspense>
  )
}
