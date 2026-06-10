import type { Metadata } from 'next'
import { Cinzel, Literata } from 'next/font/google'

import { AuthProvider } from '@/features/auth/auth-provider'

import './globals.css'

const literata = Literata({
  variable: '--font-literata',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Odds of Glory',
  description: 'Mesa virtual: fichas, salas e rolagens.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${literata.variable} ${cinzel.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
