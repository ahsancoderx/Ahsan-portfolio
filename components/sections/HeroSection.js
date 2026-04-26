'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Avatar } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DownloadIcon from '@mui/icons-material/Download';

const typingWords = ['Full-Stack Developer','AI/ML Engineer', 'Frontend Developer','Backend Developer', 'UI/UX Designer', 'React Developer', 'AI Enthusiast','Tech Innovator','chatbot developer'];

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

  @keyframes blink        { 50%{ opacity:0; } }
  @keyframes shimmerText  { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes floatAvatar  { 0%,100%{ transform:translate(-50%,-50%) translateY(0); } 50%{ transform:translate(-50%,-50%) translateY(-14px); } }
  @keyframes pulseRing    { 0%,100%{ opacity:.45; transform:translate(-50%,-50%) scale(1); } 50%{ opacity:.9; transform:translate(-50%,-50%) scale(1.07); } }
  @keyframes particleDrift{ 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes iconBob      { 0%,100%{ transform:translateY(0) scale(1); } 50%{ transform:translateY(-5px) scale(1.08); } }
  @keyframes glowPulse    { 0%,100%{ box-shadow:0 0 40px rgba(234,0,42,.5),0 0 80px rgba(234,0,42,.2); } 50%{ box-shadow:0 0 60px rgba(234,0,42,.8),0 0 120px rgba(234,0,42,.35); } }

  /* ─── Orbit: rotating ring, icon counter-rotates to stay upright ─── */
  @keyframes orbitCW   { from{ transform:rotate(0deg);    } to{ transform:rotate(360deg);  } }
  @keyframes orbitCCW  { from{ transform:rotate(0deg);    } to{ transform:rotate(-360deg); } }
  @keyframes orbitCW2  { from{ transform:rotate(45deg);   } to{ transform:rotate(405deg);  } }
  @keyframes orbitCCW2 { from{ transform:rotate(-45deg);  } to{ transform:rotate(-405deg); } }
  @keyframes orbitCW3  { from{ transform:rotate(90deg);   } to{ transform:rotate(450deg);  } }
  @keyframes orbitCCW3 { from{ transform:rotate(-90deg);  } to{ transform:rotate(-450deg); } }

  .orbit-ring {
    position:absolute;
    top:50%; left:50%;
    border-radius:50%;
    border:1px dashed rgba(234,0,42,.3);
    /* translate so ring is centered on avatar */
  }
  /* Each icon is placed at the top of its ring (transform-origin stays center of ring) */
  .icon-anchor {
    position:absolute;
    top:0; left:50%;
    /* Pull icon to sit on the ring edge */
  }
  .tech-chip {
    border-radius:13px;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(0,0,0,.55), 0 0 0 1.5px rgba(255,255,255,.1);
    animation:iconBob 2.8s ease-in-out infinite;
    cursor:default;
    position:relative;
  }
  .tech-chip img { object-fit:contain; pointer-events:none; }

  /* Tooltip */
  .tech-chip::after {
    content:attr(data-label);
    position:absolute; bottom:calc(100% + 6px); left:50%;
    transform:translateX(-50%) scale(.85);
    background:rgba(20,20,20,.9); color:#fff;
    font-size:11px; font-family:'DM Sans',sans-serif; font-weight:600;
    padding:3px 8px; border-radius:6px; white-space:nowrap;
    opacity:0; pointer-events:none;
    transition:opacity .2s, transform .2s;
    border:1px solid rgba(234,0,42,.35);
  }
  .tech-chip:hover::after { opacity:1; transform:translateX(-50%) scale(1); }

  /* ─── Scroll reveal ─── */
  .sr          { opacity:0; transform:translateY(48px); transition:opacity .75s ease, transform .75s ease; }
  .sr-left     { opacity:0; transform:translateX(-56px);transition:opacity .75s ease, transform .75s ease; }
  .sr-right    { opacity:0; transform:translateX(56px); transition:opacity .75s ease, transform .75s ease; }
  .sr-scale    { opacity:0; transform:scale(.88);       transition:opacity .75s ease, transform .75s ease; }
  .sr.in, .sr-left.in, .sr-right.in, .sr-scale.in { opacity:1; transform:none; }

  /* stagger helpers */
  .d1 { transition-delay:.1s; }
  .d2 { transition-delay:.2s; }
  .d3 { transition-delay:.35s; }
  .d4 { transition-delay:.5s; }

  /* ─── Responsive ring sizes ─── */
  /* Sizes set via CSS custom properties overridden per breakpoint */
  :root {
    --r1:170px; --r2:120px; --r3:76px;
    --chip:50px; --chip-img:28px;
  }
  @media(max-width:900px){
    :root{ --r1:140px; --r2:100px; --r3:65px; }
  }
  @media(max-width:600px){
    :root{ --r1:115px; --r2:82px; --r3:54px; --chip:40px; --chip-img:22px; }
  }
`;

/* Tech config */
const RINGS_CONFIG = [
  {
    radius: '--r1', speed: 13, direction: 'CW',
    icons: [
      { bg:'#F7DF1E', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', label:'JavaScript', deg:0   },
      { bg:'#ffff', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',          label:'React',      deg:180 },
    ],
  },
  {
    radius: '--r2', speed: 9, direction: 'CCW',
    icons: [
      { bg:'#3776AB', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',   label:'Python',  deg:0   },
      { bg:'#111111', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',   label:'Next.js', deg:180, border:'1px solid #555' },
    ],
  },
  {
    radius: '--r3', speed: 7, direction: 'CW',
    icons: [
      { bg:'#339933', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',   label:'Node.js',  deg:0   },
      { bg:'#47A248', src:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg', label:'MongoDB',  deg:180 },
    ],
  },
];

const HERO_SOCIAL = [
  { Icon: GitHubIcon,   href: 'https://github.com/ahsancoderx' },
  { Icon: LinkedInIcon, href: 'https://www.linkedin.com/in/ahsan-ali-mern-stack-developer/' },
];
const PARTICLES = [
  { id:0,  top:'8%',  left:'12%', size:'3px', delay:'0s',    dur:'6s'   },
  { id:1,  top:'15%', left:'78%', size:'2px', delay:'1.2s',  dur:'8s'   },
  { id:2,  top:'25%', left:'45%', size:'4px', delay:'0.5s',  dur:'7s'   },
  { id:3,  top:'35%', left:'88%', size:'2px', delay:'2.1s',  dur:'9s'   },
  { id:4,  top:'42%', left:'5%',  size:'3px', delay:'0.8s',  dur:'5s'   },
  { id:5,  top:'55%', left:'62%', size:'5px', delay:'1.7s',  dur:'11s'  },
  { id:6,  top:'60%', left:'30%', size:'2px', delay:'3.0s',  dur:'8s'   },
  { id:7,  top:'70%', left:'91%', size:'3px', delay:'0.3s',  dur:'6s'   },
  { id:8,  top:'78%', left:'18%', size:'4px', delay:'2.5s',  dur:'10s'  },
  { id:9,  top:'85%', left:'55%', size:'2px', delay:'1.0s',  dur:'7s'   },
  { id:10, top:'92%', left:'40%', size:'3px', delay:'0.6s',  dur:'9s'   },
  { id:11, top:'5%',  left:'60%', size:'2px', delay:'4.0s',  dur:'13s'  },
  { id:12, top:'18%', left:'25%', size:'4px', delay:'1.5s',  dur:'8s'   },
  { id:13, top:'30%', left:'72%', size:'3px', delay:'2.8s',  dur:'6s'   },
  { id:14, top:'48%', left:'83%', size:'2px', delay:'0.2s',  dur:'10s'  },
  { id:15, top:'65%', left:'10%', size:'5px', delay:'3.5s',  dur:'7s'   },
  { id:16, top:'72%', left:'48%', size:'2px', delay:'1.9s',  dur:'12s'  },
  { id:17, top:'88%', left:'76%', size:'3px', delay:'0.7s',  dur:'8s'   },
  { id:18, top:'20%', left:'92%', size:'4px', delay:'2.3s',  dur:'9s'   },
  { id:19, top:'50%', left:'22%', size:'2px', delay:'4.5s',  dur:'6s'   },
  { id:20, top:'38%', left:'58%', size:'3px', delay:'1.1s',  dur:'11s'  },
  { id:21, top:'80%', left:'35%', size:'4px', delay:'3.2s',  dur:'7s'   },
]

function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll('.sr,.sr-left,.sr-right,.sr-scale');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.12 }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useScrollReveal();

  useEffect(() => {
    const word = typingWords[wordIndex];
    let t;
    if (!isDeleting && displayed.length < word.length)
      t = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    else if (!isDeleting && displayed.length === word.length)
      t = setTimeout(() => setIsDeleting(true), 2000);
    else if (isDeleting && displayed.length > 0)
      t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 60);
    else { setIsDeleting(false); setWordIndex(i => (i + 1) % typingWords.length); }
    return () => clearTimeout(t);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <Box id="home" sx={{
        position:'relative', minHeight:'100vh',
        display:'flex', alignItems:'center',
        bgcolor:'#0a0a0a', overflow:'hidden',
        pt:{ xs:12, md:10 }, pb:{ xs:10, md:0 },
        fontFamily:"'DM Sans', sans-serif",
      }}>

        {/* BG glow */}
        <Box sx={{
          position:'absolute', inset:0, zIndex:0,
          background:`
            radial-gradient(ellipse 70% 60% at 72% 52%, rgba(234,0,42,.13) 0%, transparent 65%),
            radial-gradient(ellipse 40% 35% at 15% 75%, rgba(234,0,42,.07) 0%, transparent 55%)
          `,
        }} />

        {/* Particles */}
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'absolute', borderRadius:'50%', zIndex:0,
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.45)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }} />
        ))}

        {/* ── Main row ── */}
        <Box sx={{
          position:'relative', zIndex:1, width:'100%',
          maxWidth:1200, mx:'auto', px:{ xs:3, md:6 },
          display:'flex', flexDirection:{ xs:'column', md:'row' },
          alignItems:'center', gap:{ xs:0, md:4 },
        }}>

          {/* ── LEFT text ── */}
          <Box sx={{ flex:1, mb:{ xs:6, md:0 } }}>

            <Typography className="sr-left d1" sx={{
              fontFamily:"'Syne', sans-serif", fontWeight:800,
              fontSize:{ xs:'2.6rem', sm:'3.2rem', md:'3.9rem' },
              letterSpacing:'-1.5px', lineHeight:1.05,
              background:'linear-gradient(90deg,#fff 30%,#EA002A 80%)',
              backgroundSize:'200% auto',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'shimmerText 4s linear infinite', mb:1.5,
            }}>
              Ahsan Ali
            </Typography>

            <Typography className="sr-left d2" variant="h5" sx={{
              color:'#aaa', mb:3, fontWeight:500,
              fontSize:{ xs:'1.05rem', md:'1.3rem' },
            }}>
              I&apos;m a{' '}
              <Box component="span" sx={{ color:'#EA002A', fontWeight:700 }}>
                {displayed}
                <Box component="span" sx={{
                  display:'inline-block', width:'2px', height:'1.1em',
                  bgcolor:'#EA002A', verticalAlign:'middle',
                  animation:'blink 1s infinite',
                }} />
              </Box>
            </Typography>

            <Typography className="sr-left d3" sx={{
              color:'#888', mb:4, lineHeight:1.78,
              fontSize:{ xs:'.93rem', md:'1rem' }, maxWidth:420,
            }}>
              Full-Stack Developer specializing in MERN Stack, AI-powered applications, and modern web solutions that are fast, scalable, and user-focused.
            </Typography>

            <Box className="sr-left d4" sx={{ display:'flex', gap:2, flexWrap:'wrap' }}>
              <Button
  variant="contained"
  component="a"
  href="/Ahsan-full-stack-AI.pdf"
download="Ahsan-full-stack-AI.pdf"
  startIcon={<DownloadIcon />}
  sx={{
    bgcolor:'#EA002A', fontFamily:"'DM Sans'", fontWeight:600,
    px:3, py:1.2, borderRadius:'10px', textTransform:'none', fontSize:'1rem',
    boxShadow:'0 0 24px rgba(234,0,42,.4)', transition:'all .3s',
    '&:hover':{ bgcolor:'#c0392b', boxShadow:'0 0 38px rgba(234,0,42,.7)', transform:'translateY(-3px)' },
  }}
>
  Download CV
</Button>
              {HERO_SOCIAL.map(({ Icon, href }, i) => (
  <IconButton
    key={i}
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      color:'#ccc', border:'1px solid rgba(255,255,255,.15)', borderRadius:'10px',
      transition:'all .3s',
      '&:hover':{ color:'#EA002A', borderColor:'#EA002A', boxShadow:'0 0 16px rgba(234,0,42,.4)', transform:'translateY(-3px)' },
    }}
  >
    <Icon />
  </IconButton>
))}
            </Box>
          </Box>

          {/* ── RIGHT: avatar sphere with orbiting icons ── */}
          <Box className="sr-right d2" sx={{
            position:'relative', flexShrink:0,
            mx:{ xs:'auto', md:0 },
            /* overall container sized to outer ring diameter + some breathing room */
            width:{ xs:260, sm:340, md:420 },
            height:{ xs:260, sm:340, md:420 },
          }}>

            {/* Orbit rings */}
            {RINGS_CONFIG.map((ring, ri) => {
              const animName = `orbit${ring.direction}${ri > 0 ? ri + 1 : ''}`;
              // We rely on CSS for the counter-rotation keyframe names derived from direction
              // Ring rotates CW or CCW; icons counter-rotate
              const ringAnim = ring.direction === 'CW'
                ? `orbitCW${ri > 0 ? ri + 1 : ''}`
                : `orbitCCW${ri > 0 ? ri + 1 : ''}`;
              const iconAnim = ring.direction === 'CW'
                ? `orbitCCW${ri > 0 ? ri + 1 : ''}`
                : `orbitCW${ri > 0 ? ri + 1 : ''}`;

              return (
                <Box
                  key={ri}
                  sx={{
                    position:'absolute',
                    top:'50%', left:'50%',
                    // Use JS to read CSS var at runtime isn't possible in MUI sx easily,
                    // so we set explicit sizes per breakpoint:
                    width: ri===0
                      ? { xs:'230px', sm:'280px', md:'340px' }
                      : ri===1
                      ? { xs:'164px', sm:'200px', md:'240px' }
                      : { xs:'108px', sm:'130px', md:'152px' },
                    height: ri===0
                      ? { xs:'230px', sm:'280px', md:'340px' }
                      : ri===1
                      ? { xs:'164px', sm:'200px', md:'240px' }
                      : { xs:'108px', sm:'130px', md:'152px' },
                    borderRadius:'50%',
                    border:'1px dashed rgba(234,0,42,.28)',
                    transform:'translate(-50%,-50%)',
                    animation:`${ringAnim} ${ring.speed}s linear infinite`,
                  }}
                >
                  {ring.icons.map((icon, ii) => (
                    <Box
                      key={ii}
                      sx={{
                        position:'absolute',
                        top: ii === 0 ? '-25px' : 'auto',
                        bottom: ii === 1 ? '-25px' : 'auto',
                        left:'50%',
                        transform:'translateX(-50%)',
                        animation:`${iconAnim} ${ring.speed}s linear infinite`,
                      }}
                    >
                      <Box
                        className="tech-chip"
                        data-label={icon.label}
                        sx={{
                          width:{ xs:'40px', sm:'46px', md:'50px' },
                          height:{ xs:'40px', sm:'46px', md:'50px' },
                          background: icon.bg,
                          border: icon.border || 'none',
                          animationDelay:`${ri * 0.6 + ii * 0.3}s`,
                        }}
                      >
                        <img
                          src={icon.src}
                          alt={icon.label}
                          style={{ width:'60%', height:'60%' }}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>
              );
            })}

            {/* Pulse rings */}
            {[1, 2, 3].map(n => (
              <Box key={n} sx={{
                position:'absolute', top:'50%', left:'50%',
                width:`${80 + n * 30}px`, height:`${80 + n * 30}px`,
                borderRadius:'50%',
                border:`1.5px solid rgba(234,0,42,${.35 - n * .07})`,
                animation:`pulseRing ${1.8 + n * .4}s ${n * .22}s ease-in-out infinite`,
                zIndex:1,
              }} />
            ))}

            {/* Avatar */}
            <Avatar src="ahsan-pic.png" sx={{
              position:'absolute', top:'50%', left:'50%',
              width:{ xs:'120px', sm:'155px', md:'185px' },
              height:{ xs:'120px', sm:'155px', md:'185px' },
              border:'4px solid #EA002A',
              animation:'floatAvatar 5s ease-in-out infinite, glowPulse 3s ease-in-out infinite',
              zIndex:2,
            }} />
          </Box>
        </Box>
      </Box>
    </>
  );
}