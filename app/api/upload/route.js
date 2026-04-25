// src/app/api/upload/route.js
import { getAuthFromRequest } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'portfolio'

    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await uploadToCloudinary(buffer, folder, {
      public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`,
    })

    return Response.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    })
  } catch (err) {
    console.error('[POST /api/upload]', err.message)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}