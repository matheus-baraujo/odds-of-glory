'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { GameOption } from '@/features/characters/use-game-options'
import {
  countCheckedSupplies,
  supplyKey,
} from '@/lib/character-sheet/import-templates'
import type { CharacterSheet } from '@/types/character-sheet'

import { ContentWarningBanner } from './content-warning-banner'

type SupplySectionProps = {
  sheet: CharacterSheet
  supplies: GameOption[]
  catalogError?: string | null
  readOnly?: boolean
  supplyEditable?: boolean
  economyReadOnly?: boolean
  compact?: boolean
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
}

export function SupplySection({
  sheet,
  supplies,
  catalogError,
  readOnly = false,
  supplyEditable,
  economyReadOnly,
  compact = false,
  onChange,
}: SupplySectionProps) {
  const canEditSupply = supplyEditable ?? !readOnly
  const canEditEconomy = economyReadOnly !== undefined ? !economyReadOnly : !readOnly

  const checkedCount = countCheckedSupplies(sheet.supply.checked)
  const atLimit = checkedCount >= sheet.supply.load

  const toggleSupply = (slug: string, nextChecked: boolean) => {
    const key = supplyKey(slug)
    if (nextChecked && atLimit && !sheet.supply.checked[key]) return

    onChange((p) => ({
      ...p,
      supply: {
        ...p.supply,
        checked: { ...p.supply.checked, [key]: nextChecked },
      },
    }))
  }

  return (
    <div className="space-y-4" data-testid={compact ? 'play-supply-panel' : 'supply-section'}>
      <ContentWarningBanner
        error={catalogError}
        empty={supplies.length === 0 && !catalogError}
        emptyMessage="Catálogo de suprimentos vazio. Verifique o admin ou recarregue a página."
        testId="supply-catalog-warning"
      />

      <div className={`grid gap-4 ${compact ? 'sm:grid-cols-2' : 'sm:grid-cols-3'}`}>
        <div className="space-y-1">
          <Label>Load</Label>
          <Input
            type="number"
            min={0}
            value={sheet.supply.load}
            readOnly={!canEditSupply}
            data-testid="supply-load"
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                supply: { ...p.supply, load: Number(e.target.value) },
              }))
            }
          />
        </div>
        {!compact && (
          <>
            <div className="space-y-1">
              <Label>Moedas</Label>
              <Input
                type="number"
                min={0}
                value={sheet.economy.coinsOnHand}
                readOnly={!canEditEconomy}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    economy: { ...p.economy, coinsOnHand: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Stash</Label>
              <Input
                type="number"
                min={0}
                value={sheet.economy.stash}
                readOnly={!canEditEconomy}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    economy: { ...p.economy, stash: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </>
        )}
      </div>

      <p className="text-sm text-[var(--steel-light)]" data-testid="supply-count">
        Marcados: {checkedCount} / {sheet.supply.load}
        {atLimit && ' (limite atingido)'}
      </p>

      <div
        className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
        data-testid="supply-grid"
      >
        {supplies.map((opt) => {
          const key = supplyKey(opt.slug)
          const checked = sheet.supply.checked[key] ?? false
          const disabled = !canEditSupply || (atLimit && !checked)

          return (
            <label
              key={opt.id}
              className={`flex items-center gap-2 rounded border px-3 py-2 text-sm ${
                checked
                  ? 'border-[var(--crimson)] bg-[var(--crimson)]/10'
                  : 'border-[var(--parchment-deep)]'
              } ${disabled && !checked ? 'opacity-50' : ''}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                data-testid={`supply-${opt.slug}`}
                onChange={(e) => toggleSupply(opt.slug, e.target.checked)}
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
