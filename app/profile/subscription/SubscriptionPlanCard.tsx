import React from 'react'
import SubscribeButton from '@/app/profile/subscription/SubscribeButton'
import { PaymentPlan } from '@/app/types/PaymentPlan'

interface SubscriptionPlanCardProps {
  title: string
  description: string
  features: string[]
  price: number
  subType: PaymentPlan
  currentSubType: PaymentPlan
  stripeSubId: string | null | undefined
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  description,
  features,
  price,
  subType,
  currentSubType,
  stripeSubId,
}) => {
  return (
    <div className="rounded-md border border-2 bg-gray-600 p-4 dark:bg-gray-700">
      <h2 className="text-3xl text-white">{title}</h2>
      <p className="text-gray-200">{description}</p>
      <ul className="mt-4 space-y-2 font-bold text-gray-200">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <p className="mt-6 text-xl text-white">
        <span className="text-4xl font-bold">${price}</span> / month
      </p>
      <div className="mt-6 flex justify-center">
        {/* @ts-expect-error Server Component */}
        <SubscribeButton
          subType={subType}
          currentSubType={currentSubType}
          stripeSubId={stripeSubId}
        />
      </div>
    </div>
  )
}

export default SubscriptionPlanCard
