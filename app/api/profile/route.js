// app/api/profile/route.js
import connectDB from '@/lib/mongodb'
import Profile from '@/models/Profile'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

// GET /api/profile — public
export async function GET() {
  try {
    await connectDB()
    const profile = await Profile.findOne().sort({ createdAt: -1 })
    return Response.json(profile || {})
  } catch (err) {
    return Response.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PUT /api/profile — admin only
export async function PUT(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()

  try {
    await connectDB()
    const body = await req.json()

    // Upsert — create if doesn't exist, update otherwise
    const profile = await Profile.findOneAndUpdate(
      {},
      { ...body },
      { new: true, upsert: true, runValidators: true }
    )

    return Response.json(profile)
  } catch (err) {
    return Response.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}