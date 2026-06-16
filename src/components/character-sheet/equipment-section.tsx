'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useEquipmentTemplates } from '@/features/characters/use-game-options'
import {
  createEmptyGearItem,
  importEquipmentTemplate,
} from '@/lib/character-sheet/import-templates'
import type { CharacterSheet, GearItem } from '@/types/character-sheet'

import { ContentWarningBanner } from './content-warning-banner'
import { PipTrackInput } from './pip-track'

type EquipmentSectionProps = {
  sheet: CharacterSheet
  readOnly?: boolean
  playMode?: boolean
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
}

export function EquipmentSection({
  sheet,
  readOnly,
  playMode = false,
  onChange,
}: EquipmentSectionProps) {
  const { templates, loading, error } = useEquipmentTemplates()
  const buildLocked = readOnly || playMode

  const updateItem = (idx: number, patch: Partial<GearItem>) => {
    onChange((p) => {
      const equipment = [...p.equipment]
      equipment[idx] = { ...equipment[idx], ...patch }
      return { ...p, equipment }
    })
  }

  const updateAbility = (
    itemIdx: number,
    abilityIdx: number,
    patch: Partial<GearItem['abilities'][number]>
  ) => {
    onChange((p) => {
      const equipment = [...p.equipment]
      const abilities = [...equipment[itemIdx].abilities]
      abilities[abilityIdx] = { ...abilities[abilityIdx], ...patch }
      equipment[itemIdx] = { ...equipment[itemIdx], abilities }
      return { ...p, equipment }
    })
  }

  return (
    <div className="space-y-4">
      <ContentWarningBanner
        error={error}
        empty={!loading && !error && templates.length === 0}
        emptyMessage="Nenhum equipamento publicado no banco."
        testId="equipment-catalog-warning"
      />

      {!buildLocked && (
        <div className="flex flex-wrap gap-2">
          <Select
            value=""
            disabled={loading}
            data-testid="equipment-import-select"
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value)
              if (template) {
                onChange((p) => ({
                  ...p,
                  equipment: [...p.equipment, importEquipmentTemplate(template, p.tier)],
                }))
              }
            }}
          >
            <option value="">Importar do banco…</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onChange((p) => ({
                ...p,
                equipment: [...p.equipment, createEmptyGearItem(p.tier)],
              }))
            }
          >
            + Equipamento
          </Button>
        </div>
      )}

      {sheet.equipment.map((item, idx) => (
        <div
          key={item.id}
          className="space-y-3 rounded border border-[var(--parchment-deep)] p-3"
          data-testid="equipment-item"
        >
          <div className="flex items-start justify-between gap-2">
            {playMode ? (
              <p className="font-medium text-[var(--ink)]">{item.name}</p>
            ) : (
              <Input
                value={item.name}
                readOnly={buildLocked}
                className="font-medium"
                onChange={(e) => updateItem(idx, { name: e.target.value })}
              />
            )}
            {!buildLocked && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  onChange((p) => ({
                    ...p,
                    equipment: p.equipment.filter((_, i) => i !== idx),
                  }))
                }
              >
                Remover
              </Button>
            )}
          </div>

          {!playMode && (
            <>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <Label>Wear max</Label>
              <Input
                type="number"
                min={0}
                value={item.wearMax}
                readOnly={buildLocked}
                onChange={(e) => updateItem(idx, { wearMax: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Defesa</Label>
              <Input
                type="number"
                min={0}
                value={item.defense}
                readOnly={buildLocked}
                onChange={(e) => updateItem(idx, { defense: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Cargas</Label>
              <Input
                type="number"
                min={0}
                value={item.charges ?? 0}
                readOnly={buildLocked}
                onChange={(e) => updateItem(idx, { charges: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1">
              <Label>Alcance</Label>
              <Input
                value={item.range ?? ''}
                readOnly={buildLocked}
                onChange={(e) => updateItem(idx, { range: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Tags (vírgula)</Label>
            <Input
              value={item.tags.join(', ')}
              readOnly={buildLocked}
              onChange={(e) =>
                updateItem(idx, {
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
            />
          </div>
            </>
          )}

          <PipTrackInput
            label="Wear"
            filled={item.wear}
            max={item.wearMax}
            readOnly={readOnly}
            onChange={(wear) => updateItem(idx, { wear })}
          />

          {!playMode && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Habilidades ativas</Label>
              {!buildLocked && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateItem(idx, {
                      abilities: [
                        ...item.abilities,
                        { name: '', cost: '1', description: '' },
                      ],
                    })
                  }
                >
                  + Habilidade
                </Button>
              )}
            </div>
            {item.abilities.map((ability, abilityIdx) => (
              <div
                key={abilityIdx}
                className="grid gap-2 rounded border border-[var(--parchment-deep)]/60 p-2 sm:grid-cols-[80px_1fr_auto]"
              >
                <Input
                  placeholder="Custo"
                  value={ability.cost}
                  readOnly={buildLocked}
                  onChange={(e) => updateAbility(idx, abilityIdx, { cost: e.target.value })}
                />
                <div className="space-y-1">
                  <Input
                    placeholder="Nome"
                    value={ability.name}
                    readOnly={buildLocked}
                    onChange={(e) => updateAbility(idx, abilityIdx, { name: e.target.value })}
                  />
                  <Textarea
                    placeholder="Descrição"
                    rows={2}
                    value={ability.description}
                    readOnly={buildLocked}
                    onChange={(e) =>
                      updateAbility(idx, abilityIdx, { description: e.target.value })
                    }
                  />
                </div>
                {!buildLocked && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateItem(idx, {
                        abilities: item.abilities.filter((_, i) => i !== abilityIdx),
                      })
                    }
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      ))}
    </div>
  )
}
