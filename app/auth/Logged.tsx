'use client'

import Image from 'next/image'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

type User = {
  image: string
}

export default function Logged({ image }: User) {
  return (
    <li className="flex items-center gap-8">
      <button
        onClick={() => signOut()}
        className="rounded-md bg-gray-700 px-6 py-2 text-sm text-white"
      >
        Sign out
      </button>
      <Link href={'/dashboard'}>
        <Image
          width="64"
          height="64"
          src={image}
          className="w-14 rounded-full"
          alt=""
          priority
        ></Image>
      </Link>
    </li>
  )
}
