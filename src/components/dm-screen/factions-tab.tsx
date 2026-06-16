'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { newId } from '@/lib/character-sheet/defaults'
import type { Faction } from '@/types/session-state'

type FactionsTabProps = {
  factions: Faction[]
  onChange: (factions: Faction[]) => void
}

function formatStanding(value: number): string {
  if (value > 0) return `+${value}`
  return String(value)
}

export function FactionsTab({ factions, onChange }: FactionsTabProps) {
  const addFaction = () => {
    onChange([...factions, { id: newId(), name: 'Nova facção', standing: 0 }])
  }

  const updateFaction = (id: string, patch: Partial<Faction>) => {
    onChange(factions.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const removeFaction = (id: string) => {
    onChange(factions.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-[var(--steel-light)]">
          Ajuste a relação da party com cada facção (-100 hostil a +100 aliado).
        </p>
        <Button type="button" size="sm" onClick={addFaction} data-testid="add-faction">
          Adicionar facção
        </Button>
      </div>

      {factions.length === 0 ? (
        <p className="text-base text-[var(--steel-light)]">Nenhuma facção cadastrada.</p>
      ) : (
        <ul className="space-y-4">
          {factions.map((faction) => (
            <li
              key={faction.id}
              className="space-y-3 rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/30 p-4"
              data-testid={`faction-${faction.id}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <Input
                  value={faction.name}
                  className="max-w-xs flex-1"
                  placeholder="Nome da facção"
                  onChange={(e) => updateFaction(faction.id, { name: e.target.value })}
                />
                <span className="font-mono text-base font-medium text-[var(--ink)]">
                  {formatStanding(faction.standing)}
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => removeFaction(faction.id)}
                >
                  Remover
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-[var(--steel-light)]">
                  <span>Hostil</span>
                  <span>Neutro</span>
                  <span>Aliado</span>
                </div>
                <Slider
                  min={-100}
                  max={100}
                  step={1}
                  value={[faction.standing]}
                  onValueChange={([value]) =>
                    updateFaction(faction.id, { standing: value ?? 0 })
                  }
                />
                <div className="flex justify-between text-xs text-[var(--steel-light)]">
                  <span>-100</span>
                  <span>0</span>
                  <span>+100</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
