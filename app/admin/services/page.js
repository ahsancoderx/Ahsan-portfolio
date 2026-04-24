// src/app/admin/services/page.js
'use client'
import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent, CardActions,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import toast from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'

const EMPTY = { title: '', description: '', icon: '', features: '' }

export default function AdminServicesPage() {
  const { token } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const load = () => fetch('/api/services').then((r) => r.json()).then((d) => { setServices(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setDialogOpen(true) }
  const openEdit = (s) => { setEditItem(s); setForm({ ...s, features: (s.features || []).join('\n') }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, features: form.features.split('\n').map((f) => f.trim()).filter(Boolean) }
    try {
      const url = editItem ? `/api/services/${editItem._id}` : '/api/services'
      const method = editItem ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success(editItem ? 'Service updated!' : 'Service created!')
      setDialogOpen(false)
      load()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/services/${id}`, { method: 'DELETE', headers })
    toast.success('Deleted')
    load()
  }

  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      background: 'rgba(255,255,255,0.02)',
      '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
      '&:hover fieldset': { borderColor: '#E63946' },
      '&.Mui-focused fieldset': { borderColor: '#E63946' },
    },
    '& label.Mui-focused': { color: '#E63946' },
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Services</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>{services.length} services listed</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)', fontWeight: 600 }}>
          Add Service
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#E63946' }} /></Box>
      ) : (
        <Grid container spacing={3}>
          {services.map((s) => (
            <Grid item xs={12} sm={6} lg={4} key={s._id}>
              <Card sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h2" sx={{ mb: 1 }}>{s.icon || '⚙️'}</Typography>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>{s.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 2 }}>{s.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {s.features?.slice(0, 3).map((f) => (
                      <Chip key={f} label={f} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: 10 }} />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <IconButton onClick={() => openEdit(s)} size="small" sx={{ color: '#E63946' }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(s._id)} size="small" sx={{ color: '#ff4444' }}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>{editItem ? 'Edit Service' : 'Add Service'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} sx={inputSx} />
            <TextField fullWidth multiline rows={2} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={inputSx} />
            <TextField fullWidth label="Icon (emoji or text)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="💻" sx={inputSx} />
            <TextField fullWidth multiline rows={4} label="Features (one per line)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Fast delivery&#10;Clean code&#10;SEO optimized" sx={inputSx} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ color: '#aaa' }}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={saving}
            sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)' }}>
            {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}