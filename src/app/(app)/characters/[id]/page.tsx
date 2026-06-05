import { CharacterEditClient } from './character-edit-client'

export function generateStaticParams() {
  return [{ id: '_' }]
}

export default async function CharacterEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <CharacterEditClient id={id} />
}
