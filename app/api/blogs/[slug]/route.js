// src/app/api/blogs/[slug]/route.js
import connectDB from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { getAuthFromRequest } from '@/lib/auth'
import { deleteFromCloudinary } from '@/lib/cloudinary'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug: params.slug })
    if (!blog) return Response.json({ error: 'Not found' }, { status: 404 })
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } })
    return Response.json(blog)
  } catch (err) {
    return Response.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

export async function PUT(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const body = await req.json()
    const blog = await Blog.findOneAndUpdate({ slug: params.slug }, body, { new: true })
    if (!blog) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(blog)
  } catch {
    return Response.json({ error: 'Failed to update blog' }, { status: 500 })
  }
}

export async function DELETE(req, { params }) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await connectDB()
    const blog = await Blog.findOne({ slug: params.slug })
    if (!blog) return Response.json({ error: 'Not found' }, { status: 404 })
    if (blog.coverImagePublicId) await deleteFromCloudinary(blog.coverImagePublicId)
    await blog.deleteOne()
    return Response.json({ message: 'Deleted' })
  } catch {
    return Response.json({ error: 'Failed to delete blog' }, { status: 500 })
  }
}