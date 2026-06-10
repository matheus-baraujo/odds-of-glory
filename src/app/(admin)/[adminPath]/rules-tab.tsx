'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  getRuleCategoryLabel,
  RULE_CATEGORIES,
  type RuleCategory,
} from '@/features/admin/category-labels'
import { PaginatedTable } from '@/features/admin/paginated-table'
import {
  deleteRuleBlock,
  upsertRuleBlock,
  type AdminRuleBlock,
} from '@/features/admin/api'

import { adminFormClass, adminTabsListClass, adminTabsTriggerClass } from './admin-tab-styles'

type RulesTabProps = {
  rules: AdminRuleBlock[]
  onReload: () => Promise<void>
  onStatus: (message: string) => void
}

export function RulesTab({ rules, onReload, onStatus }: RulesTabProps) {
  const [activeCategory, setActiveCategory] = useState<RuleCategory>('roll_results')
  const [editingRule, setEditingRule] = useState<Partial<AdminRuleBlock> | null>(null)

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
    onStatus('Regra salva.')
    await onReload()
  }

  const startNewRule = (category: RuleCategory) => {
    setActiveCategory(category)
    setEditingRule({
      title: '',
      body: '',
      category,
      sort_order: 0,
      published: true,
    })
  }

  return (
    <div className="space-y-4">
      {editingRule && (
        <div className={adminFormClass}>
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
              <Select
                value={editingRule.category}
                onChange={(e) =>
                  setEditingRule({
                    ...editingRule,
                    category: e.target.value as RuleCategory,
                  })
                }
              >
                {RULE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {getRuleCategoryLabel(c)}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <Label>Sort order</Label>
              <Input
                type="number"
                value={editingRule.sort_order ?? 0}
                onChange={(e) =>
                  setEditingRule({
                    ...editingRule,
                    sort_order: Number(e.target.value),
                  })
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
          <label className="flex items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={editingRule.published ?? true}
              onChange={(e) =>
                setEditingRule({ ...editingRule, published: e.target.checked })
              }
            />
            Publicado
          </label>
          <div className="flex gap-2">
            <Button onClick={() => void saveRule()}>Salvar</Button>
            <Button variant="outline" onClick={() => setEditingRule(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as RuleCategory)}
      >
        <TabsList className={adminTabsListClass}>
          {RULE_CATEGORIES.map((category) => (
            <TabsTrigger key={category} className={adminTabsTriggerClass} value={category}>
              {getRuleCategoryLabel(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {RULE_CATEGORIES.map((category) => {
          const categoryRules = rules
            .filter((r) => r.category === category)
            .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title))

          return (
            <TabsContent key={category} value={category} className="space-y-4">
              <Button onClick={() => startNewRule(category)}>+ Nova regra</Button>

              <PaginatedTable
                key={category}
                items={categoryRules}
                emptyMessage="Nenhuma regra nesta categoria."
                getRowKey={(rule) => rule.id}
                columns={[
                  {
                    header: 'Título',
                    cell: (rule) => <span className="font-medium">{rule.title}</span>,
                  },
                  {
                    header: 'Ordem',
                    cell: (rule) => rule.sort_order,
                  },
                  {
                    header: 'Publicado',
                    cell: (rule) => (rule.published ? 'Sim' : 'Não'),
                  },
                  {
                    header: 'Ações',
                    className: 'text-right',
                    cell: (rule) => (
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingRule(rule)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            void deleteRuleBlock(rule.id).then(() => onReload())
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
