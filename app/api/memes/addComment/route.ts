import prisma from '../../../../prisma/client'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { message: 'Please sign in to post a comment.' },
      { status: 401 },
    )
  }
  const prismaUser = await prisma.user.findUnique({
    where: { email: session.user?.email || '' },
  })
  const { title, memeId } = await req.json()
  if (!title.length) {
    return NextResponse.json(
      { message: 'Please enter some text' },
      { status: 401 },
    )
  }
  try {
    const result = await prisma.comment.create({
      data: {
        message: title as string,
        userId: prismaUser?.id as string,
        memeId: memeId as string,
      },
    })
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { err: 'Error has occurred while making a comment' },
      { status: 400 },
    )
  }
}
