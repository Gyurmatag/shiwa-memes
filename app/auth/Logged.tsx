'use client'

import Image from 'next/image'
import Link from 'next/link'

type User = {
  image: string
}

export default function Logged({ image }: User) {
  return (
    <li className="flex items-center gap-8">
      <Link
        href={'/new-meme'}
        className="rounded-md bg-gray-700 px-6 py-2 text-sm text-white"
      >
        New Meme
      </Link>
      <Link href={'/'}>
        <Image
          width="64"
          height="64"
          src={image}
          className="w-14 rounded-full"
          alt="profile picture"
          priority
        ></Image>
      </Link>
    </li>
  )
}
