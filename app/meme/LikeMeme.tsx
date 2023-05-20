'use client'

import toast from 'react-hot-toast'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { LikeType } from '@/app/types/Like'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type LikeMemeProps = {
  memeId: string
  likes: LikeType[]
  user: any
}

const postLike = async (memeId: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/memes/addLike`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memeId }),
    },
  )
  return response
}

export default function LikeMeme({ memeId, likes, user }: LikeMemeProps) {
  const router = useRouter()

  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const isCurrentUserLikeIncludedInLikes = likes.some(
      (like: LikeType) => like.user.email === user?.email,
    )
    setIsLiked(isCurrentUserLikeIncludedInLikes)
    setLikeCount(likes.length)
  }, [likes, user])

  const likeMeme = async () => {
    if (user) {
      if (isLiked) {
        setIsLiked(false)
        setLikeCount(likeCount - 1)
      } else {
        setIsLiked(true)
        setLikeCount(likeCount + 1)
      }
      const likeResponse = await postLike(memeId)

      if (!likeResponse.ok) {
        const likeResponseJson = await likeResponse.json()
        toast.error(
          likeResponseJson.message || 'Something went wrong. Try again!',
        )
      }

      router.refresh()
    } else {
      signIn()
    }
  }

  const likeIcon = isLiked ? (
    <AiFillHeart size="25" />
  ) : (
    <AiOutlineHeart size="25" />
  )

  return (
    <div className="mb-5 flex justify-center space-x-2 text-gray-600 dark:text-gray-200">
      <button onClick={likeMeme}>{likeIcon}</button>
      <span>{likeCount}</span>
    </div>
  )
}
