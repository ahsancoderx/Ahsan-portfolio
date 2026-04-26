import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Email transporter
function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { name, email, phone, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject and message are required.' },
        { status: 400 }
      )
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address.' },
        { status: 400 }
      )
    }

    const transporter = createTransporter()

    // Send email to you
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Message: ${subject} — from ${name}`,
      html: `
        <h2>New Portfolio Message</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || 'Not provided'}</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    })

    // Auto reply
    await transporter.sendMail({
      from: `"Ahsan Ali" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Thanks for reaching out, ${name}!`,
      html: `
        <h2>Thank you ${name}!</h2>
        <p>I received your message and will contact you soon.</p>
        <p>Regards,<br><b>Ahsan Ali</b></p>
      `,
    })

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully!',
    })
  } catch (err) {
    console.error('Email error:', err)

    return NextResponse.json(
      { error: 'Failed to send email.' },
      { status: 500 }
    )
  }
}