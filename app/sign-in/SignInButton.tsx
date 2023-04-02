'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

type Provider = {
  providerId: string
  providerName: string
}

export default function SignInButton({ providerId, providerName }: Provider) {
  return (
    <button
      onClick={() => signIn(providerId)}
      className="m-4 flex items-center space-x-2 rounded-xl border border-teal-600 py-2 px-6 text-sm hover:bg-gray-100"
    >
      <FcGoogle size="25" />
      <span>Sign in with {providerName}</span>
    </button>
  )
}
