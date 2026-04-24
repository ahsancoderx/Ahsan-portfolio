// app/api/analytics/route.js
import connectDB from '@/lib/mongodb'
import Analytics from '@/models/Analytics'
import { getAuthFromRequest, unauthorizedResponse } from '@/lib/auth'

// POST /api/analytics — track event (public)
export async function POST(req) {
  try {
    await connectDB()
    const body = await req.json()
    const { type, metadata } = body

    const validTypes = ['page_visit', 'cv_download', 'project_click', 'contact_form']
    if (!validTypes.includes(type)) {
      return Response.json({ error: 'Invalid event type' }, { status: 400 })
    }

    await Analytics.create({ type, metadata })
    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Failed to track event' }, { status: 500 })
  }
}

// GET /api/analytics — admin only, returns summary + chart data
export async function GET(req) {
  const auth = getAuthFromRequest(req)
  if (!auth) return unauthorizedResponse()

  try {
    await connectDB()

    const [totalVisitors, cvDownloads, projectClicks, contactForms] = await Promise.all([
      Analytics.countDocuments({ type: 'page_visit' }),
      Analytics.countDocuments({ type: 'cv_download' }),
      Analytics.countDocuments({ type: 'project_click' }),
      Analytics.countDocuments({ type: 'contact_form' }),
    ])

    // Last 30 days daily visitors
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const dailyVisitors = await Analytics.aggregate([
      {
        $match: {
          type: 'page_visit',
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    return Response.json({
      summary: { totalVisitors, cvDownloads, projectClicks, contactForms },
      dailyVisitors,
    })
  } catch {
    return Response.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}