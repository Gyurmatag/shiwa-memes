export type LikeType = {
  createdAt?: string
  id: string
  memeId: string
  userId: string
  user: {
    email: string
    id: string
    image: string
    name: string
  }
}
