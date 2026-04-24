// app/api/projects/route.js
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

// GET /api/projects — public
export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')

    const query = featured === 'true' ? { featured: true } : {}
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })

    return Response.json(projects)
  } catch (err) {
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

// POST /api/projects — admin only
export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()

  try {
    await connectDB()
    const body = await req.json()
    const project = await Project.create(body)
    return Response.json(project, { status: 201 })
  } catch (err) {
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}