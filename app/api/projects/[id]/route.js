// src/app/api/projects/[id]/route.js
import connectDB from '@/lib/mongodb'
import Project from '@/models/Project'
import { getAuthFromRequest } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const project = await Project.findById(params.id)
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(project)
  } catch {
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const project = await Project.findByIdAndUpdate(params.id, body, { new: true })
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(project)
  } catch {
    return Response.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const project = await Project.findById(params.id)
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    if (project.imagePublicId) await deleteFromCloudinary(project.imagePublicId)
    await project.deleteOne()
    return Response.json({ message: 'Deleted' })
  } catch {
    return Response.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB()
    await Project.findByIdAndUpdate(params.id, { $inc: { clicks: 1 } })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to track click' }, { status: 500 })
  }
}