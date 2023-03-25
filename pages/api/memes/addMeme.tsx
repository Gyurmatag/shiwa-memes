import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import prisma from '../../../prisma/client'
import cloudinary from 'cloudinary'
const formidable = require('formidable')

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}

cloudinary.v2.config(cloudinaryConfig)

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ message: 'Please sign in to make a meme!' })
    }

    const form = new formidable.IncomingForm()
    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        return res
          .status(403)
          .json({ message: 'Error happened when parsing form data' })
      }

      const title: string = fields.title
      const imgFile: any = files?.imgFile

      console.log(imgFile.filepath)

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

      if (!imgFile) {
        return res.status(403).json({ message: 'Please select an image file' })
      }

      try {
        const uploadResult = await cloudinary.v2.uploader.upload(
          imgFile.filepath,
        )
        const result = await prisma.meme.create({
          data: {
            title: title as string,
            imgUrl: uploadResult.secure_url as string,
            userId: prismaUser?.id as string,
          },
        })
        res.status(200).json(result)
      } catch (err) {
        console.log(err)
        res.status(403).json({ message: 'Error happened when making a meme' })
      }
    })
  }
}
