import prisma from '../../../prisma/client'
import { authOptions } from '../auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    return res.status(401).json({ message: 'Please sign in to like a meme.' })
  }
  const prismaUser = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  })

  const like = await prisma.like.findFirst({
    where: {
      memeId: req.body.memeId,
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
        res.status(403).json({
          message: 'You have reached your meme like limit for this period.',
        })
      } else {
        if (!like) {
          const result = await prisma.like.create({
            data: {
              memeId: req.body.memeId as string,
              userId: prismaUser?.id as string,
            },
          })
          res.status(201).json(result)
        } else {
          const result = await prisma.like.delete({
            where: {
              id: like.id,
            },
          })
          res.status(200).json(result)
        }
      }
    } catch (err) {
      res.status(403).json({ err: 'Error has happened while liking a meme' })
    }
  }
}
