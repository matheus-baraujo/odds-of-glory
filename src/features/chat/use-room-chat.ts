'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { parseRollCommand, rollPool, type DiceRollResult } from '@/lib/dice/pool'
import type { ChatMessageType } from '@/types/database'

export type ChatMessage = {
  id: string
  room_id: string
  user_id: string
  type: ChatMessageType
  content: string
  metadata: Record<string, unknown>
  created_at: string
  author_name?: string
}

export function useRoomChat(roomId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const loadMessages = useCallback(async () => {
    if (!roomId) return
    const supabase = createBrowserSupabaseClient()
    const { data, error: fetchError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(200)

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    const userIds = [...new Set((data ?? []).map((m) => m.user_id))]
    let nameMap: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, display_name')
        .in('id', userIds)

      nameMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p.display_name ?? 'Jogador'])
      )
    }

    setMessages(
      (data ?? []).map((m) => ({
        ...m,
        type: m.type as ChatMessageType,
        metadata: (m.metadata ?? {}) as Record<string, unknown>,
        author_name: nameMap[m.user_id] ?? 'Jogador',
      }))
    )
  }, [roomId])

  useEffect(() => {
    if (!roomId) return

    let mounted = true
    setLoading(true)

    void loadMessages().finally(() => {
      if (mounted) setLoading(false)
    })

    const supabase = createBrowserSupabaseClient()
    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const row = payload.new as ChatMessage
          setMessages((prev) => {
            if (prev.some((m) => m.id === row.id)) return prev
            return [
              ...prev,
              {
                ...row,
                author_name: 'Jogador',
              },
            ]
          })
          void loadMessages()
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (!pollRef.current) {
            pollRef.current = setInterval(() => void loadMessages(), 5000)
          }
        }
      })

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }
  }, [roomId, loadMessages])

  const sendMessage = useCallback(
    async (content: string, type: ChatMessageType = 'text', metadata: Record<string, unknown> = {}) => {
      if (!roomId || !userId || !content.trim()) return

      const supabase = createBrowserSupabaseClient()
      const { error: insertError } = await supabase.from('chat_messages').insert({
        room_id: roomId,
        user_id: userId,
        type,
        content: content.trim(),
        metadata,
      })

      if (insertError) setError(insertError.message)
    },
    [roomId, userId]
  )

  const sendRoll = useCallback(
    async (input: string) => {
      const parsed = parseRollCommand(input)
      if (!parsed) {
        await sendMessage('Comando inválido. Use /roll 4 ou /roll 2+2 cut 1 add 1')
        return
      }

      const result: DiceRollResult = rollPool(parsed)
      await sendMessage(
        `${result.formula} → ${result.result} (${result.outcome})`,
        'roll',
        result as unknown as Record<string, unknown>
      )
    },
    [sendMessage]
  )

  const handleInput = useCallback(
    async (input: string) => {
      if (input.trim().toLowerCase().startsWith('/roll')) {
        await sendRoll(input)
      } else {
        await sendMessage(input)
      }
    },
    [sendMessage, sendRoll]
  )

  return { messages, loading, error, sendMessage, sendRoll, handleInput }
}
