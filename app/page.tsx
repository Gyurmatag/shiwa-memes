import Meme from '@/app/meme/Meme'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { MemeType } from '@/app/types/Meme'

const allMemes = async () => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/memes/getMemes`,
    {
      cache: 'no-store',
    },
  )
  return response.json()
}

export default async function Home() {
  const session = await getServerSession(authOptions)
  const data = await allMemes()

  return (
    <main>
      {data?.map((meme: MemeType) => (
        // TODO: if this get merged, then it will be fixed: https://github.com/microsoft/TypeScript/pull/51328
        // @ts-ignore
        <Meme
          user={session?.user}
          key={meme.id}
          id={meme.id}
          creatorName={meme.user.name}
          title={meme.title}
          imgUrl={meme.imgUrl}
          likes={meme.likes}
        />
      ))}
    </main>
  )
}
