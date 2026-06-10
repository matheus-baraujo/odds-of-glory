'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { PaginatedTable } from '@/features/admin/paginated-table'
import {
  deleteEquipment,
  upsertEquipment,
  type AdminEquipment,
} from '@/features/admin/api'

import { adminFormClass } from './admin-tab-styles'

type EquipmentTabProps = {
  equipment: AdminEquipment[]
  onReload: () => Promise<void>
  onStatus: (message: string) => void
}

export function EquipmentTab({ equipment, onReload, onStatus }: EquipmentTabProps) {
  const [editingEquip, setEditingEquip] = useState<Partial<AdminEquipment> | null>(null)

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
    onStatus('Equipamento salvo.')
    await onReload()
  }

  const sortedEquipment = [...equipment].sort(
    (a, b) => a.tier - b.tier || a.name.localeCompare(b.name)
  )

  return (
    <div className="space-y-4">
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
        <div className={adminFormClass}>
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
          <label className="flex items-center gap-2 text-base">
            <input
              type="checkbox"
              checked={editingEquip.published ?? true}
              onChange={(e) =>
                setEditingEquip({ ...editingEquip, published: e.target.checked })
              }
            />
            Publicado
          </label>
          <div className="flex gap-2">
            <Button onClick={() => void saveEquip()}>Salvar</Button>
            <Button variant="outline" onClick={() => setEditingEquip(null)}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      <PaginatedTable
        items={sortedEquipment}
        emptyMessage="Nenhum equipamento cadastrado."
        getRowKey={(item) => item.id}
        columns={[
          {
            header: 'Nome',
            cell: (item) => <span className="font-medium">{item.name}</span>,
          },
          {
            header: 'Tier',
            cell: (item) => `T${item.tier}`,
          },
          {
            header: 'Defesa',
            cell: (item) => item.defense,
          },
          {
            header: 'Wear max',
            cell: (item) => item.wear_max,
          },
          {
            header: 'Tags',
            cell: (item) => (
              <span className="text-[var(--steel-light)]">
                {item.tags.length > 0 ? item.tags.join(', ') : '—'}
              </span>
            ),
          },
          {
            header: 'Ações',
            className: 'text-right',
            cell: (item) => (
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingEquip(item)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => void deleteEquipment(item.id).then(() => onReload())}
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
