import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    try {
      const data = await prisma.meme.findUnique({
        where: {
          id: req.query.details as string,
        },
        include: {
          user: true,
          comments: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              user: true,
            },
          },
        },
      })
      res.status(200).json(data)
    } catch (err) {
      res.status(403).json({ message: 'Error occured when fetching meme' })
    }
  }
}
