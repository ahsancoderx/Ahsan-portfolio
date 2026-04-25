// src/app/api/blogs/route.js
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getAuthFromRequest } from '@/lib/auth'

export async function GET(req) {
  try {
    await connectDB()
    const auth = getAuthFromRequest(req)
    // Public: only published posts. Admin: all posts.
    const query = auth ? {} : { published: true }
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).select('-content')
    // Guarantee array — prevents "data.slice is not a function" on client
    return Response.json(Array.isArray(blogs) ? blogs : [])
  } catch (err) {
    console.error('[GET /api/blogs]', err.message)
    // Return empty array so frontend .slice() never throws
    return Response.json([])
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const blog = await Blog.create(body)
    return Response.json(blog, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message || 'Failed to create blog' }, { status: 500 })
  }
}