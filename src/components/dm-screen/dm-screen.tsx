'use client'

import { useEffect, useState } from 'react'

import { CharacterSheetEditor } from '@/components/character-sheet/character-sheet-editor'
import { Button } from '@/components/ui/button'
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

function MarkdownBlock({ body }: { body: string }) {
  return (
    <div className="prose prose-sm max-w-none whitespace-pre-wrap text-zinc-300">
      {body.split('\n').map((line, i) => {
        if (line.startsWith('|')) {
          return (
            <span key={i} className="block font-mono text-xs">
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
        <div className="flex h-full items-center justify-center text-zinc-400">
          Carregando ficha…
        </div>
      )
    }
    return (
      <div className="flex h-full flex-col">
        <Button
          variant="outline"
          className="mb-4 w-fit border-zinc-600 text-zinc-200"
          onClick={() => {
            setViewCharacterId(null)
            setViewSheet(null)
          }}
        >
          ← Voltar ao DM Screen
        </Button>
        <div className="flex-1 overflow-hidden rounded-xl border border-zinc-700 bg-[var(--parchment)] p-4 text-[var(--ink)]">
          <CharacterSheetEditor sheet={viewSheet} onChange={() => {}} readOnly />
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue="reference" className="flex h-full flex-col">
      <TabsList className="flex h-auto flex-wrap bg-zinc-800">
        <TabsTrigger value="reference">Referência</TabsTrigger>
        <TabsTrigger value="combat">Combate</TabsTrigger>
        <TabsTrigger value="resources">Recursos</TabsTrigger>
        <TabsTrigger value="session">Sessão</TabsTrigger>
        <TabsTrigger value="players">Jogadores</TabsTrigger>
      </TabsList>

      <TabsContent value="reference" className="mt-4 flex-1 overflow-y-auto space-y-4">
        {rollBlocks.map((block) => (
          <div key={block.id} className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <h3 className="mb-2 font-heading text-sm font-semibold text-amber-400">{block.title}</h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="combat" className="mt-4 flex-1 overflow-y-auto space-y-4">
        {combatBlocks.map((block) => (
          <div key={block.id} className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <h3 className="mb-2 font-heading text-sm font-semibold text-amber-400">{block.title}</h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="resources" className="mt-4 flex-1 overflow-y-auto space-y-4">
        {resourceBlocks.map((block) => (
          <div key={block.id} className="rounded-lg border border-zinc-700 bg-zinc-900/50 p-4">
            <h3 className="mb-2 font-heading text-sm font-semibold text-amber-400">{block.title}</h3>
            <MarkdownBlock body={block.body} />
          </div>
        ))}
      </TabsContent>

      <TabsContent value="session" className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-xs uppercase text-zinc-400">Heat</label>
          <input
            type="number"
            min={0}
            value={heat}
            className="w-24 rounded border border-zinc-600 bg-zinc-900 px-2 py-1 text-zinc-100"
            onChange={(e) => setHeat(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase text-zinc-400">Notas da sessão</label>
          <Textarea
            value={notes}
            rows={8}
            className="border-zinc-600 bg-zinc-900 text-zinc-100"
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
              className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3"
            >
              <div>
                <p className="font-medium text-zinc-100">
                  {p.profile?.display_name ?? 'Jogador'}
                </p>
                <p className="text-xs text-zinc-400">
                  {p.character?.name ?? 'Sem ficha selecionada'}
                </p>
              </div>
              {p.character_id && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-zinc-600 text-zinc-200"
                  onClick={() => setViewCharacterId(p.character_id!)}
                >
                  Ver ficha
                </Button>
              )}
            </div>
          ))}
        {participants.filter((p) => p.session_role === 'player').length === 0 && (
          <p className="text-sm text-zinc-400">Nenhum jogador na sala ainda.</p>
        )}
      </TabsContent>
    </Tabs>
  )
}
