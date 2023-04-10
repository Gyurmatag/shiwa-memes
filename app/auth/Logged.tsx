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
        className="flex space-x-1.5 rounded-md border-2 border-shiwa-purple py-2.5 px-2.5 text-sm font-bold text-shiwa-purple hover:bg-gray-100 dark:border-gray-200 dark:text-gray-300 dark:hover:bg-gray-600 md:px-6"
      >
        <HiOutlinePlus size="20" />
        <span className="hidden md:flex">New Meme</span>
      </Link>
      <Link href={'/profile'}>
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
