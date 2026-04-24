// models/Blog.js
import mongoose from 'mongoose'

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String },
    content: { type: String, required: true }, // Markdown
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },
    tags: [{ type: String }],
    published: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Auto-generate slug from title if not provided
BlogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  next()
})

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema)