'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useGameOptions } from '@/features/characters/use-game-options'
import { newId } from '@/lib/character-sheet/defaults'
import type { CharacterSheet, CharacterTier } from '@/types/character-sheet'
import { APPROACH_KEYS } from '@/types/character-sheet'

import { PipTrackInput } from './pip-track'

type CharacterSheetEditorProps = {
  sheet: CharacterSheet
  onChange: (updater: (prev: CharacterSheet) => CharacterSheet) => void
  readOnly?: boolean
  saving?: boolean
  lastSaved?: Date | null
}

export function CharacterSheetEditor({
  sheet,
  onChange,
  readOnly = false,
  saving,
  lastSaved,
}: CharacterSheetEditorProps) {
  const { byCategory, loading } = useGameOptions()

  const approaches = byCategory('approach')
  const skills = byCategory('skill')
  const combatSkills = byCategory('combat_skill')
  const languages = byCategory('language')
  const ancestries = byCategory('ancestry')
  const backgrounds = byCategory('background')
  const careers = byCategory('career')

  const approachLabel = (slug: string) =>
    approaches.find((a) => a.slug === slug)?.label ?? slug

  const setTier = (tier: CharacterTier) => {
    onChange((prev) => ({ ...prev, tier }))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--parchment-deep)] pb-3">
        <div>
          <h2 className="font-heading text-xl font-semibold text-[var(--ink)]">
            {sheet.bio.name || 'Sem nome'}
          </h2>
          <p className="text-sm text-[var(--steel-light)]">Tier {sheet.tier}</p>
        </div>
        <div className="text-sm text-[var(--steel-light)]">
          {saving ? 'Salvando…' : lastSaved ? `Salvo ${lastSaved.toLocaleTimeString()}` : ''}
        </div>
      </header>

      <Tabs defaultValue="identity" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-[var(--parchment-dark)] p-1">
          <TabsTrigger value="identity">Identidade</TabsTrigger>
          <TabsTrigger value="core">Atitudes & Core</TabsTrigger>
          <TabsTrigger value="skills">Perícias</TabsTrigger>
          <TabsTrigger value="aspect">Aspect & Spells</TabsTrigger>
          <TabsTrigger value="abilities">Habilidades</TabsTrigger>
          <TabsTrigger value="equipment">Equipamento</TabsTrigger>
          <TabsTrigger value="supply">Suprimentos</TabsTrigger>
          <TabsTrigger value="social">Social & Downtime</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-4 space-y-4 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="char-name">Nome</Label>
              <Input
                id="char-name"
                data-testid="sheet-name"
                value={sheet.bio.name}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({ ...p, bio: { ...p.bio, name: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="char-tier">Tier</Label>
              <Select
                id="char-tier"
                value={String(sheet.tier)}
                disabled={readOnly}
                onChange={(e) => setTier(Number(e.target.value) as CharacterTier)}
              >
                <option value="1">Tier 1</option>
                <option value="2">Tier 2</option>
                <option value="3">Tier 3</option>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="char-appearance">Aparência</Label>
            <Textarea
              id="char-appearance"
              value={sheet.bio.appearance}
              readOnly={readOnly}
              rows={3}
              onChange={(e) =>
                onChange((p) => ({ ...p, bio: { ...p.bio, appearance: e.target.value } }))
              }
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="char-ancestry">Ancestry</Label>
              <Select
                id="char-ancestry"
                value={sheet.bio.ancestryId ?? ''}
                disabled={readOnly || loading}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    bio: { ...p.bio, ancestryId: e.target.value || null },
                  }))
                }
              >
                <option value="">—</option>
                {ancestries.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="char-background">Background</Label>
              <Select
                id="char-background"
                value={sheet.bio.backgroundId ?? ''}
                disabled={readOnly || loading}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    bio: { ...p.bio, backgroundId: e.target.value || null },
                  }))
                }
              >
                <option value="">—</option>
                {backgrounds.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="char-career">Career</Label>
              <Select
                id="char-career"
                value={sheet.bio.careerId ?? ''}
                disabled={readOnly || loading}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    bio: { ...p.bio, careerId: e.target.value || null },
                  }))
                }
              >
                <option value="">—</option>
                {careers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="char-size">Tamanho</Label>
              <Input
                id="char-size"
                value={sheet.bio.size}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({ ...p, bio: { ...p.bio, size: e.target.value } }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="char-movement">Movimento</Label>
              <Input
                id="char-movement"
                value={sheet.bio.movement}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({ ...p, bio: { ...p.bio, movement: e.target.value } }))
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="core" className="mt-4 space-y-6 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <PipTrackInput
              label="Resolve"
              filled={sheet.tracks.resolve.filled}
              max={sheet.tracks.resolve.max}
              readOnly={readOnly}
              onChange={(filled) =>
                onChange((p) => ({
                  ...p,
                  tracks: { ...p.tracks, resolve: { ...p.tracks.resolve, filled } },
                }))
              }
            />
            <PipTrackInput
              label="Mana"
              filled={sheet.tracks.mana.filled}
              max={sheet.tracks.mana.max}
              readOnly={readOnly}
              onChange={(filled) =>
                onChange((p) => ({
                  ...p,
                  tracks: { ...p.tracks, mana: { ...p.tracks.mana, filled } },
                }))
              }
            />
            <PipTrackInput
              label="Maldição"
              filled={sheet.tracks.curse.filled}
              max={sheet.tracks.curse.max}
              readOnly={readOnly}
              onChange={(filled) =>
                onChange((p) => ({
                  ...p,
                  tracks: { ...p.tracks, curse: { ...p.tracks.curse, filled } },
                }))
              }
            />
            <PipTrackInput
              label="XP"
              filled={sheet.tracks.xp.filled}
              max={sheet.tracks.xp.max}
              readOnly={readOnly}
              onChange={(filled) =>
                onChange((p) => ({
                  ...p,
                  tracks: { ...p.tracks, xp: { ...p.tracks.xp, filled } },
                }))
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Saves — Mental</Label>
              <Input
                type="number"
                min={0}
                value={sheet.core.saves.mental}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    core: {
                      ...p.core,
                      saves: { ...p.core.saves, mental: Number(e.target.value) },
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Saves — Physical</Label>
              <Input
                type="number"
                min={0}
                value={sheet.core.saves.physical}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    core: {
                      ...p.core,
                      saves: { ...p.core.saves, physical: Number(e.target.value) },
                    },
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Mana atual</Label>
              <Input
                type="number"
                min={0}
                value={sheet.core.mana.current}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    core: {
                      ...p.core,
                      mana: { ...p.core.mana, current: Number(e.target.value) },
                    },
                  }))
                }
              />
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-heading text-base font-semibold uppercase tracking-wide text-[var(--gold)]">
              Atitudes
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {APPROACH_KEYS.map((key) => {
                const entry = sheet.approaches[key]
                return (
                  <div
                    key={key}
                    className="rounded-lg border border-[var(--parchment-deep)] bg-[var(--parchment-dark)]/50 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-heading text-base font-semibold">
                        {approachLabel(key)}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        max={3}
                        className="h-7 w-14 text-center"
                        value={entry.value}
                        readOnly={readOnly}
                        onChange={(e) =>
                          onChange((p) => ({
                            ...p,
                            approaches: {
                              ...p.approaches,
                              [key]: {
                                ...p.approaches[key],
                                value: Number(e.target.value),
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-1">
                      {entry.marks.map((mark, i) => (
                        <button
                          key={i}
                          type="button"
                          disabled={readOnly}
                          className={`size-4 rounded border ${
                            mark
                              ? 'border-[var(--crimson)] bg-[var(--crimson)]/30'
                              : 'border-[var(--parchment-deep)]'
                          }`}
                          onClick={() =>
                            onChange((p) => {
                              const marks = [...p.approaches[key].marks]
                              marks[i] = !marks[i]
                              return {
                                ...p,
                                approaches: {
                                  ...p.approaches,
                                  [key]: { ...p.approaches[key], marks },
                                },
                              }
                            })
                          }
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-4 space-y-6 overflow-y-auto">
          {[
            { title: 'Combat Skills', items: combatSkills, prefix: 'combat_' },
            { title: 'Perícias', items: skills, prefix: 'skill_' },
            { title: 'Idiomas', items: languages, prefix: 'lang_' },
          ].map(({ title, items, prefix }) => (
            <div key={title}>
              <h3 className="mb-2 font-heading text-base font-semibold text-[var(--gold)]">
                {title}
              </h3>
              <div className="space-y-2">
                {items.map((opt) => {
                  const key = `${prefix}${opt.slug}`
                  const entry = sheet.skills[key] ?? { dots: 0, progressMarks: 0 }
                  return (
                    <div
                      key={opt.id}
                      className="flex flex-wrap items-center gap-3 rounded border border-[var(--parchment-deep)] px-3 py-2"
                    >
                      <span className="min-w-[120px] text-base font-medium">{opt.label}</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((dot) => (
                          <button
                            key={dot}
                            type="button"
                            disabled={readOnly}
                            className={`size-4 rounded-full border-2 ${
                              dot <= entry.dots
                                ? 'border-[var(--steel)] bg-[var(--steel)]'
                                : 'border-[var(--parchment-deep)]'
                            }`}
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
                      <label className="flex items-center gap-1 text-base">
                        <input
                          type="checkbox"
                          checked={entry.edge ?? false}
                          disabled={readOnly}
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
                  )
                })}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="aspect" className="mt-4 space-y-4 overflow-y-auto">
          <div className="space-y-1">
            <Label>Aspecto</Label>
            <Input
              value={sheet.aspect.customName}
              readOnly={readOnly}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  aspect: { ...p.aspect, customName: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>Oath / Drive</Label>
            <Textarea
              value={sheet.aspect.oath}
              readOnly={readOnly}
              rows={3}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  aspect: { ...p.aspect, oath: e.target.value },
                }))
              }
            />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>Spells</Label>
              {!readOnly && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onChange((p) => ({
                      ...p,
                      aspect: {
                        ...p.aspect,
                        spells: [
                          ...p.aspect.spells,
                          { id: newId(), name: 'Novo spell', type: 'active' },
                        ],
                      },
                    }))
                  }
                >
                  + Spell
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {sheet.aspect.spells.map((spell, idx) => (
                <div
                  key={spell.id}
                  className="grid gap-2 rounded border border-[var(--parchment-deep)] p-3 sm:grid-cols-[1fr_auto]"
                >
                  <Input
                    value={spell.name}
                    readOnly={readOnly}
                    onChange={(e) =>
                      onChange((p) => {
                        const spells = [...p.aspect.spells]
                        spells[idx] = { ...spell, name: e.target.value }
                        return { ...p, aspect: { ...p.aspect, spells } }
                      })
                    }
                  />
                  <Select
                    value={spell.type}
                    disabled={readOnly}
                    onChange={(e) =>
                      onChange((p) => {
                        const spells = [...p.aspect.spells]
                        spells[idx] = {
                          ...spell,
                          type: e.target.value as 'active' | 'passive',
                        }
                        return { ...p, aspect: { ...p.aspect, spells } }
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="passive">Passive</option>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="abilities" className="mt-4 space-y-4 overflow-y-auto">
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  abilities: [
                    ...p.abilities,
                    {
                      id: newId(),
                      name: 'Nova habilidade',
                      source: 'other',
                      description: '',
                    },
                  ],
                }))
              }
            >
              + Habilidade
            </Button>
          )}
          {sheet.abilities.map((ability, idx) => (
            <div key={ability.id} className="space-y-2 rounded border border-[var(--parchment-deep)] p-3">
              <Input
                value={ability.name}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => {
                    const abilities = [...p.abilities]
                    abilities[idx] = { ...ability, name: e.target.value }
                    return { ...p, abilities }
                  })
                }
              />
              <Textarea
                value={ability.description}
                readOnly={readOnly}
                rows={2}
                onChange={(e) =>
                  onChange((p) => {
                    const abilities = [...p.abilities]
                    abilities[idx] = { ...ability, description: e.target.value }
                    return { ...p, abilities }
                  })
                }
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="equipment" className="mt-4 space-y-4 overflow-y-auto">
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  equipment: [
                    ...p.equipment,
                    {
                      id: newId(),
                      name: 'Novo item',
                      tier: p.tier,
                      tags: [],
                      defense: 0,
                      wear: 0,
                      wearMax: 2,
                      abilities: [],
                    },
                  ],
                }))
              }
            >
              + Equipamento
            </Button>
          )}
          {sheet.equipment.map((item, idx) => (
            <div key={item.id} className="space-y-2 rounded border border-[var(--parchment-deep)] p-3">
              <Input
                value={item.name}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => {
                    const equipment = [...p.equipment]
                    equipment[idx] = { ...item, name: e.target.value }
                    return { ...p, equipment }
                  })
                }
              />
              <div className="grid gap-2 sm:grid-cols-3">
                <Input
                  type="number"
                  min={0}
                  placeholder="Defesa"
                  value={item.defense}
                  readOnly={readOnly}
                  onChange={(e) =>
                    onChange((p) => {
                      const equipment = [...p.equipment]
                      equipment[idx] = { ...item, defense: Number(e.target.value) }
                      return { ...p, equipment }
                    })
                  }
                />
                <PipTrackInput
                  label="Wear"
                  filled={item.wear}
                  max={item.wearMax}
                  readOnly={readOnly}
                  onChange={(wear) =>
                    onChange((p) => {
                      const equipment = [...p.equipment]
                      equipment[idx] = { ...item, wear }
                      return { ...p, equipment }
                    })
                  }
                />
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="supply" className="mt-4 space-y-4 overflow-y-auto">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <Label>Load</Label>
              <Input
                type="number"
                min={0}
                value={sheet.supply.load}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    supply: { ...p.supply, load: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Moedas</Label>
              <Input
                type="number"
                min={0}
                value={sheet.economy.coinsOnHand}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    economy: { ...p.economy, coinsOnHand: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Stash</Label>
              <Input
                type="number"
                min={0}
                value={sheet.economy.stash}
                readOnly={readOnly}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    economy: { ...p.economy, stash: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  supply: {
                    ...p.supply,
                    items: [
                      ...p.supply.items,
                      { id: newId(), name: 'Item', checked: false },
                    ],
                  },
                }))
              }
            >
              + Suprimento
            </Button>
          )}
          {sheet.supply.items.map((item, idx) => (
            <label key={item.id} className="flex items-center gap-2 text-base">
              <input
                type="checkbox"
                checked={item.checked}
                disabled={readOnly}
                onChange={(e) =>
                  onChange((p) => {
                    const items = [...p.supply.items]
                    items[idx] = { ...item, checked: e.target.checked }
                    return { ...p, supply: { ...p.supply, items } }
                  })
                }
              />
              <Input
                value={item.name}
                readOnly={readOnly}
                className="h-7"
                onChange={(e) =>
                  onChange((p) => {
                    const items = [...p.supply.items]
                    items[idx] = { ...item, name: e.target.value }
                    return { ...p, supply: { ...p.supply, items } }
                  })
                }
              />
            </label>
          ))}
        </TabsContent>

        <TabsContent value="social" className="mt-4 space-y-4 overflow-y-auto">
          <PipTrackInput
            label="Project Clock"
            filled={sheet.downtime.projectClock.filter(Boolean).length}
            max={sheet.downtime.projectClock.length}
            readOnly={readOnly}
            onChange={(filled) =>
              onChange((p) => ({
                ...p,
                downtime: {
                  ...p.downtime,
                  projectClock: p.downtime.projectClock.map((_, i) => i < filled),
                },
              }))
            }
          />
          {!readOnly && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange((p) => ({
                  ...p,
                  circles: [
                    ...p.circles,
                    { id: newId(), name: 'Círculo', relationship: '', notes: '' },
                  ],
                }))
              }
            >
              + Círculo
            </Button>
          )}
          {sheet.circles.map((circle, idx) => (
            <div key={circle.id} className="space-y-2 rounded border border-[var(--parchment-deep)] p-3">
              <Input
                value={circle.name}
                readOnly={readOnly}
                placeholder="Nome"
                onChange={(e) =>
                  onChange((p) => {
                    const circles = [...p.circles]
                    circles[idx] = { ...circle, name: e.target.value }
                    return { ...p, circles }
                  })
                }
              />
              <Input
                value={circle.relationship}
                readOnly={readOnly}
                placeholder="Relacionamento"
                onChange={(e) =>
                  onChange((p) => {
                    const circles = [...p.circles]
                    circles[idx] = { ...circle, relationship: e.target.value }
                    return { ...p, circles }
                  })
                }
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label>Notas</Label>
            <Textarea
              value={sheet.notes}
              readOnly={readOnly}
              rows={4}
              onChange={(e) => onChange((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
