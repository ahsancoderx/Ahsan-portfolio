'use client'

import { useEffect, useState, useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'

// ─── CSS ──────────────────────────────────────────────────────────────────────
const SKILLS_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  @keyframes float3d       { 0%,100%{ transform:translateY(0) rotateX(0deg); } 50%{ transform:translateY(-8px) rotateX(6deg); } }
  @keyframes glowRing      { 0%,100%{ box-shadow:0 0 0 0 rgba(234,0,42,0), 0 8px 32px rgba(0,0,0,.6); } 50%{ box-shadow:0 0 0 6px rgba(234,0,42,.18), 0 8px 32px rgba(0,0,0,.6); } }
  @keyframes iconRotateIn  { from{ transform:rotateY(-90deg) scale(.6); opacity:0; } to{ transform:rotateY(0deg) scale(1); opacity:1; } }
  @keyframes shimmerBar    { 0%{ background-position:-200% 0; } 100%{ background-position:200% 0; } }
  @keyframes countUp       { from{ opacity:0; transform:translateY(8px); } to{ opacity:1; transform:none; } }
  @keyframes tabGlow       { 0%,100%{ box-shadow:0 0 8px rgba(234,0,42,.3); } 50%{ box-shadow:0 0 18px rgba(234,0,42,.7); } }
  @keyframes orb           { 0%,100%{ transform:scale(1) translate(0,0); } 50%{ transform:scale(1.15) translate(6px,-6px); } }

  /* scroll reveal */
  .sk-sr   { opacity:0; transform:translateY(40px); transition:opacity .75s ease, transform .75s ease; }
  .sk-sr-l { opacity:0; transform:translateX(-44px);transition:opacity .75s ease, transform .75s ease; }
  .sk-sr-r { opacity:0; transform:translateX(44px); transition:opacity .75s ease, transform .75s ease; }
  .sk-sr.in,.sk-sr-l.in,.sk-sr-r.in { opacity:1; transform:none; }
  .sk-d1{transition-delay:.04s} .sk-d2{transition-delay:.12s}
  .sk-d3{transition-delay:.2s}  .sk-d4{transition-delay:.28s}
  .sk-d5{transition-delay:.36s} .sk-d6{transition-delay:.44s}
  .sk-d7{transition-delay:.52s} .sk-d8{transition-delay:.60s}

  /* ── 3-D icon card ── */
  .skill-card-wrap {
    perspective: 800px;
  }
  .skill-card {
    position: relative;
    border-radius: 20px;
    background: linear-gradient(145deg, #141414 0%, #0d0d0d 100%);
    border: 1px solid rgba(234,0,42,.18);
    padding: 28px 20px 22px;
    text-align: center;
    cursor: default;
    transition:
      transform .45s cubic-bezier(.34,1.4,.64,1),
      box-shadow .45s,
      border-color .35s;
    transform-style: preserve-3d;
    will-change: transform;
    overflow: hidden;
  }
  .skill-card::before {
    content:'';
    position:absolute; inset:0; border-radius:20px;
    background: linear-gradient(135deg, rgba(234,0,42,.12) 0%, transparent 60%);
    opacity:0; transition:opacity .35s;
  }
  .skill-card:hover {
    transform: rotateX(-10deg) rotateY(8deg) translateY(-10px) scale(1.04);
    box-shadow:
      0 28px 60px rgba(0,0,0,.7),
      0 0 0 1px rgba(234,0,42,.45),
      0 0 40px rgba(234,0,42,.2),
      -8px 8px 20px rgba(234,0,42,.1);
    border-color: rgba(234,0,42,.55);
  }
  .skill-card:hover::before { opacity:1; }
  .skill-card:hover .sk-icon-wrap { animation: float3d 2.5s ease-in-out infinite; }
  .skill-card:hover .sk-bar-fill  { animation: shimmerBar 2s linear infinite; }

  /* icon wrapper — gives the "lifted" 3-D look */
  .sk-icon-wrap {
    width: 64px; height: 64px;
    border-radius: 16px;
    margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
    position: relative;
    transition: transform .35s;
    transform-style: preserve-3d;
  }
  .sk-icon-wrap::after {
    content:'';
    position:absolute; bottom:-6px; left:10%; right:10%; height:10px;
    background: radial-gradient(ellipse, rgba(234,0,42,.5) 0%, transparent 70%);
    filter: blur(4px);
    opacity:.6;
    transition: opacity .35s;
  }
  .skill-card:hover .sk-icon-wrap::after { opacity:1; }

  .sk-icon-img {
    width: 36px; height: 36px;
    object-fit: contain;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.5));
    transition: transform .35s, filter .35s;
  }
  .skill-card:hover .sk-icon-img {
    filter: drop-shadow(0 0 10px rgba(234,0,42,.5));
    transform: scale(1.1) translateZ(8px);
  }

  /* skill bar inside card */
  .sk-bar-track {
    height: 5px; border-radius: 4px;
    background: rgba(255,255,255,.07);
    overflow: hidden; margin-top: 12px;
    position: relative;
  }
  .sk-bar-fill {
    height: 100%; border-radius: 4px;
    background: linear-gradient(90deg, #EA002A 0%, #ff4d6d 50%, #EA002A 100%);
    background-size: 200% 100%;
    box-shadow: 0 0 8px rgba(234,0,42,.6);
    width: 0%;
    transition: width 1.1s cubic-bezier(.4,0,.2,1);
  }
  .sk-bar-fill.run { width: var(--w); }

  /* category tab pill */
  .cat-tab {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: .78rem;
    letter-spacing: .5px; text-transform: uppercase;
    padding: 7px 18px; border-radius: 30px;
    border: 1px solid rgba(255,255,255,.1);
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all .28s;
    white-space: nowrap;
  }
  .cat-tab:hover {
    color: #fff;
    border-color: rgba(234,0,42,.4);
    background: rgba(234,0,42,.08);
  }
  .cat-tab.active {
    background: #EA002A;
    border-color: #EA002A;
    color: #fff;
    box-shadow: 0 0 18px rgba(234,0,42,.5);
    animation: tabGlow 2s ease-in-out infinite;
  }

  /* proficiency badge */
  .pct-badge {
    position: absolute; top: 12px; right: 12px;
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: .72rem; color: #EA002A;
    background: rgba(234,0,42,.1);
    border: 1px solid rgba(234,0,42,.3);
    border-radius: 8px; padding: 2px 7px;
    letter-spacing: .5px;
  }
`

// ─── Skills data with devicon URLs ───────────────────────────────────────────
const ALL_SKILLS = [
  { name:'HTML / CSS',    proficiency:95, category:'frontend', bg:'linear-gradient(135deg,#e44d26,#f06529)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
  { name:'JavaScript',   proficiency:88, category:'frontend', bg:'linear-gradient(135deg,#f7df1e,#e6c800)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
  { name:'React.js',     proficiency:85, category:'frontend', bg:'linear-gradient(135deg,#20232a,#61dafb)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
  { name:'Next.js',      proficiency:80, category:'frontend', bg:'linear-gradient(135deg,#000,#333)',       icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
  { name:'TypeScript',   proficiency:76, category:'frontend', bg:'linear-gradient(135deg,#007acc,#3178c6)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
  { name:'Tailwind CSS', proficiency:82, category:'frontend', bg:'linear-gradient(135deg,#0ea5e9,#38bdf8)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
  { name:'Node.js',      proficiency:72, category:'backend',  bg:'linear-gradient(135deg,#215732,#339933)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
  { name:'Python',       proficiency:65, category:'backend',  bg:'linear-gradient(135deg,#3776ab,#ffd43b)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
  { name:'MongoDB',      proficiency:70, category:'database', bg:'linear-gradient(135deg,#116149,#47a248)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
  { name:'MySQL',        proficiency:65, category:'database', bg:'linear-gradient(135deg,#00618a,#00758f)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
  { name:'SEO',          proficiency:90, category:'tools',    bg:'linear-gradient(135deg,#EA002A,#ff4d6d)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg' },
  { name:'Git / GitHub', proficiency:84, category:'tools',    bg:'linear-gradient(135deg,#1b1f23,#f05032)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
  { name:'Figma',        proficiency:78, category:'design',   bg:'linear-gradient(135deg,#1e1e1e,#a259ff)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { name:'Photoshop',    proficiency:72, category:'design',   bg:'linear-gradient(135deg,#001e36,#31a8ff)', icon:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg' },
]

const CATEGORIES = ['all','frontend','backend','database','tools','design']

const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id:i, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
  size:`${2+Math.random()*3}px`, delay:`${Math.random()*7}s`, dur:`${5+Math.random()*9}s`,
}))

// ─── 3-D Skill Card ──────────────────────────────────────────────────────────
function SkillCard3D({ skill, index, started }) {
  const cardRef = useRef(null)

  // tilt on mouse move
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5
    card.style.transform = `rotateX(${-y * 18}deg) rotateY(${x * 18}deg) translateY(-10px) scale(1.04)`
  }
  const handleMouseLeave = (e) => {
    if (cardRef.current)
      cardRef.current.style.transform = ''
  }

  return (
    <Box
      className={`skill-card-wrap sk-sr sk-d${Math.min((index % 8) + 1, 8)}`}
      sx={{ flex:'0 0 auto', width:{ xs:'calc(50% - 8px)', sm:'calc(33.33% - 11px)', md:'calc(25% - 12px)', lg:'calc(16.66% - 13px)' }, minWidth:{ xs:140, md:150 } }}
    >
      <Box
        ref={cardRef}
        className="skill-card"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* % badge */}
        <Box className="pct-badge">{skill.proficiency}%</Box>

        {/* icon */}
        <Box className="sk-icon-wrap" sx={{ background: skill.bg }}>
          <img src={skill.icon} alt={skill.name} className="sk-icon-img" />
        </Box>

        {/* name */}
        <Typography sx={{
          fontFamily:"'DM Sans'", fontWeight:700, fontSize:'.82rem',
          color:'#e0e0e0', letterSpacing:'.2px', lineHeight:1.2,
        }}>
          {skill.name}
        </Typography>

        {/* bar */}
        <Box className="sk-bar-track">
          <Box
            className={`sk-bar-fill${started ? ' run' : ''}`}
            style={{ '--w':`${skill.proficiency}%` }}
          />
        </Box>
      </Box>
    </Box>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const [skills, setSkills]       = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [started, setStarted]     = useState(false)
  const gridRef = useRef(null)

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setSkills(d)
        else if (Array.isArray(d?.skills)) setSkills(d.skills)
        else setSkills([])
      })
      .catch(() => setSkills([]))
  }, [])

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.sk-sr,.sk-sr-l,.sk-sr-r').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [activeTab])

  // trigger bars when grid visible
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setStarted(true) }),
      { threshold: 0.2 }
    )
    if (gridRef.current) io.observe(gridRef.current)
    return () => io.disconnect()
  }, [])

  const base = skills.length ? skills : ALL_SKILLS
  const filtered = activeTab === 'all' ? base : base.filter(s => s.category === activeTab)

  return (
    <>
      <style>{SKILLS_CSS}</style>

      <Box id="skills" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:10, md:12 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* BG atmosphere */}
        <Box sx={{
          position:'absolute', inset:0, zIndex:0,
          background:`
            radial-gradient(ellipse 55% 50% at 15% 35%, rgba(234,0,42,.1) 0%, transparent 60%),
            radial-gradient(ellipse 45% 45% at 85% 70%, rgba(234,0,42,.07) 0%, transparent 55%)
          `,
        }}/>

        {/* grid texture */}
        <Box sx={{
          position:'absolute', inset:0, zIndex:0, opacity:.025,
          backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`,
          backgroundSize:'48px 48px',
        }}/>

        {/* particles */}
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'absolute', borderRadius:'50%', zIndex:0,
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.4)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }}/>
        ))}

        {/* left vertical accent */}
        <Box sx={{
          position:'absolute', left:{ xs:16, md:32 }, top:'12%', bottom:'12%',
          width:'1px', zIndex:0,
          background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.35) 30%,rgba(234,0,42,.35) 70%,transparent)',
        }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1280px !important' }}>

          {/* ── heading ── */}
          <Box className="sk-sr" sx={{ mb:{ xs:6, md:8 }, textAlign:'center' }}>
            <Typography sx={{
              fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem',
              letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5,
            }}>
              — Tech Arsenal —
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
              My Skills
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
            <Typography sx={{
              color:'#555', fontFamily:"'DM Sans'", fontSize:'.92rem',
              mt:2.5, maxWidth:440, mx:'auto', lineHeight:1.7,
            }}>
              Technologies and tools I've mastered to build fast, beautiful, and scalable products.
            </Typography>
          </Box>

          {/* ── category tabs ── */}
          <Box className="sk-sr" sx={{
            display:'flex', gap:1.5, flexWrap:'wrap', justifyContent:'center',
            mb:{ xs:5, md:7 },
          }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-tab${activeTab === cat ? ' active' : ''}`}
                onClick={() => { setActiveTab(cat); setStarted(false); setTimeout(() => setStarted(true), 100) }}
              >
                {cat === 'all' ? '⚡ All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </Box>

          {/* ── 3-D cards grid ── */}
          <Box
            ref={gridRef}
            sx={{ display:'flex', flexWrap:'wrap', gap:{ xs:2, md:2.5 }, justifyContent:'center' }}
          >
            {filtered.map((skill, i) => (
              <SkillCard3D key={skill.name + i} skill={skill} index={i} started={started} />
            ))}
          </Box>

          {/* ── proficiency legend ── */}
          <Box className="sk-sr" sx={{
            mt:{ xs:7, md:9 },
            display:'flex', flexWrap:'wrap', gap:3, justifyContent:'center',
          }}>
            {[
              { range:'90–100%', label:'Expert',       color:'#EA002A' },
              { range:'75–89%',  label:'Advanced',     color:'#ff6b35' },
              { range:'60–74%',  label:'Intermediate', color:'#ffd166' },
              { range:'< 60%',   label:'Learning',     color:'#06d6a0' },
            ].map(l => (
              <Box key={l.label} sx={{ display:'flex', alignItems:'center', gap:1 }}>
                <Box sx={{ width:10, height:10, borderRadius:'50%', bgcolor:l.color, boxShadow:`0 0 8px ${l.color}` }}/>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#666' }}>
                  <Box component="span" sx={{ color:'#aaa', fontWeight:600 }}>{l.label}</Box>
                  &nbsp;{l.range}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>

        {/* ── marquee strip ── */}
        <Box sx={{
          mt:{ xs:8, md:10 }, py:2.5,
          borderTop:'1px solid rgba(255,255,255,.06)',
          borderBottom:'1px solid rgba(255,255,255,.06)',
          overflow:'hidden', position:'relative', zIndex:2,
          background:'rgba(234,0,42,.04)',
        }}>
          <Box sx={{ display:'flex', animation:'marqueeScroll 28s linear infinite', whiteSpace:'nowrap' }}>
            {[...ALL_SKILLS, ...ALL_SKILLS].map((s, i) => (
              <Box key={i} component="span" sx={{
                display:'inline-flex', alignItems:'center', gap:1.5, mx:3,
                fontFamily:"'Syne'", fontWeight:700, fontSize:'.75rem',
                letterSpacing:'2px', textTransform:'uppercase',
                color: i % 4 === 0 ? '#EA002A' : 'rgba(255,255,255,.2)',
              }}>
                <img src={s.icon} alt="" style={{ width:14, height:14, opacity:.7 }}/>
                {s.name}
              </Box>
            ))}
          </Box>
        </Box>

        {/* diagonal bottom divider */}
        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  )
}