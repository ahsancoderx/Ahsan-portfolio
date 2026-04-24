// src/app/admin/profile/page.js
'use client'
import { useState, useEffect } from 'react'
import {
  Box, Typography, Grid, TextField, Button, CircularProgress, Divider, Avatar,
} from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/admin/ImageUploader'
import useAuth from '@/hooks/useAuth'

export default function AdminProfilePage() {
  const { token } = useAuth()
  const [form, setForm] = useState({
    name: '', title: '', bio: '', about: '',
    email: '', phone: '', location: '',
    github: '', linkedin: '', twitter: '',
    avatarUrl: '', cvUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => { if (data._id) setForm(data); setLoading(false) })
  }, [])

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Profile saved!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.02)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
      '&:hover fieldset': { borderColor: '#E63946' },
      '&.Mui-focused fieldset': { borderColor: '#E63946' },
    },
    '& label.Mui-focused': { color: '#E63946' },
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#E63946' }} /></Box>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Profile</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>Manage your public profile information</Typography>
        </Box>
        <Button variant="contained" startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SaveIcon />}
          onClick={handleSave} disabled={saving}
          sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)', fontWeight: 600 }}>
          Save Changes
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Avatar upload */}
        <Grid item xs={12} md={3}>
          <Box sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, p: 3, textAlign: 'center' }}>
            <Avatar src={form.avatarUrl} sx={{ width: 100, height: 100, mx: 'auto', mb: 2, background: '#E63946', fontSize: 36 }}>
              {form.name?.[0] || 'A'}
            </Avatar>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>Profile Picture</Typography>
            <ImageUploader
              folder="portfolio/avatars"
              onUpload={(url, publicId) => setForm({ ...form, avatarUrl: url, avatarPublicId: publicId })}
            />
            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>CV / Resume (PDF)</Typography>
            <ImageUploader
              folder="portfolio/cv"
              accept=".pdf"
              buttonLabel="Upload CV"
              onUpload={(url, publicId) => setForm({ ...form, cvUrl: url, cvPublicId: publicId })}
            />
            {form.cvUrl && (
              <Typography variant="caption" sx={{ color: '#4CAF50', mt: 1, display: 'block' }}>✓ CV uploaded</Typography>
            )}
          </Box>
        </Grid>

        {/* Form fields */}
        <Grid item xs={12} md={9}>
          <Box sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, p: 3 }}>
            <Typography variant="subtitle1" sx={{ color: '#E63946', fontWeight: 600, mb: 2 }}>Basic Info</Typography>
            <Grid container spacing={2}>
              {[
                { field: 'name', label: 'Full Name' },
                { field: 'title', label: 'Title / Role (e.g. Frontend Developer)' },
                { field: 'email', label: 'Email' },
                { field: 'phone', label: 'Phone' },
                { field: 'location', label: 'Location' },
              ].map(({ field, label }) => (
                <Grid item xs={12} sm={field === 'name' || field === 'title' ? 12 : 6} key={field}>
                  <TextField fullWidth label={label} value={form[field] || ''} onChange={handleChange(field)} sx={inputSx} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={2} label="Short Bio (hero section)" value={form.bio || ''} onChange={handleChange('bio')} sx={inputSx} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth multiline rows={4} label="About Me (detailed)" value={form.about || ''} onChange={handleChange('about')} sx={inputSx} />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.06)' }} />
            <Typography variant="subtitle1" sx={{ color: '#E63946', fontWeight: 600, mb: 2 }}>Social Links</Typography>
            <Grid container spacing={2}>
              {['github', 'linkedin', 'twitter', 'website'].map((field) => (
                <Grid item xs={12} sm={6} key={field}>
                  <TextField fullWidth label={field.charAt(0).toUpperCase() + field.slice(1)} value={form[field] || ''} onChange={handleChange(field)} sx={inputSx} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}