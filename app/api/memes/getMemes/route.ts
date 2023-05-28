import prisma from '../../../../prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: any) {
  // TODO: quick fix, it renders it SSR this way, but in the future we need the request here
  const request = await req.json()
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
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error, when fetching memes!' },
      { status: 400 },
    )
  }
}
