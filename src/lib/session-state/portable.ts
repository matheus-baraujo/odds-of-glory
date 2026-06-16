import { portableSessionDataSchema } from '@/lib/session-state/schema'
import type { PortableSessionData } from '@/lib/session-state/schema'
import type { SessionState } from '@/types/session-state'

export type { PortableSessionData }

export function serializePortable(data: SessionState): string {
  const payload: PortableSessionData = {
    version: 2,
    exportedAt: new Date().toISOString(),
    notes: data.notes,
    heat: data.heat,
    factions: data.factions,
    enemies: data.enemies,
  }
  return JSON.stringify(payload, null, 2)
}

export function parsePortable(json: string): PortableSessionData {
  const parsed = portableSessionDataSchema.parse(JSON.parse(json))
  return parsed
}

export function portableToSessionFields(
  data: PortableSessionData
): Pick<SessionState, 'notes' | 'heat' | 'factions' | 'enemies'> {
  return {
    notes: data.notes,
    heat: data.heat,
    factions: data.factions,
    enemies: data.version === 2 ? data.enemies : [],
  }
}
