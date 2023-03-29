import Link from 'next/link'
import Login from './auth/Login'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Logged from '@/app/auth/Logged'
import Image from 'next/image'

export default async function Nav() {
  const session = await getServerSession(authOptions)
  return (
    <nav className="flex items-center justify-between py-8">
      <Link href={'/'}>
        <div className="flex space-x-2">
          <Image
            width="100"
            height="100"
            src="/logo.png"
            alt="Shiwa Logo"
            className="h-6 w-auto"
          />
          <h1 className="text-lg font-bold">ShiwaMemes</h1>
        </div>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && <Login />}
        {session?.user && <Logged image={session.user?.image || ''} />}
      </ul>
    </nav>
  )
}
