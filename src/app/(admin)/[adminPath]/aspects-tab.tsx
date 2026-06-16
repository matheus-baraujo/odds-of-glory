'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PaginatedTable } from '@/features/admin/paginated-table'
import {
  deleteAspect,
  upsertAspect,
  type AdminAspect,
} from '@/features/admin/api'
import type { AspectSpellTemplate } from '@/types/game-content'

import { adminFormClass } from './admin-tab-styles'

type AspectsTabProps = {
  aspects: AdminAspect[]
  onReload: () => Promise<void>
  onStatus: (message: string) => void
}

function SpellsEditor({
  spells,
  onChange,
}: {
  spells: AspectSpellTemplate[]
  onChange: (spells: AspectSpellTemplate[]) => void
}) {
  const update = (index: number, patch: Partial<AspectSpellTemplate>) => {
    const next = [...spells]
    next[index] = { ...next[index], ...patch }
    onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Spells / Passivas</Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() =>
            onChange([
              ...spells,
              { name: '', type: 'active', description: '', cost: '' },
            ])
          }
        >
          + Spell
        </Button>
      </div>
      {spells.map((spell, idx) => (
        <div
          key={idx}
          className="space-y-2 rounded border border-[var(--parchment-deep)] p-3"
        >
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_80px_auto]">
            <Input
              placeholder="Nome"
              value={spell.name}
              onChange={(e) => update(idx, { name: e.target.value })}
            />
            <Select
              value={spell.type}
              onChange={(e) =>
                update(idx, { type: e.target.value as 'active' | 'passive' })
              }
            >
              <option value="active">Ativo</option>
              <option value="passive">Passivo</option>
            </Select>
            <Input
              placeholder="Custo"
              value={spell.cost ?? ''}
              onChange={(e) => update(idx, { cost: e.target.value })}
            />
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={() => onChange(spells.filter((_, i) => i !== idx))}
            >
              Remover
            </Button>
          </div>
          <Textarea
            placeholder="Descrição"
            rows={2}
            value={spell.description}
            onChange={(e) => update(idx, { description: e.target.value })}
          />
        </div>
      ))}
    </div>
  )
}

export function AspectsTab({ aspects, onReload, onStatus }: AspectsTabProps) {
  const [editing, setEditing] = useState<Partial<AdminAspect> | null>(null)

  const save = async () => {
    if (!editing?.name || !editing.aspect_type) return
    await upsertAspect({
      id: editing.id,
      name: editing.name,
      aspect_type: editing.aspect_type,
      description: editing.description ?? '',
      oath: editing.oath ?? '',
      drive: editing.drive ?? null,
      spells: editing.spells ?? [],
      published: editing.published ?? true,
    })
    setEditing(null)
    onStatus('Aspect salvo.')
    await onReload()
  }

  const sorted = [...aspects].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-4">
      <Button
        onClick={() =>
          setEditing({
            name: '',
            aspect_type: 'oath',
            description: '',
            oath: '',
            drive: '',
            spells: [],
            published: true,
          })
        }
      >
        + Novo aspect
      </Button>

      {editing && (
        <div className={adminFormClass}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Nome</Label>
              <Input
                value={editing.name ?? ''}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Tipo</Label>
              <Select
                value={editing.aspect_type ?? 'oath'}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    aspect_type: e.target.value as AdminAspect['aspect_type'],
                  })
                }
              >
                <option value="oath">Oath</option>
                <option value="pact">Pact</option>
                <option value="miracle">Miracle</option>
                <option value="curse">Curse</option>
              </Select>
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea
              rows={2}
              value={editing.description ?? ''}
              onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            />
          </div>
          <div>
            <Label>Oath</Label>
            <Input
              value={editing.oath ?? ''}
              onChange={(e) => setEditing({ ...editing, oath: e.target.value })}
            />
          </div>
          <div>
            <Label>Drive</Label>
            <Textarea
              rows={2}
              value={editing.drive ?? ''}
              onChange={(e) => setEditing({ ...editing, drive: e.target.value })}
            />
          </div>
          <SpellsEditor
            spells={editing.spells ?? []}
            onChange={(spells) => setEditing({ ...editing, spells })}
          />
          <label className="flex items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={editing.published ?? true}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
            />
            Publicado
          </label>
          <div className="flex gap-2">
            <Button onClick={() => void save()}>Salvar</Button>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <PaginatedTable
        items={sorted}
        emptyMessage="Nenhum aspect cadastrado."
        getRowKey={(item) => item.id}
        columns={[
          {
            header: 'Nome',
            cell: (item) => <span className="font-medium">{item.name}</span>,
          },
          {
            header: 'Tipo',
            cell: (item) => item.aspect_type,
          },
          {
            header: 'Spells',
            cell: (item) => item.spells.length,
          },
          {
            header: 'Ações',
            className: 'text-right',
            cell: (item) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(item)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void deleteAspect(item.id).then(() => onReload())}
                >
                  Excluir
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  )
}
