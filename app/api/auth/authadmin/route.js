// src/app/api/auth/authadmin/route.js
// One-time admin seed — POST once to create first admin, then protect or delete
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req) {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({ role: 'admin' })
    if (existingAdmin) {
      return Response.json({ error: 'Admin already exists' }, { status: 409 })
    }

    const { name, email, password } = await req.json()
    if (!name || !email || !password) {
      return Response.json({ error: 'All fields required' }, { status: 400 })
    }

    const admin = await User.create({ name, email, password, role: 'admin' })
    return Response.json({ message: 'Admin created successfully', email: admin.email })
  } catch (err) {
    console.error('[POST /api/auth/authadmin]', err.message)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}