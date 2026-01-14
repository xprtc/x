import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    console.log('settings POST payload:', data)
    const { email, name } = data

    if (!email) {
      console.warn('settings POST missing email')
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

    console.log('settings POST result user.id=', user?.id)

    return NextResponse.json({ user })
  } catch (err) {
    console.error('settings POST error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const email = url.searchParams.get('email')

    if (!email) {
      return NextResponse.json({ error: 'Email query required' }, { status: 400 })
    }

    console.log('settings GET for email=', email)

    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) return NextResponse.json({ user: null }, { status: 200 })

    return NextResponse.json({ user })
  } catch (err) {
    console.error('settings GET error', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
