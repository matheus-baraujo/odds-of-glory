import Link from 'next/link'

import { Button } from '@/components/ui/button'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--parchment-dark)] px-4 py-12">
      <div className="mb-8 text-center">
        <p className="font-heading text-xs uppercase tracking-[0.35em] text-[var(--gold)]">
          Fir Aesvold
        </p>
        <h1 className="font-heading mt-2 text-3xl font-semibold text-[var(--ink)]">{title}</h1>
        <p className="mt-2 max-w-md text-sm text-[var(--steel-light)]">{subtitle}</p>
      </div>
      <div className="w-full max-w-md rounded-xl border border-[var(--parchment-deep)] bg-[var(--parchment)] p-6 shadow-lg">
        {children}
      </div>
      {footer ? <div className="mt-6 text-sm text-[var(--steel-light)]">{footer}</div> : null}
    </div>
  )
}

export function AuthLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Button variant="link" asChild className="h-auto p-0 text-[var(--gold)]">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
