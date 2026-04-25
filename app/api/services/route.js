// src/app/api/services/route.js
import connectDB from '@/lib/mongodb'
import Service from '@/models/Service'
import { getAuthFromRequest } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const services = await Service.find().sort({ order: 1 })
    return Response.json(Array.isArray(services) ? services : [])
  } catch (err) {
    console.error('[GET /api/services]', err.message)
    return Response.json([])
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const service = await Service.create(body)
    return Response.json(service, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to create service' }, { status: 500 })
  }
}