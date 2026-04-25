// src/app/api/analytics/route.js
import connectDB from '@/lib/mongodb'
import Analytics from '@/models/Analytics'
import { getAuthFromRequest } from '@/lib/auth'

export async function POST(req) {
  try {
    await connectDB()
    const { type, metadata } = await req.json()
    const validTypes = ['page_visit', 'cv_download', 'project_click', 'contact_form']
    if (!validTypes.includes(type)) return Response.json({ error: 'Invalid type' }, { status: 400 })
    await Analytics.create({ type, metadata })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to track' }, { status: 500 })
  }
}

export async function GET(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const [totalVisitors, cvDownloads, projectClicks, contactForms] = await Promise.all([
      Analytics.countDocuments({ type: 'page_visit' }),
      Analytics.countDocuments({ type: 'cv_download' }),
      Analytics.countDocuments({ type: 'project_click' }),
      Analytics.countDocuments({ type: 'contact_form' }),
    ])

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyVisitors = await Analytics.aggregate([
      { $match: { type: 'page_visit', timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])

    return Response.json({ summary: { totalVisitors, cvDownloads, projectClicks, contactForms }, dailyVisitors })
  } catch {
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}