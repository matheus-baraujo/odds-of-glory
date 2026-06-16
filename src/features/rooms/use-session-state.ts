'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { updateSessionState } from '@/features/rooms/api'
import { normalizeSessionState } from '@/lib/session-state/normalize'
import type { SessionState } from '@/types/session-state'

const DEBOUNCE_MS = 500

type UseSessionStateOptions = {
  roomId: string
  sessionState: Record<string, unknown>
  onSessionUpdate?: (state: Record<string, unknown>) => void
}

export function useSessionState({ roomId, sessionState, onSessionUpdate }: UseSessionStateOptions) {
  const [session, setSession] = useState<SessionState>(() => normalizeSessionState(sessionState))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const sessionRef = useRef<SessionState>(session)

  useEffect(() => {
    if (!roomId) return
    const normalized = normalizeSessionState(sessionState)
    setSession(normalized)
    sessionRef.current = normalized
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when entering a room only
  }, [roomId])

  const persist = useCallback(
    async (next: SessionState) => {
      if (!roomId) return
      setSaving(true)
      setError(null)
      try {
        const payload = next as unknown as Record<string, unknown>
        await updateSessionState(roomId, payload)
        setLastSaved(new Date())
        onSessionUpdate?.(payload)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao salvar sessão.')
      } finally {
        setSaving(false)
      }
    },
    [roomId, onSessionUpdate]
  )

  const updateSession = useCallback(
    (updater: SessionState | ((prev: SessionState) => SessionState)) => {
      setSession((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        sessionRef.current = next

        if (saveTimer.current) clearTimeout(saveTimer.current)
        saveTimer.current = setTimeout(() => {
          void persist(next)
        }, DEBOUNCE_MS)

        return next
      })
    },
    [persist]
  )

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])

  return {
    session,
    updateSession,
    saving,
    error,
    lastSaved,
    setSession,
  }
}
