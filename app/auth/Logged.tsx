'use client'

import Image from 'next/image'
import Link from 'next/link'
import { HiOutlinePlus } from 'react-icons/all'

type User = {
  image: string
}

export default function Logged({ image }: User) {
  return (
    <li className="flex items-center gap-8">
      <Link
        href={'/new-meme'}
        className="flex space-x-1.5 rounded-md border-2 border-shiwa-purple px-6 py-2 text-sm font-bold text-shiwa-purple"
      >
        <HiOutlinePlus size="20" />
        <span>New Meme</span>
      </Link>
      <Link href={'/'}>
        <Image
          width="64"
          height="64"
          src={image}
          className="w-14 rounded-full"
          alt="profile picture"
          priority
        />
      </Link>
    </li>
  )
}
