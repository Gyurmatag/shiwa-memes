import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import AddMeme from '@/app/new-meme/AddMeme'

export default async function NewMeme() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main>
      <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
        Create a Meme!
      </h1>
      <AddMeme />
    </main>
  )
}
