// app/api/contact/route.js
import connectDB from '@/lib/mongodb'
import Analytics from '@/models/Analytics'

export async function POST(req) {
  try {
    await connectDB()
    const { name, email, phone, subject, message } = await req.json()

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    // Track contact form submission
    await Analytics.create({
      type: 'contact_form',
      metadata: { page: 'contact', referrer: email },
    })

    // TODO: Integrate with email service (Nodemailer, SendGrid, etc.)
    // For now, we just log and return success
    console.log('Contact form submission:', { name, email, subject, message })

    return Response.json({ message: 'Message received! We\'ll be in touch soon.' })
  } catch {
    return Response.json({ error: 'Failed to send message' }, { status: 500 })
  }
}