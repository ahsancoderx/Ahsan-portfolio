// src/app/api/experience/route.js
import connectDB from '@/lib/mongodb'
import mongoose from 'mongoose'

// Simple Experience Schema (اگر model نہیں بنایا تو)
const ExperienceSchema = new mongoose.Schema({
  company: String,
  role: String,
  type: { type: String, default: 'Full-time' },
  location: String,
  startDate: String,
  endDate: String,
  isCurrent: { type: Boolean, default: false },
  logo: String,
  description: String,
  achievements: [String],
  skills: [String],
  order: { type: Number, default: 0 },
}, { timestamps: true })

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema)

// GET
export async function GET() {
  try {
    await connectDB()
    const docs = await Experience.find().sort({ order: 1 })
    return Response.json(Array.isArray(docs) ? docs : [])
  } catch (err) {
    console.error('[GET /experience]', err.message)
    return Response.json([])
  }
}

// POST
export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    if (!body.company || !body.role || !body.startDate) {
      return Response.json({ error: 'company, role and startDate required' }, { status: 400 })
    }
    const doc = await Experience.create(body)
    return Response.json(doc, { status: 201 })
  } catch (err) {
    console.error('[POST /experience]', err.message)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT
export async function PUT(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { _id, ...rest } = body
    if (!_id) return Response.json({ error: '_id required' }, { status: 400 })
    const doc = await Experience.findByIdAndUpdate(_id, rest, { new: true })
    if (!doc) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(doc)
  } catch (err) {
    console.error('[PUT /experience]', err.message)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE
export async function DELETE(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })
    const result = await Experience.findByIdAndDelete(id)
    if (!result) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ success: true })
  } catch (err) {
    console.error('[DELETE /experience]', err.message)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}