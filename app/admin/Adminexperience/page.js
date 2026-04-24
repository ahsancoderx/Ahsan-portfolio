'use client'

import { useEffect, useState } from 'react'
import { Box, Container, Typography, TextField, Button, IconButton, Chip } from '@mui/material'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const ADMIN_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes fadeIn      { from{ opacity:0; transform:translateY(16px); } to{ opacity:1; transform:none; } }
  @keyframes pulse       { 0%,100%{ box-shadow:0 0 0 0 rgba(234,0,42,0); } 50%{ box-shadow:0 0 0 6px rgba(234,0,42,.2); } }
  @keyframes spin        { to{ transform:rotate(360deg); } }

  .admin-card {
    background: linear-gradient(145deg,#141414,#0d0d0d);
    border: 1px solid rgba(234,0,42,.18);
    border-radius: 16px;
    padding: 24px;
    transition: border-color .3s, box-shadow .3s;
    animation: fadeIn .5s ease both;
  }
  .admin-card:hover {
    border-color: rgba(234,0,42,.4);
    box-shadow: 0 8px 32px rgba(0,0,0,.5), 0 0 20px rgba(234,0,42,.1);
  }

  .admin-input .MuiOutlinedInput-root {
    font-family: 'DM Sans', sans-serif;
    color: #ddd;
    background: rgba(255,255,255,.03);
    border-radius: 10px;
  }
  .admin-input .MuiOutlinedInput-root fieldset { border-color: rgba(255,255,255,.1); }
  .admin-input .MuiOutlinedInput-root:hover fieldset { border-color: rgba(234,0,42,.4); }
  .admin-input .MuiOutlinedInput-root.Mui-focused fieldset { border-color: #EA002A; box-shadow: 0 0 0 3px rgba(234,0,42,.15); }
  .admin-input .MuiInputLabel-root { font-family: 'DM Sans'; color: #666; }
  .admin-input .MuiInputLabel-root.Mui-focused { color: #EA002A; }

  .admin-btn-primary {
    font-family: 'DM Sans' !important; font-weight: 700 !important;
    background: #EA002A !important; color: #fff !important;
    border-radius: 10px !important; text-transform: none !important;
    box-shadow: 0 0 18px rgba(234,0,42,.35) !important;
    transition: all .3s !important;
  }
  .admin-btn-primary:hover {
    background: #c0392b !important;
    box-shadow: 0 0 32px rgba(234,0,42,.6) !important;
    transform: translateY(-2px) !important;
  }
  .admin-btn-ghost {
    font-family: 'DM Sans' !important; font-weight: 600 !important;
    color: #666 !important; border: 1px solid rgba(255,255,255,.1) !important;
    border-radius: 10px !important; text-transform: none !important;
    transition: all .3s !important;
  }
  .admin-btn-ghost:hover { color: #fff !important; border-color: rgba(234,0,42,.4) !important; }

  .admin-btn-danger {
    font-family: 'DM Sans' !important; font-weight: 600 !important;
    color: #EA002A !important; border: 1px solid rgba(234,0,42,.3) !important;
    border-radius: 8px !important; text-transform: none !important;
    transition: all .3s !important;
  }
  .admin-btn-danger:hover { background: rgba(234,0,42,.12) !important; border-color: #EA002A !important; }

  .status-dot { width:8px; height:8px; border-radius:50%; background:#EA002A; animation:pulse 2s infinite; }

  .tag-chip {
    font-family:'DM Sans'; font-size:.72rem; font-weight:600;
    background:rgba(234,0,42,.1) !important; color:#EA002A !important;
    border:1px solid rgba(234,0,42,.3) !important; border-radius:20px !important;
  }

  .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,.15); border-top-color:#EA002A; border-radius:50%; animation:spin .7s linear infinite; display:inline-block; }

  .toggle-switch { position:relative; width:44px; height:24px; cursor:pointer; }
  .toggle-switch input { opacity:0; width:0; height:0; }
  .toggle-slider {
    position:absolute; inset:0; border-radius:24px;
    background:rgba(255,255,255,.1); transition:.3s;
  }
  .toggle-slider::before {
    content:''; position:absolute;
    width:18px; height:18px; border-radius:50%;
    left:3px; top:3px; background:#666;
    transition:.3s;
  }
  .toggle-switch input:checked + .toggle-slider { background:rgba(234,0,42,.35); }
  .toggle-switch input:checked + .toggle-slider::before { left:23px; background:#EA002A; box-shadow:0 0 8px rgba(234,0,42,.7); }
`

// ─── Types ────────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  company:'', role:'', type:'Full-time', location:'',
  startDate:'', endDate:'', isCurrent:false,
  logo:'', description:'', achievements:[], skills:[], order:0,
}

const EXP_TYPES = ['Full-time','Part-time','Freelance','Internship','Contract']

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type }) {
  if (!msg) return null
  return (
    <Box sx={{
      position:'fixed', bottom:28, right:28, zIndex:9999,
      px:3, py:1.5, borderRadius:'10px',
      background: type==='error' ? 'rgba(234,0,42,.15)' : 'rgba(0,200,80,.12)',
      border:`1px solid ${type==='error' ? 'rgba(234,0,42,.5)' : 'rgba(0,200,80,.4)'}`,
      backdropFilter:'blur(12px)',
      animation:'fadeIn .3s ease',
    }}>
      <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.88rem', color: type==='error' ? '#ff6b6b' : '#69db7c', fontWeight:600 }}>
        {type==='error' ? '✗' : '✓'} {msg}
      </Typography>
    </Box>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────
function ExpRow({ exp, onEdit, onDelete }) {
  return (
    <Box className="admin-card" sx={{ display:'flex', gap:2, alignItems:'flex-start', mb:2 }}>
      {/* logo / initials */}
      <Box sx={{
        width:44, height:44, borderRadius:'10px', flexShrink:0,
        background: exp.logo ? 'transparent' : 'linear-gradient(135deg,#EA002A,rgba(234,0,42,.5))',
        border:'1px solid rgba(234,0,42,.3)',
        display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden',
      }}>
        {exp.logo
          ? <img src={exp.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          : <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.8rem', color:'#fff' }}>
              {exp.company?.slice(0,2).toUpperCase()}
            </Typography>
        }
      </Box>

      <Box sx={{ flex:1, minWidth:0 }}>
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:1, alignItems:'center', mb:.4 }}>
          <Typography sx={{ fontFamily:"'Syne'", fontWeight:700, color:'#fff', fontSize:'.95rem' }}>
            {exp.role}
          </Typography>
          {exp.isCurrent && (
            <Box sx={{ display:'flex', alignItems:'center', gap:.6, px:1, py:.3, borderRadius:'20px', background:'rgba(234,0,42,.12)', border:'1px solid rgba(234,0,42,.3)' }}>
              <Box className="status-dot"/>
              <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.65rem', color:'#EA002A', fontWeight:700, letterSpacing:'.5px' }}>CURRENT</Typography>
            </Box>
          )}
        </Box>
        <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#EA002A', fontWeight:600, mb:.5 }}>
          {exp.company} · {exp.type} · {exp.location}
        </Typography>
        <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.75rem', color:'#555' }}>
          {exp.startDate} → {exp.isCurrent ? 'Present' : exp.endDate || '—'}
        </Typography>
        {exp.skills?.length > 0 && (
          <Box sx={{ mt:1, display:'flex', flexWrap:'wrap', gap:.75 }}>
            {exp.skills.slice(0,5).map(s => (
              <Chip key={s} label={s} size="small" className="tag-chip"/>
            ))}
            {exp.skills.length > 5 && (
              <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.7rem', color:'#555', alignSelf:'center' }}>
                +{exp.skills.length - 5} more
              </Typography>
            )}
          </Box>
        )}
      </Box>

      <Box sx={{ display:'flex', gap:1, flexShrink:0 }}>
        <Button variant="outlined" size="small" className="admin-btn-ghost" onClick={() => onEdit(exp)}>Edit</Button>
        <Button variant="outlined" size="small" className="admin-btn-danger" onClick={() => onDelete(exp._id)}>Delete</Button>
      </Box>
    </Box>
  )
}

// ─── Form ─────────────────────────────────────────────────────────────────────
function ExpForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm]         = useState(initial || EMPTY_FORM)
  const [skillInput, setSkill]  = useState('')
  const [achInput,   setAch]    = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addSkill = () => {
    if (!skillInput.trim()) return
    set('skills', [...(form.skills||[]), skillInput.trim()])
    setSkill('')
  }
  const removeSkill = (i) => set('skills', form.skills.filter((_,j) => j!==i))

  const addAch = () => {
    if (!achInput.trim()) return
    set('achievements', [...(form.achievements||[]), achInput.trim()])
    setAch('')
  }
  const removeAch = (i) => set('achievements', form.achievements.filter((_,j) => j!==i))

  const f = (label, key, opts={}) => (
    <TextField
      label={label}
      value={form[key] || ''}
      onChange={e => set(key, e.target.value)}
      fullWidth
      variant="outlined"
      size="small"
      className="admin-input"
      sx={{ mb:2 }}
      {...opts}
    />
  )

  return (
    <Box className="admin-card" sx={{ mb:3 }}>
      <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:'1.1rem', mb:3 }}>
        {initial?._id ? '✏️ Edit Experience' : '➕ Add New Experience'}
      </Typography>

      <Box sx={{ display:'flex', flexWrap:'wrap', gap:2 }}>
        <Box sx={{ flex:'1 1 220px' }}>{f('Company Name *', 'company')}</Box>
        <Box sx={{ flex:'1 1 220px' }}>{f('Job Title / Role *', 'role')}</Box>
      </Box>

      <Box sx={{ display:'flex', flexWrap:'wrap', gap:2 }}>
        <Box sx={{ flex:'1 1 160px' }}>
          <TextField
            select label="Employment Type" value={form.type || 'Full-time'}
            onChange={e => set('type', e.target.value)}
            fullWidth size="small" className="admin-input" sx={{ mb:2 }}
            SelectProps={{ native: true }}
          >
            {EXP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </TextField>
        </Box>
        <Box sx={{ flex:'1 1 200px' }}>{f('Location', 'location')}</Box>
        <Box sx={{ flex:'1 1 130px' }}>{f('Start Date (YYYY-MM) *', 'startDate', { placeholder:'2022-01' })}</Box>
        <Box sx={{ flex:'1 1 130px' }}>{f('End Date (YYYY-MM)', 'endDate', { disabled: form.isCurrent, placeholder:'2023-06' })}</Box>
      </Box>

      {/* Currently working here toggle */}
      <Box sx={{ display:'flex', alignItems:'center', gap:2, mb:2.5 }}>
        <label className="toggle-switch">
          <input type="checkbox" checked={!!form.isCurrent} onChange={e => { set('isCurrent', e.target.checked); if(e.target.checked) set('endDate','') }}/>
          <span className="toggle-slider"/>
        </label>
        <Typography sx={{ fontFamily:"'DM Sans'", color: form.isCurrent ? '#EA002A' : '#666', fontSize:'.88rem', fontWeight:600 }}>
          Currently working here
        </Typography>
      </Box>

      {f('Company Logo URL (optional)', 'logo', { placeholder:'https://...' })}
      {f('Description', 'description', { multiline:true, rows:3 })}
      {f('Display Order (lower = first)', 'order', { type:'number' })}

      {/* Skills */}
      <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.78rem', fontWeight:600, mb:1, letterSpacing:'1px', textTransform:'uppercase' }}>
        Skills / Technologies
      </Typography>
      <Box sx={{ display:'flex', gap:1, mb:1.5 }}>
        <TextField
          value={skillInput} onChange={e => setSkill(e.target.value)}
          onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addSkill())}
          placeholder="e.g. React" size="small" className="admin-input"
          sx={{ flex:1 }}
        />
        <Button onClick={addSkill} variant="contained" className="admin-btn-primary" sx={{ px:2 }}>Add</Button>
      </Box>
      <Box sx={{ display:'flex', flexWrap:'wrap', gap:.75, mb:2.5 }}>
        {(form.skills||[]).map((s,i) => (
          <Chip key={i} label={s} size="small" className="tag-chip"
            onDelete={() => removeSkill(i)}
            sx={{ '& .MuiChip-deleteIcon':{ color:'rgba(234,0,42,.6)', '&:hover':{ color:'#EA002A' } } }}
          />
        ))}
      </Box>

      {/* Achievements */}
      <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.78rem', fontWeight:600, mb:1, letterSpacing:'1px', textTransform:'uppercase' }}>
        Key Achievements
      </Typography>
      <Box sx={{ display:'flex', gap:1, mb:1.5 }}>
        <TextField
          value={achInput} onChange={e => setAch(e.target.value)}
          onKeyDown={e => e.key==='Enter' && (e.preventDefault(), addAch())}
          placeholder="e.g. Improved load speed by 40%" size="small" className="admin-input"
          sx={{ flex:1 }}
        />
        <Button onClick={addAch} variant="contained" className="admin-btn-primary" sx={{ px:2 }}>Add</Button>
      </Box>
      <Box sx={{ display:'flex', flexDirection:'column', gap:.75, mb:3 }}>
        {(form.achievements||[]).map((a,i) => (
          <Box key={i} sx={{ display:'flex', alignItems:'center', gap:1, p:1.2, borderRadius:'8px', background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)' }}>
            <Box sx={{ width:6, height:6, borderRadius:'50%', bgcolor:'#EA002A', flexShrink:0 }}/>
            <Typography sx={{ fontFamily:"'DM Sans'", color:'#bbb', fontSize:'.84rem', flex:1 }}>{a}</Typography>
            <IconButton size="small" onClick={() => removeAch(i)} sx={{ color:'#444', '&:hover':{ color:'#EA002A' }, p:.5 }}>✕</IconButton>
          </Box>
        ))}
      </Box>

      <Box sx={{ display:'flex', gap:2 }}>
        <Button
          variant="contained" className="admin-btn-primary"
          onClick={() => onSave(form)} disabled={saving}
          sx={{ px:4, py:1.2, fontSize:'1rem' }}
        >
          {saving ? <><span className="spinner" style={{ marginRight:8 }}/> Saving…</> : initial?._id ? 'Update Experience' : 'Add Experience'}
        </Button>
        <Button variant="outlined" className="admin-btn-ghost" onClick={onCancel} sx={{ px:3 }}>Cancel</Button>
      </Box>
    </Box>
  )
}

// ─── Main admin page ──────────────────────────────────────────────────────────
export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading]         = useState(true)
  const [editing,  setEditing]        = useState(null)   // null = closed, {} = new, exp = edit
  const [saving,   setSaving]         = useState(false)
  const [toast,    setToast]          = useState({ msg:'', type:'success' })

  const showToast = (msg, type='success') => {
    setToast({ msg, type })
    setTimeout(() => setToast({ msg:'', type:'success' }), 3000)
  }

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/experience')
      const data = await res.json()
      setExperiences(Array.isArray(data) ? data : data?.experiences || [])
    } catch {
      showToast('Failed to load experiences', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (form) => {
    setSaving(true)
    try {
      const isEdit = !!form._id
      const res = await fetch('/api/experience', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      showToast(isEdit ? 'Experience updated!' : 'Experience added!')
      setEditing(null)
      load()
    } catch {
      showToast('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return
    try {
      const res = await fetch(`/api/experience?id=${id}`, { method:'DELETE' })
      if (!res.ok) throw new Error()
      showToast('Deleted successfully')
      load()
    } catch {
      showToast('Failed to delete', 'error')
    }
  }

  return (
    <>
      <style>{ADMIN_CSS}</style>

      <Box sx={{
        minHeight:'100vh', bgcolor:'#080808',
        fontFamily:"'DM Sans',sans-serif", py:4,
      }}>
        <Container sx={{ maxWidth:'860px !important' }}>

          {/* header */}
          <Box sx={{ display:'flex', alignItems:'center', justifyContent:'space-between', mb:5, flexWrap:'wrap', gap:2 }}>
            <Box>
              <Typography sx={{
                fontFamily:"'Syne'", fontWeight:800,
                fontSize:{ xs:'1.6rem', md:'2rem' },
                background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                animation:'shimmerText 5s linear infinite',
              }}>
                Work Experience
              </Typography>
              <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', fontSize:'.82rem', mt:.3 }}>
                {experiences.length} entr{experiences.length===1?'y':'ies'} · Admin Panel
              </Typography>
            </Box>

            {!editing && (
              <Button
                variant="contained" className="admin-btn-primary"
                onClick={() => setEditing({})}
                sx={{ px:3, py:1.2, fontSize:'.95rem' }}
              >
                + Add Experience
              </Button>
            )}
          </Box>

          {/* form (add / edit) */}
          {editing !== null && (
            <ExpForm
              initial={editing?._id ? editing : null}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          )}

          {/* list */}
          {loading
            ? <Box sx={{ textAlign:'center', py:8 }}>
                <span className="spinner" style={{ width:32, height:32, borderWidth:3 }}/>
                <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', mt:2, fontSize:'.88rem' }}>Loading…</Typography>
              </Box>
            : experiences.length === 0
            ? <Box sx={{ textAlign:'center', py:10, border:'1px dashed rgba(255,255,255,.07)', borderRadius:'16px' }}>
                <Typography sx={{ fontFamily:"'Syne'", color:'#333', fontSize:'1.2rem', mb:1 }}>No experiences yet</Typography>
                <Typography sx={{ fontFamily:"'DM Sans'", color:'#444', fontSize:'.85rem' }}>Click "Add Experience" to get started</Typography>
              </Box>
            : experiences.map(exp => (
                <ExpRow
                  key={exp._id}
                  exp={exp}
                  onEdit={e => setEditing(e)}
                  onDelete={handleDelete}
                />
              ))
          }
        </Container>
      </Box>

      <Toast msg={toast.msg} type={toast.type}/>
    </>
  )
}