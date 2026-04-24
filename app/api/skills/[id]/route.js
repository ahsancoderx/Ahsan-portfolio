// app/api/skills/[id]/route.js
import connectDB from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

export async function PUT(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    const body = await req.json()
    const skill = await Skill.findByIdAndUpdate(params.id, body, { new: true })
    if (!skill) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(skill)
  } catch {
    return Response.json({ error: 'Failed to update skill' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    await Skill.findByIdAndDelete(params.id)
    return Response.json({ message: 'Deleted' })
  } catch {
    return Response.json({ error: 'Failed to delete skill' }, { status: 500 })
  }
}