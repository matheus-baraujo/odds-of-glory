import { newId } from '@/lib/character-sheet/defaults'
import type { Enemy, EnemyClockSize } from '@/types/session-state'

export const ENEMY_CLOCK_SIZES: EnemyClockSize[] = [4, 6, 8, 10, 12]

export const DEFAULT_ENEMY_CLOCK: EnemyClockSize = 6

export function isEnemyClockSize(value: number): value is EnemyClockSize {
  return (ENEMY_CLOCK_SIZES as number[]).includes(value)
}

export function createDefaultEnemy(): Enemy {
  return {
    id: newId(),
    name: '',
    type: '',
    ameaca: '',
    defesa: '',
    acoes: '',
    clock: DEFAULT_ENEMY_CLOCK,
    filled: 0,
    actions: [false, false, false],
    defeated: false,
  }
}

export function pipSize(clockSize: number): number {
  if (clockSize <= 6) return 34
  if (clockSize <= 8) return 30
  return 26
}
