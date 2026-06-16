'use client'

import { useRef, useState } from 'react'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { parsePortable, portableToSessionFields, serializePortable } from '@/lib/session-state/portable'
import type { SessionState } from '@/types/session-state'

type SessionPortableControlsProps = {
  session: SessionState
  onImport: (data: Pick<SessionState, 'notes' | 'heat' | 'factions' | 'enemies'>) => void
}

export function SessionPortableControls({ session, onImport }: SessionPortableControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingImport, setPendingImport] = useState<Pick<
    SessionState,
    'notes' | 'heat' | 'factions' | 'enemies'
  > | null>(null)

  const exportSession = () => {
    const json = serializePortable(session)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().slice(0, 10)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `odds-session-${date}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setError(null)
    try {
      const text = await file.text()
      const data = parsePortable(text)
      setPendingImport(portableToSessionFields(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Arquivo JSON inválido.')
    }
  }

  const confirmImport = () => {
    if (!pendingImport) return
    onImport(pendingImport)
    setPendingImport(null)
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="export-session"
          onClick={exportSession}
        >
          Exportar
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          data-testid="import-session"
          onClick={() => fileInputRef.current?.click()}
        >
          Importar
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mt-3">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Dialog open={pendingImport !== null} onOpenChange={(open) => !open && setPendingImport(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importar dados de sessão?</DialogTitle>
            <DialogDescription>
              Isso substituirá as notas, o heat, as facções e os inimigos atuais pelos dados do
              arquivo importado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setPendingImport(null)}>
              Cancelar
            </Button>
            <Button type="button" onClick={confirmImport}>
              Importar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
