import {
  DEFAULT_ENEMY_CLOCK,
  ENEMY_CLOCK_SIZES,
  isEnemyClockSize,
} from '@/lib/session-state/enemies'
import type { Enemy, Faction, SessionState } from '@/types/session-state'

function clampStanding(value: number): number {
  return Math.min(100, Math.max(-100, Math.round(value)))
}

function normalizeFaction(raw: unknown): Faction | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.id !== 'string') return null
  return {
    id: obj.id,
    name: typeof obj.name === 'string' ? obj.name : 'Facção',
    standing: clampStanding(typeof obj.standing === 'number' ? obj.standing : 0),
  }
}

function normalizeActions(raw: unknown): [boolean, boolean, boolean] {
  if (!Array.isArray(raw)) return [false, false, false]
  return [
    Boolean(raw[0]),
    Boolean(raw[1]),
    Boolean(raw[2]),
  ]
}

function normalizeEnemy(raw: unknown): Enemy | null {
  if (!raw || typeof raw !== 'object') return null
  const obj = raw as Record<string, unknown>
  if (typeof obj.id !== 'string') return null

  const clockRaw = typeof obj.clock === 'number' ? obj.clock : DEFAULT_ENEMY_CLOCK
  const clock = isEnemyClockSize(clockRaw) ? clockRaw : DEFAULT_ENEMY_CLOCK
  const filledRaw = typeof obj.filled === 'number' ? obj.filled : 0
  const filled = Math.min(Math.max(0, Math.round(filledRaw)), clock)

  return {
    id: obj.id,
    name: typeof obj.name === 'string' ? obj.name : '',
    type: typeof obj.type === 'string' ? obj.type : '',
    ameaca: typeof obj.ameaca === 'string' ? obj.ameaca : '',
    defesa: typeof obj.defesa === 'string' ? obj.defesa : '',
    acoes: typeof obj.acoes === 'string' ? obj.acoes : '',
    clock,
    filled,
    actions: normalizeActions(obj.actions),
    defeated: Boolean(obj.defeated),
  }
}

export function normalizeSessionState(raw: Record<string, unknown>): SessionState {
  const factionsRaw = Array.isArray(raw.factions) ? raw.factions : []
  const factions = factionsRaw
    .map(normalizeFaction)
    .filter((f): f is Faction => f !== null)

  const enemiesRaw = Array.isArray(raw.enemies) ? raw.enemies : []
  const enemies = enemiesRaw
    .map(normalizeEnemy)
    .filter((e): e is Enemy => e !== null)

  return {
    heat: typeof raw.heat === 'number' && raw.heat >= 0 ? raw.heat : 0,
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    clocks: Array.isArray(raw.clocks) ? raw.clocks : [],
    factions,
    enemies,
  }
}

export { ENEMY_CLOCK_SIZES }
