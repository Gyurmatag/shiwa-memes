import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.meme.findMany({
        include: {
          user: true,
          likes: {
            include: {
              user: true,
            },
          },
          comments: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      res.status(200).json(data)
    } catch (err) {
      res.status(403).json({ message: 'Error, when fetching memes!' })
    }
  }
}
