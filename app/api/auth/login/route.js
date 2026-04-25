// src/app/api/auth/login/route.js
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    if (!email || !password) {
      return Response.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user) return Response.json({ error: 'Invalid credentials' }, { status: 401 })

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return Response.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: user._id, email: user.email, role: user.role })

    return Response.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    console.error('[POST /api/auth/login]', err.message)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}