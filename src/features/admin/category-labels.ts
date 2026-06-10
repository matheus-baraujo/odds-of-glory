import type { GameOptionCategory } from '@/types/database'

export const OPTION_CATEGORY_LABELS: Record<GameOptionCategory, string> = {
  ancestry: 'Ancestralidade',
  background: 'Antecedente',
  career: 'Carreira',
  skill: 'Perícia',
  combat_skill: 'Perícia de combate',
  language: 'Idioma',
  condition: 'Condição',
  tag: 'Tag',
  tier_stat: 'Estatística de tier',
  approach: 'Abordagem',
}

export const RULE_CATEGORIES = ['roll_results', 'resources', 'combat'] as const
export type RuleCategory = (typeof RULE_CATEGORIES)[number]

export const RULE_CATEGORY_LABELS: Record<RuleCategory, string> = {
  roll_results: 'Resultados de rolagem',
  resources: 'Recursos',
  combat: 'Combate',
}

export function getOptionCategoryLabel(category: GameOptionCategory): string {
  return OPTION_CATEGORY_LABELS[category] ?? category
}

export function getRuleCategoryLabel(category: string): string {
  return RULE_CATEGORY_LABELS[category as RuleCategory] ?? category
}
