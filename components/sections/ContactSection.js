'use client'

import { useState, useEffect, useRef } from 'react'
import { Box, Container, Typography, CircularProgress } from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const CONTACT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0);opacity:.5; } 50%{ transform:translate(10px,-14px);opacity:1; } }
  @keyframes glowPulse     { 0%,100%{ box-shadow:0 0 20px rgba(234,0,42,.3); } 50%{ box-shadow:0 0 45px rgba(234,0,42,.7); } }
  @keyframes scanLine      { 0%{top:-5%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:110%;opacity:0;} }
  @keyframes fadeUp        { from{opacity:0;transform:translateY(36px);} to{opacity:1;transform:none;} }
  @keyframes fadeLeft      { from{opacity:0;transform:translateX(-44px);} to{opacity:1;transform:none;} }
  @keyframes fadeRight     { from{opacity:0;transform:translateX(44px);} to{opacity:1;transform:none;} }
  @keyframes successPop    { 0%{transform:scale(0) rotate(-15deg);opacity:0;} 70%{transform:scale(1.15) rotate(3deg);} 100%{transform:scale(1) rotate(0deg);opacity:1;} }
  @keyframes ripple        { 0%{transform:scale(0);opacity:.6;} 100%{transform:scale(3);opacity:0;} }
  @keyframes borderGlow    { 0%,100%{border-color:rgba(234,0,42,.2);} 50%{border-color:rgba(234,0,42,.6);} }
  @keyframes tagFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }

  .ct-sr   { opacity:0; transform:translateY(36px); transition:opacity .8s ease,transform .8s ease; }
  .ct-sr-l { opacity:0; transform:translateX(-44px);transition:opacity .8s ease,transform .8s ease; }
  .ct-sr-r { opacity:0; transform:translateX(44px); transition:opacity .8s ease,transform .8s ease; }
  .ct-sr.in,.ct-sr-l.in,.ct-sr-r.in { opacity:1; transform:none; }
  .ct-d1{transition-delay:.06s} .ct-d2{transition-delay:.14s}
  .ct-d3{transition-delay:.22s} .ct-d4{transition-delay:.30s}

  .info-card {
    display:flex; align-items:center; gap:16px;
    padding:16px 20px; border-radius:14px;
    background:linear-gradient(135deg,rgba(234,0,42,.07) 0%,rgba(255,255,255,.02) 100%);
    border:1px solid rgba(234,0,42,.18);
    text-decoration:none;
    transition:transform .3s cubic-bezier(.34,1.4,.64,1), box-shadow .3s, border-color .3s;
    position:relative; overflow:hidden;
  }
  .info-card:hover {
    transform:translateY(-4px) scale(1.02);
    box-shadow:0 12px 36px rgba(0,0,0,.5),0 0 24px rgba(234,0,42,.25);
    border-color:rgba(234,0,42,.5);
  }
  .info-card::before {
    content:''; position:absolute; inset:0; border-radius:14px;
    background:linear-gradient(135deg,rgba(234,0,42,.1),transparent);
    opacity:0; transition:opacity .3s;
  }
  .info-card:hover::before { opacity:1; }

  .info-icon {
    width:46px; height:46px; border-radius:12px; flex-shrink:0;
    background:rgba(234,0,42,.12); border:1px solid rgba(234,0,42,.3);
    display:flex; align-items:center; justify-content:center;
    transition:background .3s, box-shadow .3s, transform .3s;
  }
  .info-card:hover .info-icon {
    background:rgba(234,0,42,.22);
    box-shadow:0 0 16px rgba(234,0,42,.4);
    transform:rotate(-5deg) scale(1.1);
  }

  .ct-field {
    width:100%; background:rgba(255,255,255,.04);
    border:1px solid rgba(255,255,255,.09);
    border-radius:12px; padding:13px 16px;
    font-family:'DM Sans',sans-serif; font-size:.92rem; color:#fff;
    outline:none; transition:border .28s, box-shadow .28s, background .28s;
    resize:none;
  }
  .ct-field::placeholder { color:#444; }
  .ct-field:focus {
    border-color:rgba(234,0,42,.55);
    box-shadow:0 0 0 3px rgba(234,0,42,.12), 0 0 20px rgba(234,0,42,.1);
    background:rgba(234,0,42,.04);
  }
  .ct-field:hover:not(:focus) { border-color:rgba(255,255,255,.18); }

  .ct-submit {
    width:100%; padding:14px 24px; border-radius:12px;
    border:none; cursor:pointer; position:relative; overflow:hidden;
    background:#EA002A; color:#fff;
    font-family:'Syne',sans-serif; font-weight:800; font-size:1rem;
    letter-spacing:.5px; text-transform:uppercase;
    box-shadow:0 0 24px rgba(234,0,42,.45);
    transition:all .3s; animation:glowPulse 3s ease-in-out infinite;
  }
  .ct-submit:hover:not(:disabled) {
    background:#c0392b;
    box-shadow:0 0 40px rgba(234,0,42,.7);
    transform:translateY(-2px);
    animation:none;
  }
  .ct-submit:disabled { opacity:.7; cursor:not-allowed; animation:none; }
  .ct-submit .ripple-el {
    position:absolute; border-radius:50%;
    width:10px; height:10px; background:rgba(255,255,255,.3);
    transform:scale(0); animation:ripple .6s linear;
    pointer-events:none;
  }

  .ct-label {
    font-family:'DM Sans'; font-size:.72rem; font-weight:700;
    color:#EA002A; letter-spacing:1.5px; text-transform:uppercase;
    margin-bottom:6px; display:block;
  }

  .success-wrap {
    text-align:center; padding:40px 20px;
    animation:successPop .6s cubic-bezier(.34,1.56,.64,1) forwards;
  }

  .social-pill {
    display:inline-flex; align-items:center; gap:8px;
    padding:8px 16px; border-radius:30px;
    border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04);
    color:#888; font-family:'DM Sans'; font-size:.78rem; font-weight:600;
    text-decoration:none; transition:all .25s;
  }
  .social-pill:hover {
    color:#fff; border-color:rgba(234,0,42,.45);
    background:rgba(234,0,42,.1);
    box-shadow:0 0 14px rgba(234,0,42,.3);
    transform:translateY(-2px);
  }
