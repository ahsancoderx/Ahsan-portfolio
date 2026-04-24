// app/api/services/route.js
import connectDB from '@/lib/mongodb'
import Service from '@/models/Service'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const services = await Service.find().sort({ order: 1 })
    return Response.json(services)
  } catch {
    return Response.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    const body = await req.json()
    const service = await Service.create(body)
    return Response.json(service, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to create service' }, { status: 500 })
  }
}