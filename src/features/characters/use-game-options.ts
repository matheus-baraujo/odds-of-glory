'use client'

import { useEffect, useState } from 'react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { GameOptionCategory } from '@/types/database'
import type { AspectTemplate, EquipmentTemplate } from '@/types/game-content'
import { parseIdentityData } from '@/lib/character-sheet/import-templates'

export type GameOption = {
  id: string
  category: GameOptionCategory
  slug: string
  label: string
  data: Record<string, unknown>
  sort_order: number
}

export const GAME_CONTENT_ERROR_MESSAGE =
  'Conteúdo do jogo indisponível. Tente recarregar a página.'

function toErrorMessage(error: { message: string } | null): string | null {
  if (!error) return null
  return GAME_CONTENT_ERROR_MESSAGE
}

export function useGameOptions(categories?: GameOptionCategory[]) {
  const [options, setOptions] = useState<GameOption[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabaseClient()

    let query = supabase
      .from('game_options')
      .select('id, category, slug, label, data, sort_order')
      .eq('published', true)
      .order('sort_order')

    if (categories?.length) {
      query = query.in('category', categories)
    }

    void query.then(({ data, error: queryError }) => {
      if (!mounted) return
      if (queryError) {
        setError(toErrorMessage(queryError))
        setOptions([])
      } else {
        setOptions((data ?? []) as GameOption[])
        setError(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [categories?.join(',')])

  const byCategory = (category: GameOptionCategory) =>
    options.filter((o) => o.category === category)

  return { options, byCategory, loading, error }
}

export { parseIdentityData }

export function useRuleBlocks(category?: string) {
  const [blocks, setBlocks] = useState<
    { id: string; title: string; body: string; category: string; sort_order: number }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabaseClient()

    let query = supabase
      .from('rule_blocks')
      .select('id, title, body, category, sort_order')
      .eq('published', true)
      .order('sort_order')

    if (category) query = query.eq('category', category)

    void query.then(({ data, error }) => {
      if (!mounted) return
      if (!error && data) setBlocks(data)
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [category])

  return { blocks, loading }
}

export function useEquipmentTemplates() {
  const [templates, setTemplates] = useState<EquipmentTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabaseClient()

    void supabase
      .from('equipment_templates')
      .select('id, name, tier, tags, defense, wear_max, charges, range, abilities')
      .eq('published', true)
      .order('name')
      .then(({ data, error: queryError }) => {
        if (!mounted) return
        if (queryError) {
          setError(toErrorMessage(queryError))
          setTemplates([])
        } else {
          setTemplates((data ?? []) as EquipmentTemplate[])
          setError(null)
        }
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { templates, loading, error }
}

export function useAspectTemplates() {
  const [templates, setTemplates] = useState<AspectTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabaseClient()

    void supabase
      .from('aspect_templates')
      .select('id, name, aspect_type, description, oath, drive, spells')
      .eq('published', true)
      .order('name')
      .then(({ data, error: queryError }) => {
        if (!mounted) return
        if (queryError) {
          setError(toErrorMessage(queryError))
          setTemplates([])
        } else {
          setTemplates((data ?? []) as AspectTemplate[])
          setError(null)
        }
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { templates, loading, error }
}
