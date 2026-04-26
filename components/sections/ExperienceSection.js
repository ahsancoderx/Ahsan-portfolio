'use client'

import { useEffect, useState, useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'

const EXP_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  @keyframes lineDraw      { from{ height:0; opacity:0; } to{ height:100%; opacity:1; } }
  @keyframes dotPop        { 0%{ transform:translate(-50%,-50%) scale(0); opacity:0; }
                             70%{ transform:translate(-50%,-50%) scale(1.3); }
                             100%{ transform:translate(-50%,-50%) scale(1); opacity:1; } }
  @keyframes dotPulse      { 0%,100%{ box-shadow:0 0 0 0 rgba(234,0,42,0); }
                             50%{ box-shadow:0 0 0 8px rgba(234,0,42,.2); } }
  @keyframes cardSlideIn   { from{ opacity:0; transform:translateX(var(--dir,40px)); }
                             to  { opacity:1; transform:translateX(0); } }
  @keyframes tagFloat      { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-4px); } }
  @keyframes scanLine      { 0%{ top:-5%; opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ top:105%; opacity:0; } }
  @keyframes glowPulse     { 0%,100%{ box-shadow:0 0 20px rgba(234,0,42,.3); }
                             50%{ box-shadow:0 0 40px rgba(234,0,42,.6); } }

  .ex-sr   { opacity:0; transform:translateY(40px); transition:opacity .8s ease, transform .8s ease; }
  .ex-sr-l { opacity:0; transform:translateX(-48px);transition:opacity .8s ease, transform .8s ease; }
  .ex-sr-r { opacity:0; transform:translateX(48px); transition:opacity .8s ease, transform .8s ease; }
  .ex-sr.in,.ex-sr-l.in,.ex-sr-r.in { opacity:1; transform:none; }
  .ex-d1{transition-delay:.06s}.ex-d2{transition-delay:.16s}.ex-d3{transition-delay:.26s}
  .ex-d4{transition-delay:.36s}.ex-d5{transition-delay:.46s}.ex-d6{transition-delay:.56s}

  .tl-line {
    position:absolute; left:50%; top:0;
    width:2px; height:0; opacity:0;
    background:linear-gradient(to bottom,#EA002A,rgba(234,0,42,.15));
    transform:translateX(-50%);
    transition:height 1.8s cubic-bezier(.4,0,.2,1), opacity .3s;
  }
  .tl-line.run { height:100%; opacity:1; }

  .tl-dot {
    position:absolute; left:50%; top:28px;
    width:18px; height:18px; border-radius:50%;
    background:#EA002A;
    border:3px solid #0a0a0a;
    box-shadow:0 0 0 2px #EA002A;
    transform:translate(-50%,-50%) scale(0);
    opacity:0;
    transition:transform .5s cubic-bezier(.34,1.56,.64,1), opacity .3s;
    animation:dotPulse 2.5s ease-in-out infinite;
    z-index:4;
  }
  .tl-dot.pop { transform:translate(-50%,-50%) scale(1); opacity:1; }

  .exp-card {
    position:relative;
    border-radius:18px;
    background:linear-gradient(145deg,#141414 0%,#0d0d0d 100%);
    border:1px solid rgba(234,0,42,.18);
    padding:28px 26px 24px;
    overflow:hidden;
    transition:transform .38s cubic-bezier(.34,1.3,.64,1), box-shadow .38s, border-color .3s;
  }
  .exp-card:hover {
    transform:translateY(-8px) scale(1.015);
    box-shadow:0 24px 60px rgba(0,0,0,.6), 0 0 0 1px rgba(234,0,42,.45), 0 0 40px rgba(234,0,42,.18);
    border-color:rgba(234,0,42,.5);
  }
  .exp-card:hover .exp-scan { animation:scanLine 2.5s linear infinite; }
  .exp-card::before {
    content:'';
    position:absolute; inset:0; border-radius:18px;
    background:linear-gradient(135deg,rgba(234,0,42,.09) 0%,transparent 55%);
    opacity:0; transition:opacity .35s;
  }
  .exp-card:hover::before { opacity:1; }

  .exp-scan {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(234,0,42,.5),transparent);
    top:-5%; pointer-events:none; z-index:2;
  }

  .exp-tag {
    display:inline-block;
    font-family:'DM Sans',sans-serif; font-size:.7rem; font-weight:600;
    padding:3px 11px; border-radius:20px;
    border:1px solid rgba(234,0,42,.35);
    background:rgba(234,0,42,.08);
    color:#EA002A;
    margin:4px 4px 0 0;
    transition:all .28s;
    animation:tagFloat 3s ease-in-out infinite;
  }
  .exp-tag:hover { background:rgba(234,0,42,.2); box-shadow:0 0 10px rgba(234,0,42,.35); }

  .current-badge {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'DM Sans'; font-size:.7rem; font-weight:700;
    padding:3px 10px; border-radius:20px;
    background:rgba(234,0,42,.12); border:1px solid rgba(234,0,42,.4);
    color:#EA002A; letter-spacing:.5px; text-transform:uppercase;
  }
  .current-dot {
    width:6px; height:6px; border-radius:50%; background:#EA002A;
    animation:glowPulse 1.5s ease-in-out infinite;
  }
`

// ─── Static experience data ───────────────────────────────────────────────────
const EXPERIENCES = [
  {
    _id:'1', company:'Whetstonze Technologies', role:'Full-Stack Developer',
    type:'Full-time', location:'onsite', startDate:'2025-03', endDate:null, isCurrent:true, logo:null,
    description:'Built modern full-stack SaaS platforms with Next.js, React, TypeScript, Node.js, and MongoDB, focusing on scalable architecture, SEO optimization, fast performance, and exceptional user experience.',
    achievements:['Improved page load speed by 40%',
    'Built reusable component library used across 5 products',
    'Led migration from CRA to Next.js 13, improving SEO and performance'],
    skills:['Next.js','TypeScript','React','GraphQL','Node.js','MongoDB','Tailwind CSS', 'Material UI'], order:0,
  },
  {
    _id:'2', company:'Code labe Innovation', role:'Mern stack Developer',
    type:'Full-time', location:'Lahore, Pakistan', startDate:'2025-01', endDate:'2025-03', isCurrent:false, logo:null,
    description:'Worked as a Junior MERN Stack Developer, building responsive and SEO-friendly web applications using MongoDB, Express.js, React, and Node.js. Collaborated with senior developers and designers to transform Figma designs into pixel-perfect, high-performance websites while improving user experience and frontend functionality.',
    achievements:[ 'Delivered 15+ client projects on time',
    'Ranked 3 websites #1 on Google',
    'Reduced bounce rate by 28% through UX improvements'],
    skills:['Node.js','MongoDB','React','SEO','Figma'], order:1,
  },
  {
    _id:'3', company:'Spiral Labs ', role:'AI Engineer Intern',
    type:'Freelance', location:'Remote', startDate:'2019-01', endDate:'2020-05', isCurrent:false, logo:null,
    description:'Built AI chatbots and voice agents for real-world use, integrated AI APIs, and optimized prompts and workflows to improve accuracy and performance. Worked with the team to test and enhance AI features for production.',
    achievements:['Successfully built and deployed AI chatbots and voice agents for real-world applications, integrating multiple AI APIs to improve automation and system performance. Enhanced prompt engineering to increase response accuracy and reliability, and contributed to testing and optimizing AI features for production environments.'],
    skills:['python','ChatGPT','OpenAI API','Gemini API','Scikit-learn','NumPy','Pandas'], order:2,
  },
]

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

const DELAY_CLASSES = ['ex-d1','ex-d2','ex-d3','ex-d4','ex-d5','ex-d6']

function formatDate(str) {
  if (!str) return ''
  const d = new Date(str + '-01')
  return d.toLocaleDateString('en-US', { month:'short', year:'numeric' })
}

function duration(start, end) {
  const s = new Date(start + '-01')
  const e = end ? new Date(end + '-01') : new Date()
  const months = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
  const y = Math.floor(months / 12), m = months % 12
  return [y && `${y}y`, m && `${m}m`].filter(Boolean).join(' ')
}

function ExpCard({ exp, index }) {
  const dotRef  = useRef(null)
  const cardRef = useRef(null)
  const isLeft  = index % 2 === 0
  const delayClass = DELAY_CLASSES[index < 6 ? index : 5]

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          dotRef.current?.classList.add('pop')
          cardRef.current?.classList.add('in')
        }
      })
    }, { threshold: 0.3 })
    if (cardRef.current) io.observe(cardRef.current)
    return () => io.disconnect()
  }, [])

  const initials = exp.company?.slice(0,2).toUpperCase() || 'EX'

  return (
    <Box sx={{
      position:'relative',
      display:'flex',
      flexDirection:{ xs:'column', md: isLeft ? 'row' : 'row-reverse' },
      alignItems:{ xs:'flex-start', md:'flex-start' },
      gap:{ xs:2, md:0 },
      mb:{ xs:6, md:8 },
    }}>
      <Box
        ref={cardRef}
        className={`exp-card ${isLeft ? 'ex-sr-l' : 'ex-sr-r'} ${delayClass}`}
        style={{ '--dir': isLeft ? '-48px' : '48px' }}
        sx={{ flex:1, mx:{ xs:0, md: isLeft ? '0 60px 0 0' : '0 0 0 60px' } }}
      >
        <Box className="exp-scan"/>

        <Box sx={{ display:'flex', alignItems:'flex-start', gap:2, mb:2 }}>
          <Box sx={{
            width:52, height:52, borderRadius:'12px', flexShrink:0,
            background: exp.logo ? 'transparent' : 'linear-gradient(135deg,#EA002A,rgba(234,0,42,.5))',
            border:'1px solid rgba(234,0,42,.3)',
            display:'flex', alignItems:'center', justifyContent:'center',
            overflow:'hidden',
            boxShadow:'0 4px 16px rgba(234,0,42,.25)',
          }}>
            {exp.logo
              ? <img src={exp.logo} alt={exp.company} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              : <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.9rem', color:'#fff' }}>{initials}</Typography>
            }
          </Box>

          <Box sx={{ flex:1, minWidth:0 }}>
            <Box sx={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:1, mb:.4 }}>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.05rem', color:'#fff', letterSpacing:'-.3px' }}>
                {exp.role}
              </Typography>
              {exp.isCurrent && (
                <span className="current-badge">
                  <span className="current-dot"/>Current
                </span>
              )}
            </Box>
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:1.5, alignItems:'center' }}>
              <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.85rem', color:'#EA002A' }}>
                {exp.company}
              </Typography>
              <Box sx={{ width:'3px', height:'3px', borderRadius:'50%', bgcolor:'#444' }}/>
              <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#666' }}>{exp.type}</Typography>
              <Box sx={{ width:'3px', height:'3px', borderRadius:'50%', bgcolor:'#444' }}/>
              <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#666' }}>📍 {exp.location}</Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{
          display:'inline-flex', alignItems:'center', gap:1.5, mb:2,
          px:2, py:.7, borderRadius:'8px',
          background:'rgba(234,0,42,.07)', border:'1px solid rgba(234,0,42,.18)',
        }}>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#aaa', fontWeight:500 }}>
            🗓 {formatDate(exp.startDate)} → {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
          </Typography>
          <Box sx={{ width:'3px', height:'3px', borderRadius:'50%', bgcolor:'#EA002A' }}/>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.75rem', color:'#EA002A', fontWeight:700 }}>
            {duration(exp.startDate, exp.endDate)}
          </Typography>
        </Box>

        <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.88rem', lineHeight:1.78, mb:2 }}>
          {exp.description}
        </Typography>

        {exp.achievements?.length > 0 && (
          <Box sx={{ mb:2.5 }}>
            {exp.achievements.map((a, i) => (
              <Box key={i} sx={{ display:'flex', gap:1.5, mb:.9, alignItems:'flex-start' }}>
                <Box sx={{
                  mt:'.35em', width:6, height:6, borderRadius:'50%', flexShrink:0,
                  bgcolor:'#EA002A', boxShadow:'0 0 6px rgba(234,0,42,.6)',
                }}/>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.84rem', color:'#bbb', lineHeight:1.6 }}>
                  {a}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display:'flex', flexWrap:'wrap' }}>
          {exp.skills?.map((s, i) => (
            <span key={s} className="exp-tag" style={{ animationDelay:`${i*.3}s` }}>{s}</span>
          ))}
        </Box>

        <Box sx={{
          position:'absolute', bottom:-20, right:-20,
          width:80, height:80, borderRadius:'50%',
          background:'rgba(234,0,42,.1)', filter:'blur(24px)',
        }}/>
      </Box>

      <Box ref={dotRef} className="tl-dot" sx={{ display:{ xs:'none', md:'block' } }}/>
    </Box>
  )
}

export default function ExperienceSection() {
  const lineRef = useRef(null)
  const wrapRef = useRef(null)

  // scroll reveal for .ex-sr elements
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.ex-sr').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  // timeline line draw trigger
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) lineRef.current?.classList.add('run') }),
      { threshold: 0.05 }
    )
    if (wrapRef.current) io.observe(wrapRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{EXP_CSS}</style>

      <Box id="experience" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:10, md:12 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        <Box sx={{
          position:'absolute', inset:0, zIndex:0,
          background:`
            radial-gradient(ellipse 55% 50% at 80% 25%, rgba(234,0,42,.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 75%, rgba(234,0,42,.07) 0%, transparent 55%)
          `,
        }}/>
        <Box sx={{
          position:'absolute', inset:0, zIndex:0, opacity:.025,
          backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`,
          backgroundSize:'48px 48px',
        }}/>

        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'absolute', borderRadius:'50%', zIndex:0,
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.4)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }}/>
        ))}

        <Box sx={{
          position:'absolute', right:{ xs:16, md:40 }, top:'10%', bottom:'10%',
          width:'1px', zIndex:0,
          background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.35) 30%,rgba(234,0,42,.35) 70%,transparent)',
        }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1100px !important' }}>
          <Box className="ex-sr" sx={{ mb:{ xs:7, md:10 }, textAlign:'center' }}>
            <Typography sx={{
              fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem',
              letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5,
            }}>
              — My Journey —
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
              Work Experience
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
          </Box>

          <Box ref={wrapRef} sx={{ position:'relative', pb:4 }}>
            <Box ref={lineRef} className="tl-line" sx={{ display:{ xs:'none', md:'block' } }}/>
            {EXPERIENCES.map((exp, i) => (
              <ExpCard key={exp._id} exp={exp} index={i} lineRef={lineRef} />
            ))}
          </Box>
        </Container>

        {/* marquee */}
        <Box sx={{
          mt:{ xs:6, md:8 }, py:2.5,
          borderTop:'1px solid rgba(255,255,255,.06)',
          borderBottom:'1px solid rgba(255,255,255,.06)',
          overflow:'hidden', position:'relative', zIndex:2,
          background:'rgba(234,0,42,.04)',
        }}>
          <Box sx={{ display:'flex', animation:'marqueeScroll 26s linear infinite', whiteSpace:'nowrap' }}>
            {[...EXPERIENCES,...EXPERIENCES].map((e,i) => (
              <Box key={i} component="span" sx={{
                display:'inline-flex', alignItems:'center', gap:1.5, mx:4,
                fontFamily:"'Syne'", fontWeight:700, fontSize:'.75rem',
                letterSpacing:'2px', textTransform:'uppercase',
                color: i%3===0 ? '#EA002A' : 'rgba(255,255,255,.2)',
              }}>
                {i%3===0 ? '★' : '·'} {e.role} @ {e.company}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  )
}