'use client'

import { cn } from '@/lib/utils'

type PipTrackProps = {
  label: string
  filled: number
  max: number
  onChange?: (filled: number) => void
  readOnly?: boolean
  className?: string
}

export function PipTrackInput({
  label,
  filled,
  max,
  onChange,
  readOnly,
  className,
}: PipTrackProps) {
  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-[var(--steel-light)]">
        <span>{label}</span>
        <span>
          {filled}/{max}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {Array.from({ length: max }, (_, i) => {
          const active = i < filled
          return (
            <button
              key={i}
              type="button"
              disabled={readOnly}
              aria-label={`${label} ${i + 1}`}
              className={cn(
                'size-5 rounded-full border-2 transition-colors',
                active
                  ? 'border-[var(--gold)] bg-[var(--gold-light)]'
                  : 'border-[var(--parchment-deep)] bg-[var(--parchment-dark)]',
                !readOnly && 'cursor-pointer hover:border-[var(--gold)]'
              )}
              onClick={() => {
                if (readOnly || !onChange) return
                onChange(i < filled ? i : i + 1)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
