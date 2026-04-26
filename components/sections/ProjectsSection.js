'use client'
import { useState, useEffect, useRef } from 'react'
import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const PROJ_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0);opacity:.5; } 50%{ transform:translate(10px,-14px);opacity:1; } }
  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  @keyframes fadeUp        { from{ opacity:0; transform:translateY(40px); } to{ opacity:1; transform:none; } }
  @keyframes scanLine      { 0%{top:-5%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:105%;opacity:0;} }
  @keyframes glowPulse     { 0%,100%{box-shadow:0 0 20px rgba(234,0,42,.3);} 50%{box-shadow:0 0 40px rgba(234,0,42,.6);} }
  @keyframes tagFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
  @keyframes imageZoom     { from{transform:scale(1);} to{transform:scale(1.07);} }
  @keyframes numberPop     { from{opacity:0;transform:scale(.5) rotate(-10deg);} to{opacity:1;transform:scale(1) rotate(0deg);} }
  @keyframes linkBounce    { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-3px);} }

  /* scroll reveal */
  .pr-sr   { opacity:0; transform:translateY(44px); transition:opacity .8s ease,transform .8s ease; }
  .pr-sr-l { opacity:0; transform:translateX(-48px); transition:opacity .8s ease,transform .8s ease; }
  .pr-sr-r { opacity:0; transform:translateX(48px);  transition:opacity .8s ease,transform .8s ease; }
  .pr-sr.in,.pr-sr-l.in,.pr-sr-r.in { opacity:1; transform:none; }
  .pr-d1{transition-delay:.05s}.pr-d2{transition-delay:.14s}.pr-d3{transition-delay:.23s}
  .pr-d4{transition-delay:.32s}.pr-d5{transition-delay:.41s}.pr-d6{transition-delay:.50s}

  /* project card */
  .proj-card {
    position:relative; border-radius:20px; overflow:hidden;
    background:linear-gradient(145deg,#141414,#0d0d0d);
    border:1px solid rgba(234,0,42,.15);
    transition:transform .4s cubic-bezier(.34,1.3,.64,1), box-shadow .4s, border-color .3s;
    cursor:pointer;
    group:true;
  }
  .proj-card:hover {
    transform:translateY(-10px) scale(1.02);
    box-shadow:0 28px 70px rgba(0,0,0,.7),0 0 0 1px rgba(234,0,42,.45),0 0 50px rgba(234,0,42,.15);
    border-color:rgba(234,0,42,.5);
  }

  /* image */
  .proj-img-wrap {
    position:relative; height:220px; overflow:hidden;
    background:linear-gradient(135deg,#111,#0d0d0d);
  }
  .proj-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform .6s ease;
  }
  .proj-card:hover .proj-img { transform:scale(1.08); }

  /* overlay on hover */
  .proj-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom,rgba(234,0,42,.0) 0%,rgba(10,10,10,.95) 100%);
    transition:background .4s;
  }
  .proj-card:hover .proj-overlay {
    background:linear-gradient(to bottom,rgba(234,0,42,.08) 0%,rgba(10,10,10,.97) 100%);
  }

  /* scan line */
  .proj-scan {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent);
    top:-5%; pointer-events:none; z-index:3;
    opacity:0; transition:opacity .3s;
  }
  .proj-card:hover .proj-scan { opacity:1; animation:scanLine 2.5s linear infinite; }

  /* link buttons */
  .proj-link {
    display:inline-flex; align-items:center; gap:6px;
    font-family:'DM Sans',sans-serif; font-size:.75rem; font-weight:700;
    padding:6px 14px; border-radius:20px; text-decoration:none;
    border:1px solid rgba(255,255,255,.1); color:#888;
    background:rgba(255,255,255,.04);
    transition:all .28s;
    letter-spacing:.3px;
  }
  .proj-link:hover { color:#fff; border-color:rgba(234,0,42,.5); background:rgba(234,0,42,.1); box-shadow:0 0 12px rgba(234,0,42,.3); }
  .proj-link.live { border-color:rgba(234,0,42,.35); color:#EA002A; background:rgba(234,0,42,.08); }
  .proj-link.live:hover { background:rgba(234,0,42,.2); box-shadow:0 0 18px rgba(234,0,42,.4); }

  /* tag */
  .proj-tag {
    font-family:'DM Sans'; font-size:.68rem; font-weight:600;
    padding:3px 10px; border-radius:20px;
    border:1px solid rgba(234,0,42,.3); background:rgba(234,0,42,.07);
    color:#EA002A; animation:tagFloat 3s ease-in-out infinite;
    display:inline-block;
  }

  /* number badge */
  .proj-number {
    position:absolute; top:12px; right:14px; z-index:4;
    font-family:'Syne',sans-serif; font-weight:800; font-size:2.6rem;
    color:rgba(234,0,42,.1); line-height:1; pointer-events:none;
    transition:color .35s;
  }
  .proj-card:hover .proj-number { color:rgba(234,0,42,.18); }

  /* category badge */
  .proj-cat {
    position:absolute; top:14px; left:14px; z-index:4;
    font-family:'DM Sans'; font-size:.65rem; font-weight:700;
    padding:4px 10px; border-radius:20px; letter-spacing:1px; text-transform:uppercase;
    background:rgba(10,10,10,.8); border:1px solid rgba(234,0,42,.4); color:#EA002A;
    backdrop-filter:blur(8px);
  }

  /* featured badge */
  .proj-featured {
    position:absolute; top:14px; left:14px; z-index:4;
    font-family:'DM Sans'; font-size:.62rem; font-weight:700;
    padding:4px 10px; border-radius:20px; letter-spacing:1px; text-transform:uppercase;
    background:linear-gradient(90deg,rgba(234,0,42,.9),rgba(180,0,20,.9));
    color:#fff; backdrop-filter:blur(8px);
    box-shadow:0 0 14px rgba(234,0,42,.5);
  }

  /* filter tab */
  .filter-tab {
    font-family:'DM Sans'; font-weight:600; font-size:.78rem;
    padding:7px 18px; border-radius:30px;
    border:1px solid rgba(255,255,255,.08); background:transparent;
    color:#555; cursor:pointer; transition:all .25s; white-space:nowrap;
    letter-spacing:.5px; text-transform:uppercase;
  }
  .filter-tab:hover { color:#fff; border-color:rgba(234,0,42,.35); background:rgba(234,0,42,.06); }
  .filter-tab.active { background:#EA002A; border-color:#EA002A; color:#fff; box-shadow:0 0 16px rgba(234,0,42,.45); }

  /* view all button */
  .view-all-btn {
    font-family:'Syne',sans-serif; font-weight:800; font-size:.88rem;
    padding:12px 32px; border-radius:12px;
    border:1px solid rgba(234,0,42,.4); background:transparent; color:#EA002A;
    cursor:pointer; transition:all .3s; letter-spacing:.5px; text-transform:uppercase;
    position:relative; overflow:hidden; text-decoration:none; display:inline-block;
  }
  .view-all-btn::before {
    content:''; position:absolute; inset:0;
    background:#EA002A; transform:scaleX(0); transform-origin:left;
    transition:transform .35s cubic-bezier(.4,0,.2,1);
  }
  .view-all-btn:hover { color:#fff; box-shadow:0 0 28px rgba(234,0,42,.5); border-color:#EA002A; }
  .view-all-btn:hover::before { transform:scaleX(1); }
  .view-all-btn span { position:relative; z-index:1; }
`

// ─── Static Projects Data ──────────────────────────────────────────────────
export const PROJECTS = [
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Platform',
    subtitle: 'Full-stack shopping experience',
    description: 'A high-performance e-commerce platform built with Next.js 14, featuring real-time inventory, Stripe payments, and a blazing-fast search powered by Algolia.',
    category: 'Full-Stack',
    featured: true,
    image: '/projects/ecommerce.png',    // replace with your image
    fallbackColor: 'linear-gradient(135deg,#1a0a0a 0%,#2d0d0d 50%,#1a0505 100%)',
    tags: ['Next.js', 'MongoDB', 'Stripe', 'Algolia', 'Tailwind'],
    liveUrl:   'https://your-live-site.com',
    githubUrl: 'https://github.com/ahsanali/ecommerce',
    videoUrl:  'https://youtube.com/watch?v=demo1',
    year: '2024',
    status: 'Live',
  },
  {
    id: 'seo-dashboard',
    title: 'SEO Analytics Dashboard',
    subtitle: 'Real-time SEO monitoring tool',
    description: 'Comprehensive SEO dashboard with keyword tracking, competitor analysis, backlink monitoring, and automated reporting. Helped 20+ clients improve rankings.',
    category: 'Frontend',
    featured: true,
    image: '/projects/seo-dashboard.png',
    fallbackColor: 'linear-gradient(135deg,#050f1a 0%,#0d1f2d 50%,#071525 100%)',
    tags: ['React', 'Node.js', 'Chart.js', 'REST API', 'SEO'],
    liveUrl:   'https://seo-dashboard-demo.com',
    githubUrl: 'https://github.com/ahsanali/seo-dashboard',
    videoUrl:  'https://youtube.com/watch?v=demo2',
    year: '2024',
    status: 'Live',
  },
  {
    id: 'portfolio-builder',
    title: 'Portfolio Builder SaaS',
    subtitle: 'Drag-and-drop portfolio creator',
    description: 'A SaaS platform that lets developers create stunning portfolios in minutes. Features a drag-and-drop editor, custom domains, and built-in SEO optimisation.',
    category: 'SaaS',
    featured: false,
    image: '/projects/portfolio-builder.png',
    fallbackColor: 'linear-gradient(135deg,#0a0a1a 0%,#0d0d2d 50%,#060615 100%)',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
    liveUrl:   'https://portfoliobuilder.dev',
    githubUrl: 'https://github.com/ahsanali/portfolio-builder',
    videoUrl:  null,
    year: '2023',
    status: 'Live',
  },
  {
    id: 'restaurant-pos',
    title: 'Restaurant POS System',
    subtitle: 'Point-of-sale for local restaurants',
    description: 'Complete POS system for restaurants — order management, table booking, kitchen display, and daily reporting. Deployed across 5 local restaurants in Lahore.',
    category: 'Full-Stack',
    featured: false,
    image: '/projects/restaurant-pos.png',
    fallbackColor: 'linear-gradient(135deg,#0d0a05 0%,#1a1005 50%,#100a02 100%)',
    tags: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'PWA'],
    liveUrl:   null,
    githubUrl: 'https://github.com/ahsanali/restaurant-pos',
    videoUrl:  'https://youtube.com/watch?v=demo3',
    year: '2023',
    status: 'Private',
  },
  {
    id: 'ai-content-writer',
    title: 'AI Content Writer',
    subtitle: 'GPT-powered content generation',
    description: 'AI-powered writing assistant that generates SEO-optimised blog posts, social media captions, and ad copy. Integrated with OpenAI GPT-4 and custom fine-tuning.',
    category: 'AI / ML',
    featured: true,
    image: '/projects/ai-writer.png',
    fallbackColor: 'linear-gradient(135deg,#050d0a 0%,#071a12 50%,#051008 100%)',
    tags: ['Next.js', 'OpenAI', 'TypeScript', 'Vercel AI SDK'],
    liveUrl:   'https://ai-writer-demo.vercel.app',
    githubUrl: 'https://github.com/ahsanali/ai-writer',
    videoUrl:  'https://youtube.com/watch?v=demo4',
    year: '2024',
    status: 'Beta',
  },
  {
    id: 'real-estate-app',
    title: 'Real Estate Listings App',
    subtitle: 'Property search & management',
    description: 'Modern real estate platform with map-based property search, virtual tours, mortgage calculator, and an agent CRM. 3,000+ listings indexed.',
    category: 'Frontend',
    featured: false,
    image: '/projects/real-estate.png',
    fallbackColor: 'linear-gradient(135deg,#0a0510 0%,#150a1a 50%,#0d0612 100%)',
    tags: ['React', 'Google Maps', 'Node.js', 'MongoDB', 'SEO'],
    liveUrl:   'https://realestate-demo.com',
    githubUrl: 'https://github.com/ahsanali/real-estate',
    videoUrl:  null,
    year: '2023',
    status: 'Live',
  },
]

const FILTERS = ['All', 'Full-Stack', 'Frontend', 'SaaS', 'AI / ML']

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id:i, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
  size:`${2+Math.random()*3}px`, delay:`${Math.random()*7}s`, dur:`${5+Math.random()*9}s`,
}))

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const [imgErr, setImgErr] = useState(false)
  const router = useRouter()

  // Navigate to detail page when card body is clicked
  // Inner <a> buttons call e.stopPropagation() so they don't trigger this
  const handleCardClick = () => router.push(`/projects/${project.id}`)

  return (
    <Box
      className={`proj-card pr-sr pr-d${Math.min(index+1,6)}`}
      onClick={handleCardClick}
      sx={{ height:'100%', cursor:'pointer' }}
    >
      {/* ── image ── */}
      <Box className="proj-img-wrap">
        {!imgErr && project.image
          ? <img src={project.image} alt={project.title} className="proj-img" onError={() => setImgErr(true)}/>
          : <Box sx={{ width:'100%', height:'100%', background: project.fallbackColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'2.5rem', color:'rgba(234,0,42,.2)', userSelect:'none' }}>
                {project.title.slice(0,2).toUpperCase()}
              </Typography>
            </Box>
        }
        <Box className="proj-overlay"/>
        <Box className="proj-scan"/>

        {/* badges */}
        {project.featured
          ? <Box className="proj-featured">★ Featured</Box>
          : <Box className="proj-cat">{project.category}</Box>
        }

        {/* number */}
        <Box className="proj-number">{String(index+1).padStart(2,'0')}</Box>

        {/* status */}
        <Box sx={{
          position:'absolute', bottom:14, right:14, zIndex:4,
          display:'flex', alignItems:'center', gap:.6,
          px:1.2, py:.4, borderRadius:'20px',
          background:'rgba(10,10,10,.85)', border:'1px solid rgba(255,255,255,.08)',
          backdropFilter:'blur(8px)',
        }}>
          <Box sx={{
            width:6, height:6, borderRadius:'50%',
            bgcolor: project.status==='Live' ? '#22c55e' : project.status==='Beta' ? '#f59e0b' : '#888',
            boxShadow: project.status==='Live' ? '0 0 6px #22c55e' : 'none',
          }}/>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.65rem', fontWeight:700, color:'#aaa', letterSpacing:'.5px' }}>
            {project.status}
          </Typography>
        </Box>
      </Box>

      {/* ── content ── */}
      <Box sx={{ p:'20px 22px 22px' }}>
        <Box sx={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', mb:.6, gap:1 }}>
          <Box>
            <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.05rem', color:'#fff', letterSpacing:'-.3px', lineHeight:1.2, mb:.3 }}>
              {project.title}
            </Typography>
            <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#EA002A', fontWeight:600 }}>
              {project.subtitle}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.72rem', color:'#444', fontWeight:600, flexShrink:0 }}>
            {project.year}
          </Typography>
        </Box>

        {/* red accent line */}
        <Box sx={{ width:28, height:'2px', borderRadius:2, background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))', mb:1.5 }}/>

        <Typography sx={{ fontFamily:"'DM Sans'", color:'#777', fontSize:'.84rem', lineHeight:1.72, mb:2, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
          {project.description}
        </Typography>

        {/* tags */}
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:.75, mb:2.5 }}>
          {project.tags.slice(0,4).map((t,i) => (
            <span key={t} className="proj-tag" style={{ animationDelay:`${i*.3}s` }}>{t}</span>
          ))}
        </Box>

        {/* link buttons — stopPropagation so card onClick doesn't fire */}
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="proj-link live" onClick={e => e.stopPropagation()}>
              <span>🔴</span> Live
            </a>
          )}
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="proj-link" onClick={e => e.stopPropagation()}>
              <span style={{fontSize:'.8rem'}}>⌥</span> GitHub
            </a>
          )}
          {project.videoUrl && (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="proj-link" onClick={e => e.stopPropagation()}>
              <span>▶</span> Demo
            </a>
          )}
        </Box>
      </Box>

      {/* corner glow */}
      <Box sx={{ position:'absolute', bottom:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(234,0,42,.1)', filter:'blur(24px)' }}/>
    </Box>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [filter,   setFilter]   = useState('All')
  const [showAll,  setShowAll]  = useState(false)

  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter(p => p.category === filter)
  const displayed = showAll ? filtered : filtered.slice(0, 6)

  // scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.08 }
    )
    document.querySelectorAll('.pr-sr,.pr-sr-l,.pr-sr-r').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [filter])

  return (
    <>
      <style>{PROJ_CSS}</style>

      <Box id="projects" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:10, md:12 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        {/* BG */}
        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 55% 50% at 20% 40%,rgba(234,0,42,.1) 0%,transparent 60%),radial-gradient(ellipse 45% 45% at 85% 70%,rgba(234,0,42,.07) 0%,transparent 55%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.025, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute', borderRadius:'50%', zIndex:0, top:p.top, left:p.left, width:p.size, height:p.size, bgcolor:'rgba(234,0,42,.4)', animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}
        <Box sx={{ position:'absolute', left:{ xs:16, md:32 }, top:'10%', bottom:'10%', width:'1px', zIndex:0, background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.35) 30%,rgba(234,0,42,.35) 70%,transparent)' }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important' }}>

          {/* ── heading ── */}
          <Box className="pr-sr" sx={{ mb:{ xs:6, md:8 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem', letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5 }}>
              — Selected Work —
            </Typography>
            <Typography sx={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:{ xs:'2.4rem', md:'3.2rem' }, letterSpacing:'-1px', lineHeight:1.05,
              background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)', backgroundSize:'200% auto',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              animation:'shimmerText 5s linear infinite',
            }}>
              My Projects
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
          </Box>

          {/* ── filters ── */}
          <Box className="pr-sr" sx={{ display:'flex', gap:1.5, flexWrap:'wrap', justifyContent:'center', mb:{ xs:5, md:7 } }}>
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab${filter===f?' active':''}`}
                onClick={() => { setFilter(f); setShowAll(false) }}
              >
                {f}
              </button>
            ))}
          </Box>

          {/* ── grid ── */}
          <Box sx={{ display:'flex', flexWrap:'wrap', gap:3, justifyContent:'center' }}>
            {displayed.map((project, i) => (
              <Box key={project.id} sx={{ flex:'0 0 auto', width:{ xs:'100%', sm:'calc(50% - 12px)', lg:'calc(33.33% - 16px)' } }}>
                <ProjectCard project={project} index={i}/>
              </Box>
            ))}
          </Box>

          {/* ── show more / view all ── */}
          <Box className="pr-sr" sx={{ display:'flex', gap:3, justifyContent:'center', alignItems:'center', flexWrap:'wrap', mt:{ xs:6, md:8 } }}>
            {filtered.length > 6 && (
              <button
                className="view-all-btn"
                onClick={() => setShowAll(s => !s)}
                style={{ background:'transparent' }}
              >
                <span>{showAll ? '↑ Show Less' : `⊕ Load More (${filtered.length - displayed.length} left)`}</span>
              </button>
            )}
            <Link href="/projects" className="view-all-btn">
              <span>→ View All Projects</span>
            </Link>
          </Box>
        </Container>

        {/* marquee */}
        <Box sx={{ mt:{ xs:7, md:9 }, py:2.5, borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', overflow:'hidden', position:'relative', zIndex:2, background:'rgba(234,0,42,.04)' }}>
          <Box sx={{ display:'flex', animation:'marqueeScroll 30s linear infinite', whiteSpace:'nowrap' }}>
            {[...PROJECTS,...PROJECTS].map((p,i) => (
              <Box key={i} component="span" sx={{ display:'inline-flex', alignItems:'center', gap:1.5, mx:4, fontFamily:"'Syne'", fontWeight:700, fontSize:'.75rem', letterSpacing:'2px', textTransform:'uppercase', color:i%3===0?'#EA002A':'rgba(255,255,255,.18)' }}>
                {i%3===0?'◆':'·'} {p.title}
              </Box>
            ))}
          </Box>
        </Box>

        {/* bottom divider */}
        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  )
}