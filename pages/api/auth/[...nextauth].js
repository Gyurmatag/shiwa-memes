import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../prisma/client'
import { Stripe } from 'stripe'
import { STRIPE_API_VERSION } from '@/config'

const adapter = PrismaAdapter(prisma)

export const authOptions = {
  adapter: adapter,
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  events: {
    createUser: async ({ user }) => {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: STRIPE_API_VERSION,
      })

      await stripe.customers
        .create({
          email: user.email,
        })
        .then(async (customer) => {
          return prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customer.id,
            },
          })
        })
    },
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id

      session.user.stripeCustomerId = user.stripeCustomerId
      session.user.stripeSubTier = user.currentSubPlan

      return session
    },
  },
}

export default NextAuth(authOptions)
