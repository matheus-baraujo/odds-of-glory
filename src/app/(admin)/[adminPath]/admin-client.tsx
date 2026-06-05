'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  deleteEquipment,
  deleteGameOption,
  deleteRuleBlock,
  listAllEquipment,
  listAllGameOptions,
  listAllRuleBlocks,
  upsertEquipment,
  upsertGameOption,
  upsertRuleBlock,
  type AdminEquipment,
  type AdminGameOption,
  type AdminRuleBlock,
} from '@/features/admin/api'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import type { GameOptionCategory } from '@/types/database'

const OPTION_CATEGORIES: GameOptionCategory[] = [
  'ancestry',
  'background',
  'career',
  'skill',
  'combat_skill',
  'language',
  'condition',
  'tag',
  'tier_stat',
  'approach',
]

export function AdminClient() {
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
  const { loading, isAuthenticated, profile } = useRequireAuth()

  const [options, setOptions] = useState<AdminGameOption[]>([])
  const [rules, setRules] = useState<AdminRuleBlock[]>([])
  const [equipment, setEquipment] = useState<AdminEquipment[]>([])
  const [filterCategory, setFilterCategory] = useState<GameOptionCategory | 'all'>('all')
  const [editingOption, setEditingOption] = useState<Partial<AdminGameOption> | null>(null)
  const [editingRule, setEditingRule] = useState<Partial<AdminRuleBlock> | null>(null)
  const [editingEquip, setEditingEquip] = useState<Partial<AdminEquipment> | null>(null)
  const [status, setStatus] = useState<string | null>(null)

  const reload = async () => {
    const [o, r, e] = await Promise.all([
      listAllGameOptions(),
      listAllRuleBlocks(),
      listAllEquipment(),
    ])
    setOptions(o)
    setRules(r)
    setEquipment(e)
  }

  useEffect(() => {
    if (!profile?.is_admin) return
    void (async () => {
      await reload()
    })()
  }, [profile?.is_admin])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
        <p data-testid="admin-loading">Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!profile?.is_admin) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100"
        data-testid="admin-denied"
      >
        <p>Acesso negado.</p>
      </div>
    )
  }

  const filteredOptions =
    filterCategory === 'all' ? options : options.filter((o) => o.category === filterCategory)

  const saveOption = async () => {
    if (!editingOption?.category || !editingOption.slug || !editingOption.label) return
    await upsertGameOption({
      id: editingOption.id,
      category: editingOption.category,
      slug: editingOption.slug,
      label: editingOption.label,
      data: editingOption.data ?? {},
      sort_order: editingOption.sort_order ?? 0,
      published: editingOption.published ?? true,
    })
    setEditingOption(null)
    setStatus('Opção salva.')
    await reload()
  }

  const saveRule = async () => {
    if (!editingRule?.title || !editingRule.category) return
    await upsertRuleBlock({
      id: editingRule.id,
      title: editingRule.title,
      body: editingRule.body ?? '',
      category: editingRule.category,
      sort_order: editingRule.sort_order ?? 0,
      published: editingRule.published ?? true,
    })
    setEditingRule(null)
    setStatus('Regra salva.')
    await reload()
  }

  const saveEquip = async () => {
    if (!editingEquip?.name || !editingEquip.tier) return
    await upsertEquipment({
      id: editingEquip.id,
      name: editingEquip.name,
      tier: editingEquip.tier,
      tags: editingEquip.tags ?? [],
      defense: editingEquip.defense ?? 0,
      wear_max: editingEquip.wear_max ?? 2,
      abilities: editingEquip.abilities ?? [],
      published: editingEquip.published ?? true,
    })
    setEditingEquip(null)
    setStatus('Equipamento salvo.')
    await reload()
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold" data-testid="admin-title">
            Admin — CMS de Regras
          </h1>
          <p className="mt-1 text-sm text-zinc-400">Rota oculta: /{adminPath}/</p>
          {status && <p className="mt-2 text-sm text-emerald-400">{status}</p>}
        </header>

        <Tabs defaultValue="options">
          <TabsList className="mb-6 flex h-auto flex-wrap bg-zinc-800">
            <TabsTrigger value="options">Opções de personagem</TabsTrigger>
            <TabsTrigger value="rules">Regras</TabsTrigger>
            <TabsTrigger value="equipment">Equipamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="options" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(e.target.value as GameOptionCategory | 'all')
                }
              >
                <option value="all">Todas categorias</option>
                {OPTION_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
              <Button
                onClick={() =>
                  setEditingOption({
                    category: 'skill',
                    slug: '',
                    label: '',
                    data: {},
                    sort_order: 0,
                    published: true,
                  })
                }
              >
                + Nova opção
              </Button>
            </div>

            {editingOption && (
              <div className="space-y-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Categoria</Label>
                    <Select
                      value={editingOption.category}
                      onChange={(e) =>
                        setEditingOption({
                          ...editingOption,
                          category: e.target.value as GameOptionCategory,
                        })
                      }
                    >
                      {OPTION_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label>Slug</Label>
                    <Input
                      value={editingOption.slug ?? ''}
                      onChange={(e) =>
                        setEditingOption({ ...editingOption, slug: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={editingOption.label ?? ''}
                      onChange={(e) =>
                        setEditingOption({ ...editingOption, label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Sort order</Label>
                    <Input
                      type="number"
                      value={editingOption.sort_order ?? 0}
                      onChange={(e) =>
                        setEditingOption({
                          ...editingOption,
                          sort_order: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Data (JSON)</Label>
                  <Textarea
                    rows={4}
                    value={JSON.stringify(editingOption.data ?? {}, null, 2)}
                    className="font-mono text-xs"
                    onChange={(e) => {
                      try {
                        setEditingOption({
                          ...editingOption,
                          data: JSON.parse(e.target.value) as Record<string, unknown>,
                        })
                      } catch {
                        /* ignore parse while typing */
                      }
                    }}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editingOption.published ?? true}
                    onChange={(e) =>
                      setEditingOption({ ...editingOption, published: e.target.checked })
                    }
                  />
                  Publicado
                </label>
                <div className="flex gap-2">
                  <Button onClick={() => void saveOption()}>Salvar</Button>
                  <Button variant="outline" onClick={() => setEditingOption(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
              {filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <span className="text-zinc-400">{opt.category}</span> ·{' '}
                    <span className="font-medium">{opt.label}</span>{' '}
                    <span className="text-zinc-500">({opt.slug})</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingOption(opt)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() =>
                        void deleteGameOption(opt.id).then(() => reload())
                      }
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Button
              onClick={() =>
                setEditingRule({
                  title: '',
                  body: '',
                  category: 'roll_results',
                  sort_order: 0,
                  published: true,
                })
              }
            >
              + Nova regra
            </Button>

            {editingRule && (
              <div className="space-y-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={editingRule.title ?? ''}
                      onChange={(e) =>
                        setEditingRule({ ...editingRule, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Categoria</Label>
                    <Input
                      value={editingRule.category ?? ''}
                      onChange={(e) =>
                        setEditingRule({ ...editingRule, category: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Corpo (markdown)</Label>
                  <Textarea
                    rows={8}
                    value={editingRule.body ?? ''}
                    onChange={(e) =>
                      setEditingRule({ ...editingRule, body: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void saveRule()}>Salvar</Button>
                  <Button variant="outline" onClick={() => setEditingRule(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <span className="text-zinc-400">{rule.category}</span> ·{' '}
                    <span className="font-medium">{rule.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingRule(rule)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void deleteRuleBlock(rule.id).then(() => reload())}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="equipment" className="space-y-4">
            <Button
              onClick={() =>
                setEditingEquip({
                  name: '',
                  tier: 1,
                  tags: [],
                  defense: 0,
                  wear_max: 2,
                  abilities: [],
                  published: true,
                })
              }
            >
              + Novo equipamento
            </Button>

            {editingEquip && (
              <div className="space-y-3 rounded-lg border border-zinc-700 bg-zinc-900 p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={editingEquip.name ?? ''}
                      onChange={(e) =>
                        setEditingEquip({ ...editingEquip, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Tier</Label>
                    <Select
                      value={String(editingEquip.tier ?? 1)}
                      onChange={(e) =>
                        setEditingEquip({
                          ...editingEquip,
                          tier: Number(e.target.value),
                        })
                      }
                    >
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </Select>
                  </div>
                  <div>
                    <Label>Defesa</Label>
                    <Input
                      type="number"
                      value={editingEquip.defense ?? 0}
                      onChange={(e) =>
                        setEditingEquip({
                          ...editingEquip,
                          defense: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Wear max</Label>
                    <Input
                      type="number"
                      value={editingEquip.wear_max ?? 2}
                      onChange={(e) =>
                        setEditingEquip({
                          ...editingEquip,
                          wear_max: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Tags (separadas por vírgula)</Label>
                  <Input
                    value={(editingEquip.tags ?? []).join(', ')}
                    onChange={(e) =>
                      setEditingEquip({
                        ...editingEquip,
                        tags: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => void saveEquip()}>Salvar</Button>
                  <Button variant="outline" onClick={() => setEditingEquip(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            )}

            <ul className="divide-y divide-zinc-800 rounded-lg border border-zinc-800">
              {equipment.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between px-4 py-3 text-sm"
                >
                  <div>
                    <span className="font-medium">{item.name}</span>{' '}
                    <span className="text-zinc-500">
                      T{item.tier} · Def {item.defense}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingEquip(item)}>
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => void deleteEquipment(item.id).then(() => reload())}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
