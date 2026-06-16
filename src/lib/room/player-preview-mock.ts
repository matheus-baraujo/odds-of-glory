import { createDefaultSheetState } from '@/lib/character-sheet/defaults'
import type { ChatMessage } from '@/features/chat/use-room-chat'
import type { CharacterSheet } from '@/types/character-sheet'

export function createPlayerPreviewSheet(): CharacterSheet {
  const sheet = createDefaultSheetState(2, 'Aldric das Sombras')
  return {
    ...sheet,
    bio: {
      ...sheet.bio,
      appearance: 'Capa esfarrapada, olhar atento, cicatriz na mandíbula.',
    },
    notes: 'Exemplo de notas de sessão visíveis na ficha do jogador.',
    supply: {
      ...sheet.supply,
      load: 3,
      checked: { rations: true, waterskin: true },
    },
  }
}

export function createPlayerPreviewMessages(roomId: string): ChatMessage[] {
  const now = new Date()
  const earlier = new Date(now.getTime() - 5 * 60 * 1000)

  return [
    {
      id: 'preview-1',
      room_id: roomId,
      user_id: 'preview-user-1',
      type: 'text',
      content: 'A trilha leva ao acampamento ao norte.',
      metadata: {},
      created_at: earlier.toISOString(),
      author_name: 'Mestre',
    },
    {
      id: 'preview-2',
      room_id: roomId,
      user_id: 'preview-user-2',
      type: 'text',
      content: 'Vou investigar as pegadas perto do rio.',
      metadata: {},
      created_at: new Date(earlier.getTime() + 60_000).toISOString(),
      author_name: 'Aldric',
    },
    {
      id: 'preview-3',
      room_id: roomId,
      user_id: 'preview-user-2',
      type: 'roll',
      content: 'Rolagem: 3 sucessos',
      metadata: {
        dice: [4, 3, 2, 1],
        result: 3,
        outcome: 'success',
        formula: '/roll 4',
      },
      created_at: new Date(earlier.getTime() + 120_000).toISOString(),
      author_name: 'Aldric',
    },
    {
      id: 'preview-4',
      room_id: roomId,
      user_id: 'preview-user-1',
      type: 'text',
      content: 'Vocês encontram sinais de uma emboscada.',
      metadata: {},
      created_at: now.toISOString(),
      author_name: 'Mestre',
    },
  ]
}
