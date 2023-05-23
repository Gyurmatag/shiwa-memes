import { User } from '@/app/types/User'

export type Session = {
  user: User
  accessToken: string
  expires: string
}
