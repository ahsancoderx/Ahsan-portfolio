// src/app/admin/layout.js
'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Box, CircularProgress } from '@mui/material'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setChecking(false)
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.replace('/admin/login')
    } else {
      setChecking(false)
    }
  }, [pathname, router])

  // Don't wrap login page with admin UI
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (checking) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000' }}>
        <CircularProgress sx={{ color: '#E63946' }} />
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', background: '#050505', minHeight: '100vh' }}>
      <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      <Box
        component="main"
        sx={{
          flex: 1,
          ml: { xs: 0, md: sidebarOpen ? '260px' : '72px' },
          transition: 'margin 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AdminHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, mt: '64px' }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}