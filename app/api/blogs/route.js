// app/api/blogs/route.js
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

export async function GET(req) {
  try {
    await connectDB()
    const auth = getAuthFromRequest(req)
    // Public sees only published; admin sees all
    const query = auth ? {} : { published: true }
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).select('-content')
    return Response.json(blogs)
  } catch {
    return Response.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()
  try {
    await connectDB()
    const body = await req.json()
    const blog = await Blog.create(body)
    return Response.json(blog, { status: 201 })
  } catch (err) {
    return Response.json({ error: err.message || 'Failed to create blog' }, { status: 500 })
  }
}