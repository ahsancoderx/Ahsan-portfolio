// models/Analytics.js
import mongoose from 'mongoose'

const AnalyticsSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['page_visit', 'cv_download', 'project_click', 'contact_form'],
      required: true,
    },
    metadata: {
      page: String,
      projectId: String,
      projectTitle: String,
      userAgent: String,
      referrer: String,
    },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

// Index for fast aggregations
AnalyticsSchema.index({ type: 1, timestamp: -1 })

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema)