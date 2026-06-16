'use client'

import { useEffect, useState } from 'react'

import {
  adminTabsListClass,
  adminTabsTriggerClass,
} from '@/app/(admin)/[adminPath]/admin-tab-styles'
import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useRuleBlocks } from '@/features/characters/use-game-options'
import { getCharacter } from '@/features/characters/api'
import type { RoomParticipant } from '@/features/rooms/api'
import { updateSessionState } from '@/features/rooms/api'
import type { CharacterSheet } from '@/types/character-sheet'

type DmScreenProps = {
  roomId: string
  sessionState: Record<string, unknown>
  participants: RoomParticipant[]
  onSessionUpdate?: (state: Record<string, unknown>) => void
}

const blockCardClass =
  'rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/30 p-4'

function MarkdownBlock({ body }: { body: string }) {
  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-[var(--steel)]">
      {body.split('\n').map((line, i) => {
        if (line.startsWith('|')) {
          return (
            <span key={i} className="block font-mono text-sm">
              {line}
            </span>
          )
        }
        const bold = line.replace(/\*\*(.+?)\*\*/g, '$1')
        return (
          <p key={i} className="mb-2">
            {bold}
          </p>
        )
      })}
    </div>
  )
}

export function DmScreen({
  roomId,
  sessionState,
  participants,
  onSessionUpdate,
}: DmScreenProps) {
  const { blocks: rollBlocks } = useRuleBlocks('roll_results')
  const { blocks: combatBlocks } = useRuleBlocks('combat')
  const { blocks: resourceBlocks } = useRuleBlocks('resources')

  const [notes, setNotes] = useState(String(sessionState.notes ?? ''))
  const [heat, setHeat] = useState(Number(sessionState.heat ?? 0))
  const [viewCharacterId, setViewCharacterId] = useState<string | null>(null)
  const [viewSheet, setViewSheet] = useState<CharacterSheet | null>(null)

  useEffect(() => {
    if (!viewCharacterId) return
    void getCharacter(viewCharacterId).then((row) => {
      setViewSheet(row?.sheet_state ?? null)
    })
  }, [viewCharacterId])

  const saveSession = async () => {
    const next = { ...sessionState, notes, heat }
    await updateSessionState(roomId, next)
    onSessionUpdate?.(next)
  }

  if (viewCharacterId) {
    if (!viewSheet) {
      return (
        <div className="flex h-full items-center justify-center text-[var(--steel-light)]">
          Carregando ficha…
        </div>
      )
    }
    return (
      <div className="flex h-full flex-col">
        <Button
          variant="outline"
          className="mb-4 w-fit"
          onClick={() => {
            setViewCharacterId(null)
            setViewSheet(null)
          }}
        >
          ← Voltar ao DM Screen
        </Button>
        <div className="flex-1 overflow-hidden rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-4 text-[var(--ink)]">
          <CharacterSheetEditor sheet={viewSheet} onChange={() => {}} readOnly />
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="reference" className="flex h-full flex-col">
      <TabsList className={adminTabsListClass}>
        <TabsTrigger value="reference" className={adminTabsTriggerClass}>
          Referência
        </TabsTrigger>
        <TabsTrigger value="combat" className={adminTabsTriggerClass}>
          Combate
        </TabsTrigger>
        <TabsTrigger value="resources" className={adminTabsTriggerClass}>
          Recursos
        </TabsTrigger>
        <TabsTrigger value="session" className={adminTabsTriggerClass}>
          Sessão
        </TabsTrigger>
        <TabsTrigger value="players" className={adminTabsTriggerClass}>
          Jogadores
        </TabsTrigger>
      </TabsList>

      <TabsContent value="reference" className="mt-4 flex-1 space-y-4 overflow-y-auto">
        {rollBlocks.map((block) => (
          <div key={block.id} className={blockCardClass}>
            <h3 className="mb-2 font-heading text-base font-semibold text-[var(--gold)]">
              {block.title}
            </h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="combat" className="mt-4 flex-1 space-y-4 overflow-y-auto">
        {combatBlocks.map((block) => (
          <div key={block.id} className={blockCardClass}>
            <h3 className="mb-2 font-heading text-base font-semibold text-[var(--gold)]">
              {block.title}
            </h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="resources" className="mt-4 flex-1 space-y-4 overflow-y-auto">
        {resourceBlocks.map((block) => (
          <div key={block.id} className={blockCardClass}>
            <h3 className="mb-2 font-heading text-base font-semibold text-[var(--gold)]">
              {block.title}
            </h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="session" className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="session-heat" className="text-sm uppercase text-[var(--gold)]">
            Heat
          </Label>
          <Input
            id="session-heat"
            type="number"
            min={0}
            value={heat}
            className="w-24"
            onChange={(e) => setHeat(Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-notes" className="text-sm uppercase text-[var(--gold)]">
            Notas da sessão
          </Label>
          <Textarea
            id="session-notes"
            value={notes}
            rows={8}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <Button onClick={() => void saveSession()}>Salvar sessão</Button>
      </TabsContent>

      <TabsContent value="players" className="mt-4 space-y-3">
        {participants
          .filter((p) => p.session_role === 'player')
          .map((p) => (
            <div
              key={p.user_id}
              className="flex items-center justify-between rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/30 px-4 py-3"
            >
              <div>
                <p className="font-medium text-[var(--ink)]">
                  {p.profile?.display_name ?? 'Jogador'}
                </p>
                <p className="text-sm text-[var(--steel-light)]">
                  {p.character?.name ?? 'Sem ficha selecionada'}
                </p>
              </div>
              {p.character_id && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewCharacterId(p.character_id!)}
                >
                  Ver ficha
                </Button>
              )}
            </div>
          ))}
        {participants.filter((p) => p.session_role === 'player').length === 0 && (
          <p className="text-base text-[var(--steel-light)]">Nenhum jogador na sala ainda.</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
