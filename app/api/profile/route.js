// src/app/api/profile/route.js
import connectDB from '@/lib/mongodb'
import Profile from '@/models/Profile'
import { getAuthFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const profile = await Profile.findOne().sort({ createdAt: -1 })
    return Response.json(profile || {})
  } catch (err) {
    console.error('[GET /api/profile]', err.message)
    return Response.json({})
  }
}

export async function PUT(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const profile = await Profile.findOneAndUpdate({}, { ...body }, { new: true, upsert: true, runValidators: true })
    return Response.json(profile)
  } catch (err) {
    console.error('[PUT /api/profile]', err.message)
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}