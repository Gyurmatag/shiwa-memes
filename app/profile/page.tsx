import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ThemeSelector from '@/app/profile/theme/ThemeSelector'
import Link from 'next/link'

export default async function Profile() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main>
      <div className="flex space-x-3 align-middle">
        <h1 className="inline-block text-xl font-bold text-gray-800 dark:text-gray-200">
          My Profile
        </h1>
        <Link
          href="/profile/subscription"
          className="rounded-md border border-yellow-500 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-800"
        >
          Upgrade
        </Link>
      </div>
      <ThemeSelector />
    </main>
  )
}
