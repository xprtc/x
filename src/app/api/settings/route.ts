import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { email, name } = data

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { name: name ?? undefined },
      create: {
        email,
        name: name ?? email.split('@')[0],
      },
    })

    return NextResponse.json({ user })
  } catch (err) {
    console.error('settings POST error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
