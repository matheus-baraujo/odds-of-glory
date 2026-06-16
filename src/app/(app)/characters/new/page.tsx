'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { createCharacter } from '@/features/characters/api'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import { characterEditPath } from '@/lib/paths'
import type { CharacterTier } from '@/types/character-sheet'

export default function NewCharacterPage() {
  const router = useRouter()
  const { loading: authLoading, isAuthenticated } = useRequireAuth()
  const [name, setName] = useState('')
  const [tier, setTier] = useState<CharacterTier>(1)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Informe um nome.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const char = await createCharacter(name.trim(), tier)
      router.push(characterEditPath(char.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar ficha.')
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--parchment-dark)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-8">
        <h1 className="font-heading text-xl font-semibold text-[var(--ink)]">Nova ficha</h1>
        <div className="mt-6 space-y-4">
          <div className="space-y-1">
            <Label htmlFor="new-char-name">Nome</Label>
            <Input
              id="new-char-name"
              data-testid="new-character-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-char-tier">Tier</Label>
            <Select
              id="new-char-tier"
              value={String(tier)}
              onChange={(e) => setTier(Number(e.target.value) as CharacterTier)}
            >
              <option value="1">Tier 1</option>
              <option value="2">Tier 2</option>
              <option value="3">Tier 3</option>
            </Select>
          </div>
          {error && <p className="text-base text-[var(--crimson)]">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" asChild>
              <Link href="/characters/">Cancelar</Link>
            </Button>
            <Button
              onClick={() => void handleCreate()}
              disabled={creating}
              data-testid="new-character-submit"
            >
              {creating ? 'Criando…' : 'Criar ficha'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
