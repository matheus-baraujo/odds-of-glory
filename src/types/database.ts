export type Profile = {
  id: string
  display_name: string | null
  avatar_url: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}

export type GameRoomStatus = 'lobby' | 'active' | 'closed'
export type SessionRole = 'master' | 'player'
export type ChatMessageType = 'text' | 'roll' | 'system'

export type GameOptionCategory =
  | 'ancestry'
  | 'background'
  | 'career'
  | 'skill'
  | 'combat_skill'
  | 'language'
  | 'condition'
  | 'tag'
  | 'tier_stat'
  | 'approach'
  | 'supply'
