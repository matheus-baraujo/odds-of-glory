'use client'

import { useRequireAuth } from '@/features/auth/use-require-auth'

export function AdminClient() {
  const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui'
  const { loading, isAuthenticated, profile } = useRequireAuth()

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

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold">Admin — CMS de Regras</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Painel completo na Fase 5. Rota oculta: /{adminPath}/
        </p>
      </div>
    </div>
  )
}
