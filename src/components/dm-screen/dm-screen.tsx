'use client'

import { useEffect, useState } from 'react'

import {
  adminTabsListClass,
  adminTabsTriggerClass,
} from '@/app/(admin)/[adminPath]/admin-tab-styles'
import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { FactionsTab } from '@/components/dm-screen/factions-tab'
import { EnemiesTab } from '@/components/dm-screen/enemies-tab'
import { PlayerPreviewTab } from '@/components/dm-screen/player-preview-tab'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useRuleBlocks } from '@/features/characters/use-game-options'
import { getCharacter } from '@/features/characters/api'
import type { RoomParticipant } from '@/features/rooms/api'
import type { SessionState } from '@/types/session-state'
import type { CharacterSheet } from '@/types/character-sheet'

type DmScreenProps = {
  roomId: string
  roomName: string
  roomCode: string
  session: SessionState
  updateSession: (updater: SessionState | ((prev: SessionState) => SessionState)) => void
  saving?: boolean
  lastSaved?: Date | null
  participants: RoomParticipant[]
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

function SaveIndicator({ saving, lastSaved }: { saving?: boolean; lastSaved?: Date | null }) {
  const text = saving ? 'Salvando…' : lastSaved ? `Salvo ${lastSaved.toLocaleTimeString()}` : ''
  if (!text) return null
  return <p className="text-sm text-[var(--steel-light)]">{text}</p>
}

export function DmScreen({
  roomId,
  roomName,
  roomCode,
  session,
  updateSession,
  saving,
  lastSaved,
  participants,
}: DmScreenProps) {
  const { blocks: rollBlocks } = useRuleBlocks('roll_results')
  const { blocks: combatBlocks } = useRuleBlocks('combat')
  const { blocks: resourceBlocks } = useRuleBlocks('resources')

  const [viewCharacterId, setViewCharacterId] = useState<string | null>(null)
  const [viewSheet, setViewSheet] = useState<CharacterSheet | null>(null)

  useEffect(() => {
    if (!viewCharacterId) return
    void getCharacter(viewCharacterId).then((row) => {
      setViewSheet(row?.sheet_state ?? null)
    })
  }, [viewCharacterId])

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
        <TabsTrigger value="enemies" className={adminTabsTriggerClass}>
          Inimigos
        </TabsTrigger>
        <TabsTrigger value="resources" className={adminTabsTriggerClass}>
          Recursos
        </TabsTrigger>
        <TabsTrigger value="session" className={adminTabsTriggerClass}>
          Sessão
        </TabsTrigger>
        <TabsTrigger value="factions" className={adminTabsTriggerClass}>
          Facções
        </TabsTrigger>
        <TabsTrigger value="players" className={adminTabsTriggerClass}>
          Jogadores
        </TabsTrigger>
        <TabsTrigger value="preview" className={adminTabsTriggerClass}>
          Preview
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

      <TabsContent value="enemies" className="mt-4 space-y-4 overflow-y-auto">
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
        <EnemiesTab
          enemies={session.enemies}
          onChange={(enemies) => updateSession((s) => ({ ...s, enemies }))}
        />
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
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
        <div className="space-y-2">
          <Label htmlFor="session-heat" className="text-sm uppercase text-[var(--gold)]">
            Heat
          </Label>
          <Input
            id="session-heat"
            type="number"
            min={0}
            value={session.heat}
            className="w-24"
            onChange={(e) =>
              updateSession((s) => ({ ...s, heat: Number(e.target.value) || 0 }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="session-notes" className="text-sm uppercase text-[var(--gold)]">
            Notas da sessão
          </Label>
          <Textarea
            id="session-notes"
            value={session.notes}
            rows={8}
            onChange={(e) => updateSession((s) => ({ ...s, notes: e.target.value }))}
          />
        </div>
      </TabsContent>

      <TabsContent value="factions" className="mt-4 space-y-4">
        <SaveIndicator saving={saving} lastSaved={lastSaved} />
        <FactionsTab
          factions={session.factions}
          onChange={(factions) => updateSession((s) => ({ ...s, factions }))}
        />
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

      <TabsContent value="preview" className="mt-4">
        <PlayerPreviewTab roomId={roomId} roomName={roomName} roomCode={roomCode} />
      </TabsContent>
    </Tabs>
  )
}
