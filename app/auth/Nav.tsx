import Link from 'next/link'
import Login from './Login'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import Logged from '@/app/auth/Logged'

export default async function Nav() {
  const session = await getServerSession(authOptions)
  return (
    <nav className="flex items-center justify-between py-8">
      <Link href={'/'}>
        <h1 className="text-lg font-bold">ShiwaMemes</h1>
      </Link>
      <ul className="flex items-center gap-6">
        {!session?.user && <Login />}
        {session?.user && <Logged image={session.user?.image || ''} />}
      </ul>
    </nav>
  )
}
