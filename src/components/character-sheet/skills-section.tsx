'use client'

import type { GameOption } from '@/features/characters/use-game-options'
import type { CharacterSheet } from '@/types/character-sheet'

type SkillSectionGroup = {
  title: string
  items: GameOption[]
  prefix: string
}

type SkillsSectionProps = {
  sheet: CharacterSheet
  sections: SkillSectionGroup[]
  locked?: boolean
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
}

export function SkillsSection({ sheet, sections, locked = false, onChange }: SkillsSectionProps) {
  return (
    <div className="space-y-6">
      {sections.map(({ title, items, prefix }) => (
        <div key={title}>
          <h3 className="mb-2 font-heading text-base font-semibold text-[var(--gold)]">
            {title}
          </h3>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((opt) => {
              const key = `${prefix}${opt.slug}`
              const entry = sheet.skills[key] ?? { dots: 0, progressMarks: 0 }
              return (
                <div
                  key={opt.id}
                  className="rounded border border-[var(--parchment-deep)] px-3 py-2"
                >
                  <p className="truncate text-sm font-medium text-[var(--ink)]">{opt.label}</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((dot) => (
                        <button
                          key={dot}
                          type="button"
                          disabled={locked}
                          className={`size-3.5 rounded-full border-2 ${
                            dot <= entry.dots
                              ? 'border-[var(--steel)] bg-[var(--steel)]'
                              : 'border-[var(--parchment-deep)]'
                          } ${locked ? 'cursor-default' : ''}`}
                          onClick={() =>
                            onChange((p) => ({
                              ...p,
                              skills: {
                                ...p.skills,
                                [key]: {
                                  ...entry,
                                  dots: entry.dots === dot ? dot - 1 : dot,
                                },
                              },
                            }))
                          }
                        />
                      ))}
                    </div>
                    <label className="flex shrink-0 items-center gap-1 text-xs text-[var(--steel-light)]">
                      <input
                        type="checkbox"
                        checked={entry.edge ?? false}
                        disabled={locked}
                        className={locked ? 'cursor-default' : ''}
                        onChange={(e) =>
                          onChange((p) => ({
                            ...p,
                            skills: {
                              ...p.skills,
                              [key]: { ...entry, edge: e.target.checked },
                            },
                          }))
                        }
                      />
                      Edge
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
