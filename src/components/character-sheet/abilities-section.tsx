'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { newId } from '@/lib/character-sheet/defaults'
import { cn } from '@/lib/utils'
import type { AbilityEntry, CharacterSheet } from '@/types/character-sheet'

type AbilitiesSectionProps = {
  abilities: AbilityEntry[]
  readOnly?: boolean
  compact?: boolean
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
}

const SOURCE_LABELS: Record<AbilityEntry['source'], string> = {
  ancestry: 'Ancestralidade',
  background: 'Background',
  career: 'Carreira',
  other: 'Outro',
}

export function AbilitiesSection({
  abilities,
  readOnly,
  compact = false,
  onChange,
}: AbilitiesSectionProps) {
  const [openState, setOpenState] = useState<Record<string, boolean>>({})

  const updateAbility = (idx: number, patch: Partial<AbilityEntry>) => {
    onChange((p) => {
      const next = [...p.abilities]
      next[idx] = { ...next[idx], ...patch }
      return { ...p, abilities: next }
    })
  }

  const isOpen = (id: string, index: number) => openState[id] ?? index === 0

  const setOpen = (id: string, open: boolean) => {
    setOpenState((prev) => ({ ...prev, [id]: open }))
  }

  return (
    <div className="space-y-4">
      {!readOnly && !compact && (
        <Button
          variant="outline"
          size="sm"
          data-testid="add-ability-btn"
          onClick={() =>
            onChange((p) => ({
              ...p,
              abilities: [
                ...p.abilities,
                {
                  id: newId(),
                  name: 'Nova habilidade',
                  source: 'other',
                  cost: '1',
                  description: '',
                },
              ],
            }))
          }
        >
          + Habilidade manual
        </Button>
      )}

      {abilities.length === 0 && (
        <p
          className="rounded border border-dashed border-[var(--parchment-deep)] px-4 py-6 text-center text-sm text-[var(--steel-light)]"
          data-testid="abilities-empty"
        >
          Selecione Ancestry, Background e Career na aba Identidade para importar habilidades,
          ou adicione habilidades manuais.
        </p>
      )}

      {abilities.map((ability, idx) => {
        if (compact) {
          const open = isOpen(ability.id, idx)
          return (
            <Collapsible
              key={ability.id}
              open={open}
              onOpenChange={(next) => setOpen(ability.id, next)}
              className="rounded border border-[var(--parchment-deep)]"
              data-testid="ability-item"
            >
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                  <span className="rounded bg-[var(--parchment-dark)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--steel-light)]">
                    {SOURCE_LABELS[ability.source]}
                  </span>
                  <span className="truncate font-medium text-[var(--ink)]">{ability.name}</span>
                </div>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 text-[var(--steel-light)] transition-transform duration-200',
                    open && 'rotate-180'
                  )}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 border-t border-[var(--parchment-deep)]/60 px-3 py-3">
                  {ability.cost && (
                    <p className="text-sm text-[var(--steel-light)]">
                      <span className="font-medium text-[var(--ink)]">Custo:</span> {ability.cost}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap text-sm text-[var(--steel)]">
                    {ability.description || 'Sem descrição.'}
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )
        }

        return (
          <div
            key={ability.id}
            className="space-y-2 rounded border border-[var(--parchment-deep)] p-3"
            data-testid="ability-item"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded bg-[var(--parchment-dark)] px-2 py-0.5 text-xs uppercase tracking-wide text-[var(--steel-light)]">
                {SOURCE_LABELS[ability.source]}
              </span>
              <Input
                className="h-8 w-16"
                placeholder="Custo"
                value={ability.cost ?? ''}
                readOnly={readOnly || ability.source !== 'other'}
                onChange={(e) => updateAbility(idx, { cost: e.target.value })}
              />
              <Input
                className="flex-1"
                value={ability.name}
                readOnly={readOnly || ability.source !== 'other'}
                onChange={(e) => updateAbility(idx, { name: e.target.value })}
              />
              {ability.source === 'other' && !readOnly && (
                <Select
                  value={ability.source}
                  onChange={(e) =>
                    updateAbility(idx, {
                      source: e.target.value as AbilityEntry['source'],
                    })
                  }
                >
                  <option value="other">Outro</option>
                  <option value="ancestry">Ancestralidade</option>
                  <option value="background">Background</option>
                  <option value="career">Carreira</option>
                </Select>
              )}
              {ability.source === 'other' && !readOnly && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    onChange((p) => ({
                      ...p,
                      abilities: p.abilities.filter((_, i) => i !== idx),
                    }))
                  }
                >
                  Remover
                </Button>
              )}
            </div>
            <Textarea
              value={ability.description}
              readOnly={readOnly || ability.source !== 'other'}
              rows={2}
              onChange={(e) => updateAbility(idx, { description: e.target.value })}
            />
          </div>
        )
      })}
    </div>
  )
}
