// src/app/admin/projects/page.js
'use client'
import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Grid, Card, CardContent, CardMedia, CardActions,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Chip, CircularProgress, Switch, FormControlLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import toast from 'react-hot-toast'
import ImageUploader from '@/components/admin/ImageUploader'
import useAuth from '@/hooks/useAuth'

const EMPTY = { title: '', description: '', longDescription: '', technologies: '', liveUrl: '', githubUrl: '', featured: false, imageUrl: '', imagePublicId: '' }

export default function AdminProjectsPage() {
  const { token } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  const load = () => fetch('/api/projects').then((r) => r.json()).then((d) => { setProjects(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setDialogOpen(true) }
  const openEdit = (p) => {
    setEditItem(p)
    setForm({ ...p, technologies: (p.technologies || []).join(', ') })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean) }
    try {
      const url = editItem ? `/api/projects/${editItem._id}` : '/api/projects'
      const method = editItem ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success(editItem ? 'Project updated!' : 'Project created!')
      setDialogOpen(false)
      load()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return
    await fetch(`/api/projects/${id}`, { method: 'DELETE', headers })
    toast.success('Deleted')
    load()
  }

  const f = (field) => (e) => setForm({ ...form, [field]: e.target.value })

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
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Projects</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>{projects.length} projects in portfolio</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)', fontWeight: 600 }}>
          Add Project
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#E63946' }} /></Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((p) => (
            <Grid item xs={12} sm={6} lg={4} key={p._id}>
              <Card sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                {p.imageUrl && <CardMedia component="img" height="160" image={p.imageUrl} alt={p.title} sx={{ objectFit: 'cover' }} />}
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    {p.featured && <Chip label="Featured" size="small" sx={{ background: 'rgba(230,57,70,0.15)', color: '#E63946', fontSize: 10 }} />}
                    <Chip label={`${p.clicks} clicks`} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#aaa', fontSize: 10 }} />
                  </Box>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>{p.title}</Typography>
                  <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>{p.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {p.technologies?.slice(0, 4).map((t) => (
                      <Chip key={t} label={t} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: 10 }} />
                    ))}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <IconButton onClick={() => openEdit(p)} size="small" sx={{ color: '#E63946' }}><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(p._id)} size="small" sx={{ color: '#ff4444' }}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>
          {editItem ? 'Edit Project' : 'Add Project'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth label="Title" value={form.title} onChange={f('title')} sx={inputSx} />
            <TextField fullWidth label="Short Description" value={form.description} onChange={f('description')} sx={inputSx} />
            <TextField fullWidth multiline rows={3} label="Long Description" value={form.longDescription} onChange={f('longDescription')} sx={inputSx} />
            <TextField fullWidth label="Technologies (comma separated)" value={form.technologies} onChange={f('technologies')} placeholder="React, Node.js, MongoDB" sx={inputSx} />
            <TextField fullWidth label="Live URL" value={form.liveUrl} onChange={f('liveUrl')} sx={inputSx} />
            <TextField fullWidth label="GitHub URL" value={form.githubUrl} onChange={f('githubUrl')} sx={inputSx} />
            <FormControlLabel
              control={<Switch checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} sx={{ '& .MuiSwitch-thumb': { background: '#E63946' } }} />}
              label={<Typography sx={{ color: '#ccc' }}>Featured Project</Typography>}
              sx={{ mb: 2 }}
            />
            <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>Project Image</Typography>
            {form.imageUrl && <Box component="img" src={form.imageUrl} sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 2, mb: 1 }} />}
            <ImageUploader folder="portfolio/projects" onUpload={(url, pid) => setForm({ ...form, imageUrl: url, imagePublicId: pid })} />
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