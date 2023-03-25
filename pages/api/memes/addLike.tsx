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
    } catch (err) {
      res.status(403).json({ err: 'Error has happened while liking a meme' })
    }
  }
}
