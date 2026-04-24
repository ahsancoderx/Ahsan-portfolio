// app/api/skills/route.js
import connectDB from '@/lib/mongodb'
import Skill from '@/models/Skill'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ order: 1, category: 1 })
    return Response.json(skills)
  } catch {
    return Response.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()

  try {
    await connectDB()
    const body = await req.json()
    const skill = await Skill.create(body)
    return Response.json(skill, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to create skill' }, { status: 500 })
  }
}