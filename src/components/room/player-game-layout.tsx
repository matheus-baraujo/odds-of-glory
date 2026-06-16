'use client'

import Link from 'next/link'

import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { ChatPanel } from '@/components/chat/chat-panel'
import { Button } from '@/components/ui/button'
import type { ChatMessage } from '@/features/chat/use-room-chat'
import type { CharacterSheet } from '@/types/character-sheet'

type PlayerGameLayoutProps = {
  roomName: string
  roomCode: string
  sheet: CharacterSheet
  onSheetChange?: (updater: (prev: CharacterSheet) => CharacterSheet) => void
  readOnly?: boolean
  chatMessages: ChatMessage[]
  chatLoading?: boolean
  onChatSend?: (text: string) => Promise<void>
  currentUserId?: string | null
  saving?: boolean
  lastSaved?: Date | null
  showLobbyLink?: boolean
  previewBanner?: string
  chatDisabled?: boolean
  embedded?: boolean
}

export function PlayerGameLayout({
  roomName,
  roomCode,
  sheet,
  onSheetChange,
  readOnly = false,
  chatMessages,
  chatLoading = false,
  onChatSend,
  currentUserId,
  saving,
  lastSaved,
  showLobbyLink = true,
  previewBanner,
  chatDisabled = false,
  embedded = false,
}: PlayerGameLayoutProps) {
  const shellClass = embedded
    ? 'rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/20 p-2'
    : 'min-h-screen bg-[var(--parchment-dark)] px-4 py-6 lg:px-8'

  const gridClass = embedded
    ? 'grid gap-3 lg:grid-cols-[1fr_280px]'
    : 'mx-auto grid max-w-7xl gap-4 lg:grid-cols-[1fr_380px] lg:gap-6'

  const mainMinH = embedded ? 'min-h-[480px]' : 'min-h-[calc(100vh-3rem)]'
  const chatHeight = embedded ? 'min-h-[480px]' : 'lg:h-[calc(100vh-3rem)]'

  return (
    <div className={shellClass}>
      {previewBanner && (
        <p className="mb-3 rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/50 px-4 py-2 text-sm text-[var(--steel-light)]">
          {previewBanner}
        </p>
      )}
      <div className={gridClass}>
        <div
          className={`flex ${mainMinH} flex-col rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-4 lg:p-6`}
        >
          <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-heading text-sm uppercase tracking-[0.35em] text-[var(--gold)]">
                Odds of Glory
              </p>
              <h1 className="font-heading mt-2 text-2xl font-semibold text-[var(--ink)]">
                {roomName}
              </h1>
              <p className="mt-1 text-base text-[var(--steel-light)]">
                Código: <span className="font-mono tracking-widest">{roomCode}</span>
              </p>
            </div>
            {showLobbyLink && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/lobby/">← Lobby</Link>
              </Button>
            )}
          </header>
          <CharacterSheetEditor
            sheet={sheet}
            onChange={onSheetChange ?? (() => {})}
            mode={readOnly ? 'play' : 'play'}
            readOnly={readOnly}
            saving={saving}
            lastSaved={lastSaved}
          />
        </div>

        <div className={`lg:sticky lg:top-4 ${chatHeight}`}>
          <ChatPanel
            messages={chatMessages}
            loading={chatLoading}
            currentUserId={currentUserId}
            onSend={onChatSend ?? (async () => {})}
            disabled={chatDisabled}
          />
        </div>
      </div>
    </div>
  )
}
