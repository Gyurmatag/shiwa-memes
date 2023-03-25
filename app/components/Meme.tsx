'use client'
import Image from 'next/image'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'
import { LikeType } from '@/app/types/Like'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

type MemeProps = {
  creatorName: string
  title: string
  imgUrl: string
  likes: LikeType[]
  likeMemeExternal: () => void
}

export default function Meme({
  creatorName,
  title,
  imgUrl,
  likes,
  likeMemeExternal,
}: MemeProps) {
  const { data: session } = useSession()

  const [likeCount, setLikeCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const isCurrentUserLikeIncludedInLikes = likes.some(
      (like: LikeType) => like.user.email === session?.user?.email,
    )
    setIsLiked(isCurrentUserLikeIncludedInLikes)
    setLikeCount(likes.length)
  }, [likes, session])

  const likeMeme = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikeCount(likeCount - 1)
    } else {
      setIsLiked(true)
      setLikeCount(likeCount + 1)
    }
    likeMemeExternal()
  }

  const likeIcon = isLiked ? (
    <AiFillHeart size="25" className="cursor-pointer" />
  ) : (
    <AiOutlineHeart size="25" className="cursor-pointer" />
  )

  return (
    <div className="my-8 rounded-lg bg-white p-8">
      <div className="flex justify-center gap-2">
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
      <div className="my-8 flex justify-center">
        <Image width="300" height="300" src={imgUrl} alt={title} />
      </div>
      <div className="mb-5 flex justify-center space-x-2 text-gray-600">
        <button onClick={likeMeme}>{likeIcon}</button>
        <span>{likeCount}</span>
      </div>
      <div className="flex justify-center">
        <p className="text-gray-400">{creatorName}</p>
      </div>
    </div>
  )
}
