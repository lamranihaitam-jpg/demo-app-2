import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// lazy global prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getPrisma(){
  try{
    if (!global.prisma) global.prisma = new PrismaClient()
    return global.prisma as PrismaClient
  }catch(err:any){
    console.error('Prisma init error in getPrisma()', err)
    // Throw a normalized error message for callers
    throw new Error('PRISMA_CLIENT_ERROR: '+String(err?.message || err))
  }
}

export async function GET() {
  try{
    const prisma = getPrisma()
    const courses = await prisma.course.findMany({ include: { sessions: { include: { slots: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: courses })
  }catch(e:any){
    console.error('Admin GET courses error', e)
    if (String(e.message || '').includes('PRISMA_CLIENT_ERROR') || String(e.message || '').includes('did not initialize')) {
      return NextResponse.json({ success: false, message: 'Prisma client not generated. Run `npx prisma generate` in the project and restart the dev server.' }, { status: 500 })
    }
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try{
    // simple admin protection using a token header
    const adminToken = process.env.ADMIN_TOKEN
    const provided = req.headers.get('x-admin-token') || ''
    if (!adminToken || provided !== adminToken) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { title, description, image, sessions } = body
    if (!title) return NextResponse.json({ success: false, message: 'Title required' }, { status: 400 })

  const prisma = getPrisma()
    // create course with nested sessions and slots
    const created = await prisma.course.create({
      data: {
        title,
        description,
        image,
        sessions: sessions ? {
          create: sessions.map((s:any) => ({
            startDate: new Date(s.startDate),
            endDate: s.endDate ? new Date(s.endDate) : undefined,
            location: s.location,
            slots: s.slots ? { create: s.slots.map((slot:any) => ({ time: slot.time, capacity: slot.capacity ?? 1 })) } : undefined,
          }))
        } : undefined,
      },
      include: { sessions: { include: { slots: true } } }
    })

    return NextResponse.json({ success: true, data: created })
  }catch(e:any){
    console.error('Admin POST courses error', e)
    if (String(e.message || '').includes('PRISMA_CLIENT_ERROR') || String(e.message || '').includes('did not initialize')) {
      return NextResponse.json({ success: false, message: 'Prisma client not generated. Run `npx prisma generate` and restart the dev server.' , error: String(e) }, { status: 500 })
    }
    return NextResponse.json({ success: false, message: 'Server error', error: String(e) }, { status: 500 })
  }
}
