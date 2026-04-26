'use client'

import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'

const FOOTER_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  @keyframes marqueeScroll { from{transform:translateX(0);} to{transform:translateX(-50%);} }
  @keyframes glowPulse     { 0%,100%{box-shadow:0 0 8px rgba(234,0,42,.4);} 50%{box-shadow:0 0 20px rgba(234,0,42,.8);} }
  @keyframes floatUp       { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-5px);} }

  .ft-link {
    font-family:'DM Sans'; font-size:.85rem; color:#555; text-decoration:none;
    transition:color .25s; display:inline-flex; align-items:center; gap:6px;
  }
  .ft-link:hover { color:#EA002A; }

  .ft-social {
    width:40px; height:40px; border-radius:'10px'; display:flex; align-items:center; justify-content:center;
    border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03);
    text-decoration:none; font-size:1rem; transition:all .3s;
    border-radius:10px;
  }
  .ft-social:hover {
    border-color:rgba(234,0,42,.5); background:rgba(234,0,42,.1);
    transform:translateY(-3px); box-shadow:0 8px 20px rgba(234,0,42,.2);
  }

  .ft-badge {
    font-family:'DM Sans'; font-size:.7rem; font-weight:700;
    padding:3px 10px; border-radius:20px; letter-spacing:1px;
    border:1px solid rgba(234,0,42,.3); background:rgba(234,0,42,.08); color:#EA002A;
    display:inline-block; text-transform:uppercase;
  }

  .availability-dot {
    width:8px; height:8px; border-radius:50%; background:#22c55e;
    box-shadow:0 0 8px #22c55e; display:inline-block;
    animation:glowPulse 1.5s ease-in-out infinite;
  }
