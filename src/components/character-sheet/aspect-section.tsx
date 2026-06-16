'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAspectTemplates } from '@/features/characters/use-game-options'
import { newId } from '@/lib/character-sheet/defaults'
import {
  createEmptyAspect,
  importAspectTemplate,
} from '@/lib/character-sheet/import-templates'
import type { CharacterAspect, CharacterSheet } from '@/types/character-sheet'

import { ContentWarningBanner } from './content-warning-banner'

type AspectSectionProps = {
  aspect: CharacterAspect
  readOnly?: boolean
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
}

export function AspectSection({ aspect, readOnly, onChange }: AspectSectionProps) {
  const { templates, loading, error } = useAspectTemplates()

  const updateAspect = (patch: Partial<CharacterAspect>) => {
    onChange((p) => ({ ...p, aspect: { ...p.aspect, ...patch } }))
  }

  const updateSpell = (idx: number, patch: Partial<CharacterAspect['spells'][number]>) => {
    onChange((p) => {
      const spells = [...p.aspect.spells]
      spells[idx] = { ...spells[idx], ...patch }
      return { ...p, aspect: { ...p.aspect, spells } }
    })
  }

  return (
    <div className="space-y-4">
      <ContentWarningBanner
        error={error}
        empty={!loading && !error && templates.length === 0}
        emptyMessage="Nenhum aspect publicado no banco."
        testId="aspect-catalog-warning"
      />

      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          <Select
            value=""
            disabled={loading}
            onChange={(e) => {
              const template = templates.find((t) => t.id === e.target.value)
              if (template) updateAspect(importAspectTemplate(template))
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
            onClick={() => updateAspect(createEmptyAspect())}
          >
            Criar novo
          </Button>
        </div>
      )}

      <div className="space-y-1">
        <Label>Nome</Label>
        <Input
          value={aspect.customName}
          readOnly={readOnly}
          data-testid="aspect-name"
          onChange={(e) => updateAspect({ customName: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label>Descrição</Label>
        <Textarea
          value={aspect.description}
          readOnly={readOnly}
          rows={2}
          onChange={(e) => updateAspect({ description: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label>Oath</Label>
        <Input
          value={aspect.oath}
          readOnly={readOnly}
          onChange={(e) => updateAspect({ oath: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label>Drive</Label>
        <Textarea
          value={aspect.drive}
          readOnly={readOnly}
          rows={2}
          onChange={(e) => updateAspect({ drive: e.target.value })}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <Label>Spells / Passivas</Label>
          {!readOnly && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                updateAspect({
                  spells: [
                    ...aspect.spells,
                    {
                      id: newId(),
                      name: 'Novo spell',
                      type: 'active',
                      description: '',
                      cost: '',
                    },
                  ],
                })
              }
            >
              + Spell
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {aspect.spells.map((spell, idx) => (
            <div
              key={spell.id}
              className="space-y-2 rounded border border-[var(--parchment-deep)] p-3"
            >
              <div className="grid gap-2 sm:grid-cols-[1fr_auto_80px_auto]">
                <Input
                  value={spell.name}
                  readOnly={readOnly}
                  onChange={(e) => updateSpell(idx, { name: e.target.value })}
                />
                <Select
                  value={spell.type}
                  disabled={readOnly}
                  onChange={(e) =>
                    updateSpell(idx, { type: e.target.value as 'active' | 'passive' })
                  }
                >
                  <option value="active">Ativo</option>
                  <option value="passive">Passivo</option>
                </Select>
                <Input
                  placeholder="Custo"
                  value={spell.cost ?? ''}
                  readOnly={readOnly}
                  onChange={(e) => updateSpell(idx, { cost: e.target.value })}
                />
                {!readOnly && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      updateAspect({
                        spells: aspect.spells.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    Remover
                  </Button>
                )}
              </div>
              <Textarea
                value={spell.description}
                readOnly={readOnly}
                rows={2}
                placeholder="Descrição"
                onChange={(e) => updateSpell(idx, { description: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
