'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

const blockCardClass =
  'rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/30'

type RuleBlock = {
  id: string
  title: string
  body: string
}

function readStoredState(storageKey: string): Record<string, boolean> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function writeStoredState(storageKey: string, state: Record<string, boolean>) {
  sessionStorage.setItem(storageKey, JSON.stringify(state))
}

function buildDefaultState(blockIds: string[]): Record<string, boolean> {
  return Object.fromEntries(blockIds.map((id, index) => [id, index === 0]))
}

type CollapsibleRuleBlockProps = {
  id: string
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

function CollapsibleRuleBlock({
  title,
  open,
  onOpenChange,
  children,
}: CollapsibleRuleBlockProps) {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange} className={blockCardClass}>
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left">
        <h3 className="font-heading text-base font-semibold text-[var(--gold)]">{title}</h3>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 text-[var(--steel-light)] transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t border-[var(--parchment-deep)]/60 px-4 pb-4 pt-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

type RulesBlocksPanelProps = {
  blocks: RuleBlock[]
  storageKey: string
  loading: boolean
  loadingLabel: string
  emptyLabel: string
  renderBody: (body: string) => ReactNode
}

export function RulesBlocksPanel({
  blocks,
  storageKey,
  loading,
  loadingLabel,
  emptyLabel,
  renderBody,
}: RulesBlocksPanelProps) {
  const blockIds = blocks.map((b) => b.id)
  const [openState, setOpenState] = useState<Record<string, boolean>>(() =>
    buildDefaultState(blockIds)
  )
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (blockIds.length === 0) return
    const stored = readStoredState(storageKey)
    const merged = { ...buildDefaultState(blockIds), ...stored }
    const filtered = Object.fromEntries(
      blockIds.map((id) => [id, merged[id] ?? false])
    )
    setOpenState(filtered)
    setHydrated(true)
  }, [storageKey, blockIds.join(',')])

  useEffect(() => {
    if (!hydrated || blockIds.length === 0) return
    writeStoredState(storageKey, openState)
  }, [openState, storageKey, hydrated, blockIds.length])

  const setBlockOpen = useCallback((id: string, open: boolean) => {
    setOpenState((prev) => ({ ...prev, [id]: open }))
  }, [])

  const expandAll = useCallback(() => {
    setOpenState(Object.fromEntries(blockIds.map((id) => [id, true])))
  }, [blockIds])

  const collapseAll = useCallback(() => {
    setOpenState(Object.fromEntries(blockIds.map((id) => [id, false])))
  }, [blockIds])

  if (loading) {
    return <p className="text-sm text-[var(--steel-light)]">{loadingLabel}</p>
  }

  if (blocks.length === 0) {
    return <p className="text-sm text-[var(--steel-light)]">{emptyLabel}</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline" onClick={expandAll}>
          Expandir todos
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={collapseAll}>
          Recolher todos
        </Button>
      </div>
      <div className="space-y-3">
        {blocks.map((block) => (
          <CollapsibleRuleBlock
            key={block.id}
            id={block.id}
            title={block.title}
            open={openState[block.id] ?? false}
            onOpenChange={(open) => setBlockOpen(block.id, open)}
          >
            {renderBody(block.body)}
          </CollapsibleRuleBlock>
        ))}
      </div>
    </div>
  )
}
