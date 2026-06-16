import { newId } from '@/lib/character-sheet/defaults'
import type {
  AbilityEntry,
  CharacterAspect,
  CharacterSheet,
  GearItem,
} from '@/types/character-sheet'
import type {
  AspectTemplate,
  ContentAbility,
  EquipmentTemplate,
  GameOptionRef,
  IdentityOptionData,
} from '@/types/game-content'

export function parseIdentityData(data: Record<string, unknown>): IdentityOptionData {
  const description = typeof data.description === 'string' ? data.description : undefined
  const abilities = Array.isArray(data.abilities)
    ? (data.abilities as ContentAbility[]).filter(
        (a) => a && typeof a.name === 'string' && typeof a.description === 'string'
      )
    : undefined
  return { description, abilities }
}

export function getAbilitiesFromOption(
  option: GameOptionRef | undefined,
  source: 'ancestry' | 'background' | 'career'
): AbilityEntry[] {
  if (!option) return []
  const { abilities } = parseIdentityData(option.data)
  if (!abilities?.length) return []

  return abilities.map((a) => ({
    id: newId(),
    name: a.name,
    source,
    sourceOptionId: option.id,
    cost: a.cost ?? '',
    description: a.description,
  }))
}

export function syncAbilitiesFromIdentity(
  sheet: CharacterSheet,
  ancestry?: GameOptionRef,
  background?: GameOptionRef,
  career?: GameOptionRef
): AbilityEntry[] {
  const manual = sheet.abilities.filter((a) => a.source === 'other')
  const fromIdentity = [
    ...getAbilitiesFromOption(ancestry, 'ancestry'),
    ...getAbilitiesFromOption(background, 'background'),
    ...getAbilitiesFromOption(career, 'career'),
  ]
  return [...fromIdentity, ...manual]
}

export function needsAbilitySync(
  sheet: CharacterSheet,
  ancestry?: GameOptionRef,
  background?: GameOptionRef,
  career?: GameOptionRef
): boolean {
  const hasIdentity =
    Boolean(sheet.bio.ancestryId) ||
    Boolean(sheet.bio.backgroundId) ||
    Boolean(sheet.bio.careerId)
  if (!hasIdentity) return false

  const expected = syncAbilitiesFromIdentity(sheet, ancestry, background, career)
  const expectedCount = expected.filter((a) => a.source !== 'other').length
  const currentCount = sheet.abilities.filter((a) => a.source !== 'other').length
  return expectedCount > currentCount
}

export function importAspectTemplate(template: AspectTemplate): CharacterAspect {
  return {
    templateId: template.id,
    customName: template.name,
    description: template.description,
    oath: template.oath,
    drive: template.drive ?? '',
    spells: template.spells.map((s) => ({
      id: newId(),
      name: s.name,
      type: s.type,
      description: s.description,
      cost: s.cost,
    })),
  }
}

export function importEquipmentTemplate(
  template: EquipmentTemplate,
  tier: CharacterSheet['tier']
): GearItem {
  return {
    id: newId(),
    templateId: template.id,
    name: template.name,
    tier: (template.tier as CharacterSheet['tier']) || tier,
    tags: [...template.tags],
    defense: template.defense,
    wear: 0,
    wearMax: template.wear_max,
    charges: template.charges,
    range: template.range,
    abilities: template.abilities.map((a) => ({
      name: a.name,
      cost: a.cost ?? '',
      description: a.description,
    })),
  }
}

export function createEmptyGearItem(tier: CharacterSheet['tier']): GearItem {
  return {
    id: newId(),
    templateId: null,
    name: 'Novo item',
    tier,
    tags: [],
    defense: 0,
    wear: 0,
    wearMax: 2,
    charges: 0,
    range: '',
    abilities: [],
  }
}

export function createEmptyAspect(): CharacterAspect {
  return {
    templateId: null,
    customName: '',
    description: '',
    oath: '',
    drive: '',
    spells: [],
  }
}

export function countCheckedSupplies(checked: Record<string, boolean>): number {
  return Object.values(checked).filter(Boolean).length
}

export function supplyKey(slug: string): string {
  return `supply_${slug}`
}
