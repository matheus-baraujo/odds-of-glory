import { MasterRoomClient } from './master-room-client'

export function generateStaticParams() {
  return [{ code: '_' }]
}

export default async function MasterRoomPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <MasterRoomClient code={code} />
}
