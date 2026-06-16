import { z } from 'zod'

import { ENEMY_CLOCK_SIZES } from '@/lib/session-state/enemies'

export const factionSchema = z.object({
  id: z.string(),
  name: z.string(),
  standing: z.number().min(-100).max(100),
})

const enemyClockSchema = z.union([
  z.literal(4),
  z.literal(6),
  z.literal(8),
  z.literal(10),
  z.literal(12),
])

export const enemySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    type: z.string(),
    ameaca: z.string(),
    defesa: z.string(),
    acoes: z.string(),
    clock: enemyClockSchema,
    filled: z.number().min(0),
    actions: z.tuple([z.boolean(), z.boolean(), z.boolean()]),
    defeated: z.boolean(),
  })
  .superRefine((enemy, ctx) => {
    if (enemy.filled > enemy.clock) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'filled cannot exceed clock size',
        path: ['filled'],
      })
    }
  })

export const sessionStateSchema = z.object({
  heat: z.number().min(0),
  notes: z.string(),
  clocks: z.array(z.unknown()),
  factions: z.array(factionSchema),
  enemies: z.array(enemySchema),
})

const portableSessionBaseSchema = z.object({
  exportedAt: z.string(),
  notes: z.string(),
  heat: z.number().min(0),
  factions: z.array(factionSchema),
})

export const portableSessionDataV1Schema = portableSessionBaseSchema.extend({
  version: z.literal(1),
})

export const portableSessionDataV2Schema = portableSessionBaseSchema.extend({
  version: z.literal(2),
  enemies: z.array(enemySchema),
})

export const portableSessionDataSchema = z.discriminatedUnion('version', [
  portableSessionDataV1Schema,
  portableSessionDataV2Schema,
])

export type PortableSessionDataV1 = z.infer<typeof portableSessionDataV1Schema>
export type PortableSessionDataV2 = z.infer<typeof portableSessionDataV2Schema>
export type PortableSessionData = z.infer<typeof portableSessionDataSchema>

export { ENEMY_CLOCK_SIZES }
