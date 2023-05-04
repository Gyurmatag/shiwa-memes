import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import SubscribeButton from '@/app/profile/subscription/SubscribeButton'
import prisma from '@/prisma/client'

export default async function Subscription() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  let currentSubPlan: 'MONTHLY_FREE' | 'MONTHLY_PLUS' | 'MONTHLY_ULTRA' =
    'MONTHLY_FREE'

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  })

  if (prismaUser?.currentSubPlan) {
    currentSubPlan = prismaUser.currentSubPlan as
      | 'MONTHLY_FREE'
      | 'MONTHLY_PLUS'
      | 'MONTHLY_ULTRA'
  }

  return (
    <main className="space-y-7">
      <div className="mt-3 flex flex-col items-center space-y-3">
        <h1 className="inline-block text-3xl font-bold font-black text-gray-800 dark:text-gray-200">
          Plans
        </h1>
        <p>
          Start using the platform free, then add some extras if you are into
          it!
        </p>
      </div>
      <div className="mt-5 flex flex-col justify-center space-x-0 space-y-4 dark:bg-gray-700 sm:flex-row sm:space-x-4 sm:space-y-0">
        <div className="rounded-md border border-2 bg-gray-600 p-4 dark:bg-gray-700">
          <h2 className="text-3xl text-white">Free</h2>
          <p className="text-gray-200">The Basic experience of ShiwaMemes</p>
          <p className="mt-6 mt-6 text-xl text-white">
            <span className="text-4xl font-bold">$0</span> / month
          </p>
          <div className="mt-6 flex justify-center">
            {/* @ts-expect-error Server Component */}
            <SubscribeButton
              subType="MONTHLY_FREE"
              currentSubType={currentSubPlan}
              stripeSubId={prismaUser?.stripeSubId}
            />
          </div>
        </div>
        <div className="rounded-md border border-2 bg-gray-600 p-4 dark:bg-gray-700">
          <h2 className="text-3xl text-white">Plus</h2>
          <p className="text-gray-200">The Plus experience of ShiwaMemes</p>
          <p className="mt-6 text-xl text-white">
            <span className="text-4xl font-bold">$5</span> / month
          </p>
          <div className="mt-6 flex justify-center">
            {/* @ts-expect-error Server Component */}
            <SubscribeButton
              subType="MONTHLY_PLUS"
              currentSubType={currentSubPlan}
              stripeSubId={prismaUser?.stripeSubId}
            />
          </div>
        </div>
        <div className="rounded-md border border-2 bg-gray-600 p-4 dark:bg-gray-700">
          <h2 className="text-3xl text-white">Ultra</h2>
          <p className="text-gray-200">The Ultra experience of ShiwaMemes</p>
          <p className="mt-6 text-xl text-white">
            <span className="text-4xl font-bold">$15</span> / month
          </p>
          <div className="mt-6 flex justify-center">
            {/* @ts-expect-error Server Component */}
            <SubscribeButton
              subType="MONTHLY_ULTRA"
              currentSubType={currentSubPlan}
              stripeSubId={prismaUser?.stripeSubId}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
