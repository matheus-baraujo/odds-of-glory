'use client'

import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatMessage } from '@/features/chat/use-room-chat'
import { outcomeLabel, type RollOutcome } from '@/lib/dice/pool'

type ChatPanelProps = {
  messages: ChatMessage[]
  loading?: boolean
  onSend: (text: string) => Promise<void>
  currentUserId?: string | null
}

function RollBadge({ outcome }: { outcome: RollOutcome }) {
  const variant =
    outcome === 'critical'
      ? 'success'
      : outcome === 'success'
        ? 'secondary'
        : outcome === 'partial'
          ? 'warning'
          : 'destructive'

  return <Badge variant={variant}>{outcomeLabel(outcome)}</Badge>
}

export function ChatPanel({ messages, loading, onSend, currentUserId }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    if (!input.trim() || sending) return
    setSending(true)
    try {
      await onSend(input)
      setInput('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div
      className="flex h-full min-h-[320px] flex-col rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)]"
      data-testid="chat-panel"
    >
      <div className="border-b border-[var(--parchment-deep)] px-4 py-3">
        <h3 className="font-heading text-sm font-semibold text-[var(--ink)]">Chat & Rolagens</h3>
        <p className="text-xs text-[var(--steel-light)]">
          Digite uma mensagem ou <code className="text-[var(--gold)]">/roll 4</code>
        </p>
      </div>

      <ScrollArea className="flex-1 px-4 py-3">
        {loading ? (
          <p className="text-sm text-[var(--steel-light)]">Carregando mensagens…</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-[var(--steel-light)]">Nenhuma mensagem ainda.</p>
        ) : (
          <ul className="space-y-3">
            {messages.map((msg) => {
              const isOwn = msg.user_id === currentUserId
              const meta = msg.metadata as {
                dice?: number[]
                result?: number
                outcome?: RollOutcome
                formula?: string
              }

              return (
                <li
                  key={msg.id}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    isOwn ? 'bg-[var(--parchment-dark)]' : 'bg-white/40'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-medium text-[var(--ink)]">
                      {msg.author_name ?? 'Jogador'}
                    </span>
                    {msg.type === 'roll' && meta.outcome && <RollBadge outcome={meta.outcome} />}
                    <span className="ml-auto text-[10px] text-[var(--steel-light)]">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[var(--steel)]">{msg.content}</p>
                  {msg.type === 'roll' && meta.dice && (
                    <p className="mt-1 text-xs text-[var(--steel-light)]">
                      Dados: [{meta.dice.join(', ')}]
                      {meta.formula ? ` · ${meta.formula}` : ''}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </ScrollArea>

      <div className="flex gap-2 border-t border-[var(--parchment-deep)] p-3">
        <Input
          value={input}
          placeholder="Mensagem ou /roll 4…"
          data-testid="chat-input"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void submit()
            }
          }}
        />
        <Button
          onClick={() => void submit()}
          disabled={sending || !input.trim()}
          data-testid="chat-send"
        >
          Enviar
        </Button>
      </div>
    </div>
  )
}
