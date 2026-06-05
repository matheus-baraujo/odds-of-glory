import { PlayerRoomClient } from './player-room-client'

export function generateStaticParams() {
  return [{ code: '_' }]
}

export default async function PlayerRoomPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <PlayerRoomClient code={code} />
}
