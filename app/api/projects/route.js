// src/app/api/projects/route.js
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { getAuthFromRequest } from '@/lib/auth'

export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    const query = featured === 'true' ? { featured: true } : {}
    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })
    return Response.json(Array.isArray(projects) ? projects : [])
  } catch (err) {
    console.error('[GET /api/projects]', err.message)
    return Response.json([])
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const project = await Project.create(body)
    return Response.json(project, { status: 201 })
  } catch (err) {
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}