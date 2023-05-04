import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { PRICE_IDS, STRIPE_API_VERSION } from '@/config'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: STRIPE_API_VERSION,
  })

  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return res.status(401).json({
      error: {
        code: 'no-access',
        message: 'You are not signed in.',
      },
    })
  }

  const subType: string = req.body.subType

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: session.user.stripeCustomerId,
    line_items: [
      {
        price:
          PRICE_IDS[`STRIPE_${subType}_PRICE_ID` as keyof typeof PRICE_IDS],
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/subscription?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/profile/subscription?cancelledPayment=true`,
    subscription_data: {
      metadata: {
        payingUserId: session.user.id,
      },
    },
  })

  if (!checkoutSession.url) {
    return res.status(500).json({
      code: 'stripe-error',
      error: 'Could not create checkout session',
    })
  }

  return res.status(200).json({ redirectUrl: checkoutSession.url })
}
