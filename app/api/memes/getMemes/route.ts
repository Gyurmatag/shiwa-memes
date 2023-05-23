import prisma from '../../../../prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
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
