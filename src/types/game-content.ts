export type ContentAbility = {
  name: string
  cost: string
  description: string
}

export type AspectSpellTemplate = {
  name: string
  type: 'active' | 'passive'
  description: string
  cost?: string
}

export type IdentityOptionData = {
  description?: string
  abilities?: ContentAbility[]
}

export type EquipmentAbility = ContentAbility

export type AspectTemplate = {
  id: string
  name: string
  aspect_type: 'oath' | 'pact' | 'miracle' | 'curse'
  description: string
  oath: string
  drive: string | null
  spells: AspectSpellTemplate[]
}

export type EquipmentTemplate = {
  id: string
  name: string
  tier: number
  tags: string[]
  defense: number
  wear_max: number
  charges: number
  range: string
  abilities: EquipmentAbility[]
}

export type GameOptionRef = {
  id: string
  category: string
  slug: string
  label: string
  data: Record<string, unknown>
}
