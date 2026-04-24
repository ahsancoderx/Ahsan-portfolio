// lib/analytics.js
// Server-side analytics helpers

import connectDB from './mongodb'
import Analytics from '@/models/Analytics'

export async function trackEvent(type, metadata = {}) {
  try {
    await connectDB()
    await Analytics.create({ type, metadata, timestamp: new Date() })
  } catch (err) {
    // Non-blocking — analytics failures shouldn't break the app
    console.error('Analytics tracking error:', err)
  }
}

export async function getAnalyticsSummary() {
  await connectDB()
  const [visitors, cvDownloads, projectClicks] = await Promise.all([
    Analytics.countDocuments({ type: 'page_visit' }),
    Analytics.countDocuments({ type: 'cv_download' }),
    Analytics.countDocuments({ type: 'project_click' }),
  ])
  return { visitors, cvDownloads, projectClicks }
}