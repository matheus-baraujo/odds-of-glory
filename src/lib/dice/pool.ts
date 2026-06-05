export type RollOutcome = 'critical' | 'success' | 'partial' | 'failure'

export type DiceRollResult = {
  formula: string
  dice: number[]
  cut: number
  add: number
  poolSize: number
  result: number
  outcome: RollOutcome
  isCritical: boolean
  usedLowest: boolean
}

function rollD6(): number {
  return Math.floor(Math.random() * 6) + 1
}

function classifyOutcome(dice: number[], result: number): RollOutcome {
  const sixes = dice.filter((d) => d === 6).length
  if (sixes >= 2) return 'critical'
  if (result === 6) return 'success'
  if (result >= 4) return 'partial'
  return 'failure'
}

export function rollPool(options: {
  poolSize: number
  cut?: number
  add?: number
  formula?: string
}): DiceRollResult {
  const cut = Math.max(0, options.cut ?? 0)
  const add = Math.max(0, options.add ?? 0)
  const formula = options.formula ?? `${options.poolSize}d6`

  let dice: number[]
  let usedLowest = false
  let result: number

  if (options.poolSize <= 0) {
    dice = [rollD6(), rollD6()]
    usedLowest = true
    result = Math.min(...dice)
  } else {
    const totalDice = options.poolSize + add
    dice = Array.from({ length: totalDice }, () => rollD6())
    const sorted = [...dice].sort((a, b) => b - a)
    const afterCut = sorted.slice(cut)
    result = afterCut.length > 0 ? afterCut[0] : sorted[sorted.length - 1] ?? 1
  }

  const isCritical = dice.filter((d) => d === 6).length >= 2
  const outcome = classifyOutcome(dice, result)

  return {
    formula,
    dice,
    cut,
    add,
    poolSize: options.poolSize,
    result,
    outcome,
    isCritical,
    usedLowest,
  }
}

export function parseRollCommand(input: string): {
  poolSize: number
  cut: number
  add: number
  formula: string
} | null {
  const trimmed = input.trim()
  const match = trimmed.match(/^\/roll\s+(.+)$/i)
  if (!match) return null

  const expr = match[1].trim()
  let cut = 0
  let add = 0
  let poolPart = expr

  const cutMatch = poolPart.match(/cut\s*(\d+)/i)
  if (cutMatch) {
    cut = parseInt(cutMatch[1], 10)
    poolPart = poolPart.replace(cutMatch[0], '').trim()
  }

  const addMatch = poolPart.match(/add\s*(\d+)/i)
  if (addMatch) {
    add = parseInt(addMatch[1], 10)
    poolPart = poolPart.replace(addMatch[0], '').trim()
  }

  const numMatch = poolPart.match(/^(\d+)$/)
  if (numMatch) {
    const poolSize = parseInt(numMatch[1], 10)
    return { poolSize, cut, add, formula: `${poolSize}d6${cut ? ` cut ${cut}` : ''}${add ? ` add ${add}` : ''}` }
  }

  const plusMatch = poolPart.match(/^(\d+)\s*\+\s*(\d+)$/i)
  if (plusMatch) {
    const poolSize = parseInt(plusMatch[1], 10) + parseInt(plusMatch[2], 10)
    return {
      poolSize,
      cut,
      add,
      formula: `${plusMatch[1]}+${plusMatch[2]}${cut ? ` cut ${cut}` : ''}${add ? ` add ${add}` : ''}`,
    }
  }

  return null
}

export function outcomeLabel(outcome: RollOutcome): string {
  switch (outcome) {
    case 'critical':
      return 'Crítico (6+6)'
    case 'success':
      return 'Sucesso (6)'
    case 'partial':
      return 'Parcial (4–5)'
    case 'failure':
      return 'Falha (1–3)'
  }
}
