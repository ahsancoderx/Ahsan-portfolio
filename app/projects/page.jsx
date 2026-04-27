'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { PROJECTS } from '@/components/sections/ProjectsSection'

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0);opacity:.5; } 50%{ transform:translate(10px,-14px);opacity:1; } }
  @keyframes fadeUp        { from{opacity:0;transform:translateY(30px);} to{opacity:1;transform:none;} }
  @keyframes scanLine      { 0%{top:-5%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:105%;opacity:0;} }
  @keyframes tagFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }

  .allpr-sr { opacity:0; transform:translateY(36px); transition:opacity .7s ease,transform .7s ease; }
  .allpr-sr.in { opacity:1; transform:none; }

  .proj-card2 {
    position:relative; border-radius:20px; overflow:hidden;
    background:linear-gradient(145deg,#141414,#0d0d0d);
    border:1px solid rgba(234,0,42,.15);
    transition:transform .4s cubic-bezier(.34,1.3,.64,1), box-shadow .4s, border-color .3s;
    cursor:pointer; animation:fadeUp .55s ease both;
  }
  .proj-card2:hover {
    transform:translateY(-10px) scale(1.02);
    box-shadow:0 28px 70px rgba(0,0,0,.7),0 0 0 1px rgba(234,0,42,.45),0 0 50px rgba(234,0,42,.15);
    border-color:rgba(234,0,42,.5);
  }
  .proj-img2 { width:100%;height:200px;object-fit:cover;transition:transform .6s ease; }
  .proj-card2:hover .proj-img2 { transform:scale(1.07); }
  .proj-scan2 { position:absolute;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent);top:-5%;pointer-events:none;z-index:3;opacity:0;transition:opacity .3s; }
  .proj-card2:hover .proj-scan2 { opacity:1;animation:scanLine 2.5s linear infinite; }

  .proj-link2 {
    display:inline-flex;align-items:center;gap:6px;
    font-family:'DM Sans';font-size:.73rem;font-weight:700;
    padding:5px 13px;border-radius:20px;text-decoration:none;
    border:1px solid rgba(255,255,255,.1);color:#777;background:rgba(255,255,255,.03);
    transition:all .25s;cursor:pointer;
  }
  .proj-link2:hover { color:#fff;border-color:rgba(234,0,42,.4);background:rgba(234,0,42,.08); }
  .proj-link2.live2 { border-color:rgba(234,0,42,.3);color:#EA002A;background:rgba(234,0,42,.07); }
  .proj-link2.live2:hover { background:rgba(234,0,42,.18);box-shadow:0 0 14px rgba(234,0,42,.35); }

  .proj-tag2 { font-family:'DM Sans';font-size:.67rem;font-weight:600;padding:3px 9px;border-radius:20px;border:1px solid rgba(234,0,42,.28);background:rgba(234,0,42,.06);color:#EA002A;display:inline-block; }

  .filter-tab2 { font-family:'DM Sans';font-weight:600;font-size:.77rem;padding:7px 18px;border-radius:30px;border:1px solid rgba(255,255,255,.08);background:transparent;color:#555;cursor:pointer;transition:all .25s;white-space:nowrap;letter-spacing:.5px;text-transform:uppercase; }
  .filter-tab2:hover { color:#fff;border-color:rgba(234,0,42,.35);background:rgba(234,0,42,.06); }
  .filter-tab2.active { background:#EA002A;border-color:#EA002A;color:#fff;box-shadow:0 0 16px rgba(234,0,42,.4); }

  .search-input {
    background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);
    border-radius:10px;padding:10px 16px;color:#fff;
    font-family:'DM Sans';font-size:.9rem;width:100%;outline:none;
    transition:border-color .25s,box-shadow .25s;
  }
  .search-input::placeholder { color:#444; }
  .search-input:focus { border-color:rgba(234,0,42,.45);box-shadow:0 0 0 3px rgba(234,0,42,.12); }

  .back-btn {
    display:inline-flex;align-items:center;gap:8px;
    font-family:'DM Sans';font-weight:600;font-size:.85rem;
    color:#666;text-decoration:none;transition:color .25s;
    padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.07);
  }
  .back-btn:hover { color:#EA002A;border-color:rgba(234,0,42,.3); }
`

const FILTERS = ['All', 'Full-Stack', 'Frontend', 'SaaS', 'AI / ML']
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id:i,top:`${Math.random()*100}%`,left:`${Math.random()*100}%`,
  size:`${2+Math.random()*3}px`,delay:`${Math.random()*7}s`,dur:`${5+Math.random()*9}s`,
}))

function AllProjectCard({ project, index }) {
  const [imgErr, setImgErr] = useState(false)

  const openUrl = (e, url) => {
    e.stopPropagation()
    e.preventDefault()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Link href={`/projects/${project.id}`} style={{ textDecoration:'none', display:'block' }}>
      <Box className="proj-card2" style={{ animationDelay:`${(index%6)*0.08}s` }}>
        <Box sx={{ position:'relative', overflow:'hidden', height:200 }}>
          {!imgErr && project.image
            ? <img src={project.image} alt={project.title} className="proj-img2" onError={() => setImgErr(true)}/>
            : <Box sx={{ width:'100%',height:'100%',background:project.fallbackColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
                <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'2rem',color:'rgba(234,0,42,.2)' }}>{project.title.slice(0,2).toUpperCase()}</Typography>
              </Box>
          }
          <Box sx={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,10,10,.9) 100%)' }}/>
          <Box className="proj-scan2"/>
          {project.featured && (
            <Box sx={{ position:'absolute',top:12,left:12,zIndex:4,px:1.5,py:.5,borderRadius:'20px',background:'linear-gradient(90deg,rgba(234,0,42,.9),rgba(180,0,20,.9))',boxShadow:'0 0 12px rgba(234,0,42,.4)' }}>
              <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.62rem',fontWeight:700,color:'#fff',letterSpacing:'1px',textTransform:'uppercase' }}>★ Featured</Typography>
            </Box>
          )}
          <Box sx={{ position:'absolute',top:12,right:12,zIndex:4,display:'flex',alignItems:'center',gap:.5,px:1.2,py:.4,borderRadius:'20px',background:'rgba(10,10,10,.8)',border:'1px solid rgba(255,255,255,.08)',backdropFilter:'blur(8px)' }}>
            <Box sx={{ width:6,height:6,borderRadius:'50%',bgcolor:project.status==='Live'?'#22c55e':project.status==='Beta'?'#f59e0b':'#888',boxShadow:project.status==='Live'?'0 0 6px #22c55e':'none' }}/>
            <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.62rem',fontWeight:700,color:'#aaa' }}>{project.status}</Typography>
          </Box>
        </Box>

        <Box sx={{ p:'18px 20px 20px' }}>
          <Box sx={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',mb:.5 }}>
            <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'1rem',color:'#fff',letterSpacing:'-.3px',lineHeight:1.2 }}>{project.title}</Typography>
            <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.7rem',color:'#444',fontWeight:600,flexShrink:0,ml:1 }}>{project.year}</Typography>
          </Box>
          <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.76rem',color:'#EA002A',fontWeight:600,mb:1 }}>{project.subtitle}</Typography>
          <Box sx={{ width:24,height:'2px',borderRadius:2,background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))',mb:1.5 }}/>
          <Typography sx={{ fontFamily:"'DM Sans'",color:'#666',fontSize:'.82rem',lineHeight:1.7,mb:2,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden' }}>
            {project.description}
          </Typography>
          <Box sx={{ display:'flex',flexWrap:'wrap',gap:.6,mb:2 }}>
            {project.tags.slice(0,3).map(t => <span key={t} className="proj-tag2">{t}</span>)}
            {project.tags.length>3 && <span className="proj-tag2">+{project.tags.length-3}</span>}
          </Box>
          <Box sx={{ display:'flex',flexWrap:'wrap',gap:.75 }} onClick={e => e.preventDefault()}>
            {project.liveUrl && (
              <span className="proj-link2 live2" onClick={e => openUrl(e, project.liveUrl)}>🔴 Live</span>
            )}
            {project.githubUrl && (
              <span className="proj-link2" onClick={e => openUrl(e, project.githubUrl)}>⌥ GitHub</span>
            )}
            {project.videoUrl && (
              <span className="proj-link2" onClick={e => openUrl(e, project.videoUrl)}>▶ Demo</span>
            )}
          </Box>
        </Box>
        <Box sx={{ position:'absolute',bottom:-18,right:-18,width:70,height:70,borderRadius:'50%',background:'rgba(234,0,42,.09)',filter:'blur(20px)' }}/>
      </Box>
    </Link>
  )
}

export default function AllProjectsPage() {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = PROJECTS
    .filter(p => filter==='All' || p.category===filter)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('in') }),
      { threshold:0.05 }
    )
    document.querySelectorAll('.allpr-sr').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <>
      <style>{PAGE_CSS}</style>
      <Box sx={{ minHeight:'100vh', bgcolor:'#0a0a0a', pt:{ xs:10, md:12 }, pb:12, position:'relative', overflow:'hidden', fontFamily:"'DM Sans'" }}>

        <Box sx={{ position:'absolute',inset:0,zIndex:0,background:`radial-gradient(ellipse 60% 50% at 70% 30%,rgba(234,0,42,.1) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 15% 75%,rgba(234,0,42,.07) 0%,transparent 55%)` }}/>
        <Box sx={{ position:'absolute',inset:0,zIndex:0,opacity:.022,backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`,backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute',borderRadius:'50%',zIndex:0,top:p.top,left:p.left,width:p.size,height:p.size,bgcolor:'rgba(234,0,42,.4)',animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        <Container sx={{ position:'relative',zIndex:2,maxWidth:'1200px !important' }}>
          <Box className="allpr-sr" sx={{ mb:4 }}>
            <Link href="/" className="back-btn">← Back to Portfolio</Link>
          </Box>

          <Box className="allpr-sr" sx={{ mb:{ xs:6, md:8 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'",fontWeight:600,fontSize:'.8rem',letterSpacing:'4px',textTransform:'uppercase',color:'#EA002A',mb:1.5 }}>
              — Complete Portfolio —
            </Typography>
            <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:{ xs:'2.2rem',md:'3rem' },letterSpacing:'-1px',lineHeight:1.05,background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmerText 5s linear infinite' }}>
              All Projects
            </Typography>
            <Typography sx={{ color:'#444',fontFamily:"'DM Sans'",fontSize:'.9rem',mt:1.5 }}>
              {PROJECTS.length} projects · {PROJECTS.filter(p=>p.status==='Live').length} live
            </Typography>
          </Box>

          <Box className="allpr-sr" sx={{ mb:{ xs:5, md:7 } }}>
            <Box sx={{ maxWidth:400, mx:'auto', mb:3 }}>
              <input className="search-input" placeholder="Search projects or technologies…" value={search} onChange={e => setSearch(e.target.value)}/>
            </Box>
            <Box sx={{ display:'flex',gap:1.5,flexWrap:'wrap',justifyContent:'center' }}>
              {FILTERS.map(f => (
                <button key={f} className={`filter-tab2${filter===f?' active':''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </Box>
          </Box>

          {filtered.length === 0
            ? <Box sx={{ textAlign:'center',py:10 }}>
                <Typography sx={{ fontFamily:"'Syne'",color:'#333',fontSize:'1.2rem',mb:1 }}>No projects found</Typography>
                <Typography sx={{ fontFamily:"'DM Sans'",color:'#444',fontSize:'.85rem' }}>Try a different filter or search term</Typography>
              </Box>
            : <Box sx={{ display:'flex',flexWrap:'wrap',gap:3,justifyContent:'center' }}>
                {filtered.map((project, i) => (
                  <Box key={project.id} sx={{ flex:'0 0 auto',width:{ xs:'100%',sm:'calc(50% - 12px)',lg:'calc(33.33% - 16px)' } }}>
                    <AllProjectCard project={project} index={i}/>
                  </Box>
                ))}
              </Box>
          }
        </Container>
      </Box>
    </>
  )
}