`

const SKILLS_MARQUEE = ['Next.js','React','Node.js','MongoDB','SEO Expert','UI/UX Design','TypeScript','Tailwind CSS','Framer Motion','REST APIs','Figma','PostgreSQL']

const NAV_LINKS = [
  { label:'Home',    href:'/#home'     },
  { label:'About',   href:'/#about'    },
  { label:'Services',href:'/#services' },
  { label:'Projects',href:'/#projects' },
  { label:'Blog',    href:'/blog'      },
  { label:'Contact', href:'/#contact'  },
]

const SOCIAL_LINKS = [
  { icon:'🐙', label:'GitHub',   href:'https://github.com/ahsancoderx'   },
  { icon:'💼', label:'LinkedIn', href:'https://www.linkedin.com/in/ahsan-ali-mern-stack-developer/' },
  { icon:'🐦', label:'Tiktok',  href:'https://www.tiktok.com/@ahsantech74'  },
  { icon:'📸', label:'Instagram',href:'https://instagram.com'},
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <style>{FOOTER_CSS}</style>

      <Box component="footer" sx={{
        position:'relative', bgcolor:'#050505',
        borderTop:'1px solid rgba(234,0,42,.12)',
        fontFamily:"'DM Sans',sans-serif", overflow:'hidden',
      }}>

        {/* BG glow */}
        <Box sx={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'60%', height:200, background:'radial-gradient(ellipse,rgba(234,0,42,.07) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.015, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'40px 40px' }}/>

        {/* ── Marquee strip ── */}
        <Box sx={{ py:2, borderBottom:'1px solid rgba(255,255,255,.04)', overflow:'hidden', position:'relative', zIndex:1, background:'rgba(234,0,42,.03)' }}>
          <Box sx={{ display:'flex', animation:'marqueeScroll 20s linear infinite', whiteSpace:'nowrap' }}>
            {[...SKILLS_MARQUEE,...SKILLS_MARQUEE].map((s,i) => (
              <Box key={i} component="span" sx={{
                display:'inline-flex', alignItems:'center', gap:1.5, mx:3,
                fontFamily:"'Syne'", fontWeight:700, fontSize:'.72rem',
                letterSpacing:'2px', textTransform:'uppercase',
                color: i%4===0 ? '#EA002A' : 'rgba(255,255,255,.18)',
              }}>
                {i%4===0 ? '◆' : '·'} {s}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Main footer ── */}
        <Container sx={{ maxWidth:'1200px !important', position:'relative', zIndex:1 }}>
          <Box sx={{ py:{ xs:8, md:10 }, display:'grid', gridTemplateColumns:{ xs:'1fr', md:'2fr 1fr 1fr 1.5fr' }, gap:{ xs:6, md:4 } }}>

            {/* Col 1 — Brand */}
            <Box>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.2, mb:2.5 }}>
                <Box sx={{
                  width:36, height:36, borderRadius:'10px',
                  background:'linear-gradient(135deg,#EA002A,#c0001f)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation:'glowPulse 3s ease-in-out infinite',
                }}>
                  <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.9rem', color:'#fff' }}>A</Typography>
                </Box>
                <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.4rem', color:'#fff', letterSpacing:'-.5px' }}>
                  Ahsan<Box component="span" sx={{ color:'#EA002A' }}>.</Box>
                </Typography>
              </Box>

              <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', fontSize:'.88rem', lineHeight:1.8, mb:3, maxWidth:260 }}>
                Full-stack engineer crafting scalable, AI-powered web products with Next.js & TypeScript.
              </Typography>

              {/* Availability */}
              <Box sx={{
                display:'inline-flex', alignItems:'center', gap:1.2, mb:3,
                px:2, py:1, borderRadius:'10px',
                background:'rgba(34,197,94,.08)', border:'1px solid rgba(34,197,94,.2)',
              }}>
                <span className="availability-dot"/>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', fontWeight:600, color:'#22c55e' }}>
                  Available for projects
                </Typography>
              </Box>

              {/* Social icons */}
              <Box sx={{ display:'flex', gap:1.2 }}>
                {SOCIAL_LINKS.map(s => (
                  <Box key={s.label} component="a" href={s.href} target="_blank" rel="noopener noreferrer" className="ft-social" title={s.label}>
                    {s.icon}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Col 2 — Navigation */}
            <Box>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.9rem', color:'#fff', mb:3, letterSpacing:'-.3px' }}>
                Navigation
              </Typography>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.8 }}>
                {NAV_LINKS.map(link => (
                  <Link key={link.label} href={link.href} className="ft-link">
                    <Box component="span" sx={{ color:'rgba(234,0,42,.5)', fontSize:'.7rem' }}>▸</Box>
                    {link.label}
                  </Link>
                ))}
              </Box>
            </Box>

            {/* Col 3 — Services */}
            <Box>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.9rem', color:'#fff', mb:3, letterSpacing:'-.3px' }}>
                Services
              </Typography>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.8 }}>
                {['Web Development','Frontend Dev','SEO Expert','UI/UX Design','Backend Dev','Local SEO'].map(s => (
                  <Box key={s} className="ft-link">
                    <Box component="span" sx={{ color:'rgba(234,0,42,.5)', fontSize:'.7rem' }}>▸</Box>
                    {s}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Col 4 — Contact */}
            <Box>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.9rem', color:'#fff', mb:3, letterSpacing:'-.3px' }}>
                Get In Touch
              </Typography>

              {[
                { icon:'📧', label:'Email', value:'ahsanaliwebdeveloper@gmail.com', href:'mailto:ahsanaliwebdeveloper@gmail.com' },
                { icon:'📱', label:'Phone', value:'+92 327 1348097', href:'tel:+923271348097' },
                { icon:'📍', label:'Location', value:'Lahore, Pakistan', href:null },
              ].map(item => (
                <Box key={item.label} sx={{ mb:2.5 }}>
                  <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.7rem', fontWeight:600, color:'#EA002A', letterSpacing:'1px', textTransform:'uppercase', mb:.5 }}>
                    {item.icon} {item.label}
                  </Typography>
                  {item.href
                    ? <Box component="a" href={item.href} sx={{ fontFamily:"'DM Sans'", fontSize:'.83rem', color:'#555', textDecoration:'none', transition:'color .2s', '&:hover':{ color:'#fff' } }}>{item.value}</Box>
                    : <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.83rem', color:'#555' }}>{item.value}</Typography>
                  }
                </Box>
              ))}

              {/* CTA */}
              <Box
                component="a"
                href="/#contact"
                sx={{
                  display:'block', textAlign:'center', mt:3,
                  fontFamily:"'DM Sans'", fontWeight:700, fontSize:'.85rem',
                  py:1.4, borderRadius:'12px',
                  background:'linear-gradient(135deg,#EA002A,#c0001f)',
                  color:'#fff', textDecoration:'none',
                  boxShadow:'0 0 20px rgba(234,0,42,.35)',
                  transition:'all .3s',
                  '&:hover':{ transform:'translateY(-2px)', boxShadow:'0 0 32px rgba(234,0,42,.6)' },
                }}
              >
                Let's Work Together →
              </Box>
            </Box>
          </Box>
        </Container>

        {/* ── Bottom bar ── */}
        <Box sx={{ borderTop:'1px solid rgba(255,255,255,.05)', py:3, position:'relative', zIndex:1 }}>
          <Container sx={{ maxWidth:'1200px !important' }}>
            <Box sx={{ display:'flex', flexDirection:{ xs:'column', md:'row' }, justifyContent:'space-between', alignItems:'center', gap:2 }}>
              <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.8rem', color:'#333' }}>
                © {year} Ahsan Ali. All rights reserved.
              </Typography>

              <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                <span className="ft-badge">Open to Work</span>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#333' }}>
                  Built with Next.js & ❤️
                </Typography>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  )
}