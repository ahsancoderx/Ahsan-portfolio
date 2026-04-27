'use client';

import { useEffect } from 'react';
import { Box, Container, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ALL_SERVICES } from '@/components/sections/ServicesSection';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const DETAIL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes borderFlow    { 0%{ background-position:0% 50%; } 100%{ background-position:300% 50%; } }
  @keyframes floatTag      { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
  @keyframes iconGlow      { 0%,100%{ box-shadow:0 0 20px rgba(234,0,42,.3); } 50%{ box-shadow:0 0 40px rgba(234,0,42,.7); } }
  @keyframes scanLine      { 0%{ top:-5%; opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ top:105%; opacity:0; } }
  @keyframes pulseRing     { 0%,100%{ opacity:.3; transform:scale(1); } 50%{ opacity:.6; transform:scale(1.06); } }
  @keyframes stepReveal    { from{ opacity:0; transform:translateX(-20px); } to{ opacity:1; transform:none; } }

  .dt-sr    { opacity:0; transform:translateY(40px); transition:opacity .75s ease, transform .75s ease; }
  .dt-sr-l  { opacity:0; transform:translateX(-40px); transition:opacity .75s ease, transform .75s ease; }
  .dt-sr-r  { opacity:0; transform:translateX(40px); transition:opacity .75s ease, transform .75s ease; }
  .dt-sr.in,.dt-sr-l.in,.dt-sr-r.in { opacity:1; transform:none; }
  .dt-d1{ transition-delay:.05s; } .dt-d2{ transition-delay:.15s; } .dt-d3{ transition-delay:.25s; }
  .dt-d4{ transition-delay:.35s; } .dt-d5{ transition-delay:.45s; } .dt-d6{ transition-delay:.55s; }

  .feat-item {
    display:flex; align-items:flex-start; gap:12px;
    padding:14px 18px; border-radius:12px;
    border:1px solid rgba(234,0,42,.15);
    background:rgba(234,0,42,.04);
    transition:all .3s;
  }
  .feat-item:hover {
    border-color:rgba(234,0,42,.4);
    background:rgba(234,0,42,.08);
    transform:translateX(6px);
    box-shadow:0 0 20px rgba(234,0,42,.15);
  }

  .step-card {
    position:relative; padding:24px 22px;
    border-radius:14px; overflow:hidden;
    border:1px solid rgba(255,255,255,.06);
    background:linear-gradient(145deg,#111,#0d0d0d);
    transition:all .35s;
  }
  .step-card::before {
    content:''; position:absolute; left:0; top:0; bottom:0; width:3px;
    background:linear-gradient(to bottom,#EA002A,rgba(234,0,42,.2));
    border-radius:3px 0 0 3px;
  }
  .step-card:hover {
    border-color:rgba(234,0,42,.3);
    transform:translateY(-4px);
    box-shadow:0 12px 40px rgba(234,0,42,.2);
  }
  .step-card .svc-scan { position:absolute; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent); top:-5%; pointer-events:none; }
  .step-card:hover .svc-scan { animation:scanLine 2s linear infinite; }

  .related-card {
    position:relative; border-radius:14px; padding:2px;
    background:linear-gradient(135deg,rgba(234,0,42,.35) 0%,rgba(255,255,255,.06) 50%,rgba(234,0,42,.2) 100%);
    text-decoration:none; display:block;
    transition:transform .3s, box-shadow .3s;
  }
  .related-card:hover { transform:translateY(-6px); box-shadow:0 16px 40px rgba(234,0,42,.25); }
  .related-inner { background:linear-gradient(145deg,#111,#0d0d0d); border-radius:12px; padding:22px 20px; }
  .related-icon-wrap {
    width:44px; height:44px; border-radius:11px;
    background:rgba(234,0,42,.1); border:1px solid rgba(234,0,42,.25);
    display:flex; align-items:center; justify-content:center; margin-bottom:12px;
    transition:all .3s;
  }
  .related-card:hover .related-icon-wrap { background:rgba(234,0,42,.2); box-shadow:0 0 20px rgba(234,0,42,.3); }

  .svc-tag {
    display:inline-block; font-family:'DM Sans',sans-serif; font-size:.7rem; font-weight:600;
    padding:3px 10px; border-radius:20px; border:1px solid rgba(234,0,42,.35);
    background:rgba(234,0,42,.08); color:#EA002A;
    margin:4px 4px 0 0; animation:floatTag 3s ease-in-out infinite;
  }

  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  .marquee-track { display:flex; animation:marqueeScroll 22s linear infinite; }
`;

const PARTICLES = [
  { id:0, top:'8%',  left:'5%',  size:'3px', delay:'0s',   dur:'7s'  },
  { id:1, top:'15%', left:'80%', size:'2px', delay:'1.5s', dur:'9s'  },
  { id:2, top:'30%', left:'92%', size:'3px', delay:'0.8s', dur:'6s'  },
  { id:3, top:'50%', left:'3%',  size:'4px', delay:'2.2s', dur:'8s'  },
  { id:4, top:'65%', left:'75%', size:'2px', delay:'1.0s', dur:'11s' },
  { id:5, top:'80%', left:'45%', size:'3px', delay:'3.1s', dur:'7s'  },
];

export default function ServiceDetailPage() {
  const { id } = useParams();
  const service = ALL_SERVICES.find(s => s.id === id);
  const related = ALL_SERVICES.filter(s => s.id !== id).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
    const targets = document.querySelectorAll('.dt-sr,.dt-sr-l,.dt-sr-r');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [id]);

  if (!service) {
    return (
      <Box sx={{ bgcolor:'#0a0a0a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Box sx={{ textAlign:'center' }}>
          <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'2rem', color:'#fff', mb:2 }}>Service not found</Typography>
          <Box component={Link} href="/services" sx={{ color:'#EA002A', fontFamily:"'DM Sans'", textDecoration:'none' }}>← Back to Services</Box>
        </Box>
      </Box>
    );
  }

  const { Icon } = service;

  return (
    <>
      <style>{DETAIL_CSS}</style>

      <Box sx={{ position:'relative', bgcolor:'#0a0a0a', minHeight:'100vh', overflow:'hidden', fontFamily:"'DM Sans',sans-serif" }}>

        {/* BG */}
        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 55% 45% at 85% 15%, rgba(234,0,42,.14) 0%, transparent 60%),radial-gradient(ellipse 40% 40% at 5% 80%, rgba(234,0,42,.08) 0%, transparent 55%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.02, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute', borderRadius:'50%', zIndex:0, top:p.top, left:p.left, width:p.size, height:p.size, bgcolor:'rgba(234,0,42,.4)', animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important', pt:{ xs:14, md:16 }, pb:{ xs:10, md:14 } }}>

          {/* Breadcrumb */}
          <Box className="dt-sr dt-d1" sx={{ display:'flex', alignItems:'center', gap:1, mb:5 }}>
            <Box component={Link} href="/" sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#555', textDecoration:'none', '&:hover':{ color:'#EA002A' }, transition:'color .2s' }}>Home</Box>
            <Box component="span" sx={{ color:'#333', fontSize:'.8rem' }}>›</Box>
            <Box component={Link} href="/services" sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#555', textDecoration:'none', '&:hover':{ color:'#EA002A' }, transition:'color .2s' }}>Services</Box>
            <Box component="span" sx={{ color:'#333', fontSize:'.8rem' }}>›</Box>
            <Box component="span" sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#EA002A' }}>{service.title}</Box>
          </Box>

          {/* ── Hero block ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1fr 1fr' }, gap:{ xs:6, md:10 }, alignItems:'center', mb:{ xs:10, md:14 } }}>

            {/* Left */}
            <Box>
              <Box className="dt-sr-l dt-d1" sx={{ display:'inline-flex', alignItems:'center', gap:1, mb:3, px:2, py:.8, borderRadius:'20px', border:'1px solid rgba(234,0,42,.3)', background:'rgba(234,0,42,.06)' }}>
                <Box sx={{ width:6, height:6, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 8px #EA002A' }}/>
                <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.75rem', fontWeight:700, color:'#EA002A', letterSpacing:'2px', textTransform:'uppercase' }}>
                  Service Detail
                </Typography>
              </Box>

              <Typography className="dt-sr-l dt-d2" sx={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:{ xs:'2.4rem', md:'3.2rem' }, letterSpacing:'-1px', lineHeight:1.05, background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmerText 5s linear infinite', mb:2 }}>
                {service.title}
              </Typography>

              <Box className="dt-sr-l dt-d3" sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3 }}>
                <Box sx={{ width:36, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
                <Box sx={{ width:6, height:6, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 8px #EA002A' }}/>
                <Box sx={{ width:36, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
              </Box>

              <Typography className="dt-sr-l dt-d4" sx={{ color:'#999', fontFamily:"'DM Sans'", fontSize:'1rem', lineHeight:1.85, mb:4 }}>
                {service.fullDesc}
              </Typography>

              <Box className="dt-sr-l dt-d5" sx={{ display:'flex', flexWrap:'wrap', gap:1, mb:4 }}>
                {service.tags.map((t, i) => (
                  <span key={t} className="svc-tag" style={{ animationDelay:`${i * 0.4}s`, fontSize:'.8rem', padding:'5px 14px' }}>{t}</span>
                ))}
              </Box>

              <Box className="dt-sr-l dt-d6" sx={{ display:'flex', gap:2, flexWrap:'wrap' }}>
                <Box
                  component="a"
                  href="/#contact"
                  sx={{
                    display:'inline-flex', alignItems:'center', gap:1,
                    fontFamily:"'DM Sans'", fontWeight:700, fontSize:'.95rem',
                    px:3.5, py:1.4, borderRadius:'10px', cursor:'pointer',
                    background:'#EA002A', color:'#fff', textDecoration:'none',
                    boxShadow:'0 0 24px rgba(234,0,42,.4)', transition:'all .3s',
                    '&:hover':{ background:'#c0392b', boxShadow:'0 0 38px rgba(234,0,42,.65)', transform:'translateY(-2px)' },
                  }}
                >
                  Hire Me for This <ArrowForwardIcon sx={{ fontSize:'1rem' }}/>
                </Box>
                <Box
                  component={Link}
                  href="/services"
                  sx={{
                    display:'inline-flex', alignItems:'center', gap:1,
                    fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.95rem',
                    px:3.5, py:1.4, borderRadius:'10px', cursor:'pointer',
                    border:'1px solid rgba(255,255,255,.12)', color:'#aaa', textDecoration:'none',
                    transition:'all .3s',
                    '&:hover':{ borderColor:'rgba(234,0,42,.4)', color:'#fff', background:'rgba(234,0,42,.07)' },
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize:'1rem' }}/> All Services
                </Box>
              </Box>
            </Box>

            {/* Right — icon display */}
            <Box className="dt-sr-r dt-d2" sx={{ display:'flex', justifyContent:'center', alignItems:'center' }}>
              <Box sx={{ position:'relative', width:240, height:240 }}>
                {/* Pulse rings */}
                {[1,2,3].map(n => (
                  <Box key={n} sx={{
                    position:'absolute', top:'50%', left:'50%',
                    width:`${90 + n * 40}px`, height:`${90 + n * 40}px`,
                    borderRadius:'50%', border:`1.5px solid rgba(234,0,42,${.3 - n * .07})`,
                    transform:'translate(-50%,-50%)',
                    animation:`pulseRing ${1.8 + n * .4}s ${n * .2}s ease-in-out infinite`,
                  }}/>
                ))}
                {/* Icon box */}
                <Box sx={{
                  position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
                  width:100, height:100, borderRadius:'24px',
                  background:'linear-gradient(135deg,rgba(234,0,42,.25),rgba(234,0,42,.08))',
                  border:'2px solid rgba(234,0,42,.5)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  animation:'iconGlow 3s ease-in-out infinite',
                  zIndex:2,
                }}>
                  <Icon sx={{ fontSize:'3rem', color:'#EA002A' }}/>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* ── Features + Process ── */}
          <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', md:'1fr 1fr' }, gap:{ xs:6, md:8 }, mb:{ xs:10, md:14 } }}>

            {/* Features */}
            <Box>
              <Typography className="dt-sr dt-d1" sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.5rem', color:'#fff', mb:.5, letterSpacing:'-.3px' }}>
                What's Included
              </Typography>
              <Box className="dt-sr dt-d2" sx={{ display:'flex', alignItems:'center', gap:1.5, mb:4 }}>
                <Box sx={{ width:28, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
                <Box sx={{ width:5, height:5, borderRadius:'50%', bgcolor:'#EA002A' }}/>
                <Box sx={{ width:28, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
              </Box>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.5 }}>
                {service.features.map((f, i) => (
                  <Box key={f} className={`feat-item dt-sr dt-d${Math.min(i + 1, 6)}`}>
                    <CheckCircleIcon sx={{ color:'#EA002A', fontSize:'1.15rem', mt:'.1rem', flexShrink:0 }}/>
                    <Typography sx={{ fontFamily:"'DM Sans'", color:'#ccc', fontSize:'.9rem', fontWeight:500 }}>{f}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Process */}
            <Box>
              <Typography className="dt-sr dt-d1" sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.5rem', color:'#fff', mb:.5, letterSpacing:'-.3px' }}>
                My Process
              </Typography>
              <Box className="dt-sr dt-d2" sx={{ display:'flex', alignItems:'center', gap:1.5, mb:4 }}>
                <Box sx={{ width:28, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
                <Box sx={{ width:5, height:5, borderRadius:'50%', bgcolor:'#EA002A' }}/>
                <Box sx={{ width:28, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
              </Box>
              <Box sx={{ display:'flex', flexDirection:'column', gap:1.5 }}>
                {service.process.map((step, i) => (
                  <Box key={step} className={`step-card dt-sr dt-d${Math.min(i + 1, 6)}`}>
                    <Box className="svc-scan"/>
                    <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
                      <Box sx={{
                        width:28, height:28, borderRadius:'8px', flexShrink:0,
                        background:'rgba(234,0,42,.15)', border:'1px solid rgba(234,0,42,.3)',
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.72rem', color:'#EA002A' }}>
                          {String(i + 1).padStart(2, '0')}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontFamily:"'DM Sans'", color:'#ccc', fontSize:'.9rem', fontWeight:500 }}>{step}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          {/* ── Related Services ── */}
          <Box className="dt-sr">
            <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.6rem', color:'#fff', mb:1, letterSpacing:'-.3px' }}>
              Other Services
            </Typography>
            <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:5 }}>
              <Box sx={{ width:36, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:6, height:6, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 8px #EA002A' }}/>
              <Box sx={{ width:36, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>

            <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr', md:'1fr 1fr 1fr' }, gap:2.5 }}>
              {related.map(rel => {
                const RelIcon = rel.Icon;
                return (
                  <Box key={rel.id} component={Link} href={`/services/${rel.id}`} className="related-card">
                    <Box className="related-inner">
                      <Box className="related-icon-wrap"><RelIcon sx={{ color:'#EA002A', fontSize:'1.3rem' }}/></Box>
                      <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1rem', color:'#fff', mb:1, letterSpacing:'-.2px' }}>
                        {rel.title}
                      </Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'", color:'#666', fontSize:'.82rem', lineHeight:1.65, mb:1.5 }}>
                        {rel.desc}
                      </Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', fontWeight:700, color:'#EA002A', letterSpacing:'.5px' }}>
                        Learn More →
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Container>

        {/* Marquee */}
        <Box sx={{ py:2.5, borderTop:'1px solid rgba(255,255,255,.06)', overflow:'hidden', position:'relative', zIndex:2, background:'rgba(234,0,42,.04)' }}>
          <Box className="marquee-track" sx={{ whiteSpace:'nowrap' }}>
            {[service.title, ...service.features, ...service.tags, service.title, ...service.features, ...service.tags].map((item, i) => (
              <Box key={i} component="span" sx={{ display:'inline-flex', alignItems:'center', gap:2, fontFamily:"'Syne'", fontWeight:700, fontSize:'.75rem', letterSpacing:'2px', textTransform:'uppercase', color: i % 3 === 0 ? '#EA002A' : 'rgba(255,255,255,.22)', mx:3 }}>
                {i % 3 === 0 ? '★' : '·'} {item}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
}