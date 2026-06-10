'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteCharacter, listCharacters } from '@/features/characters/api'
import { useRequireAuth } from '@/features/auth/use-require-auth'
import type { CharacterRow } from '@/types/character-sheet'

export default function CharactersPage() {
  const router = useRouter()
  const { loading: authLoading, isAuthenticated } = useRequireAuth()
  const [characters, setCharacters] = useState<CharacterRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) return
    void listCharacters()
      .then(setCharacters)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar.'))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p data-testid="characters-loading">Carregando…</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Excluir ficha "${name}"?`)) return
    await deleteCharacter(id)
    setCharacters((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="min-h-screen bg-[var(--parchment-dark)] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-[var(--ink)]">Fichas</h1>
            <p className="text-base text-[var(--steel-light)]">Gerencie seus personagens.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/lobby/" data-testid="characters-back-lobby">
                Lobby
              </Link>
            </Button>
            <Button onClick={() => router.push('/characters/new/')} data-testid="characters-new">
              Nova ficha
            </Button>
          </div>
        </header>

        {error && <p className="mb-4 text-base text-[var(--crimson)]">{error}</p>}

        {loading ? (
          <p className="text-base text-[var(--steel-light)]">Carregando fichas…</p>
        ) : characters.length === 0 ? (
          <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
            <CardContent className="py-10 text-center">
              <p className="text-[var(--steel-light)]">Nenhuma ficha ainda.</p>
              <Button className="mt-4" onClick={() => router.push('/characters/new/')}>
                Criar primeira ficha
              </Button>
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-3">
            {characters.map((char) => (
              <li key={char.id}>
                <Card className="border-[var(--parchment-deep)] bg-[var(--parchment)]">
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div>
                      <CardTitle className="font-heading text-lg text-[var(--ink)]">
                        {char.name}
                      </CardTitle>
                      <p className="text-sm text-[var(--steel-light)]">
                        Tier {char.tier} · Atualizado{' '}
                        {new Date(char.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/characters/${char.id}/`)}
                        data-testid={`character-edit-${char.id}`}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => void handleDelete(char.id, char.name)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
