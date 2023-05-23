import prisma from '../../../../prisma/client'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { id } = await req.json()
  if (!id) {
    return NextResponse.json({ message: 'Meme ID required' }, { status: 400 })
  }
  try {
    const data = await prisma.meme.findUnique({
      where: {
        id: id as string,
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
    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { message: 'Error occurred when fetching meme' },
      { status: 400 },
    )
  }
}
