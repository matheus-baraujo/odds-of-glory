'use client'

import Link from 'next/link'

import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { Button } from '@/components/ui/button'
import { useCharacterSheet } from '@/features/characters/use-character-sheet'
import { useRequireAuth } from '@/features/auth/use-require-auth'

export function CharacterEditClient({ id }: { id: string }) {
  const { loading: authLoading, isAuthenticated } = useRequireAuth()
  const { sheet, loading, saving, error, lastSaved, updateSheet, saveNow } =
    useCharacterSheet(id)

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)]">
        <p data-testid="character-sheet-loading">Carregando ficha…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!sheet) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--parchment-dark)]">
        <p className="text-[var(--crimson)]">{error ?? 'Ficha não encontrada.'}</p>
        <Button variant="outline" asChild>
          <Link href="/characters/">Voltar</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col lg:min-h-[calc(100vh-3rem)]">
        <header className="mb-4 flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/characters/" data-testid="sheet-back">
              ← Fichas
            </Link>
          </Button>
          <Button variant="secondary" size="sm" onClick={() => void saveNow()} disabled={saving}>
            Salvar agora
          </Button>
          {error && <span className="text-sm text-[var(--crimson)]">{error}</span>}
        </header>

        <div
          className="flex-1 rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-4 lg:p-6"
          data-testid="character-sheet-editor"
        >
          <CharacterSheetEditor
            sheet={sheet}
            onChange={updateSheet}
            saving={saving}
            lastSaved={lastSaved}
          />
        </div>
      </div>
    </div>
  )
}
