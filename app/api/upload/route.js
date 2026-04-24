// app/api/upload/route.js
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'

export async function POST(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()

  try {
    const formData = await req.formData()
    const file = formData.get('file')
    const folder = formData.get('folder') || 'portfolio'

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert file to buffer
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
    console.error('Upload error:', err)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}

// Needed for large file uploads
export const config = {
  api: { bodyParser: false },
}