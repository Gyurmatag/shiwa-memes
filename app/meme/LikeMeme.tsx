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
  postLike: () => any
}

export default function LikeMeme({ likes, user, postLike }: LikeMemeProps) {
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
      const likeResponse = await postLike()

      if (!likeResponse.memeId) {
        toast.error(likeResponse.message || 'Something went wrong. Try again!')
      } else {
        router.refresh()
      }
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
