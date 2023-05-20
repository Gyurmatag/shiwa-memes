import type { NextApiRequest, NextApiResponse } from 'next'
import { buffer } from 'micro'
import Stripe from 'stripe'
import prisma from '@/prisma/client'
import { getStripeSubTier } from '@/utils/stripe'
import { STRIPE_API_VERSION } from '@/config'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    const requestBuffer = await buffer(req)
    const sig = req.headers['stripe-signature'] as string
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: STRIPE_API_VERSION,
    })

    let event

    try {
      event = stripe.webhooks.constructEvent(
        requestBuffer.toString(),
        sig,
        process.env.STRIPE_ENDPOINT_SECRET as string,
      )
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message)
      return res.status(400).send(`Webhook signature verification failed.`)
    }

    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            stripeSubId: subscription.items.data[0]?.subscription,
            currentSubPlan: getStripeSubTier(
              subscription.items.data[0]?.price.id,
            ),
          },
        })
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await prisma.user.update({
          where: {
            stripeCustomerId: subscription.customer as string,
          },
          data: {
            stripeSubId: '',
            currentSubPlan: 'MONTHLY_FREE',
          },
        })
        break
      }
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (err) {
    console.log(err)
    res.status(500).end()
  }
}
