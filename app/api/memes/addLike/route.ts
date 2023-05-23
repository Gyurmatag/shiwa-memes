import prisma from '../../../../prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { message: 'Please sign in to like a meme.' },
      { status: 401 },
    )
  }
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  })

  const body = await req.json()

  const like = await prisma.like.findFirst({
    where: {
      memeId: body.memeId,
      userId: prismaUser?.id,
    },
  })

  if (req.method === 'POST') {
    try {
      const userCreatedAt = prismaUser?.createdAt
      const currentDate = new Date()
      const daysSinceCreation = Math.floor(
        (currentDate.getTime() - userCreatedAt!.getTime()) /
          (1000 * 60 * 60 * 24),
      )

      const currentPeriodStart = new Date(userCreatedAt as Date)
      currentPeriodStart.setDate(
        currentPeriodStart.getDate() + Math.floor(daysSinceCreation / 30) * 30,
      )
      const currentPeriodEnd = new Date(currentPeriodStart)
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30)

      const likesCount = await prisma.like.count({
        where: {
          userId: prismaUser?.id,
          createdAt: {
            gte: currentPeriodStart,
            lt: currentPeriodEnd,
          },
        },
      })

      const subPlan = prismaUser?.currentSubPlan

      if (
        (!subPlan && likesCount >= 1) ||
        (subPlan === 'MONTHLY_PLUS' && likesCount >= 10)
      ) {
        return NextResponse.json(
          {
            message: 'You have reached your meme like limit for this period.',
          },
          { status: 403 },
        )
      } else {
        if (!like) {
          const result = await prisma.like.create({
            data: {
              memeId: body.memeId as string,
              userId: prismaUser?.id as string,
            },
          })
          return NextResponse.json(result, { status: 201 })
        } else {
          const result = await prisma.like.delete({
            where: {
              id: like.id,
            },
          })
          return NextResponse.json(result, { status: 200 })
        }
      }
    } catch (err) {
      return NextResponse.json(
        { err: 'Error has happened while liking a meme' },
        { status: 400 },
      )
    }
  }
}
