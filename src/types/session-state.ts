export type Faction = {
  id: string
  name: string
  standing: number
}

export type EnemyClockSize = 4 | 6 | 8 | 10 | 12

export type Enemy = {
  id: string
  name: string
  type: string
  ameaca: string
  defesa: string
  acoes: string
  clock: EnemyClockSize
  filled: number
  actions: [boolean, boolean, boolean]
  defeated: boolean
}

export type SessionState = {
  heat: number
  notes: string
  clocks: unknown[]
  factions: Faction[]
  enemies: Enemy[]
}
