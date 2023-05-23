import { getProviders } from 'next-auth/react'
import SignInButton from '@/app/sign-in/SignInButton'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function SignIn() {
  const providers = await getProviders()

  const session = await getServerSession(authOptions)
  if (session) {
    redirect('/')
  }

  return (
    <>
      {providers &&
        Object.values(providers).map((provider) => (
          <div
            key={provider.name}
            className="flex justify-center rounded-md bg-white"
          >
            <SignInButton
              providerId={provider.id}
              providerName={provider.name}
            />
          </div>
        ))}
    </>
  )
}
