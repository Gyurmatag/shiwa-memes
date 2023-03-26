'use client'
import axios from 'axios'
import { useMutation, useQuery } from '@tanstack/react-query'
import Meme from '@/app/meme/Meme'
import { MemeType } from '@/app/types/Meme'
import toast from 'react-hot-toast'

const allMemes = async () => {
  const response = await axios.get('/api/memes/getMemes')
  return response.data
}

export default function Home() {
  const { mutate } = useMutation(
    async (id: string) =>
      await axios.post('/api/memes/addLike', { memeId: id }),
    {
      onError: (error) => {
        toast.error('Error liking the post')
      },
    },
  )

  const likeMeme = (memeId: string) => {
    mutate(memeId)
  }

  const { data, error, isLoading } = useQuery<MemeType[]>({
    queryFn: allMemes,
    queryKey: ['memes'],
  })
  if (error) return error
  if (isLoading) return 'Loading...'
  return (
    <main>
      {data?.map((meme) => (
        <Meme
          key={meme.id}
          creatorName={meme.user.name}
          title={meme.title}
          imgUrl={meme.imgUrl}
          likes={meme.likes}
          likeMemeExternal={() => likeMeme(meme.id)}
        />
      ))}
    </main>
  )
}
