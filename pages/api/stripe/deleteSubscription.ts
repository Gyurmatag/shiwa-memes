import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { STRIPE_API_VERSION } from '@/config'

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

  const subscriptionId = req.query.id

  const deleteResponse = await stripe.subscriptions.del(
    subscriptionId as string,
  )

  return res.status(200).json(deleteResponse)
}
