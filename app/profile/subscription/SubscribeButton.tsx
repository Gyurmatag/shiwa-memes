'use client'

import { useRouter } from 'next/navigation'

type SubscribeButtonProps = {
  subType: 'MONTHLY_FREE' | 'MONTHLY_PLUS' | 'MONTHLY_ULTRA'
  currentSubType: 'MONTHLY_FREE' | 'MONTHLY_PLUS' | 'MONTHLY_ULTRA'
  stripeSubId: string | null | undefined
}

export default async function SubscribeButton({
  subType,
  currentSubType,
  stripeSubId,
}: SubscribeButtonProps) {
  const router = useRouter()
  const goToCheckout = async () => {
    const stripeApiAction =
      subType === 'MONTHLY_FREE'
        ? `deleteSubscription?id=${stripeSubId}`
        : 'createCheckoutSession'
    const stripeApiMethod = subType === 'MONTHLY_FREE' ? 'DELETE' : 'POST'
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/${stripeApiAction}`,
        {
          method: stripeApiMethod,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subType,
          }),
        },
      )
      const response = await res.json()
      const { redirectUrl, status } = response
      if (redirectUrl) {
        window.location.assign(redirectUrl)
      } else if (status) {
        router.refresh()
      } else {
        console.log('Error creating checkout session')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const buttonClassNames =
    subType !== currentSubType
      ? 'w-full rounded-md bg-white p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-150'
      : 'w-full rounded-md p-2 text-white shadow-md border-2 border-green-700'

  const buttonText = subType !== currentSubType ? 'Subscribe' : 'Current plan'

  return (
    <button
      className={buttonClassNames}
      onClick={() => {
        goToCheckout()
      }}
      disabled={subType === currentSubType}
    >
      {buttonText}
    </button>
  )
}
