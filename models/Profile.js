// models/Profile.js
import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true }, // e.g. "Frontend Developer"
    bio: { type: String },
    about: { type: String }, // Longer about section
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String },
    avatarUrl: { type: String }, // Cloudinary URL
    avatarPublicId: { type: String }, // Cloudinary public_id for deletion
    cvUrl: { type: String }, // Cloudinary URL for CV PDF
    cvPublicId: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Profile || mongoose.model('Profile', ProfileSchema)