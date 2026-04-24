// src/app/admin/skills/page.js
'use client'
import { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Slider, Chip, CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import toast from 'react-hot-toast'
import useAuth from '@/hooks/useAuth'

const CATEGORIES = ['frontend', 'backend', 'database', 'tools', 'design', 'other']
const CATEGORY_COLORS = { frontend: '#E63946', backend: '#2196F3', database: '#4CAF50', tools: '#FF9800', design: '#9C27B0', other: '#aaa' }
const EMPTY = { name: '', category: 'frontend', proficiency: 80, icon: '' }

export default function AdminSkillsPage() {
  const { token } = useAuth()
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  const load = () => fetch('/api/skills').then((r) => r.json()).then((d) => { setSkills(d); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setDialogOpen(true) }
  const openEdit = (s) => { setEditItem(s); setForm({ ...s }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editItem ? `/api/skills/${editItem._id}` : '/api/skills'
      const method = editItem ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success(editItem ? 'Skill updated!' : 'Skill added!')
      setDialogOpen(false)
      load()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this skill?')) return
    await fetch(`/api/skills/${id}`, { method: 'DELETE', headers })
    toast.success('Deleted')
    load()
  }

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat)
    return acc
  }, {})

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
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#fff' }}>Skills</Typography>
          <Typography variant="body2" sx={{ color: '#aaa' }}>{skills.length} skills managed</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ background: 'linear-gradient(135deg,#E63946,#C1121F)', fontWeight: 600 }}>
          Add Skill
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 8 }}><CircularProgress sx={{ color: '#E63946' }} /></Box>
      ) : (
        <TableContainer component={Paper} sx={{ background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                {['Skill', 'Category', 'Proficiency', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ color: '#aaa', borderBottom: '1px solid rgba(255,255,255,0.06)', fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {skills.map((s) => (
                <TableRow key={s._id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                  <TableCell sx={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{s.name}</TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Chip label={s.category} size="small"
                      sx={{ background: `${CATEGORY_COLORS[s.category]}22`, color: CATEGORY_COLORS[s.category], borderRadius: 1 }} />
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 2, height: 6 }}>
                        <Box sx={{ width: `${s.proficiency}%`, background: '#E63946', borderRadius: 2, height: '100%' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#aaa', minWidth: 32 }}>{s.proficiency}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <IconButton size="small" onClick={() => openEdit(s)} sx={{ color: '#E63946' }}><EditIcon fontSize="small" /></IconButton>
                    <IconButton size="small" onClick={() => handleDelete(s._id)} sx={{ color: '#ff4444' }}><DeleteIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { background: '#0d0d0d', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 } }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 700 }}>{editItem ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField fullWidth label="Skill Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={inputSx} />
            <FormControl fullWidth sx={inputSx}>
              <InputLabel sx={{ '&.Mui-focused': { color: '#E63946' } }}>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })}
                sx={{ background: 'rgba(255,255,255,0.02)', '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' } }}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ color: '#aaa', mb: 1 }}>Proficiency: {form.proficiency}%</Typography>
            <Slider value={form.proficiency} onChange={(_, v) => setForm({ ...form, proficiency: v })}
              min={0} max={100} sx={{ color: '#E63946', mb: 2 }} />
            <TextField fullWidth label="Icon (optional)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} sx={inputSx} />
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