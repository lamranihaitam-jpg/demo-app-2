import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function getPrisma(){
  if (!global.prisma) global.prisma = new PrismaClient()
  return global.prisma as PrismaClient
}

export async function GET() {
  try{
    const prisma = getPrisma()
    const courses = await prisma.course.findMany({ include: { sessions: { include: { slots: true } } }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: courses })
  }catch(e:any){
    console.error('GET courses error', e)
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
