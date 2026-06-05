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
  description?: string
}

export type AbilityEntry = {
  id: string
  name: string
  source: 'ancestry' | 'background' | 'career' | 'other'
  description: string
}

export type GearItem = {
  id: string
  name: string
  tier: CharacterTier
  tags: string[]
  defense: number
  wear: number
  wearMax: number
  abilities: { name: string; description: string }[]
}

export type SupplyItem = {
  id: string
  name: string
  checked: boolean
}

export type CircleEntry = {
  id: string
  name: string
  relationship: string
  notes: string
}

export type CharacterAspect = {
  templateId: string | null
  customName: string
  oath: string
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
  supply: { load: number; items: SupplyItem[] }
  economy: { coinsOnHand: number; stash: number }
  circles: CircleEntry[]
  downtime: { projectClock: boolean[]; notes: string }
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
