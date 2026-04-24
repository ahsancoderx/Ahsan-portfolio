// models/Skill.js
import mongoose from 'mongoose'

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'tools', 'design', 'other'],
      default: 'other',
    },
    proficiency: { type: Number, min: 0, max: 100, default: 80 }, // percentage
    icon: { type: String }, // icon name or URL
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema)