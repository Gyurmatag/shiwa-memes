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
    return res
      .status(401)
      .json({ message: 'Please sign in to post a comment.' })
  }
  //Get User
  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  })
  if (req.method === 'POST') {
    const { title, memeId } = req.body.data
    if (!title.length) {
      return res.status(401).json({ message: 'Please enter some text' })
    }
    try {
      const result = await prisma.comment.create({
        data: {
          message: title as string,
          userId: prismaUser?.id as string,
          memeId: memeId as string,
        },
      })
      res.status(200).json(result)
    } catch (err) {
      res.status(403).json({ err: 'Error has occured while making a comment' })
    }
  }
}
