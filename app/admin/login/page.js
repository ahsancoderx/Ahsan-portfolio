// src/app/admin/login/page.js
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Card, CardContent, Typography, TextField, Button,
  CircularProgress, InputAdornment, IconButton,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function AdminLoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      toast.success('Welcome back!')
      router.push('/admin')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.03)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
      '&:hover fieldset': { borderColor: '#E63946' },
      '&.Mui-focused fieldset': { borderColor: '#E63946' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#E63946' },
  }

  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', background: '#000',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(230,57,70,0.12) 0%, transparent 60%)',
    }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card sx={{
          width: 420, background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          borderRadius: 3,
        }}>
          <CardContent sx={{ p: 5 }}>
            {/* Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #E63946, #C1121F)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(230,57,70,0.35)',
              }}>
                <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
            </Box>

            <Typography variant="h5" align="center" sx={{ fontWeight: 700, color: '#fff', mb: 0.5 }}>
              Admin Login
            </Typography>
            <Typography variant="body2" align="center" sx={{ color: '#aaa', mb: 4 }}>
              Sign in to manage your portfolio
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email" type="email" fullWidth required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                sx={inputSx}
              />
              <TextField
                label="Password" fullWidth required
                type={showPass ? 'text' : 'password'}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(!showPass)} sx={{ color: '#aaa' }}>
                        {showPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit" fullWidth variant="contained" size="large"
                disabled={loading}
                sx={{
                  mt: 1, py: 1.5, fontWeight: 700, fontSize: 16,
                  background: 'linear-gradient(135deg, #E63946, #C1121F)',
                  '&:hover': { background: 'linear-gradient(135deg, #FF6B6B, #E63946)' },
                  '&:disabled': { background: '#333' },
                }}
              >
                {loading ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  )
}