'use client'
import Image from 'next/image'

type MemeProps = {
  creatorName: string
  title: string
  imgUrl: string
}

export default function Meme({ creatorName, title, imgUrl }: MemeProps) {
  return (
    <div className="my-8 rounded-lg bg-white p-8">
      <div className="flex justify-center gap-2">
        <h3 className="font-bold text-gray-700">{title}</h3>
      </div>
      <div className="my-8 flex justify-center">
        <Image width="300" height="300" src={imgUrl} alt={title}></Image>
      </div>
    </div>
  )
}
