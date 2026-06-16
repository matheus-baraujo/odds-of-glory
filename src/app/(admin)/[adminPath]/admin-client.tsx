'use client'

import { useEffect, useState } from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  listAllAspects,
  listAllEquipment,
  listAllGameOptions,
  listAllRuleBlocks,
  type AdminAspect,
  type AdminEquipment,
  type AdminGameOption,
  type AdminRuleBlock,
} from '@/features/admin/api'
import { useRequireAuth } from '@/features/auth/use-require-auth'

import { adminTabsListClass, adminTabsTriggerClass } from './admin-tab-styles'
import { AspectsTab } from './aspects-tab'
import { EquipmentTab } from './equipment-tab'
import { OptionsTab } from './options-tab'
import { RulesTab } from './rules-tab'

export function AdminClient() {
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
  const { loading, isAuthenticated, profile } = useRequireAuth()

  const [options, setOptions] = useState<AdminGameOption[]>([])
  const [rules, setRules] = useState<AdminRuleBlock[]>([])
  const [equipment, setEquipment] = useState<AdminEquipment[]>([])
  const [aspects, setAspects] = useState<AdminAspect[]>([])
  const [status, setStatus] = useState<string | null>(null)

  const reload = async () => {
    const [o, r, e, a] = await Promise.all([
      listAllGameOptions(),
      listAllRuleBlocks(),
      listAllEquipment(),
      listAllAspects(),
    ])
    setOptions(o)
    setRules(r)
    setEquipment(e)
    setAspects(a)
  }

  useEffect(() => {
    if (!profile?.is_admin) return
    void (async () => {
      await reload()
    })()
  }, [profile?.is_admin])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--parchment)] text-[var(--ink)]">
        <p data-testid="admin-loading">Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (!profile?.is_admin) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--parchment)] text-[var(--ink)]"
        data-testid="admin-denied"
      >
        <p>Acesso negado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--parchment)] px-4 py-10 text-[var(--ink)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold" data-testid="admin-title">
            Admin — CMS de Regras
          </h1>
          <p className="mt-1 text-base text-[var(--steel-light)]">Rota oculta: /{adminPath}/</p>
          {status && <p className="mt-2 text-base text-emerald-700">{status}</p>}
        </header>

        <Tabs defaultValue="options">
          <TabsList className={adminTabsListClass}>
            <TabsTrigger className={adminTabsTriggerClass} value="options">
              Opções de personagem
            </TabsTrigger>
            <TabsTrigger className={adminTabsTriggerClass} value="rules">
              Regras
            </TabsTrigger>
            <TabsTrigger className={adminTabsTriggerClass} value="equipment">
              Equipamentos
            </TabsTrigger>
            <TabsTrigger className={adminTabsTriggerClass} value="aspects">
              Aspects
            </TabsTrigger>
          </TabsList>

          <TabsContent value="options">
            <OptionsTab
              options={options}
              onReload={reload}
              onStatus={setStatus}
            />
          </TabsContent>

          <TabsContent value="rules">
            <RulesTab rules={rules} onReload={reload} onStatus={setStatus} />
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentTab
              equipment={equipment}
              onReload={reload}
              onStatus={setStatus}
            />
          </TabsContent>

          <TabsContent value="aspects">
            <AspectsTab aspects={aspects} onReload={reload} onStatus={setStatus} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
