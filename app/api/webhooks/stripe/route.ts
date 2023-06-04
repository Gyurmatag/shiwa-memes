import Stripe from 'stripe'
import { buffer } from 'node:stream/consumers'
import prisma from '@/prisma/client'
import { getStripeSubTier } from '@/utils/stripe'
import { STRIPE_API_VERSION } from '@/config'

export async function POST(req: any) {
  try {
    const rawBody = await buffer(req.body)
    const signature = req.headers.get('stripe-signature') as string
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
      apiVersion: STRIPE_API_VERSION,
    })

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_ENDPOINT_SECRET as string,
      )
    } catch (error: any) {
      return new Response(`Webhook Error: ${error.message}`, { status: 400 })
    }

    switch (event.type) {
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        console.log(subscription)
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

    return new Response(null, { status: 200 })
  } catch (err) {
    return new Response(null, { status: 500 })
  }
}
