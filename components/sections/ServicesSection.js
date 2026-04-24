'use client';

import { useEffect, useRef, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';

// ─── CSS ──────────────────────────────────────────────────────────────────────
const SERVICES_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText  { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift{ 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes glowPulse    { 0%,100%{ opacity:.5; } 50%{ opacity:1; } }
  @keyframes iconSpin     { 0%{ transform:rotate(0deg) scale(1); } 50%{ transform:rotate(8deg) scale(1.12); } 100%{ transform:rotate(0deg) scale(1); } }
  @keyframes borderFlow   {
    0%  { background-position: 0% 50%;   }
    100%{ background-position: 300% 50%; }
  }
  @keyframes scanLine     { 0%{ top:-5%; opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ top:105%; opacity:0; } }
  @keyframes cardReveal   { from{ opacity:0; transform:translateY(52px) scale(.95); } to{ opacity:1; transform:none; } }
  @keyframes counterUp    { from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:none; } }
  @keyframes floatTag     { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
  @keyframes pulseNumber  { 0%,100%{ text-shadow:0 0 8px rgba(234,0,42,.4); } 50%{ text-shadow:0 0 20px rgba(234,0,42,.9); } }

  /* scroll reveal */
  .sv-sr    { opacity:0; transform:translateY(44px); transition:opacity .8s ease, transform .8s ease; }
  .sv-sr-l  { opacity:0; transform:translateX(-44px);transition:opacity .8s ease, transform .8s ease; }
  .sv-sr-r  { opacity:0; transform:translateX(44px); transition:opacity .8s ease, transform .8s ease; }
  .sv-sr.in,.sv-sr-l.in,.sv-sr-r.in { opacity:1; transform:none; }
  .sv-d1{ transition-delay:.05s; } .sv-d2{ transition-delay:.15s; }
  .sv-d3{ transition-delay:.25s; } .sv-d4{ transition-delay:.35s; }
  .sv-d5{ transition-delay:.45s; } .sv-d6{ transition-delay:.55s; }

  /* service card */
  .svc-card {
    position: relative;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(234,0,42,.5) 0%, rgba(255,255,255,.08) 50%, rgba(234,0,42,.3) 100%);
    background-size: 300% 300%;
    transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s;
    cursor: default;
    overflow: hidden;
  }
  .svc-card::before {
    content:'';
    position:absolute; inset:0; border-radius:18px;
    background: linear-gradient(135deg, #EA002A 0%, rgba(255,255,255,.12) 50%, #EA002A 100%);
    background-size: 300% 300%;
    opacity: 0;
    transition: opacity .4s;
  }
  .svc-card:hover {
    transform: translateY(-10px) scale(1.025);
    box-shadow: 0 24px 60px rgba(234,0,42,.35), 0 0 0 1px rgba(234,0,42,.5);
  }
  .svc-card:hover::before {
    opacity: 1;
    animation: borderFlow 2s linear infinite;
  }
  .svc-card:hover .svc-scan { animation: scanLine 2s linear infinite; }
  .svc-card:hover .svc-icon { animation: iconSpin 1s ease-in-out infinite; }
  .svc-card:hover .svc-number { animation: pulseNumber 1s ease-in-out infinite; }

  .svc-inner {
    background: linear-gradient(145deg, #111 0%, #0d0d0d 100%);
    border-radius: 16px;
    padding: 32px 28px 28px;
    position: relative;
    overflow: hidden;
    height: 100%;
  }

  .svc-scan {
    position:absolute; left:0; right:0; height:2px;
    background: linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent);
    top: -5%; pointer-events:none; z-index:2;
  }

  .svc-icon {
    font-size: 2.4rem;
    display: block;
    margin-bottom: 16px;
    line-height: 1;
    filter: drop-shadow(0 0 8px rgba(234,0,42,.5));
  }

  .svc-number {
    position: absolute;
    top: 20px; right: 22px;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 3.5rem;
    color: rgba(234,0,42,.08);
    line-height: 1;
    letter-spacing: -2px;
    user-select: none;
    transition: color .35s;
  }
  .svc-card:hover .svc-number-text { color: rgba(234,0,42,.16); }

  .svc-tag {
    display: inline-block;
    font-family: 'DM Sans', sans-serif;
    font-size: .7rem; font-weight: 600;
    padding: 3px 10px; border-radius: 20px;
    border: 1px solid rgba(234,0,42,.35);
    background: rgba(234,0,42,.08);
    color: #EA002A;
    margin: 4px 4px 0 0;
    transition: all .3s;
    animation: floatTag 3s ease-in-out infinite;
  }
  .svc-card:hover .svc-tag {
    background: rgba(234,0,42,.18);
    box-shadow: 0 0 10px rgba(234,0,42,.3);
  }

  /* marquee strip */
  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  .marquee-track { display:flex; animation: marqueeScroll 22s linear infinite; }
  .marquee-track:hover { animation-play-state:paused; }
`;

// ─── Services data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    icon: '🚀',
    title: 'Web Development',
    desc: 'Fast, modern, and scalable websites built with Next.js and React — optimized for performance from day one.',
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    icon: '🎨',
    title: 'Frontend Development',
    desc: 'Pixel-perfect, fully responsive UIs that look stunning on every screen size and device.',
    tags: ['Tailwind CSS', 'MUI', 'Framer Motion'],
  },
  {
    icon: '🔥',
    title: 'SEO Expert',
    desc: 'Data-driven SEO strategies that push your site to page one — technical, on-page, and off-page covered.',
    tags: ['On-Page SEO', 'Core Web Vitals', 'Analytics'],
  },
  {
    icon: '✨',
    title: 'UI/UX Design',
    desc: 'Beautiful, intuitive interfaces designed to convert — from wireframe to high-fidelity prototype.',
    tags: ['Figma', 'Prototyping', 'User Research'],
  },
  {
    icon: '🔧',
    title: 'Backend Development',
    desc: 'Robust REST APIs and serverless functions — secure, fast, and ready to scale with your business.',
    tags: ['Node.js', 'MongoDB', 'REST APIs'],
  },
  {
    icon: '📍',
    title: 'Local SEO',
    desc: 'Dominate local search results. Get found by nearby customers and grow your foot traffic.',
    tags: ['Google Business', 'Local Citations', 'Maps SEO'],
  },
];

// ─── Particles ───────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top:  `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: `${2 + Math.random() * 3}px`,
  delay:`${Math.random() * 7}s`,
  dur:  `${5 + Math.random() * 9}s`,
}));

