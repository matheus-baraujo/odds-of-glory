'use client'

import { useEffect, useState } from 'react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import type { GameOptionCategory } from '@/types/database'

export type GameOption = {
  id: string
  category: GameOptionCategory
  slug: string
  label: string
  data: Record<string, unknown>
  sort_order: number
}

export function useGameOptions(categories?: GameOptionCategory[]) {
  const [options, setOptions] = useState<GameOption[]>([])
  const [loading, setLoading] = useState(true)

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

    void query.then(({ data, error }) => {
      if (!mounted) return
      if (!error && data) setOptions(data as GameOption[])
      setLoading(false)
    })

    return () => {
      mounted = false
    }
  }, [categories?.join(',')])

  const byCategory = (category: GameOptionCategory) =>
    options.filter((o) => o.category === category)

  return { options, byCategory, loading }
}

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
  const [templates, setTemplates] = useState<
    {
      id: string
      name: string
      tier: number
      tags: string[]
      defense: number
      wear_max: number
      abilities: { name: string; description: string }[]
    }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const supabase = createBrowserSupabaseClient()

    void supabase
      .from('equipment_templates')
      .select('id, name, tier, tags, defense, wear_max, abilities')
      .eq('published', true)
      .order('name')
      .then(({ data, error }) => {
        if (!mounted) return
        if (!error && data) setTemplates(data as typeof templates)
        setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return { templates, loading }
}
