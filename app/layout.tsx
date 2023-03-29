import './globals.css'
import Nav from './Nav'
import { Roboto } from 'next/font/google'
import QueryWrapper from './QueryWrapper'
import React, { ReactNode } from 'react'
import AuthContext from '@/app/auth/AuthContext'

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
    <html lang="en">
      <body className={`m-auto max-w-3xl px-4 ${roboto.variable} bg-gray-200`}>
        <QueryWrapper>
          <AuthContext>
            {/* @ts-expect-error Server Component */}
            <Nav />
            {children}
          </AuthContext>
        </QueryWrapper>
      </body>
    </html>
  )
}
