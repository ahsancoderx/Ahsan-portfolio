// app/api/experience/route.js  (Next.js 13+ App Router)
// ─── OR ───
// pages/api/experience.js      (Next.js Pages Router — see bottom of file)
//
// MongoDB collection: "experiences"
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'   // your existing MongoDB client
import { ObjectId } from 'mongodb'

const DB   = process.env.MONGODB_DB   || 'portfolio'
const COLL = 'experiences'

// ─── helper ──────────────────────────────────────────────────────────────────
async function getCollection() {
  const client = await clientPromise
  return client.db(DB).collection(COLL)
}

// ─── GET /api/experience ─────────────────────────────────────────────────────
// Returns all experiences sorted by order asc
export async function GET() {
  try {
    const col  = await getCollection()
    const docs = await col
      .find({})
      .sort({ order: 1 })
      .toArray()

    // Convert ObjectId → string
    const data = docs.map(d => ({ ...d, _id: d._id.toString() }))
    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET /api/experience]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── POST /api/experience ────────────────────────────────────────────────────
// Create a new experience entry
// Body (JSON):
// {
//   company:      string   required
//   role:         string   required
//   type:         string   "Full-time" | "Part-time" | "Freelance" | "Internship"
//   location:     string
//   startDate:    string   "YYYY-MM"
//   endDate:      string   "YYYY-MM" | null
//   isCurrent:    boolean
//   logo:         string   URL | null
//   description:  string
//   achievements: string[]
//   skills:       string[]
//   order:        number   (display order, lower = first)
// }
export async function POST(req) {
  try {
    const body = await req.json()

    // Basic validation
    if (!body.company || !body.role || !body.startDate) {
      return NextResponse.json(
        { error: 'company, role and startDate are required' },
        { status: 400 }
      )
    }

    const doc = {
      company:      body.company      || '',
      role:         body.role         || '',
      type:         body.type         || 'Full-time',
      location:     body.location     || '',
      startDate:    body.startDate    || '',
      endDate:      body.isCurrent ? null : (body.endDate || null),
      isCurrent:    Boolean(body.isCurrent),
      logo:         body.logo         || null,
      description:  body.description  || '',
      achievements: Array.isArray(body.achievements) ? body.achievements.filter(Boolean) : [],
      skills:       Array.isArray(body.skills)       ? body.skills.filter(Boolean)       : [],
      order:        typeof body.order === 'number'   ? body.order : Date.now(),
      createdAt:    new Date(),
      updatedAt:    new Date(),
    }

    const col    = await getCollection()
    const result = await col.insertOne(doc)
    return NextResponse.json({ ...doc, _id: result.insertedId.toString() }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/experience]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── PUT /api/experience ─────────────────────────────────────────────────────
// Update an existing experience
// Body must include _id plus any fields to update
export async function PUT(req) {
  try {
    const body = await req.json()
    const { _id, ...rest } = body

    if (!_id) {
      return NextResponse.json({ error: '_id is required' }, { status: 400 })
    }

    const update = {
      ...rest,
      endDate:   rest.isCurrent ? null : (rest.endDate || null),
      isCurrent: Boolean(rest.isCurrent),
      achievements: Array.isArray(rest.achievements) ? rest.achievements.filter(Boolean) : [],
      skills:       Array.isArray(rest.skills)       ? rest.skills.filter(Boolean)       : [],
      updatedAt: new Date(),
    }

    const col    = await getCollection()
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: update },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ ...result, _id: result._id.toString() })
  } catch (err) {
    console.error('[PUT /api/experience]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// ─── DELETE /api/experience?id=xxx ───────────────────────────────────────────
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id query param required' }, { status: 400 })
    }

    const col    = await getCollection()
    const result = await col.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/experience]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// PAGES ROUTER VERSION  (use this if you're NOT on App Router)
// Save as: pages/api/experience.js
// ─────────────────────────────────────────────────────────────────────────────
/*
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const DB = process.env.MONGODB_DB || 'portfolio'

export default async function handler(req, res) {
  const client = await clientPromise
  const col    = client.db(DB).collection('experiences')

  if (req.method === 'GET') {
    const docs = await col.find({}).sort({ order: 1 }).toArray()
    return res.json(docs.map(d => ({ ...d, _id: d._id.toString() })))
  }

  if (req.method === 'POST') {
    const body   = req.body
    const result = await col.insertOne({ ...body, createdAt: new Date(), updatedAt: new Date() })
    return res.status(201).json({ ...body, _id: result.insertedId.toString() })
  }

  if (req.method === 'PUT') {
    const { _id, ...rest } = req.body
    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      { $set: { ...rest, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )
    return res.json({ ...result, _id: result._id.toString() })
  }

  if (req.method === 'DELETE') {
    const { id } = req.query
    await col.deleteOne({ _id: new ObjectId(id) })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
*/