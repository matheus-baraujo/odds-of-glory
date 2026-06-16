import { z } from 'zod'

import { APPROACH_KEYS } from '@/types/character-sheet'

const pipTrackSchema = z.object({
  filled: z.number().int().min(0),
  max: z.number().int().min(0),
})

const approachEntrySchema = z.object({
  value: z.number().int().min(0).max(3),
  marks: z.array(z.boolean()),
})

const skillEntrySchema = z.object({
  dots: z.number().int().min(0).max(3),
  edge: z.boolean().optional(),
  progressMarks: z.number().int().min(0),
})

const gearAbilitySchema = z.object({
  name: z.string(),
  cost: z.string(),
  description: z.string(),
})

export const characterSheetSchema = z.object({
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  bio: z.object({
    name: z.string().min(1).max(120),
    appearance: z.string().max(2000),
    ancestryId: z.string().nullable(),
    backgroundId: z.string().nullable(),
    careerId: z.string().nullable(),
    size: z.string().max(40),
    movement: z.string().max(40),
  }),
  core: z.object({
    approachPoints: z.number().int().min(0),
    saves: z.object({
      mental: z.number().int().min(0),
      physical: z.number().int().min(0),
    }),
    mana: z.object({
      current: z.number().int().min(0),
      maxBonus: z.number().int().min(0),
    }),
  }),
  tracks: z.object({
    resolve: pipTrackSchema,
    mana: pipTrackSchema,
    curse: pipTrackSchema,
    xp: pipTrackSchema,
  }),
  approaches: z.record(z.enum(APPROACH_KEYS), approachEntrySchema),
  skills: z.record(z.string(), skillEntrySchema),
  aspect: z.object({
    templateId: z.string().nullable(),
    customName: z.string().max(120),
    description: z.string().max(2000),
    oath: z.string().max(2000),
    drive: z.string().max(2000),
    spells: z.array(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        type: z.enum(['active', 'passive']),
        description: z.string(),
        cost: z.string().optional(),
      })
    ),
  }),
  abilities: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      source: z.enum(['ancestry', 'background', 'career', 'other']),
      sourceOptionId: z.string().optional(),
      cost: z.string().optional(),
      description: z.string(),
    })
  ),
  equipment: z.array(
    z.object({
      id: z.string(),
      templateId: z.string().nullable().optional(),
      name: z.string().min(1),
      tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      tags: z.array(z.string()),
      defense: z.number().int().min(0),
      wear: z.number().int().min(0),
      wearMax: z.number().int().min(0),
      charges: z.number().int().min(0).optional(),
      range: z.string().optional(),
      abilities: z.array(gearAbilitySchema),
    })
  ),
  supply: z.object({
    load: z.number().int().min(0),
    checked: z.record(z.string(), z.boolean()),
  }),
  economy: z.object({
    coinsOnHand: z.number().int().min(0),
    stash: z.number().int().min(0),
  }),
  circles: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1),
      relationship: z.string(),
      notes: z.string(),
    })
  ),
  downtime: z.object({
    projectClock: z.array(z.boolean()),
    notes: z.string(),
  }),
  notes: z.string().max(5000),
})

export type CharacterSheetInput = z.infer<typeof characterSheetSchema>
