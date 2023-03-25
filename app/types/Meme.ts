import { LikeType } from '@/app/types/Like'

export type MemeType = {
  id: string
  title: string
  imgUrl: string
  updatedAt?: string
  user: {
    email: string
    id: string
    image: string
    name: string
  }
  likes: LikeType[]
  comments: {
    createdAt?: string
    id: string
    memeId: string
    title: string
    userId: string
    user: {
      email: string
      id: string
      image: string
      name: string
    }
  }[]
}
