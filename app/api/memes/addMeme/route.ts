import { getServerSession } from 'next-auth'
import cloudinary from 'cloudinary'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '../../../../prisma/client'
import { NextRequest, NextResponse } from 'next/server'

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}

cloudinary.v2.config(cloudinaryConfig)

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { message: 'Please sign in to make a meme!' },
      { status: 401 },
    )
  }

  const formData = await req.formData()

  const memeTitle: string = formData.get('title') as string
  const imgFile: any = formData.get('imgFile')

  let buffer = Buffer.from(await imgFile.arrayBuffer())

  const base64ImgData =
    'data:' + imgFile.type + ';base64,' + buffer.toString('base64')

  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  })

  if (!memeTitle.length) {
    return NextResponse.json(
      { message: 'Please do not leave the title empty' },
      { status: 400 },
    )
  }

  if (memeTitle.length > 300) {
    return NextResponse.json(
      { message: 'Please write a shorter title for your meme!' },
      { status: 400 },
    )
  }

  if (!imgFile) {
    return NextResponse.json(
      { message: 'Please select an image file' },
      { status: 400 },
    )
  }

  try {
    const uploadResult = await cloudinary.v2.uploader.upload(base64ImgData)
    const result = await prisma.meme.create({
      data: {
        title: memeTitle as string,
        imgUrl: uploadResult.secure_url as string,
        userId: prismaUser?.id as string,
      },
    })
    return NextResponse.json(result, { status: 200 })
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Error happened when making a meme' },
      { status: 400 },
    )
  }
}
