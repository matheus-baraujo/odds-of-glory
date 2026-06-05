import { AdminClient } from './admin-client'

export function generateStaticParams() {
  return [
    {
      adminPath: process.env.NEXT_PUBLIC_ADMIN_PATH ?? 'admin-seu-segredo-aqui',
    },
  ]
}

export default function AdminPage() {
  return <AdminClient />
}
