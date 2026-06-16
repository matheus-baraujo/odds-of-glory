'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ENEMY_CLOCK_SIZES,
  pipSize,
} from '@/lib/session-state/enemies'
import type { Enemy, EnemyClockSize } from '@/types/session-state'
import { cn } from '@/lib/utils'

type EnemyCardProps = {
  enemy: Enemy
  onChange: (enemy: Enemy) => void
  onRemove: () => void
}

export function EnemyCard({ enemy, onChange, onRemove }: EnemyCardProps) {
  const update = (patch: Partial<Enemy>) => {
    onChange({ ...enemy, ...patch })
  }

  const setClock = (size: EnemyClockSize) => {
    onChange({
      ...enemy,
      clock: size,
      filled: Math.min(enemy.filled, size),
    })
  }

  const togglePip = (idx: number) => {
    if (enemy.defeated) return

    let filled: number
    if (enemy.filled === idx + 1) {
      filled = idx
    } else {
      filled = idx + 1
    }

    const defeated = filled >= enemy.clock
    onChange({ ...enemy, filled, defeated })
  }

  const toggleAction = (idx: number) => {
    if (enemy.defeated) return
    const actions = [...enemy.actions] as [boolean, boolean, boolean]
    actions[idx] = !actions[idx]
    onChange({ ...enemy, actions })
  }

  const resetActions = () => {
    onChange({ ...enemy, actions: [false, false, false] })
  }

  const revive = () => {
    onChange({
      ...enemy,
      defeated: false,
      filled: Math.max(0, enemy.clock - 1),
    })
  }

  const size = pipSize(enemy.clock)

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/30',
        enemy.defeated && 'opacity-60'
      )}
      data-testid={`enemy-${enemy.id}`}
    >
      <div
        className={cn(
          'border-b-2 border-[var(--gold-dim)] bg-[var(--parchment-dark)]/50 px-3.5 py-3',
          enemy.defeated && 'bg-[var(--parchment-dark)]/80'
        )}
      >
        <div className="flex items-start gap-2.5">
          <div className="min-w-0 flex-1 space-y-1">
            <Input
              value={enemy.name}
              placeholder="Nome do inimigo"
              spellCheck={false}
              className="border-none bg-transparent px-0 font-heading text-lg font-bold text-[var(--gold)] shadow-none focus-visible:ring-0"
              onChange={(e) => update({ name: e.target.value })}
            />
            <Input
              value={enemy.type}
              placeholder="tipo / descrição"
              spellCheck={false}
              className="border-none bg-transparent px-0 text-xs uppercase tracking-widest text-[var(--steel-light)] shadow-none focus-visible:ring-0"
              onChange={(e) => update({ type: e.target.value })}
            />
          </div>
          <button
            type="button"
            title="Remover"
            className="shrink-0 px-1 text-[var(--steel-light)] transition-colors hover:text-red-600"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b border-[var(--parchment-deep)]">
        <div className="flex flex-col items-center border-r border-[var(--parchment-deep)] px-2 py-2.5">
          <span className="mb-1 text-[0.65rem] uppercase tracking-widest text-[var(--steel-light)]">
            Ameaça (A)
          </span>
          <Input
            value={enemy.ameaca}
            inputMode="numeric"
            placeholder="—"
            className="h-auto w-12 border-none bg-transparent p-0 text-center font-heading text-2xl font-bold text-red-600 shadow-none focus-visible:ring-0"
            onChange={(e) => update({ ameaca: e.target.value })}
          />
        </div>
        <div className="flex flex-col items-center border-r border-[var(--parchment-deep)] px-2 py-2.5">
          <span className="mb-1 text-[0.65rem] uppercase tracking-widest text-[var(--steel-light)]">
            Defesa
          </span>
          <Input
            value={enemy.defesa}
            inputMode="numeric"
            placeholder="—"
            className="h-auto w-12 border-none bg-transparent p-0 text-center font-heading text-2xl font-bold text-blue-500 shadow-none focus-visible:ring-0"
            onChange={(e) => update({ defesa: e.target.value })}
          />
        </div>
        <div className="flex flex-col items-center px-2 py-2.5">
          <span className="mb-1 text-[0.65rem] uppercase tracking-widest text-[var(--steel-light)]">
            Ações / turno
          </span>
          <Input
            value={enemy.acoes}
            inputMode="numeric"
            placeholder="3"
            className="h-auto w-12 border-none bg-transparent p-0 text-center font-heading text-2xl font-bold text-[var(--gold)] shadow-none focus-visible:ring-0"
            onChange={(e) => update({ acoes: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 border-b border-[var(--parchment-deep)] px-3.5 py-2.5">
        <span className="mr-1 text-[0.65rem] uppercase tracking-widest text-[var(--steel-light)]">
          Ações
        </span>
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            type="button"
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded border-2 border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/50 transition-colors hover:border-[var(--gold)]',
              enemy.actions[i] && 'border-red-700 bg-red-800/60 text-red-200'
            )}
            onClick={() => toggleAction(i)}
          >
            {enemy.actions[i] ? (
              <span className="text-xs leading-none">✕</span>
            ) : null}
          </button>
        ))}
        <button
          type="button"
          className="ml-1.5 rounded border border-[var(--parchment-deep)] px-2 py-1 text-[0.65rem] uppercase tracking-wide text-[var(--steel-light)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          onClick={resetActions}
        >
          ↺
        </button>
      </div>

      <div className="px-3.5 py-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.65rem] uppercase tracking-widest text-[var(--steel-light)]">
            Resistência
          </span>
          <div className="flex gap-1">
            {ENEMY_CLOCK_SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={cn(
                  'rounded border border-[var(--parchment-deep)] px-1.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--steel-light)] transition-colors hover:border-[var(--gold-dim)] hover:text-[var(--gold)]',
                  enemy.clock === s &&
                    'border-[var(--gold)] bg-[var(--gold-dim)] text-[var(--parchment-light)]'
                )}
                onClick={() => setClock(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: enemy.clock }, (_, i) => (
            <button
              key={i}
              type="button"
              style={{ width: size, height: size }}
              className={cn(
                'shrink-0 rounded border-2 border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/50 transition-colors hover:border-[var(--gold-dim)]',
                i < enemy.filled && 'border-red-700 bg-red-700 hover:bg-red-800'
              )}
              onClick={() => togglePip(i)}
            />
          ))}
        </div>
      </div>

      {enemy.defeated && (
        <button
          type="button"
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40"
          onClick={revive}
        >
          <span className="-rotate-6 border-2 border-red-600 px-5 py-1.5 font-heading text-base font-bold uppercase tracking-widest text-red-500 shadow-[0_0_20px_rgba(200,48,48,0.4)]">
            Derrotado
          </span>
        </button>
      )}
    </div>
  )
}
