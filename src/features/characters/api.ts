'use client'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { createDefaultSheetState } from '@/lib/character-sheet/defaults'
import type { CharacterRow, CharacterSheet, CharacterTier } from '@/types/character-sheet'

function parseSheetState(raw: unknown): CharacterSheet {
  if (raw && typeof raw === 'object' && Object.keys(raw as object).length > 0) {
    return raw as CharacterSheet
  }
  return createDefaultSheetState()
}

export async function listCharacters(): Promise<CharacterRow[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row) => ({
    ...row,
    tier: row.tier as CharacterTier,
    sheet_state: parseSheetState(row.sheet_state),
  }))
}

export async function getCharacter(id: string): Promise<CharacterRow | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase.from('characters').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  if (!data) return null

  return {
    ...data,
    tier: data.tier as CharacterTier,
    sheet_state: parseSheetState(data.sheet_state),
  }
}

export async function createCharacter(name: string, tier: CharacterTier = 1): Promise<CharacterRow> {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const sheet_state = createDefaultSheetState(tier, name)

  const { data, error } = await supabase
    .from('characters')
    .insert({
      owner_id: user.id,
      name,
      tier,
      bio: sheet_state.bio,
      sheet_state,
    })
    .select('*')
    .single()

  if (error) throw error

  return {
    ...data,
    tier: data.tier as CharacterTier,
    sheet_state: parseSheetState(data.sheet_state),
  }
}

export async function updateCharacter(
  id: string,
  updates: {
    name?: string
    tier?: CharacterTier
    bio?: CharacterSheet['bio']
    sheet_state?: CharacterSheet
  }
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const payload: Record<string, unknown> = {}

  if (updates.name !== undefined) payload.name = updates.name
  if (updates.tier !== undefined) payload.tier = updates.tier
  if (updates.bio !== undefined) payload.bio = updates.bio
  if (updates.sheet_state !== undefined) {
    payload.sheet_state = updates.sheet_state
    payload.name = updates.sheet_state.bio.name
    payload.tier = updates.sheet_state.tier
    payload.bio = updates.sheet_state.bio
  }

  const { error } = await supabase.from('characters').update(payload).eq('id', id)
  if (error) throw error
}

export async function deleteCharacter(id: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('characters').delete().eq('id', id)
  if (error) throw error
}
