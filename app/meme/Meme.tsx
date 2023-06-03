import Image from 'next/image'
import { LikeType } from '@/app/types/Like'
import LikeMeme from '@/app/meme/LikeMeme'
import { getServerSession } from '@/app/getServerSession'
import { NextResponse } from 'next/server'

type MemeProps = {
  id: string
  user: any
  creatorName: string
  title: string
  imgUrl: string
  likes: LikeType[]
}

export default async function Meme({
  id,
  user,
  creatorName,
  title,
  imgUrl,
  likes,
}: MemeProps) {
  const postLike = async () => {
    'use server'
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { message: 'Please sign in to like a meme.' },
        { status: 401 },
      )
    }
    const likeResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/memes/addLike`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memeId: id, userEmail: session.user.email }),
      },
    )
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/revalidate`)
    return await likeResponse.json()
  }

  return (
    <div className="my-8 rounded-lg bg-gray-50 p-8 dark:bg-gray-700">
      <div className="flex justify-center gap-2">
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
      <div className="my-8 flex justify-center">
        <Image width="300" height="300" src={imgUrl} alt={title} />
      </div>
      <LikeMeme memeId={id} likes={likes} user={user} postLike={postLike} />
      <div className="flex justify-center">
        <p className="text-gray-400">{creatorName}</p>
      </div>
    </div>
  )
}
