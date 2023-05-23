import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { STRIPE_API_VERSION } from '@/config'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function DELETE(req: Request) {
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

  const { subscriptionId } = await req.json()

  const deleteResponse = await stripe.subscriptions.del(
    subscriptionId as string,
  )

  return NextResponse.json(deleteResponse, { status: 200 })
}
