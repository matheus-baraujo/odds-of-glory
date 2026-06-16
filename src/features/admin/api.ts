import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { GameOptionCategory } from '@/types/database'
import type { AspectSpellTemplate, ContentAbility } from '@/types/game-content'

export type AdminGameOption = {
  id: string
  category: GameOptionCategory
  slug: string
  label: string
  data: Record<string, unknown>
  sort_order: number
  published: boolean
}

export type AdminRuleBlock = {
  id: string
  title: string
  body: string
  category: string
  sort_order: number
  published: boolean
}

export type AdminEquipment = {
  id: string
  name: string
  tier: number
  tags: string[]
  defense: number
  wear_max: number
  charges: number
  range: string
  abilities: ContentAbility[]
  published: boolean
}

export type AdminAspect = {
  id: string
  name: string
  aspect_type: 'oath' | 'pact' | 'miracle' | 'curse'
  description: string
  oath: string
  drive: string | null
  spells: AspectSpellTemplate[]
  published: boolean
}

export async function listAllGameOptions(): Promise<AdminGameOption[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('game_options')
    .select('*')
    .order('category')
    .order('sort_order')

  if (error) throw error
  return (data ?? []) as AdminGameOption[]
}

export async function upsertGameOption(
  option: Partial<AdminGameOption> & { category: GameOptionCategory; slug: string; label: string }
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('game_options').upsert({
    id: option.id,
    category: option.category,
    slug: option.slug,
    label: option.label,
    data: option.data ?? {},
    sort_order: option.sort_order ?? 0,
    published: option.published ?? true,
  })
  if (error) throw error
}

export async function deleteGameOption(id: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('game_options').delete().eq('id', id)
  if (error) throw error
}

export async function listAllRuleBlocks(): Promise<AdminRuleBlock[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('rule_blocks')
    .select('*')
    .order('category')
    .order('sort_order')

  if (error) throw error
  return (data ?? []) as AdminRuleBlock[]
}

export async function upsertRuleBlock(
  block: Partial<AdminRuleBlock> & { title: string; category: string }
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('rule_blocks').upsert({
    id: block.id,
    title: block.title,
    body: block.body ?? '',
    category: block.category,
    sort_order: block.sort_order ?? 0,
    published: block.published ?? true,
  })
  if (error) throw error
}

export async function deleteRuleBlock(id: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('rule_blocks').delete().eq('id', id)
  if (error) throw error
}

export async function listAllEquipment(): Promise<AdminEquipment[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.from('equipment_templates').select('*').order('name')
  if (error) throw error
  return (data ?? []) as AdminEquipment[]
}

export async function upsertEquipment(
  item: Partial<AdminEquipment> & { name: string; tier: number }
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('equipment_templates').upsert({
    id: item.id,
    name: item.name,
    tier: item.tier,
    tags: item.tags ?? [],
    defense: item.defense ?? 0,
    wear_max: item.wear_max ?? 2,
    charges: item.charges ?? 0,
    range: item.range ?? '',
    abilities: item.abilities ?? [],
    published: item.published ?? true,
  })
  if (error) throw error
}

export async function deleteEquipment(id: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('equipment_templates').delete().eq('id', id)
  if (error) throw error
}

export async function listAllAspects(): Promise<AdminAspect[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.from('aspect_templates').select('*').order('name')
  if (error) throw error
  return (data ?? []) as AdminAspect[]
}

export async function upsertAspect(
  aspect: Partial<AdminAspect> & { name: string; aspect_type: AdminAspect['aspect_type'] }
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('aspect_templates').upsert({
    id: aspect.id,
    name: aspect.name,
    aspect_type: aspect.aspect_type,
    description: aspect.description ?? '',
    oath: aspect.oath ?? '',
    drive: aspect.drive ?? null,
    spells: aspect.spells ?? [],
    published: aspect.published ?? true,
  })
  if (error) throw error
}

export async function deleteAspect(id: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('aspect_templates').delete().eq('id', id)
  if (error) throw error
}
