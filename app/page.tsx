'use client'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Meme from '@/app/components/Meme'
import { MemeType } from '@/app/types/Meme'

const allMemes = async () => {
  const response = await axios.get('/api/memes/getMemes')
  return response.data
}

export default function Home() {
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
        />
      ))}
    </main>
  )
}
