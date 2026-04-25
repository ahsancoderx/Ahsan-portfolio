// src/lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(buffer, folder = 'portfolio', options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto', transformation: [{ quality: 'auto', fetch_format: 'auto' }], ...options },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

export default cloudinary