'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { ContentAbility } from '@/types/game-content'

type AbilitiesEditorProps = {
  abilities: ContentAbility[]
  onChange: (abilities: ContentAbility[]) => void
}

export function AbilitiesEditor({ abilities, onChange }: AbilitiesEditorProps) {
  const update = (index: number, patch: Partial<ContentAbility>) => {
    const next = [...abilities]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Habilidades</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange([...abilities, { name: '', cost: '1', description: '' }])
          }
        >
          + Habilidade
        </Button>
      </div>
      {abilities.map((ability, idx) => (
        <div
          key={idx}
          className="space-y-2 rounded border border-[var(--parchment-deep)] p-3"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr_80px_auto]">
            <Input
              placeholder="Nome"
              value={ability.name}
              onChange={(e) => update(idx, { name: e.target.value })}
            />
            <Input
              placeholder="Custo"
              value={ability.cost}
              onChange={(e) => update(idx, { cost: e.target.value })}
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange(abilities.filter((_, i) => i !== idx))}
            >
              Remover
            </Button>
          </div>
          <Textarea
            placeholder="Descrição"
            rows={2}
            value={ability.description}
            onChange={(e) => update(idx, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}
