import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { GameRoomStatus, SessionRole } from '@/types/database'

export type GameRoom = {
  id: string
  code: string
  name: string
  master_id: string
  status: GameRoomStatus
  session_state: Record<string, unknown>
  created_at: string
}

export type RoomParticipant = {
  room_id: string
  user_id: string
  session_role: SessionRole
  character_id: string | null
  joined_at: string
  profile?: { display_name: string | null }
  character?: { id: string; name: string } | null
}

function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function createRoom(name: string): Promise<GameRoom> {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  let code = generateRoomCode()
  let attempts = 0

  while (attempts < 5) {
    const { data, error } = await supabase
      .from('game_rooms')
      .insert({
        code,
        name,
        master_id: user.id,
        status: 'lobby',
        session_state: { heat: 0, notes: '', clocks: [], factions: [], enemies: [] },
      })
      .select('*')
      .single()

    if (!error && data) {
      const { error: participantError } = await supabase.from('room_participants').insert({
        room_id: data.id,
        user_id: user.id,
        session_role: 'master',
      })
      if (participantError) throw participantError
      return data as GameRoom
    }

    if (error?.code === '23505') {
      code = generateRoomCode()
      attempts++
      continue
    }
    throw error ?? new Error('Failed to create room')
  }

  throw new Error('Could not generate unique room code')
}

export async function joinRoom(code: string): Promise<GameRoom> {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const normalized = code.trim().toUpperCase()
  const { data, error } = await supabase.rpc('join_room_by_code', {
    p_code: normalized,
  })

  if (error) throw new Error(error.message)
  if (!data) throw new Error('Sala não encontrada.')

  return data as GameRoom
}

export async function getRoomByCode(code: string): Promise<GameRoom | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('code', code.trim().toUpperCase())
    .maybeSingle()

  if (error) throw error
  return data as GameRoom | null
}

export async function getRoomParticipant(
  roomId: string,
  userId: string
): Promise<RoomParticipant | null> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('room_participants')
    .select('*')
    .eq('room_id', roomId)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data as RoomParticipant | null
}

export async function listRoomParticipants(roomId: string): Promise<RoomParticipant[]> {
  const supabase = createBrowserSupabaseClient()
  const { data, error } = await supabase
    .from('room_participants')
    .select('*')
    .eq('room_id', roomId)

  if (error) throw error

  const rows = data ?? []
  const userIds = [...new Set(rows.map((r) => r.user_id))]
  const characterIds = [
    ...new Set(rows.map((r) => r.character_id).filter(Boolean)),
  ] as string[]

  let profileMap: Record<string, { display_name: string | null }> = {}
  let characterMap: Record<string, { id: string; name: string }> = {}

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name')
      .in('id', userIds)
    profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  }

  if (characterIds.length > 0) {
    const { data: characters } = await supabase
      .from('characters')
      .select('id, name')
      .in('id', characterIds)
    characterMap = Object.fromEntries((characters ?? []).map((c) => [c.id, c]))
  }

  return rows.map((row) => ({
    room_id: row.room_id,
    user_id: row.user_id,
    session_role: row.session_role as RoomParticipant['session_role'],
    character_id: row.character_id,
    joined_at: row.joined_at,
    profile: profileMap[row.user_id],
    character: row.character_id ? characterMap[row.character_id] ?? null : null,
  }))
}

export async function setParticipantCharacter(
  roomId: string,
  characterId: string
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { error } = await supabase
    .from('room_participants')
    .update({ character_id: characterId })
    .eq('room_id', roomId)
    .eq('user_id', user.id)

  if (error) throw error
}

export async function updateSessionState(
  roomId: string,
  sessionState: Record<string, unknown>
): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase
    .from('game_rooms')
    .update({ session_state: sessionState, status: 'active' })
    .eq('id', roomId)

  if (error) throw error
}

export async function startRoom(roomId: string): Promise<void> {
  const supabase = createBrowserSupabaseClient()
  const { error } = await supabase.from('game_rooms').update({ status: 'active' }).eq('id', roomId)
  if (error) throw error
}