// ─── Marquee items ────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = ['Web Development','Frontend Development','SEO Expert','UI/UX Design','Backend Development','Local SEO','React','Next.js','Node.js','MongoDB','Figma','Tailwind CSS'];

// ─── Single card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  return (
    <Box
      className={`svc-card sv-sr sv-d${Math.min(index + 1, 6)}`}
      sx={{ flex:'0 0 auto', width:{ xs:'100%', sm:'calc(50% - 12px)', lg:'calc(33.33% - 16px)' } }}
    >
      <Box className="svc-inner">
        <Box className="svc-scan" />

        {/* big ghost number */}
        <Box className="svc-number svc-number-text">
          {String(index + 1).padStart(2, '0')}
        </Box>

        {/* icon */}
        <span className="svc-icon">{service.icon}</span>

        {/* red accent line */}
        <Box sx={{
          width:36, height:3, borderRadius:2, mb:2,
          background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.3))',
          boxShadow:'0 0 8px rgba(234,0,42,.5)',
        }}/>

        <Typography sx={{
          fontFamily:"'Syne',sans-serif", fontWeight:800,
          fontSize:'1.15rem', color:'#fff', mb:1.5, letterSpacing:'-.3px',
        }}>
          {service.title}
        </Typography>

        <Typography sx={{
          fontFamily:"'DM Sans'", color:'#888', fontSize:'.88rem',
          lineHeight:1.75, mb:2.5,
        }}>
          {service.desc}
        </Typography>

        {/* tags */}
        <Box sx={{ display:'flex', flexWrap:'wrap' }}>
          {service.tags.map((t, i) => (
            <span key={t} className="svc-tag" style={{ animationDelay:`${i * 0.4}s` }}>{t}</span>
          ))}
        </Box>

        {/* bottom-right glow blob */}
        <Box sx={{
          position:'absolute', bottom:-24, right:-24,
          width:90, height:90, borderRadius:'50%',
          background:'rgba(234,0,42,.12)', filter:'blur(28px)',
          transition:'opacity .35s',
        }}/>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ServicesSection() {
  const sectionRef = useRef(null);

  // scroll reveal
  useEffect(() => {
    const targets = document.querySelectorAll('.sv-sr,.sv-sr-l,.sv-sr-r');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{SERVICES_CSS}</style>

      <Box id="services" sx={{
        position:'relative',
        bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 },
        pb:{ xs:6, md:8 },
        overflow:'hidden',
        fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* ── BG atmosphere ── */}
        <Box sx={{
          position:'absolute', inset:0, zIndex:0,
          background:`
            radial-gradient(ellipse 60% 50% at 80% 40%, rgba(234,0,42,.1) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 70%, rgba(234,0,42,.07) 0%, transparent 55%)
          `,
        }}/>

        {/* ── Grid texture ── */}
        <Box sx={{
          position:'absolute', inset:0, zIndex:0, opacity:.025,
          backgroundImage:`
            linear-gradient(rgba(234,0,42,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,0,42,1) 1px, transparent 1px)
          `,
          backgroundSize:'48px 48px',
        }}/>

        {/* ── Particles ── */}
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'absolute', borderRadius:'50%', zIndex:0,
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.4)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }}/>
        ))}

        {/* ── Vertical accent line (right side) ── */}
        <Box sx={{
          position:'absolute', right:{ xs:16, md:40 }, top:'10%', bottom:'10%',
          width:'1px', zIndex:0,
          background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.35) 30%,rgba(234,0,42,.35) 70%,transparent)',
        }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important' }}>

          {/* ── Section heading ── */}
          <Box className="sv-sr" sx={{ mb:{ xs:7, md:9 }, textAlign:'center' }}>
            <Typography sx={{
              fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem',
              letterSpacing:'4px', textTransform:'uppercase',
              color:'#EA002A', mb:1.5,
            }}>
              — What I Offer —
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
              My Services
            </Typography>

            {/* decorative line */}
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>

            <Typography sx={{
              color:'#666', fontFamily:"'DM Sans'", fontSize:'.95rem',
              mt:2.5, maxWidth:460, mx:'auto', lineHeight:1.7,
            }}>
              End-to-end digital solutions — from design to deployment, built to impress and built to last.
            </Typography>
          </Box>

          {/* ── Cards ── */}
          <Box ref={sectionRef} sx={{
            display:'flex',
            flexWrap:'wrap',
            gap:3,
            justifyContent:'center',
          }}>
            {SERVICES.map((s, i) => (
              <ServiceCard key={s.title} service={s} index={i} />
            ))}
          </Box>

          {/* ── Bottom CTA strip ── */}
          <Box className="sv-sr" sx={{
            mt:{ xs:7, md:9 }, textAlign:'center',
            p:{ xs:3, md:4 },
            borderRadius:'16px',
            border:'1px solid rgba(234,0,42,.2)',
            background:'linear-gradient(135deg,rgba(234,0,42,.07) 0%,rgba(255,255,255,.02) 100%)',
            position:'relative', overflow:'hidden',
          }}>
            <Box sx={{
              position:'absolute', top:-40, left:'50%',
              transform:'translateX(-50%)',
              width:300, height:80,
              background:'rgba(234,0,42,.12)', filter:'blur(40px)',
            }}/>
            <Typography sx={{
              fontFamily:"'Syne'", fontWeight:800, color:'#fff',
              fontSize:{ xs:'1.3rem', md:'1.6rem' }, mb:1, position:'relative',
            }}>
              Need something custom?
            </Typography>
            <Typography sx={{ color:'#777', fontFamily:"'DM Sans'", fontSize:'.92rem', mb:2.5, position:'relative' }}>
              Let's talk about your project and build something great together.
            </Typography>
            <Box
              component="button"
              sx={{
                fontFamily:"'DM Sans'", fontWeight:700, fontSize:'1rem',
                px:4, py:1.4, borderRadius:'10px',
                border:'none', cursor:'pointer',
                background:'#EA002A',
                color:'#fff',
                boxShadow:'0 0 24px rgba(234,0,42,.45)',
                transition:'all .3s',
                position:'relative',
                '&:hover':{
                  background:'#c0392b',
                  boxShadow:'0 0 40px rgba(234,0,42,.7)',
                  transform:'translateY(-3px)',
                },
              }}
            >
              Get In Touch →
            </Box>
          </Box>
        </Container>

        {/* ── Marquee strip ── */}
        <Box sx={{
          mt:{ xs:7, md:9 }, py:2.5,
          borderTop:'1px solid rgba(255,255,255,.06)',
          borderBottom:'1px solid rgba(255,255,255,.06)',
          overflow:'hidden', position:'relative', zIndex:2,
          background:'rgba(234,0,42,.04)',
        }}>
          <Box className="marquee-track" sx={{ whiteSpace:'nowrap' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <Box key={i} component="span" sx={{
                display:'inline-flex', alignItems:'center', gap:2,
                fontFamily:"'Syne'", fontWeight:700,
                fontSize:'.8rem', letterSpacing:'2px', textTransform:'uppercase',
                color: i % 3 === 0 ? '#EA002A' : 'rgba(255,255,255,.25)',
                mx:3,
              }}>
                {i % 3 === 0 ? '★' : '·'} {item}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ── Diagonal bottom divider ── */}
        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  );
}