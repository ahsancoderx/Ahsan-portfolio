// models/Service.js
import mongoose from 'mongoose'

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String }, // MUI icon name or emoji
    features: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Service || mongoose.model('Service', ServiceSchema)