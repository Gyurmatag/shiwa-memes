import Link from 'next/link'
import Login from './auth/Login'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Logged from '@/app/auth/Logged'
import Logo from '@/app/Logo'

export default async function Nav() {
  const session = await getServerSession(authOptions)
  return (
    <nav className="flex items-center justify-between py-8">
      <Link href={'/'}>
        <div className="flex items-center space-x-2">
          <Logo height={40} width={40} />
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            ShiwaMemes
          </h1>
        </div>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && <Login />}
        {session?.user && <Logged image={session.user?.image || ''} />}
      </ul>
    </nav>
  )
}
