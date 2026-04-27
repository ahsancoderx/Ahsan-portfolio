'use client';

import { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { ALL_SERVICES } from '@/components/sections/ServicesSection';

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes borderFlow    { 0%{ background-position:0% 50%; } 100%{ background-position:300% 50%; } }
  @keyframes scanLine      { 0%{ top:-5%; opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ top:105%; opacity:0; } }
  @keyframes floatTag      { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
  @keyframes pulseNumber   { 0%,100%{ text-shadow:0 0 8px rgba(234,0,42,.4); } 50%{ text-shadow:0 0 20px rgba(234,0,42,.9); } }
  @keyframes iconGlow      { 0%,100%{ filter:drop-shadow(0 0 6px rgba(234,0,42,.5)); } 50%{ filter:drop-shadow(0 0 16px rgba(234,0,42,.9)); } }
  @keyframes iconSpin      { 0%{ transform:rotate(0deg) scale(1); } 50%{ transform:rotate(8deg) scale(1.12); } 100%{ transform:rotate(0deg) scale(1); } }
  @keyframes fadeUp        { from{ opacity:0; transform:translateY(40px); } to{ opacity:1; transform:none; } }

  .sp-sr    { opacity:0; transform:translateY(44px); transition:opacity .8s ease, transform .8s ease; }
  .sp-sr.in { opacity:1; transform:none; }
  .sp-d1{ transition-delay:.05s; } .sp-d2{ transition-delay:.12s; } .sp-d3{ transition-delay:.19s; }
  .sp-d4{ transition-delay:.26s; } .sp-d5{ transition-delay:.33s; } .sp-d6{ transition-delay:.40s; }
  .sp-d7{ transition-delay:.47s; } .sp-d8{ transition-delay:.54s; }

  .svc-card {
    position:relative; border-radius:18px; padding:2px;
    background:linear-gradient(135deg,rgba(234,0,42,.5) 0%,rgba(255,255,255,.08) 50%,rgba(234,0,42,.3) 100%);
    background-size:300% 300%;
    transition:transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s;
    cursor:pointer; overflow:hidden; text-decoration:none; display:block;
  }
  .svc-card::before {
    content:''; position:absolute; inset:0; border-radius:18px;
    background:linear-gradient(135deg,#EA002A 0%,rgba(255,255,255,.12) 50%,#EA002A 100%);
    background-size:300% 300%; opacity:0; transition:opacity .4s;
  }
  .svc-card:hover { transform:translateY(-10px) scale(1.025); box-shadow:0 24px 60px rgba(234,0,42,.35),0 0 0 1px rgba(234,0,42,.5); }
  .svc-card:hover::before { opacity:1; animation:borderFlow 2s linear infinite; }
  .svc-card:hover .svc-scan { animation:scanLine 2s linear infinite; }
  .svc-card:hover .svc-icon-wrap { animation:iconSpin 1s ease-in-out infinite; }
  .svc-card:hover .svc-number { animation:pulseNumber 1s ease-in-out infinite; }
  .svc-card:hover .svc-arrow { opacity:1; transform:translateX(0); }

  .svc-inner {
    background:linear-gradient(145deg,#111 0%,#0d0d0d 100%);
    border-radius:16px; padding:32px 28px 28px;
    position:relative; overflow:hidden; height:100%;
  }
  .svc-scan {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent);
    top:-5%; pointer-events:none; z-index:2;
  }
  .svc-icon-wrap {
    width:56px; height:56px; border-radius:14px;
    background:linear-gradient(135deg,rgba(234,0,42,.18),rgba(234,0,42,.06));
    border:1px solid rgba(234,0,42,.3);
    display:flex; align-items:center; justify-content:center;
    margin-bottom:18px; box-shadow:0 0 20px rgba(234,0,42,.15); transition:all .35s;
  }
  .svc-card:hover .svc-icon-wrap { background:linear-gradient(135deg,rgba(234,0,42,.3),rgba(234,0,42,.12)); border-color:rgba(234,0,42,.6); box-shadow:0 0 30px rgba(234,0,42,.35); }
  .svc-mui-icon { color:#EA002A; font-size:1.7rem !important; transition:all .35s; }
  .svc-number { position:absolute; top:20px; right:22px; font-family:'Syne',sans-serif; font-weight:800; font-size:3.5rem; color:rgba(234,0,42,.08); line-height:1; letter-spacing:-2px; user-select:none; transition:color .35s; }
  .svc-tag {
    display:inline-block; font-family:'DM Sans',sans-serif; font-size:.7rem; font-weight:600;
    padding:3px 10px; border-radius:20px; border:1px solid rgba(234,0,42,.35); background:rgba(234,0,42,.08); color:#EA002A;
    margin:4px 4px 0 0; transition:all .3s; animation:floatTag 3s ease-in-out infinite;
  }
  .svc-card:hover .svc-tag { background:rgba(234,0,42,.18); box-shadow:0 0 10px rgba(234,0,42,.3); }
  .svc-arrow {
    position:absolute; bottom:28px; right:24px; font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:700;
    color:#EA002A; opacity:0; transform:translateX(-8px); transition:all .35s; letter-spacing:1px;
  }

  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  .marquee-track { display:flex; animation:marqueeScroll 22s linear infinite; }
  .marquee-track:hover { animation-play-state:paused; }
`;

const PARTICLES = [
  { id:0, top:'5%',  left:'8%',  size:'3px', delay:'0s',   dur:'6s'  },
  { id:1, top:'12%', left:'72%', size:'2px', delay:'1.2s', dur:'8s'  },
  { id:2, top:'22%', left:'45%', size:'4px', delay:'0.5s', dur:'7s'  },
  { id:3, top:'38%', left:'88%', size:'2px', delay:'2.1s', dur:'9s'  },
  { id:4, top:'55%', left:'60%', size:'5px', delay:'1.7s', dur:'11s' },
  { id:5, top:'70%', left:'90%', size:'3px', delay:'0.3s', dur:'6s'  },
  { id:6, top:'80%', left:'20%', size:'4px', delay:'2.5s', dur:'10s' },
  { id:7, top:'90%', left:'55%', size:'2px', delay:'1.0s', dur:'7s'  },
];

const MARQUEE_ITEMS = ['Web Development','Frontend Development','SEO Expert','UI/UX Design','Backend Development','Local SEO','AI Integration','E-Commerce','React','Next.js','Node.js','MongoDB'];

function ServiceCard({ service, index }) {
  const { Icon } = service;
  return (
    <Box
      component={Link}
      href={`/services/${service.id}`}
      className={`svc-card sp-sr sp-d${Math.min(index + 1, 8)}`}
      sx={{ flex:'0 0 auto', width:{ xs:'100%', sm:'calc(50% - 12px)', lg:'calc(33.33% - 16px)' } }}
    >
      <Box className="svc-inner">
        <Box className="svc-scan" />
        <Box className="svc-number">{String(index + 1).padStart(2, '0')}</Box>
        <Box className="svc-icon-wrap"><Icon className="svc-mui-icon" /></Box>
        <Box sx={{ width:36, height:3, borderRadius:2, mb:2, background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.3))', boxShadow:'0 0 8px rgba(234,0,42,.5)' }}/>
        <Typography sx={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.15rem', color:'#fff', mb:1.5, letterSpacing:'-.3px' }}>
          {service.title}
        </Typography>
        <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.88rem', lineHeight:1.75, mb:2.5 }}>
          {service.desc}
        </Typography>
        <Box sx={{ display:'flex', flexWrap:'wrap' }}>
          {service.tags.map((t, i) => (
            <span key={t} className="svc-tag" style={{ animationDelay:`${i * 0.4}s` }}>{t}</span>
          ))}
        </Box>
        <span className="svc-arrow">View Details →</span>
        <Box sx={{ position:'absolute', bottom:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(234,0,42,.12)', filter:'blur(28px)' }}/>
      </Box>
    </Box>
  );
}

export default function ServicesPage() {
  useEffect(() => {
    const targets = document.querySelectorAll('.sp-sr');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{PAGE_CSS}</style>

      <Box sx={{ position:'relative', bgcolor:'#0a0a0a', minHeight:'100vh', overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>

        {/* BG */}
        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 60% 50% at 80% 20%, rgba(234,0,42,.12) 0%, transparent 60%),radial-gradient(ellipse 40% 40% at 10% 70%, rgba(234,0,42,.07) 0%, transparent 55%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.025, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute', borderRadius:'50%', zIndex:0, top:p.top, left:p.left, width:p.size, height:p.size, bgcolor:'rgba(234,0,42,.4)', animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        {/* Hero heading */}
        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important', pt:{ xs:14, md:16 }, pb:{ xs:8, md:10 } }}>

          {/* Breadcrumb */}
          <Box className="sp-sr sp-d1" sx={{ display:'flex', alignItems:'center', gap:1, mb:4 }}>
            <Box component={Link} href="/" sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#555', textDecoration:'none', '&:hover':{ color:'#EA002A' }, transition:'color .2s' }}>Home</Box>
            <Box component="span" sx={{ color:'#333', fontSize:'.8rem' }}>›</Box>
            <Box component="span" sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#EA002A' }}>Services</Box>
          </Box>

          <Box className="sp-sr sp-d2" sx={{ mb:{ xs:8, md:10 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem', letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5 }}>
              — Full Service Offering —
            </Typography>
            <Typography sx={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:{ xs:'2.6rem', md:'3.8rem' }, letterSpacing:'-1.5px', lineHeight:1.05, background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmerText 5s linear infinite', mb:2 }}>
              All Services
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mb:2.5 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
            <Typography sx={{ color:'#666', fontFamily:"'DM Sans'", fontSize:'.95rem', maxWidth:520, mx:'auto', lineHeight:1.7 }}>
              Every service I offer — from a single landing page to a full AI-powered platform. Built to perform, designed to convert.
            </Typography>
          </Box>

          {/* All cards */}
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:3, justifyContent:'center' }}>
            {ALL_SERVICES.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </Box>

          {/* Bottom CTA */}
          <Box className="sp-sr" sx={{ mt:{ xs:8, md:10 }, textAlign:'center', p:{ xs:3, md:5 }, borderRadius:'16px', border:'1px solid rgba(234,0,42,.2)', background:'linear-gradient(135deg,rgba(234,0,42,.07) 0%,rgba(255,255,255,.02) 100%)', position:'relative', overflow:'hidden' }}>
            <Box sx={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', width:300, height:80, background:'rgba(234,0,42,.12)', filter:'blur(40px)' }}/>
            <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:{ xs:'1.4rem', md:'1.8rem' }, mb:1, position:'relative' }}>
              Don't see what you need?
            </Typography>
            <Typography sx={{ color:'#777', fontFamily:"'DM Sans'", fontSize:'.95rem', mb:3, position:'relative' }}>
              I offer custom solutions tailored to your exact requirements. Let's discuss your project.
            </Typography>
            <Box
              component="a"
              href="/#contact"
              sx={{
                display:'inline-block', fontFamily:"'DM Sans'", fontWeight:700, fontSize:'1rem',
                px:5, py:1.5, borderRadius:'10px', cursor:'pointer',
                background:'#EA002A', color:'#fff', textDecoration:'none',
                boxShadow:'0 0 24px rgba(234,0,42,.45)', transition:'all .3s', position:'relative',
                '&:hover':{ background:'#c0392b', boxShadow:'0 0 40px rgba(234,0,42,.7)', transform:'translateY(-3px)' },
              }}
            >
              Get In Touch →
            </Box>
          </Box>
        </Container>

        {/* Marquee */}
        <Box sx={{ py:2.5, borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', overflow:'hidden', position:'relative', zIndex:2, background:'rgba(234,0,42,.04)' }}>
          <Box className="marquee-track" sx={{ whiteSpace:'nowrap' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <Box key={i} component="span" sx={{ display:'inline-flex', alignItems:'center', gap:2, fontFamily:"'Syne'", fontWeight:700, fontSize:'.8rem', letterSpacing:'2px', textTransform:'uppercase', color: i % 3 === 0 ? '#EA002A' : 'rgba(255,255,255,.25)', mx:3 }}>
                {i % 3 === 0 ? '★' : '·'} {item}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}