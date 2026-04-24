// models/Project.js
import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    imageUrl: { type: String },
    imagePublicId: { type: String },
    technologies: [{ type: String }],
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 }, // track clicks
  },
  { timestamps: true }
)

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)