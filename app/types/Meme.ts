import { LikeType } from '@/app/types/Like'
import { User } from '@/app/types/User'

export type MemeType = {
  id: string
  title: string
  imgUrl: string
  updatedAt?: string
  user: User
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
