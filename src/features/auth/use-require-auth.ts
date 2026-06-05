'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { useAuth } from '@/features/auth/auth-provider'

export function useRequireAuth(redirectTo = '/login/') {
  const { user, profile, loading, configured } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (loading) return
    if (!configured) return
    if (!user) {
      const next = encodeURIComponent(pathname)
      router.replace(`${redirectTo}?next=${next}`)
    }
  }, [user, loading, configured, router, redirectTo, pathname])

  return { user, profile, loading, configured, isAuthenticated: Boolean(user) }
}
