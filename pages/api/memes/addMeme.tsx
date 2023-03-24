import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '../../../prisma/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Please sign in to make a meme!' })
    }

    const title: string = req.body.title
    const imgUrl: string = req.body.imgUrl

    const prismaUser = await prisma.user.findUnique({
      where: { email: session.user?.email || '' },
    })

    if (!title.length) {
      return res
        .status(403)
        .json({ message: 'Please do not leave the title empty' })
    }

    if (title.length > 300) {
      return res
        .status(403)
        .json({ message: 'Please write a shorter title for your meme!' })
    }

    if (!imgUrl.length) {
      return res
        .status(403)
        .json({ message: 'Please do not leave the image URL empty' })
    }

    try {
      const result = await prisma.meme.create({
        data: {
          title: title as string,
          imgUrl: imgUrl as string,
          userId: prismaUser?.id as string,
        },
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ message: 'Error happened when making a meme' })
    }
  }
}
