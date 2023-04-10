import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import ThemeSelector from '@/app/profile/theme/ThemeSelector'

export default async function NewMeme() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main>
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        My Profile
      </h1>
      <ThemeSelector />
    </main>
  )
}
