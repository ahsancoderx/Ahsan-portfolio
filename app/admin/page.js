// src/app/admin/page.js
'use client'
import { useState, useEffect } from 'react'
import { Grid, Typography, Box, Paper, CircularProgress } from '@mui/material'
import PeopleIcon from '@mui/icons-material/People'
import DownloadIcon from '@mui/icons-material/Download'
import TouchAppIcon from '@mui/icons-material/TouchApp'
import EmailIcon from '@mui/icons-material/Email'
import { motion } from 'framer-motion'
import AnalyticsCard from '@/components/admin/AnalyticsCard'
import useAuth from '@/hooks/useAuth'

// Simple sparkline bar chart
function MiniBarChart({ data }) {
  if (!data?.length) return null
  const max = Math.max(...data.map((d) => d.count), 1)
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 48, mt: 2 }}>
      {data.slice(-20).map((d, i) => (
        <Box
          key={i}
          sx={{
            flex: 1,
            background: `rgba(230,57,70,${0.3 + (d.count / max) * 0.7})`,
            height: `${(d.count / max) * 100}%`,
            borderRadius: '2px 2px 0 0',
            minHeight: 2,
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </Box>
  )
}

export default function AdminDashboard() {
  const { token } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch('/api/analytics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setAnalytics(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  const stats = analytics?.summary

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 800, color: '#fff', mb: 0.5 }}>
        Dashboard
      </Typography>
      <Typography variant="body2" sx={{ color: '#aaa', mb: 4 }}>
        Welcome back! Here's what's happening with your portfolio.
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}>
          <CircularProgress sx={{ color: '#E63946' }} />
        </Box>
      ) : (
        <>
          {/* Stats cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { label: 'Total Visitors', value: stats?.totalVisitors ?? 0, icon: <PeopleIcon />, color: '#E63946' },
              { label: 'CV Downloads', value: stats?.cvDownloads ?? 0, icon: <DownloadIcon />, color: '#4CAF50' },
              { label: 'Project Clicks', value: stats?.projectClicks ?? 0, icon: <TouchAppIcon />, color: '#2196F3' },
              { label: 'Contact Forms', value: stats?.contactForms ?? 0, icon: <EmailIcon />, color: '#FF9800' },
            ].map((item, i) => (
              <Grid item xs={12} sm={6} lg={3} key={item.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AnalyticsCard {...item} />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Visitor chart */}
          <Paper sx={{ p: 3, background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
              Visitors — Last 30 Days
            </Typography>
            <Typography variant="caption" sx={{ color: '#aaa' }}>
              {analytics?.dailyVisitors?.reduce((a, b) => a + b.count, 0) ?? 0} total visits in this period
            </Typography>
            <MiniBarChart data={analytics?.dailyVisitors} />
          </Paper>
        </>
      )}
    </Box>
  )
}