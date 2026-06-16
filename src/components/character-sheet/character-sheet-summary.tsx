'use client'

import type { GameOption } from '@/features/characters/use-game-options'
import {
  countCheckedSupplies,
  supplyKey,
} from '@/lib/character-sheet/import-templates'
import type { CharacterSheet } from '@/types/character-sheet'

type CharacterSheetSummaryProps = {
  sheet: CharacterSheet
  gameOptions: GameOption[]
}

function labelForOption(options: GameOption[], id: string | null): string {
  if (!id) return '—'
  return options.find((o) => o.id === id)?.label ?? '—'
}

function countBySource(sheet: CharacterSheet, source: 'ancestry' | 'background' | 'career' | 'other') {
  return sheet.abilities.filter((a) => a.source === source).length
}

export function CharacterSheetSummary({ sheet, gameOptions }: CharacterSheetSummaryProps) {
  const supplies = gameOptions.filter((o) => o.category === 'supply')
  const checkedCount = countCheckedSupplies(sheet.supply.checked)
  const markedSupplies = supplies
    .filter((opt) => sheet.supply.checked[supplyKey(opt.slug)])
    .map((opt) => opt.label)

  return (
    <div
      className="space-y-4 rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/40 p-4 text-sm"
      data-testid="character-sheet-summary"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Personagem</p>
          <p className="font-medium text-[var(--ink)]">{sheet.bio.name || 'Sem nome'}</p>
          <p className="text-[var(--steel-light)]">Tier {sheet.tier}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Identidade</p>
          <p>{labelForOption(gameOptions, sheet.bio.ancestryId)}</p>
          <p>{labelForOption(gameOptions, sheet.bio.backgroundId)}</p>
          <p>{labelForOption(gameOptions, sheet.bio.careerId)}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Habilidades</p>
          <p>
            Ancestry {countBySource(sheet, 'ancestry')} · Background{' '}
            {countBySource(sheet, 'background')} · Career {countBySource(sheet, 'career')} ·
            Outras {countBySource(sheet, 'other')}
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Suprimentos</p>
          <p>
            {checkedCount} / {sheet.supply.load} marcados
          </p>
        </div>
      </div>

      {(sheet.aspect.customName || sheet.aspect.oath) && (
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Aspect</p>
          <p className="font-medium">{sheet.aspect.customName || '—'}</p>
          {sheet.aspect.oath && (
            <p className="text-[var(--steel-light)] italic">{sheet.aspect.oath}</p>
          )}
        </div>
      )}

      {sheet.equipment.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">Equipamento</p>
          <p>{sheet.equipment.map((e) => e.name).join(' · ')}</p>
        </div>
      )}

      {markedSupplies.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-[var(--steel-light)]">
            Suprimentos marcados
          </p>
          <p>{markedSupplies.join(' · ')}</p>
        </div>
      )}
    </div>
  )
}
