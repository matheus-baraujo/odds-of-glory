'use client'

import { EnemyCard } from '@/components/dm-screen/enemy-card'
import { Button } from '@/components/ui/button'
import { createDefaultEnemy } from '@/lib/session-state/enemies'
import type { Enemy } from '@/types/session-state'

type EnemiesTabProps = {
  enemies: Enemy[]
  onChange: (enemies: Enemy[]) => void
}

export function EnemiesTab({ enemies, onChange }: EnemiesTabProps) {
  const addEnemy = () => {
    onChange([...enemies, createDefaultEnemy()])
  }

  const updateEnemy = (id: string, enemy: Enemy) => {
    onChange(enemies.map((e) => (e.id === id ? enemy : e)))
  }

  const removeEnemy = (id: string) => {
    onChange(enemies.filter((e) => e.id !== id))
  }

  const resetAllActions = () => {
    onChange(
      enemies.map((e) => ({
        ...e,
        actions: [false, false, false] as [boolean, boolean, boolean],
      }))
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-base text-[var(--steel-light)]">
          Rastreie inimigos, ações de turno e relógios de resistência.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="outline" onClick={resetAllActions}>
            ↺ Reset Turno
          </Button>
          <Button type="button" size="sm" onClick={addEnemy} data-testid="add-enemy">
            + Adicionar Inimigo
          </Button>
        </div>
      </div>

      {enemies.length === 0 ? (
        <p className="py-12 text-center text-sm uppercase tracking-widest text-[var(--steel-light)]">
          Nenhum inimigo adicionado.
          <br />
          Clique em &quot;+ Adicionar Inimigo&quot; para começar.
        </p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {enemies.map((enemy) => (
            <EnemyCard
              key={enemy.id}
              enemy={enemy}
              onChange={(next) => updateEnemy(enemy.id, next)}
              onRemove={() => removeEnemy(enemy.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