`

const PARTICLES = [
  { id:0,  top:'5%',  left:'8%',  size:'3px', delay:'0s',   dur:'6s'  },
  { id:1,  top:'12%', left:'72%', size:'2px', delay:'1.2s', dur:'8s'  },
  { id:2,  top:'22%', left:'45%', size:'4px', delay:'0.5s', dur:'7s'  },
  { id:3,  top:'38%', left:'88%', size:'2px', delay:'2.1s', dur:'9s'  },
  { id:4,  top:'45%', left:'15%', size:'3px', delay:'0.8s', dur:'5s'  },
  { id:5,  top:'55%', left:'60%', size:'5px', delay:'1.7s', dur:'11s' },
  { id:6,  top:'62%', left:'32%', size:'2px', delay:'3.0s', dur:'8s'  },
  { id:7,  top:'70%', left:'90%', size:'3px', delay:'0.3s', dur:'6s'  },
  { id:8,  top:'78%', left:'20%', size:'4px', delay:'2.5s', dur:'10s' },
  { id:9,  top:'85%', left:'55%', size:'2px', delay:'1.0s', dur:'7s'  },
  { id:10, top:'90%', left:'40%', size:'3px', delay:'0.6s', dur:'9s'  },
  { id:11, top:'18%', left:'28%', size:'2px', delay:'4.0s', dur:'13s' },
  { id:12, top:'30%', left:'75%', size:'4px', delay:'1.5s', dur:'8s'  },
  { id:13, top:'50%', left:'82%', size:'2px', delay:'1.9s', dur:'12s' },
]

const CONTACT_INFO = [
  {
    Icon: PhoneIcon,
    label: 'Phone',
    value: '+92 327 1348097',
    href: 'tel:+923271348097',
    sub: 'Tap to call directly',
  },
  {
    Icon: EmailIcon,
    label: 'Email',
    value: 'ahsanalitech7@gmail.com',
    href: 'mailto:ahsanalitech7@gmail.com',
    sub: 'Tap to open Gmail',
  },
  {
    Icon: LocationOnIcon,
    label: 'Location',
    value: 'Lahore, Pakistan',
    href: 'https://maps.google.com/?q=Lahore,Pakistan',
    sub: 'Open in Google Maps',
  },
  {
    Icon: WhatsAppIcon,
    label: 'WhatsApp',
    value: '+92 327 1348097',
    href: 'https://wa.me/923271348097?text=Hi%20Ahsan!%20I%20visited%20your%20portfolio.',
    sub: 'Chat on WhatsApp',
  },
]

const EMPTY = { name:'', email:'', phone:'', subject:'', message:'' }

export default function ContactSection() {
  const [form, setForm]       = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const btnRef = useRef(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.ct-sr,.ct-sr-l,.ct-sr-r').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const addRipple = (e) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const el = document.createElement('span')
    el.className = 'ripple-el'
    el.style.left = `${e.clientX - rect.left - 5}px`
    el.style.top  = `${e.clientY - rect.top  - 5}px`
    btn.appendChild(el)
    setTimeout(() => el.remove(), 700)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setSuccess(true)
      setForm(EMPTY)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{CONTACT_CSS}</style>

      <Box id="contact" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:10, md:12 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* BG */}
        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 60% 55% at 50% 100%,rgba(234,0,42,.12) 0%,transparent 60%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.022, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute', borderRadius:'50%', zIndex:0, top:p.top, left:p.left, width:p.size, height:p.size, bgcolor:'rgba(234,0,42,.4)', animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1100px !important' }}>

          {/* heading */}
          <Box className="ct-sr" sx={{ mb:{ xs:7, md:9 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem', letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5 }}>
              — Let's Connect —
            </Typography>
            <Typography sx={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:{ xs:'2.4rem', md:'3.2rem' },
              letterSpacing:'-1px', lineHeight:1.05,
              background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',
              backgroundSize:'200% auto',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'shimmerText 5s linear infinite',
            }}>
              Get In Touch
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
            <Typography sx={{ color:'#555', fontFamily:"'DM Sans'", fontSize:'.95rem', mt:2.5, maxWidth:440, mx:'auto', lineHeight:1.7 }}>
              Available for freelance projects, full-time roles, and collaborations. Let's build something great.
            </Typography>
          </Box>

          {/* two columns */}
          <Box sx={{ display:'flex', flexDirection:{ xs:'column', md:'row' }, gap:{ xs:5, md:6 }, alignItems:'flex-start' }}>

            {/* ── LEFT ── */}
            <Box className="ct-sr-l ct-d1" sx={{ flex:'0 0 auto', width:{ xs:'100%', md:340 } }}>

              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:'1.5rem', letterSpacing:'-.5px', mb:.8 }}>
                Let's Work Together
              </Typography>
              <Box sx={{ width:32, height:'3px', borderRadius:2, background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))', mb:2 }}/>
              <Typography sx={{ fontFamily:"'DM Sans'", color:'#777', fontSize:'.9rem', lineHeight:1.8, mb:4 }}>
                I help businesses build modern websites, improve SEO, and grow their online presence. Drop me a message and I'll get back to you within 24 hours.
              </Typography>

              {/* contact info cards */}
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.5, mb:4 }}>
                {CONTACT_INFO.map((item, i) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href?.startsWith('http') ? '_blank' : undefined}
                    rel={item.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`info-card ct-sr-l ct-d${i+1}`}
                  >
                    <Box className="info-icon">
                      <item.Icon sx={{ fontSize:'1.25rem', color:'#EA002A' }}/>
                    </Box>
                    <Box sx={{ flex:1, minWidth:0 }}>
                      <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.65rem', fontWeight:700, color:'#EA002A', letterSpacing:'1.5px', textTransform:'uppercase', mb:.2 }}>
                        {item.label}
                      </Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'", color:'#ddd', fontSize:'.84rem', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {item.value}
                      </Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', fontSize:'.7rem', mt:.2 }}>
                        {item.sub}
                      </Typography>
                    </Box>
                    <Typography sx={{ color:'#EA002A', fontSize:'.8rem', flexShrink:0 }}>→</Typography>
                  </a>
                ))}
              </Box>

              {/* availability badge */}
              <Box sx={{
                display:'inline-flex', alignItems:'center', gap:1.5,
                px:2.5, py:1.2, borderRadius:'30px',
                background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.3)',
              }}>
                <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#22c55e', boxShadow:'0 0 8px #22c55e', animation:'glowPulse 2s infinite' }}/>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.8rem', fontWeight:700, color:'#22c55e' }}>
                  Available for new projects
                </Typography>
              </Box>
            </Box>

            {/* ── RIGHT: FORM ── */}
            <Box className="ct-sr-r ct-d2" sx={{ flex:1 }}>
              <Box sx={{
                p:{ xs:'28px 22px', md:'36px 32px' },
                borderRadius:'20px',
                background:'linear-gradient(145deg,#141414,#0d0d0d)',
                border:'1px solid rgba(234,0,42,.22)',
                boxShadow:'0 0 60px rgba(0,0,0,.6), 0 0 0 1px rgba(234,0,42,.08)',
                position:'relative', overflow:'hidden',
                animation:'borderGlow 4s ease-in-out infinite',
              }}>
                <Box sx={{ position:'absolute', left:0, right:0, height:'2px', background:'linear-gradient(90deg,transparent,rgba(234,0,42,.4),transparent)', top:'-5%', animation:'scanLine 6s linear infinite', pointerEvents:'none', zIndex:2 }}/>
                <Box sx={{ position:'absolute', top:-30, right:-30, width:100, height:100, borderRadius:'50%', background:'rgba(234,0,42,.12)', filter:'blur(30px)' }}/>
                <Box sx={{ position:'absolute', bottom:-30, left:-30, width:80, height:80, borderRadius:'50%', background:'rgba(234,0,42,.08)', filter:'blur(24px)' }}/>

                {success ? (
                  <Box className="success-wrap">
                    <CheckCircleIcon sx={{ fontSize:'4rem', color:'#22c55e', mb:2, display:'block', mx:'auto' }}/>
                    <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:'1.5rem', mb:1 }}>
                      Message Sent!
                    </Typography>
                    <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.9rem', mb:3, lineHeight:1.7 }}>
                      Thank you for reaching out. I'll get back to you within 24 hours.
                    </Typography>
                    <button
                      className="ct-submit"
                      style={{ width:'auto', padding:'10px 28px' }}
                      onClick={() => setSuccess(false)}
                    >
                      Send Another →
                    </button>
                  </Box>
                ) : (
                  <>
                    <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:'1.3rem', mb:.5, letterSpacing:'-.3px' }}>
                      Send a Message
                    </Typography>
                    <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', fontSize:'.82rem', mb:3 }}>
                      Fill in the details below and I'll respond promptly.
                    </Typography>

                    <form onSubmit={handleSubmit} style={{ position:'relative', zIndex:1 }}>

                      <Box sx={{ display:'flex', gap:2, flexDirection:{ xs:'column', sm:'row' }, mb:2 }}>
                        <Box sx={{ flex:1 }}>
                          <label className="ct-label">Full Name *</label>
                          <input className="ct-field" placeholder="Ahsan Ali" value={form.name} onChange={set('name')} required/>
                        </Box>
                        <Box sx={{ flex:1 }}>
                          <label className="ct-label">Email Address *</label>
                          <input className="ct-field" type="email" placeholder="ahsan@example.com" value={form.email} onChange={set('email')} required/>
                        </Box>
                      </Box>

                      <Box sx={{ display:'flex', gap:2, flexDirection:{ xs:'column', sm:'row' }, mb:2 }}>
                        <Box sx={{ flex:1 }}>
                          <label className="ct-label">Phone Number</label>
                          <input className="ct-field" placeholder="+92 300 0000000" value={form.phone} onChange={set('phone')}/>
                        </Box>
                        <Box sx={{ flex:1 }}>
                          <label className="ct-label">Subject *</label>
                          <input className="ct-field" placeholder="Project Inquiry" value={form.subject} onChange={set('subject')} required/>
                        </Box>
                      </Box>

                      <Box sx={{ mb:2.5 }}>
                        <label className="ct-label">Your Message *</label>
                        <textarea className="ct-field" rows={5} placeholder="Tell me about your project, goals, budget and timeline…" value={form.message} onChange={set('message')} required/>
                      </Box>

                      {error && (
                        <Box sx={{ mb:2, p:1.5, borderRadius:'10px', background:'rgba(234,0,42,.1)', border:'1px solid rgba(234,0,42,.3)' }}>
                          <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
                            <WarningAmberIcon sx={{ color:'#ff6b6b', fontSize:'1rem' }}/>
                            <Typography sx={{ fontFamily:"'DM Sans'", color:'#ff6b6b', fontSize:'.84rem' }}>
                              {error}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <button
                        ref={btnRef}
                        type="submit"
                        className="ct-submit"
                        disabled={loading}
                        onClick={addRipple}
                      >
                        {loading
                          ? <Box sx={{ display:'flex', alignItems:'center', gap:1, justifyContent:'center' }}>
                              <CircularProgress size={18} sx={{ color:'#fff' }}/>
                              <span>Sending…</span>
                            </Box>
                          : <Box sx={{ display:'flex', alignItems:'center', gap:1, justifyContent:'center' }}>
                              <SendIcon sx={{ fontSize:'1rem' }}/>
                              <span>Send Message</span>
                            </Box>
                        }
                      </button>
                    </form>
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Container>

        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  )
}