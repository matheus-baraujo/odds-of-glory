'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'

const CONTENT_UNAVAILABLE =
  'Conteúdo do jogo indisponível. Tente recarregar a página.'

type ContentWarningBannerProps = {
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  testId?: string
}

export function ContentWarningBanner({
  error,
  empty,
  emptyMessage = 'Nenhum item publicado nesta categoria.',
  testId = 'content-warning',
}: ContentWarningBannerProps) {
  if (!error && !empty) return null

  return (
    <Alert variant="destructive" data-testid={testId}>
      <AlertDescription>
        {error ? CONTENT_UNAVAILABLE : emptyMessage}
      </AlertDescription>
    </Alert>
  )
}

export const GAME_CONTENT_ERROR_MESSAGE = CONTENT_UNAVAILABLE
