import type { CharacterSheet } from '@/types/character-sheet'

/** Normalize legacy sheet_state shapes without retroactive supply migration. */
export function normalizeCharacterSheet(raw: unknown): CharacterSheet {
  const sheet = raw as CharacterSheet & {
    supply?: { load?: number; items?: unknown[]; checked?: Record<string, boolean> }
    aspect?: CharacterSheet['aspect'] & { description?: string; drive?: string }
    abilities?: Array<CharacterSheet['abilities'][number] & { cost?: string }>
    equipment?: Array<
      CharacterSheet['equipment'][number] & {
        charges?: number
        range?: string
        templateId?: string | null
      }
    >
  }

  return {
    ...sheet,
    aspect: {
      templateId: sheet.aspect?.templateId ?? null,
      customName: sheet.aspect?.customName ?? '',
      description: sheet.aspect?.description ?? '',
      oath: sheet.aspect?.oath ?? '',
      drive: sheet.aspect?.drive ?? '',
      spells: (sheet.aspect?.spells ?? []).map((s) => ({
        ...s,
        description: s.description ?? '',
      })),
    },
    abilities: (sheet.abilities ?? []).map((a) => ({
      ...a,
      cost: a.cost ?? '',
      description: a.description ?? '',
    })),
    equipment: (sheet.equipment ?? []).map((item) => ({
      ...item,
      templateId: item.templateId ?? null,
      charges: item.charges ?? 0,
      range: item.range ?? '',
      abilities: (item.abilities ?? []).map((ab) => ({
        name: ab.name,
        cost: 'cost' in ab && typeof ab.cost === 'string' ? ab.cost : '',
        description: ab.description ?? '',
      })),
    })),
    supply: {
      load: sheet.supply?.load ?? 0,
      checked: sheet.supply?.checked ?? {},
    },
  }
}
