'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  getOptionCategoryLabel,
  OPTION_CATEGORY_LABELS,
} from '@/features/admin/category-labels'
import { PaginatedTable } from '@/features/admin/paginated-table'
import {
  deleteGameOption,
  upsertGameOption,
  type AdminGameOption,
} from '@/features/admin/api'
import type { GameOptionCategory } from '@/types/database'

import {
  adminFormClass,
  adminSubTabsListClass,
  adminSubTabsTriggerClass,
} from './admin-tab-styles'

const OPTION_CATEGORIES = Object.keys(OPTION_CATEGORY_LABELS) as GameOptionCategory[]

type OptionsTabProps = {
  options: AdminGameOption[]
  onReload: () => Promise<void>
  onStatus: (message: string) => void
}

export function OptionsTab({ options, onReload, onStatus }: OptionsTabProps) {
  const [activeCategory, setActiveCategory] = useState<GameOptionCategory>('ancestry')
  const [editingOption, setEditingOption] = useState<Partial<AdminGameOption> | null>(null)

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
    onStatus('Opção salva.')
    await onReload()
  }

  const startNewOption = (category: GameOptionCategory) => {
    setActiveCategory(category)
    setEditingOption({
      category,
      slug: '',
      label: '',
      data: {},
      sort_order: 0,
      published: true,
    })
  }

  return (
    <div className="space-y-4">
      {editingOption && (
        <div className={adminFormClass}>
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
                    {getOptionCategoryLabel(c)}
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
              className="font-mono text-sm"
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
          <label className="flex items-center gap-2 text-base">
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

      <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as GameOptionCategory)}>
        <TabsList className={adminSubTabsListClass}>
          {OPTION_CATEGORIES.map((category) => (
            <TabsTrigger key={category} className={adminSubTabsTriggerClass} value={category}>
              {getOptionCategoryLabel(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {OPTION_CATEGORIES.map((category) => {
          const categoryOptions = options
            .filter((o) => o.category === category)
            .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label))

          return (
            <TabsContent key={category} value={category} className="space-y-4">
              <Button onClick={() => startNewOption(category)}>+ Nova opção</Button>

              <PaginatedTable
                key={category}
                items={categoryOptions}
                getRowKey={(opt) => opt.id}
                columns={[
                  {
                    header: 'Label',
                    cell: (opt) => <span className="font-medium">{opt.label}</span>,
                  },
                  {
                    header: 'Slug',
                    cell: (opt) => <span className="text-[var(--steel-light)]">{opt.slug}</span>,
                  },
                  {
                    header: 'Ordem',
                    cell: (opt) => opt.sort_order,
                  },
                  {
                    header: 'Publicado',
                    cell: (opt) => (opt.published ? 'Sim' : 'Não'),
                  },
                  {
                    header: 'Ações',
                    className: 'text-right',
                    cell: (opt) => (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingOption(opt)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            void deleteGameOption(opt.id).then(() => onReload())
                          }
                        >
                          Excluir
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
