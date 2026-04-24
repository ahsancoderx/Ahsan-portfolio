// src/app/admin/blogs/page.js
'use client'
import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Chip, CircularProgress, Switch, FormControlLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import ImageUploader from '@/components/admin/ImageUploader'
import useAuth from '@/hooks/useAuth'

const EMPTY = { title: '', slug: '', excerpt: '', content: '', tags: '', published: false, coverImageUrl: '', coverImagePublicId: '' }

export default function AdminBlogsPage() {
  const { token } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const load = () =>
    fetch('/api/blogs', { headers }).then((r) => r.json()).then((d) => { setBlogs(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setDialogOpen(true) }
  const openEdit = (b) => { setEditItem(b); setForm({ ...b, tags: (b.tags || []).join(', ') }); setDialogOpen(true) }

  // Auto-generate slug
  const handleTitleChange = (e) => {
    const title = e.target.value
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    setForm({ ...form, title, slug: editItem ? form.slug : slug })
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { ...form, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) }
    try {
      const url = editItem ? `/api/blogs/${editItem.slug}` : '/api/blogs'
      const method = editItem ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error()
      toast.success(editItem ? 'Blog updated!' : 'Blog created!')
      setDialogOpen(false)
      load()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Delete this post?')) return
    await fetch(`/api/blogs/${slug}`, { method: 'DELETE', headers })
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Blog Posts</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>{blogs.length} articles total</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)', fontWeight: 600 }}>
          New Post
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#E63946' }} /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Title', 'Status', 'Tags', 'Views', 'Date', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ color: '#aaa', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((b) => (
                <TableRow key={b._id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)', maxWidth: 200 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{b.title}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Chip label={b.published ? 'Published' : 'Draft'} size="small"
                      sx={{ background: b.published ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)', color: b.published ? '#4CAF50' : '#aaa', borderRadius: 1 }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {b.tags?.slice(0, 2).map((t) => (
                        <Chip key={t} label={t} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#ccc', fontSize: 10 }} />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#aaa', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{b.views}</TableCell>
                  <TableCell sx={{ color: '#aaa', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    {format(new Date(b.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <IconButton size="small" href={`/blog/${b.slug}`} target="_blank" sx={{ color: '#aaa' }}><VisibilityIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => openEdit(b)} sx={{ color: '#E63946' }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(b.slug)} sx={{ color: '#ff4444' }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>{editItem ? 'Edit Post' : 'New Post'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth label="Title" value={form.title} onChange={handleTitleChange} sx={inputSx} />
            <TextField fullWidth label="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} sx={inputSx} />
            <TextField fullWidth label="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} sx={inputSx} />
            <TextField fullWidth label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} sx={inputSx} />
            <TextField fullWidth multiline rows={10} label="Content (Markdown)" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} sx={inputSx} />
            <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>Cover Image</Typography>
            {form.coverImageUrl && <Box component="img" src={form.coverImageUrl} sx={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 2, mb: 1 }} />}
            <ImageUploader folder="portfolio/blog" onUpload={(url, pid) => setForm({ ...form, coverImageUrl: url, coverImagePublicId: pid })} />
            <FormControlLabel
              sx={{ mt: 2 }}
              control={<Switch checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} sx={{ '& .MuiSwitch-thumb': { background: '#E63946' } }} />}
              label={<Typography sx={{ color: '#ccc' }}>Publish immediately</Typography>}
            />
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