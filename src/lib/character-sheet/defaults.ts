import {
  APPROACH_KEYS,
  type ApproachKey,
  type CharacterSheet,
  type CharacterTier,
} from '@/types/character-sheet'

const TIER_DEFAULTS: Record<
  CharacterTier,
  { resolve: number; mana: number; approachMarks: number; xp: number }
> = {
  1: { resolve: 2, mana: 2, approachMarks: 2, xp: 4 },
  2: { resolve: 4, mana: 3, approachMarks: 4, xp: 6 },
  3: { resolve: 6, mana: 4, approachMarks: 6, xp: 8 },
}

function emptyApproaches(marksPerApproach: number) {
  return APPROACH_KEYS.reduce(
    (acc, key) => {
      acc[key] = {
        value: 0,
        marks: Array.from({ length: marksPerApproach }, () => false),
      }
      return acc
    },
    {} as Record<ApproachKey, { value: number; marks: boolean[] }>
  )
}

export function createDefaultSheetState(
  tier: CharacterTier = 1,
  name = 'Novo Personagem'
): CharacterSheet {
  const tierDefaults = TIER_DEFAULTS[tier]

  return {
    tier,
    bio: {
      name,
      appearance: '',
      ancestryId: null,
      backgroundId: null,
      careerId: null,
      size: 'Medium',
      movement: '9 m',
    },
    core: {
      approachPoints: 0,
      saves: { mental: 0, physical: 0 },
      mana: { current: tierDefaults.mana, maxBonus: 0 },
    },
    tracks: {
      resolve: { filled: tierDefaults.resolve, max: tierDefaults.resolve },
      mana: { filled: tierDefaults.mana, max: tierDefaults.mana },
      curse: { filled: 0, max: 6 },
      xp: { filled: 0, max: tierDefaults.xp },
    },
    approaches: emptyApproaches(tier === 1 ? 2 : 2),
    skills: {},
    aspect: {
      templateId: null,
      customName: '',
      oath: '',
      spells: [],
    },
    abilities: [],
    equipment: [],
    supply: { load: 0, items: [] },
    economy: { coinsOnHand: 0, stash: 0 },
    circles: [],
    downtime: {
      projectClock: Array.from({ length: 4 }, () => false),
      notes: '',
    },
    notes: '',
  }
}

export function newId(): string {
  return crypto.randomUUID()
}
