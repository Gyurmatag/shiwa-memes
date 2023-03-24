import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import AddMeme from '@/app/new-meme/AddMeme'

export default async function NewMeme() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  return (
    <main>
      <h1 className="text-2xl font-bold">
        Please add a meme, {session?.user?.name}!
      </h1>
      <AddMeme />
    </main>
  )
}
