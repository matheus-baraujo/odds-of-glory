export const APPROACH_KEYS = [
  'wrath',
  'iron',
  'finesse',
  'honor',
  'wits',
  'heart',
  'instinct',
  'veils',
] as const

export type ApproachKey = (typeof APPROACH_KEYS)[number]
export type CharacterTier = 1 | 2 | 3

export type PipTrack = {
  filled: number
  max: number
}

export type CharacterBio = {
  name: string
  appearance: string
  ancestryId: string | null
  backgroundId: string | null
  careerId: string | null
  size: string
  movement: string
}

export type CharacterCore = {
  approachPoints: number
  saves: { mental: number; physical: number }
  mana: { current: number; maxBonus: number }
}

export type ApproachEntry = {
  value: number
  marks: boolean[]
}

export type SkillEntry = {
  dots: number
  edge?: boolean
  progressMarks: number
}

export type SpellEntry = {
  id: string
  name: string
  type: 'active' | 'passive'
  description: string
  cost?: string
}

export type AbilityEntry = {
  id: string
  name: string
  source: 'ancestry' | 'background' | 'career' | 'other'
  sourceOptionId?: string
  cost?: string
  description: string
}

export type GearAbility = {
  name: string
  cost: string
  description: string
}

export type GearItem = {
  id: string
  templateId?: string | null
  name: string
  tier: CharacterTier
  tags: string[]
  defense: number
  wear: number
  wearMax: number
  charges?: number
  range?: string
  abilities: GearAbility[]
}

export type CharacterAspect = {
  templateId: string | null
  customName: string
  description: string
  oath: string
  drive: string
  spells: SpellEntry[]
}

export type CharacterSheet = {
  tier: CharacterTier
  bio: CharacterBio
  core: CharacterCore
  tracks: {
    resolve: PipTrack
    mana: PipTrack
    curse: PipTrack
    xp: PipTrack
  }
  approaches: Record<ApproachKey, ApproachEntry>
  skills: Record<string, SkillEntry>
  aspect: CharacterAspect
  abilities: AbilityEntry[]
  equipment: GearItem[]
  supply: { load: number; checked: Record<string, boolean> }
  economy: { coinsOnHand: number; stash: number }
  circles: CircleEntry[]
  downtime: { projectClock: boolean[]; notes: string }
  notes: string
}

export type CircleEntry = {
  id: string
  name: string
  relationship: string
  notes: string
}

export type CharacterRow = {
  id: string
  owner_id: string
  name: string
  tier: CharacterTier
  bio: Record<string, unknown>
  sheet_state: CharacterSheet
  created_at: string
  updated_at: string
}
