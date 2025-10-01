import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

// Lazy/global PrismaClient to avoid module-load errors in dev when client isn't generated
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log('📩 Body reçu:', body) // Debug pour voir ce qui arrive

    // Accept multiple possible field names (handle clients that send different keys)
    const firstname = body.firstname || body.Name || body.firstName || body.name || ''
    const lastname = body.lastname || body.LastName || body.lastName || ''
    const email = body.email || body.Email || ''
    const phnumber = body.phnumber || body.Phnumber || body.PhoneNo || body.phone || ''
    const motif = body.motif || body.Motif || ''
    const Message = body.Message || body.message || ''

    // Vérification des champs
    if (!firstname || !lastname || !email || !phnumber || !motif || !Message) {
      console.warn('Validation failed - champs manquants:', { firstname, lastname, email, phnumber, motif, Message })
      return NextResponse.json(
        { success: false, message: 'Tous les champs sont obligatoires.' },
        { status: 400 }
      )
    }

    // 1️⃣ Sauvegarde en base (lazy + safe mode)
    // Support common truthy values for disabling contact (1, true, yes)
    const disableContact = ['1', 'true', 'yes'].includes(String(process.env.DISABLE_CONTACT || '').toLowerCase())
    const hasDb = typeof process.env.DATABASE_URL === 'string' && process.env.DATABASE_URL.trim() !== ''

    let newContact: any = null
    if (!disableContact && hasDb) {
      try {
        // lazy-init Prisma client (global to avoid double instantiation in dev)
        if (!global.prisma) global.prisma = new PrismaClient()
        const prismaClient = global.prisma as PrismaClient
        newContact = await prismaClient.contact.create({
          data: {
            firstname,
            lastname,
            email,
            phnumber,
            motif,
            message: Message,
          },
        })
      } catch (prismaErr: any) {
        // If Prisma fails for any reason, log and fallback to fake contact
        console.error('Prisma init/write failed, falling back to fake contact:', prismaErr)
        newContact = { id: 'local-fake', firstname, lastname, email, phnumber, motif, message: Message }
      }
    } else {
      console.log('DB skipped (safe mode or no DATABASE_URL) - creating fake contact')
      newContact = { id: 'local-fake', firstname, lastname, email, phnumber, motif, message: Message }
    }

    // 2️⃣ Configurer Nodemailer (support SMTP via env or fallback to Gmail)
    const nodemailerModule = await import('nodemailer')
    const MAIL_HOST = process.env.MAIL_HOST
    const MAIL_PORT = process.env.MAIL_PORT
    const MAIL_SECURE = process.env.MAIL_SECURE === 'true'
    const MAIL_USER = process.env.MAIL_USER
    const MAIL_PASS = process.env.MAIL_PASS
    const MAIL_FROM = process.env.MAIL_FROM || MAIL_USER

    let transporter: any
    if (MAIL_HOST && MAIL_PORT) {
      transporter = nodemailerModule.createTransport({
        host: MAIL_HOST,
        port: Number(MAIL_PORT) || 587,
        secure: MAIL_SECURE,
        auth: MAIL_USER ? { user: MAIL_USER, pass: MAIL_PASS } : undefined,
      })
      console.log('Using SMTP host:', MAIL_HOST)
    } else {
      transporter = nodemailerModule.createTransport({
        service: 'gmail',
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASS,
        },
      })
      console.log('Using Gmail service for SMTP')
    }

    // Verify transporter (fail early with clear message)
    try {
      await transporter.verify()
      console.log('Nodemailer transporter verified')
    } catch (verifyErr: any) {
      console.error('Nodemailer verification failed:', verifyErr)
      return NextResponse.json({ success: false, message: 'SMTP authentication failed. Check MAIL_USER/MAIL_PASS or SMTP settings (see server logs).' , error: String(verifyErr) }, { status: 500 })
    }

    // 3️⃣ Envoi email à l’admin
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.MAIL_TO || process.env.MAIL_FROM
    if (!ADMIN_EMAIL) {
      console.warn('No admin recipient configured (ADMIN_EMAIL or MAIL_TO or MAIL_FROM)')
      return NextResponse.json({ success: false, message: 'Admin recipient not configured on server (set ADMIN_EMAIL in env).' }, { status: 500 })
    }

    try {
      const adminResult = await transporter.sendMail({
        from: MAIL_FROM,
        to: ADMIN_EMAIL,
        subject: `📩 Nouveau message de ${firstname} ${lastname}`,
        text: `Nom: ${firstname} ${lastname}\nEmail: ${email}\nTéléphone: ${phnumber}\nMotif: ${motif}\nMessage: ${Message}`,
      })
      console.log('Admin sendMail info:', adminResult)
    } catch (adminErr: any) {
      console.error('Error sending admin email:', adminErr)
      return NextResponse.json({ success: false, message: 'Failed to send admin email', error: String(adminErr) }, { status: 500 })
    }

    // 4️⃣ Envoi email de confirmation au client
    try {
      const clientResult = await transporter.sendMail({
        from: MAIL_FROM,
        to: email,
        subject: '✅ Nous avons bien reçu votre message',
        text: `Bonjour ${firstname},\n\nMerci de nous avoir contactés ! Nous avons bien reçu votre message :\n"${Message}"\n\nNotre équipe vous répondra rapidement.\n\nCordialement,\nL'équipe Support`,
      })
      console.log('Client sendMail info:', clientResult)
    } catch (clientErr: any) {
      console.error('Error sending client email:', clientErr)
      return NextResponse.json({ success: false, message: 'Failed to send confirmation email', error: String(clientErr) }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Message envoyé et enregistré !',
      data: newContact,
    })
  } catch (error) {
    console.error('❌ Erreur API contact:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
