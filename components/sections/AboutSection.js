'use client'

import { useEffect, useState, useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import Image from 'next/image'

const ABOUT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText  { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift{ 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes floatImg     { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-10px); } }
  @keyframes glowPulse    { 0%,100%{ box-shadow:0 0 40px rgba(234,0,42,.45),0 0 80px rgba(234,0,42,.18); } 50%{ box-shadow:0 0 65px rgba(234,0,42,.75),0 0 120px rgba(234,0,42,.3); } }
  @keyframes scanLine     { 0%{ top:-10%; } 100%{ top:110%; } }
  @keyframes tagFloat     { 0%,100%{ transform:translateY(0) rotate(var(--r,0deg)); } 50%{ transform:translateY(-6px) rotate(var(--r,0deg)); } }

  .ab-sr-left  { opacity:0; transform:translateX(-52px); transition:opacity .8s ease, transform .8s ease; }
  .ab-sr-right { opacity:0; transform:translateX(52px);  transition:opacity .8s ease, transform .8s ease; }
  .ab-sr-up    { opacity:0; transform:translateY(42px);  transition:opacity .75s ease, transform .75s ease; }
  .ab-sr-scale { opacity:0; transform:scale(.88);        transition:opacity .75s ease, transform .75s ease; }
  .ab-sr-left.in, .ab-sr-right.in, .ab-sr-up.in, .ab-sr-scale.in { opacity:1; transform:none; }
  .ab-d1{ transition-delay:.08s; }
  .ab-d2{ transition-delay:.2s;  }
  .ab-d3{ transition-delay:.34s; }
  .ab-d4{ transition-delay:.48s; }
  .ab-d5{ transition-delay:.62s; }
  .ab-d6{ transition-delay:.76s; }

  .skill-fill { width:0%; transition:width 1.2s cubic-bezier(.4,0,.2,1); }
  .skill-fill.run { width:var(--w); }

  .about-tag {
    font-family:'DM Sans',sans-serif; font-weight:600; font-size:.78rem;
    padding:5px 14px; border-radius:20px; cursor:default;
    border:1px solid rgba(234,0,42,.45);
    background:rgba(234,0,42,.08);
    color:#fff;
    box-shadow:0 0 10px rgba(234,0,42,.2);
    transition:all .3s;
    animation:tagFloat 3s ease-in-out infinite;
  }
  .about-tag:hover {
    background:rgba(234,0,42,.22);
    box-shadow:0 0 20px rgba(234,0,42,.5);
    transform:translateY(-3px) scale(1.04);
  }

  .img-corner {
    position:absolute; width:22px; height:22px;
    border-color:#EA002A; border-style:solid; border-width:0;
  }
  .img-corner.tl { top:-4px; left:-4px; border-top-width:3px; border-left-width:3px; border-radius:4px 0 0 0; }
  .img-corner.tr { top:-4px; right:-4px; border-top-width:3px; border-right-width:3px; border-radius:0 4px 0 0; }
  .img-corner.bl { bottom:-4px; left:-4px; border-bottom-width:3px; border-left-width:3px; border-radius:0 0 0 4px; }
  .img-corner.br { bottom:-4px; right:-4px; border-bottom-width:3px; border-right-width:3px; border-radius:0 0 4px 0; }
`

const PROFILE = {
  name:      'Ahsan Ali',
  email:     'ahsanalitech7@gmail.com',
  avatarUrl: '/ahsan3-removebg-preview.png',
  about:     'Full-stack engineer crafting scalable, AI-powered web products with Next.js & TypeScript.',
}


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
  { id:14, top:'65%', left:'12%', size:'3px', delay:'3.5s', dur:'7s'  },
  { id:15, top:'75%', left:'50%', size:'2px', delay:'0.7s', dur:'9s'  },
  { id:16, top:'8%',  left:'35%', size:'4px', delay:'2.3s', dur:'6s'  },
  { id:17, top:'95%', left:'68%', size:'3px', delay:'1.4s', dur:'10s' },
]

const SKILLS = [
  { label:'React / Next.js',         pct:92 },
  { label:'JavaScript / TypeScript', pct:88 },
  { label:'UI/UX & Tailwind CSS',    pct:85 },
  { label:'AI / ML',                 pct:80 },
  { label:'AI Chatbot Development',  pct:82 },
  { label:'Node.js / MongoDB',       pct:75 },
]

const STATS = [
  { value:20, suffix:'+', label:'Projects Done'    },
  { value:2,  suffix:'+', label:'Years Experience' },
  { value:15, suffix:'+', label:'Happy Clients'    },
  { value:50, suffix:'%', label:'Dedication'       },
]

const TAGS = ['React','Next.js','TypeScript','Node.js','MongoDB','AI/ML','Tailwind','Figma','Python','REST APIs']


const SKILL_DELAYS = [1, 2, 3, 4, 5, 6]
const STAT_DELAYS  = [1, 2, 3, 4]

const INFO_ROWS = [
  { label:'Name',     value: PROFILE.name     },
  { label:'Email',    value: PROFILE.email    },
  { label:'Location', value: 'Pakistan'       },
  { label:'Role',     value: 'Full Stack Developer (MERN) AI Enthusiast' },
]

function useCounter(target, started) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!started) return
    let current = 0
    const step = Math.ceil(target / 50)
    const t = setInterval(() => {
      current += step
      if (current >= target) { setVal(target); clearInterval(t) }
      else setVal(current)
    }, 30)
    return () => clearInterval(t)
  }, [started, target])
  return val
}

function StatCard({ stat, started, delay }) {
  const val = useCounter(stat.value, started)
  return (
    <Box className={`ab-sr-up ab-d${delay}`} sx={{
      flex:1, minWidth:{ xs:'calc(50% - 8px)', md:'auto' },
      textAlign:'center',
      background:'linear-gradient(135deg,rgba(234,0,42,.1) 0%,rgba(255,255,255,.03) 100%)',
      border:'1px solid rgba(234,0,42,.25)',
      borderRadius:'14px', py:2.5, px:1.5,
      position:'relative', overflow:'hidden',
      transition:'transform .3s, box-shadow .3s',
      '&:hover':{ transform:'translateY(-5px)', boxShadow:'0 0 28px rgba(234,0,42,.35)' },
    }}>
      <Box sx={{ position:'absolute', bottom:-20, right:-20, width:70, height:70, borderRadius:'50%', background:'rgba(234,0,42,.15)', filter:'blur(20px)' }}/>
      <Typography sx={{
        fontFamily:"'Syne',sans-serif", fontWeight:800,
        fontSize:{ xs:'1.9rem', md:'2.3rem' },
        background:'linear-gradient(90deg,#fff 30%,#EA002A 100%)',
        backgroundSize:'200% auto',
        WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
        animation:'shimmerText 4s linear infinite', lineHeight:1,
      }}>
        {val}{stat.suffix}
      </Typography>
      <Typography sx={{ color:'#888', fontSize:'.78rem', fontFamily:"'DM Sans'", mt:.6, fontWeight:500 }}>
        {stat.label}
      </Typography>
    </Box>
  )
}

function SkillBar({ skill, started, delay }) {
  return (
    <Box className={`ab-sr-up ab-d${delay}`} sx={{ mb:2.5 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', mb:.7 }}>
        <Typography sx={{ color:'#ccc', fontSize:'.88rem', fontFamily:"'DM Sans'", fontWeight:600 }}>
          {skill.label}
        </Typography>
        <Typography sx={{ color:'#EA002A', fontSize:'.88rem', fontFamily:"'DM Sans'", fontWeight:700 }}>
          {skill.pct}%
        </Typography>
      </Box>
      <Box sx={{ height:'7px', borderRadius:'8px', background:'rgba(255,255,255,.08)', overflow:'hidden', position:'relative' }}>
        <Box sx={{ position:'absolute', inset:0, background:'repeating-linear-gradient(90deg,transparent 0px,transparent 10px,rgba(255,255,255,.03) 10px,rgba(255,255,255,.03) 11px)' }}/>
        <Box
          className={`skill-fill${started ? ' run' : ''}`}
          style={{ '--w': `${skill.pct}%` }}
          sx={{
            height:'100%', borderRadius:'8px', position:'relative',
            background:'linear-gradient(90deg,#EA002A,#ff4d6d)',
            boxShadow:'0 0 10px rgba(234,0,42,.6)',
            '&::after':{ content:'""', position:'absolute', right:0, top:0, bottom:0, width:'4px', background:'#fff', borderRadius:'4px', opacity:.7 },
          }}
        />
      </Box>
    </Box>
  )
}

export default function AboutSection() {
  const [statsStarted,  setStats]  = useState(false)
  const [skillsStarted, setSkills] = useState(false)
  const statsRef  = useRef(null)
  const skillsRef = useRef(null)

  useEffect(() => {
    const targets = document.querySelectorAll('.ab-sr-left,.ab-sr-right,.ab-sr-up,.ab-sr-scale')
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.1 }
    )
    targets.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (e.target === statsRef.current)  setStats(true)
          if (e.target === skillsRef.current) setSkills(true)
        }
      })
    }, { threshold: 0.3 })
    if (statsRef.current)  io.observe(statsRef.current)
    if (skillsRef.current) io.observe(skillsRef.current)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{ABOUT_CSS}</style>

      <Box id="about" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:14, md:16 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* BG */}
        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 55% 50% at 25% 60%, rgba(234,0,42,.11) 0%, transparent 60%),radial-gradient(ellipse 40% 40% at 80% 30%, rgba(234,0,42,.07) 0%, transparent 55%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.03, backgroundImage:`linear-gradient(rgba(234,0,42,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,.8) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>

        {/* ✅ Fixed particles */}
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'absolute', borderRadius:'50%', zIndex:0,
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.4)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }}/>
        ))}

        <Box sx={{ position:'absolute', left:{ xs:16, md:32 }, top:'15%', bottom:'15%', width:'1px', zIndex:0, background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.4) 30%,rgba(234,0,42,.4) 70%,transparent)' }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important' }}>

          {/* Heading */}
          <Box className="ab-sr-up" sx={{ mb:{ xs:7, md:9 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem', letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5 }}>
              — Get to Know Me —
            </Typography>
            <Typography sx={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:{ xs:'2.4rem', md:'3.2rem' }, letterSpacing:'-1px', lineHeight:1.05,
              background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)', backgroundSize:'200% auto',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'shimmerText 5s linear infinite',
            }}>
              About Me
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
          </Box>

          {/* Main row */}
          <Box sx={{ display:'flex', flexDirection:{ xs:'column', md:'row' }, gap:{ xs:6, md:7 }, alignItems:'center' }}>

            {/* LEFT — image */}
            <Box className="ab-sr-left ab-d1" sx={{ flex:'0 0 auto', width:{ xs:'100%', md:380 } }}>
              <Box sx={{
                position:'relative',
                '&::before':{ content:'""', position:'absolute', inset:'-8px', borderRadius:'20px', background:'linear-gradient(135deg,rgba(234,0,42,.5) 0%,transparent 50%,rgba(234,0,42,.3) 100%)', zIndex:0, filter:'blur(6px)' },
              }}>
                <Box sx={{
                  position:'relative', borderRadius:'16px', overflow:'hidden',
                  height:{ xs:320, md:440 }, border:'1px solid rgba(234,0,42,.35)',
                  animation:'glowPulse 3.5s ease-in-out infinite', zIndex:1,
                }}>
                  <Image
                    src={PROFILE.avatarUrl}
                    alt={PROFILE.name}
                    fill
                    sizes="(max-width:768px) 100vw, 380px"
                    style={{ objectFit:'cover', animation:'floatImg 6s ease-in-out infinite' }}
                  />
                  <Box sx={{ position:'absolute', left:0, right:0, height:'3px', background:'linear-gradient(90deg,transparent,rgba(234,0,42,.6),transparent)', animation:'scanLine 4s linear infinite', zIndex:2 }}/>
                  <Box sx={{ position:'absolute', bottom:0, left:0, right:0, height:'35%', background:'linear-gradient(to top,rgba(10,10,10,.75),transparent)', zIndex:2 }}/>

                  {/* name badge */}
                  <Box sx={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', zIndex:3, px:2.5, py:.8, background:'rgba(10,10,10,.8)', backdropFilter:'blur(10px)', border:'1px solid rgba(234,0,42,.5)', borderRadius:'30px', display:'flex', alignItems:'center', gap:1, whiteSpace:'nowrap' }}>
                    <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 8px #EA002A', flexShrink:0, animation:'glowPulse 1.5s infinite' }}/>
                    <Typography sx={{ fontFamily:"'Syne'", fontWeight:700, color:'#fff', fontSize:'.85rem' }}>{PROFILE.name}</Typography>
                    <Typography sx={{ color:'#EA002A', fontSize:'.72rem', fontFamily:"'DM Sans'", fontWeight:600 }}>Available</Typography>
                  </Box>
                </Box>

                {/* corner accents */}
                {['tl','tr','bl','br'].map(c => (
                  <Box key={c} className={`img-corner ${c}`} sx={{ position:'absolute', zIndex:2 }}/>
                ))}
              </Box>

              {/* Bottom tags */}
              <Box className="ab-sr-up ab-d3" sx={{ mt:3, display:'flex', gap:1, flexWrap:'wrap', justifyContent:'center' }}>
                {TAGS.slice(0,5).map((t, i) => (
                  <span key={t} className="about-tag" style={{ animationDelay:`${i*0.35}s`, '--r':'0deg' }}>{t}</span>
                ))}
              </Box>
            </Box>

            {/* RIGHT — content */}
            <Box sx={{ flex:1, minWidth:0 }}>
              <Typography className="ab-sr-right ab-d1" sx={{
                fontFamily:"'Syne',sans-serif", fontWeight:800,
                fontSize:{ xs:'2rem', md:'2.5rem' }, letterSpacing:'-1px', lineHeight:1.1,
                background:'linear-gradient(90deg,#fff 35%,#EA002A 85%)', backgroundSize:'200% auto',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                animation:'shimmerText 5s linear infinite', mb:2,
              }}>
                Who Am I?
              </Typography>

              <Typography className="ab-sr-right ab-d2" sx={{ color:'#999', lineHeight:1.85, fontSize:{ xs:'.92rem', md:'1rem' }, fontFamily:"'DM Sans'", mb:2.5, maxWidth:500 }}>
                {PROFILE.about}
              </Typography>

              {INFO_ROWS.map((item, i) => (
                <Box
                  key={item.label}
                  className={`ab-sr-right ab-d${i + 2}`}
                  sx={{
                    display:'flex', gap:2, alignItems:'flex-start', mb:1.3, pb:1.3,
                    borderBottom: i < 3 ? '1px solid rgba(255,255,255,.06)' : 'none',
                  }}
                >
                  <Typography sx={{ color:'#EA002A', fontFamily:"'DM Sans'", fontWeight:700, fontSize:'.82rem', textTransform:'uppercase', letterSpacing:'1.5px', minWidth:72, pt:.1 }}>
                    {item.label}
                  </Typography>
                  <Typography sx={{ color:'#ccc', fontFamily:"'DM Sans'", fontSize:'.92rem' }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}

              {/* More tags */}
              <Box className="ab-sr-right ab-d4" sx={{ display:'flex', gap:1, flexWrap:'wrap', mt:1.5, mb:4 }}>
                {TAGS.slice(5).map((t, i) => (
                  <span key={t} className="about-tag" style={{ animationDelay:`${i*0.3}s` }}>{t}</span>
                ))}
              </Box>

              {/* Skill bars — ✅ static SKILL_DELAYS array */}
              <Box ref={skillsRef}>
                <Typography className="ab-sr-right ab-d2" sx={{ fontFamily:"'Syne'", fontWeight:700, color:'#fff', fontSize:'1.1rem', mb:2.5, letterSpacing:'.5px' }}>
                  Technical Skills
                </Typography>
                {SKILLS.map((s, i) => (
                  <SkillBar
                    key={s.label}
                    skill={s}
                    started={skillsStarted}
                    delay={SKILL_DELAYS[i]}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Stats row — ✅ static STAT_DELAYS array */}
          <Box ref={statsRef} sx={{ display:'flex', flexWrap:'wrap', gap:2, mt:{ xs:8, md:10 }, pt:{ xs:4, md:5 }, borderTop:'1px solid rgba(255,255,255,.07)' }}>
            {STATS.map((s, i) => (
              <StatCard
                key={s.label}
                stat={s}
                started={statsStarted}
                delay={STAT_DELAYS[i]}
              />
            ))}
          </Box>
        </Container>

        {/* Bottom divider */}
        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  )
}