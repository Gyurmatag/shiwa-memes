import React, { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Roboto } from 'next/font/google'
import Providers from '@/app/providers'
import './globals.css'
import Nav from './Nav'
import ToasterClient from '@/app/ToasterClient'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
})

export const metadata = {
  title: 'ShiwaMemes',
  description: 'The storage of funny pics from the ShiwaForce community',
  icons: {
    icon: '/favicon.ico',
  },
}

interface Props {
  children?: ReactNode
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`m-auto max-w-3xl px-4 ${roboto.variable} bg-gray-200 dark:bg-gray-800`}
      >
        <ToasterClient />
        <Providers>
          {/* @ts-expect-error Server Component */}
          <Nav />
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
