import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { PRICE_IDS, STRIPE_API_VERSION } from '@/config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: STRIPE_API_VERSION,
  })

  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json(
      {
        error: {
          code: 'no-access',
          message: 'You are not signed in.',
        },
      },
      { status: 401 },
    )
  }

  const { subType } = await req.json()

  if (!session?.user) {
    return NextResponse.json(
      {
        message: 'You must provide a price subtype!',
      },
      { status: 400 },
    )
  }

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
    return NextResponse.json(
      {
        code: 'stripe-error',
        error: 'Could not create checkout session',
      },
      { status: 500 },
    )
  }

  return NextResponse.json(
    { redirectUrl: checkoutSession.url },
    { status: 201 },
  )
}
