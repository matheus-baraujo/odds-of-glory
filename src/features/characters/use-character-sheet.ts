'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { characterSheetSchema } from '@/lib/character-sheet/schema'
import { normalizeCharacterSheet } from '@/lib/character-sheet/normalize'
import type { CharacterRow, CharacterSheet } from '@/types/character-sheet'

import { getCharacter, updateCharacter } from './api'

const DEBOUNCE_MS = 500

export function useCharacterSheet(characterId: string) {
  const [character, setCharacter] = useState<CharacterRow | null>(null)
  const [sheet, setSheet] = useState<CharacterSheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sheetRef = useRef<CharacterSheet | null>(null)

  useEffect(() => {
    if (!characterId || characterId === 'none') return

    let mounted = true
    setLoading(true)
    void getCharacter(characterId)
      .then((row) => {
        if (!mounted) return
        if (!row) {
          setError('Ficha não encontrada.')
          return
        }
        const normalized = normalizeCharacterSheet(row.sheet_state)
        setCharacter(row)
        setSheet(normalized)
        sheetRef.current = normalized
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : 'Erro ao carregar ficha.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [characterId])

  const persist = useCallback(
    async (nextSheet: CharacterSheet) => {
      const parsed = characterSheetSchema.safeParse(nextSheet)
      if (!parsed.success) {
        setError('Dados inválidos na ficha.')
        return
      }

      setSaving(true)
      setError(null)
      try {
        await updateCharacter(characterId, { sheet_state: parsed.data })
        setLastSaved(new Date())
        setCharacter((prev) =>
          prev
            ? {
                ...prev,
                name: parsed.data.bio.name,
                tier: parsed.data.tier,
                sheet_state: parsed.data,
              }
            : prev
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar.')
      } finally {
        setSaving(false)
      }
    },
    [characterId]
  )

  const updateSheet = useCallback(
    (updater: (prev: CharacterSheet) => CharacterSheet) => {
      setSheet((prev) => {
        if (!prev) return prev
        const next = updater(prev)
        sheetRef.current = next

        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
          void persist(next)
        }, DEBOUNCE_MS)

        return next
      })
    },
    [persist]
  )

  const saveNow = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    if (sheetRef.current) await persist(sheetRef.current)
  }, [persist])

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  return {
    character,
    sheet,
    loading,
    saving,
    error,
    lastSaved,
    updateSheet,
    saveNow,
    setSheet,
  }
}
