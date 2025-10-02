import { NextResponse, NextRequest } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getPrisma() {
  try {
    if (!global.prisma) global.prisma = new PrismaClient()
    return global.prisma as PrismaClient
  } catch (err: any) {
    console.error('Prisma init error in getPrisma()', err)
    throw new Error('PRISMA_CLIENT_ERROR: ' + String(err?.message || err))
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = process.env.ADMIN_TOKEN
    const provided = request.headers.get('x-admin-token') || ''
    if (!adminToken || provided !== adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id
    const prisma = getPrisma()
    await prisma.course.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Admin DELETE course error', e)
    if (
      String(e.message || '').includes('PRISMA_CLIENT_ERROR') ||
      String(e.message || '').includes('did not initialize')
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Prisma client not generated. Run `npx prisma generate` and restart the dev server.',
          error: String(e),
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(e) },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminToken = process.env.ADMIN_TOKEN
    const provided = request.headers.get('x-admin-token') || ''
    if (!adminToken || provided !== adminToken) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const id = params.id
    const body = await request.json()
    const { title, description, image, sessions } = body
    if (!title) {
      return NextResponse.json(
        { success: false, message: 'Title required' },
        { status: 400 }
      )
    }

    const prisma = getPrisma()
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.course.update({
        where: { id },
        data: { title, description, image },
      })
      if (Array.isArray(sessions)) {
        await tx.session.deleteMany({ where: { courseId: id } })
        for (const s of sessions) {
          const created = await tx.session.create({
            data: {
              courseId: id,
              startDate: new Date(s.startDate),
              endDate: s.endDate ? new Date(s.endDate) : undefined,
              location: s.location,
            },
          })
          if (Array.isArray(s.slots) && s.slots.length > 0) {
            await tx.slot.createMany({
              data: s.slots.map((sl: any) => ({
                sessionId: created.id,
                time: sl.time,
                capacity: sl.capacity ?? 1,
              })),
            })
          }
        }
      }
    })

    const updated = await prisma.course.findUnique({
      where: { id },
      include: { sessions: { include: { slots: true } } },
    })
    return NextResponse.json({ success: true, data: updated })
  } catch (e: any) {
    console.error('Admin PATCH course error', e)
    if (
      String(e.message || '').includes('PRISMA_CLIENT_ERROR') ||
      String(e.message || '').includes('did not initialize')
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Prisma client not generated. Run `npx prisma generate` and restart the dev server.',
          error: String(e),
        },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { success: false, message: 'Server error', error: String(e) },
      { status: 500 }
    )
  }
}
