// app/api/services/[id]/route.js
import connectDB from '@/lib/mongodb'
import Service from '@/models/Service'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

export async function PUT(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    const body = await req.json()
    const service = await Service.findByIdAndUpdate(params.id, body, { new: true })
    if (!service) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(service)
  } catch {
    return Response.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    await Service.findByIdAndDelete(params.id)
    return Response.json({ message: 'Deleted' })
  } catch {
    return Response.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}