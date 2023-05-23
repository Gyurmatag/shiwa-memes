import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import prisma from '@/prisma/client'
import SubscriptionPlanCard from '@/app/profile/subscription/SubscriptionPlanCard'
import { PaymentPlan } from '@/app/types/PaymentPlan'

export default async function Subscription() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/api/auth/signin')
  }

  let currentSubPlan: PaymentPlan = 'MONTHLY_FREE'

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  })

  if (prismaUser?.currentSubPlan) {
    currentSubPlan = prismaUser.currentSubPlan as PaymentPlan
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
        <SubscriptionPlanCard
          title="Free"
          description="The Basic experience of ShiwaMemes"
          features={['1 meme like per month']}
          price={0}
          subType="MONTHLY_FREE"
          currentSubType={currentSubPlan}
          stripeSubId={prismaUser?.stripeSubId}
        />
        <SubscriptionPlanCard
          title="Plus"
          description="The Plus experience of ShiwaMemes"
          features={['10 meme likes per month']}
          price={5}
          subType="MONTHLY_PLUS"
          currentSubType={currentSubPlan}
          stripeSubId={prismaUser?.stripeSubId}
        />
        <SubscriptionPlanCard
          title="Ultra"
          description="The Ultra experience of ShiwaMemes"
          features={['∞ meme likes per month']}
          price={15}
          subType="MONTHLY_ULTRA"
          currentSubType={currentSubPlan}
          stripeSubId={prismaUser?.stripeSubId}
        />
      </div>
    </main>
  )
}
