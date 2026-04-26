'use client'

import { useState } from 'react'
import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { PROJECTS } from '@/components/sections/ProjectsSection'

const DETAIL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0);opacity:.5; } 50%{ transform:translate(10px,-14px);opacity:1; } }
  @keyframes fadeUp        { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:none;} }
  @keyframes scanLine      { 0%{top:-5%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:105%;opacity:0;} }
  @keyframes glowPulse     { 0%,100%{box-shadow:0 0 20px rgba(234,0,42,.3);} 50%{box-shadow:0 0 40px rgba(234,0,42,.6);} }
  @keyframes tagFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }

  .detail-img { width:100%;height:100%;object-fit:cover;transition:transform 8s ease; }
  .detail-img:hover { transform:scale(1.04); }

  .detail-link {
    display:inline-flex;align-items:center;gap:8px;
    font-family:'DM Sans';font-weight:700;font-size:.9rem;
    padding:11px 24px;border-radius:12px;text-decoration:none;transition:all .3s;
  }
  .detail-link.live-link { background:#EA002A;color:#fff;box-shadow:0 0 22px rgba(234,0,42,.45);animation:glowPulse 3s ease-in-out infinite; }
  .detail-link.live-link:hover { background:#c0392b;transform:translateY(-3px);box-shadow:0 6px 30px rgba(234,0,42,.6);animation:none; }
  .detail-link.ghost-link { border:1px solid rgba(255,255,255,.12);color:#ccc;background:rgba(255,255,255,.04); }
  .detail-link.ghost-link:hover { color:#fff;border-color:rgba(234,0,42,.45);background:rgba(234,0,42,.08);box-shadow:0 0 16px rgba(234,0,42,.25); }

  .detail-tag { font-family:'DM Sans';font-size:.76rem;font-weight:600;padding:5px 14px;border-radius:20px;border:1px solid rgba(234,0,42,.35);background:rgba(234,0,42,.08);color:#EA002A;display:inline-block;animation:tagFloat 3s ease-in-out infinite; }

  .stat-card { background:linear-gradient(135deg,rgba(234,0,42,.09) 0%,rgba(255,255,255,.02) 100%);border:1px solid rgba(234,0,42,.2);border-radius:14px;padding:20px 22px;text-align:center;transition:transform .3s,box-shadow .3s; }
  .stat-card:hover { transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.5),0 0 20px rgba(234,0,42,.2); }

  .section-card { background:linear-gradient(145deg,#141414,#0d0d0d);border:1px solid rgba(234,0,42,.15);border-radius:16px;padding:24px 26px;transition:border-color .3s; }
  .section-card:hover { border-color:rgba(234,0,42,.3); }

  .related-card { position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(145deg,#141414,#0d0d0d);border:1px solid rgba(234,0,42,.15);transition:transform .35s cubic-bezier(.34,1.3,.64,1),box-shadow .35s,border-color .3s;cursor:pointer;text-decoration:none;display:block; }
  .related-card:hover { transform:translateY(-7px) scale(1.02);box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 0 1px rgba(234,0,42,.4);border-color:rgba(234,0,42,.45); }
  .related-card img { width:100%;height:140px;object-fit:cover;transition:transform .5s; display:block; }
  .related-card:hover img { transform:scale(1.06); }

  .back-btn { display:inline-flex;align-items:center;gap:8px;font-family:'DM Sans';font-weight:600;font-size:.85rem;color:#666;text-decoration:none;transition:color .25s;padding:8px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.07); }
  .back-btn:hover { color:#EA002A;border-color:rgba(234,0,42,.3); }

  .video-frame { position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:16px;border:1px solid rgba(234,0,42,.2);box-shadow:0 0 40px rgba(0,0,0,.6); }
  .video-frame iframe { position:absolute;top:0;left:0;width:100%;height:100%; }

  .video-placeholder { position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,#111,#0d0d0d);cursor:pointer;transition:background .3s; }
  .video-placeholder:hover { background:linear-gradient(135deg,#1a0a0a,#110808); }
`

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id:i, top:`${Math.random()*100}%`, left:`${Math.random()*100}%`,
  size:`${2+Math.random()*2.5}px`, delay:`${Math.random()*7}s`, dur:`${5+Math.random()*9}s`,
}))

function getYouTubeId(url) {
  if (!url) return null
  const m = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return m ? m[1] : null
}

export default function ProjectDetailPage() {
  const params = useParams()
  const [imgErr, setImgErr] = useState(false)
  const [videoActive, setVideoActive] = useState(false)

  const project   = PROJECTS.find(p => p.id === params?.id)
  const related   = project ? PROJECTS.filter(p => p.id !== project.id && p.category === project.category).slice(0, 3) : []
  const youtubeId = project ? getYouTubeId(project.videoUrl) : null

  if (!project) {
    return (
      <>
        <style>{DETAIL_CSS}</style>
        <Box sx={{ minHeight:'100vh', bgcolor:'#0a0a0a', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:3 }}>
          <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'5rem', color:'rgba(234,0,42,.2)', lineHeight:1 }}>404</Typography>
          <Typography sx={{ fontFamily:"'Syne'", fontWeight:700, color:'#fff', fontSize:'1.4rem' }}>Project Not Found</Typography>
          <Typography sx={{ fontFamily:"'DM Sans'", color:'#555', fontSize:'.9rem' }}>
            ID &quot;{params?.id}&quot; does not match any project
          </Typography>
          <Link href="/projects" className="back-btn" style={{ marginTop:8 }}>← All Projects</Link>
        </Box>
      </>
    )
  }

  return (
    <>
      <style>{DETAIL_CSS}</style>

      <Box sx={{ minHeight:'100vh', bgcolor:'#0a0a0a', pt:{ xs:10, md:12 }, pb:12, position:'relative', overflow:'hidden', fontFamily:"'DM Sans'" }}>

        {/* BG */}
        <Box sx={{ position:'absolute',inset:0,zIndex:0,background:`radial-gradient(ellipse 55% 50% at 75% 25%,rgba(234,0,42,.12) 0%,transparent 60%),radial-gradient(ellipse 40% 40% at 10% 75%,rgba(234,0,42,.07) 0%,transparent 55%)` }}/>
        <Box sx={{ position:'absolute',inset:0,zIndex:0,opacity:.022,backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`,backgroundSize:'48px 48px' }}/>
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute',borderRadius:'50%',zIndex:0,top:p.top,left:p.left,width:p.size,height:p.size,bgcolor:'rgba(234,0,42,.38)',animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        <Container sx={{ position:'relative',zIndex:2,maxWidth:'1000px !important' }}>

          {/* back nav */}
          <Box sx={{ display:'flex',gap:2,mb:5,flexWrap:'wrap', animation:'fadeUp .4s ease' }}>
            <Link href="/" className="back-btn">← Portfolio</Link>
            <Link href="/projects" className="back-btn">⊞ All Projects</Link>
          </Box>

          {/* hero image */}
          <Box sx={{ borderRadius:'20px',overflow:'hidden',mb:5,border:'1px solid rgba(234,0,42,.2)',boxShadow:'0 0 60px rgba(0,0,0,.7)',position:'relative',animation:'fadeUp .6s ease' }}>
            {!imgErr && project.image
              ? <img src={project.image} alt={project.title} className="detail-img" style={{ height:400, display:'block' }} onError={() => setImgErr(true)}/>
              : <Box sx={{ height:400,background:project.fallbackColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'5rem',color:'rgba(234,0,42,.2)' }}>{project.title.slice(0,2).toUpperCase()}</Typography>
                </Box>
            }
            <Box sx={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent 40%,rgba(10,10,10,.85) 100%)' }}/>
            <Box sx={{ position:'absolute',left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,rgba(234,0,42,.5),transparent)',top:'-5%',animation:'scanLine 4s linear infinite',pointerEvents:'none',zIndex:2 }}/>
            {project.featured && (
              <Box sx={{ position:'absolute',top:18,left:18,zIndex:3,px:1.5,py:.5,borderRadius:'20px',background:'linear-gradient(90deg,rgba(234,0,42,.9),rgba(180,0,20,.9))',boxShadow:'0 0 14px rgba(234,0,42,.5)' }}>
                <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.65rem',fontWeight:700,color:'#fff',letterSpacing:'1px',textTransform:'uppercase' }}>★ Featured Project</Typography>
              </Box>
            )}
            <Box sx={{ position:'absolute',top:18,right:18,zIndex:3,display:'flex',alignItems:'center',gap:.6,px:1.5,py:.5,borderRadius:'20px',background:'rgba(10,10,10,.85)',border:'1px solid rgba(255,255,255,.1)',backdropFilter:'blur(8px)' }}>
              <Box sx={{ width:7,height:7,borderRadius:'50%',bgcolor:project.status==='Live'?'#22c55e':project.status==='Beta'?'#f59e0b':'#888',boxShadow:project.status==='Live'?'0 0 8px #22c55e':'none' }}/>
              <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.7rem',fontWeight:700,color:'#aaa' }}>{project.status}</Typography>
            </Box>
          </Box>

          {/* title + links */}
          <Box sx={{ animation:'fadeUp .65s .1s ease both' }}>
            <Box sx={{ display:'flex',flexWrap:'wrap',gap:1,alignItems:'center',mb:1 }}>
              <Box sx={{ px:1.5,py:.4,borderRadius:'20px',background:'rgba(234,0,42,.1)',border:'1px solid rgba(234,0,42,.3)' }}>
                <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.7rem',fontWeight:700,color:'#EA002A',letterSpacing:'.5px',textTransform:'uppercase' }}>{project.category}</Typography>
              </Box>
              <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.78rem',color:'#444',fontWeight:600 }}>{project.year}</Typography>
            </Box>

            <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:{ xs:'2rem',md:'2.8rem' },letterSpacing:'-1px',lineHeight:1.05,background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'shimmerText 5s linear infinite',mb:.8 }}>
              {project.title}
            </Typography>
            <Typography sx={{ fontFamily:"'DM Sans'",color:'#EA002A',fontWeight:600,fontSize:'1rem',mb:1 }}>{project.subtitle}</Typography>
            <Box sx={{ width:40,height:'3px',borderRadius:2,background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))',mb:3 }}/>

            <Box sx={{ display:'flex',flexWrap:'wrap',gap:2,mb:5 }}>
              {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noopener noreferrer" className="detail-link live-link">🔴 View Live Site</a>}
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="detail-link ghost-link">⌥ View on GitHub</a>}
              {project.videoUrl  && <a href={project.videoUrl}  target="_blank" rel="noopener noreferrer" className="detail-link ghost-link">▶ Watch Demo</a>}
            </Box>
          </Box>

          {/* stats */}
          <Box sx={{ display:'flex',flexWrap:'wrap',gap:2,mb:4,animation:'fadeUp .7s .15s ease both' }}>
            {[
              { label:'Category', value:project.category },
              { label:'Year',     value:project.year },
              { label:'Status',   value:project.status },
              { label:'Tech Stack', value:`${project.tags.length} Technologies` },
            ].map(s => (
              <Box key={s.label} className="stat-card" sx={{ flex:'1 1 130px' }}>
                <Typography sx={{ fontFamily:"'DM Sans'",fontSize:'.7rem',color:'#555',fontWeight:600,textTransform:'uppercase',letterSpacing:'1px',mb:.5 }}>{s.label}</Typography>
                <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'1rem',background:'linear-gradient(90deg,#fff,#EA002A)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent' }}>{s.value}</Typography>
              </Box>
            ))}
          </Box>

          {/* description */}
          <Box className="section-card" sx={{ mb:3,animation:'fadeUp .75s .2s ease both' }}>
            <Typography sx={{ fontFamily:"'Syne'",fontWeight:700,color:'#fff',fontSize:'1.05rem',mb:1.5 }}>About this Project</Typography>
            <Box sx={{ width:28,height:'2px',borderRadius:2,background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))',mb:2 }}/>
            <Typography sx={{ fontFamily:"'DM Sans'",color:'#888',fontSize:'.93rem',lineHeight:1.85 }}>{project.description}</Typography>
          </Box>

          {/* tech stack */}
          <Box className="section-card" sx={{ mb:3,animation:'fadeUp .8s .25s ease both' }}>
            <Typography sx={{ fontFamily:"'Syne'",fontWeight:700,color:'#fff',fontSize:'1.05rem',mb:1.5 }}>Tech Stack</Typography>
            <Box sx={{ width:28,height:'2px',borderRadius:2,background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))',mb:2 }}/>
            <Box sx={{ display:'flex',flexWrap:'wrap',gap:1 }}>
              {project.tags.map((t,i) => <span key={t} className="detail-tag" style={{ animationDelay:`${i*.25}s` }}>{t}</span>)}
            </Box>
          </Box>

          {/* video */}
          {project.videoUrl && (
            <Box sx={{ mb:5,animation:'fadeUp .85s .3s ease both' }}>
              <Typography sx={{ fontFamily:"'Syne'",fontWeight:700,color:'#fff',fontSize:'1.05rem',mb:2 }}>Demo Video</Typography>
              {youtubeId && videoActive
                ? <Box className="video-frame">
                    <iframe src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`} title="Demo" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen/>
                  </Box>
                : <Box className="video-frame" style={{ paddingBottom:'56.25%', height:0, cursor:'pointer' }} onClick={() => setVideoActive(true)}>
                    <Box className="video-placeholder">
                      <Box sx={{ width:72,height:72,borderRadius:'50%',background:'rgba(234,0,42,.9)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'0 0 30px rgba(234,0,42,.6)',mb:2 }}>
                        <Typography sx={{ fontSize:'1.8rem', ml:'.3em' }}>▶</Typography>
                      </Box>
                      <Typography sx={{ fontFamily:"'Syne'",fontWeight:700,color:'#fff',fontSize:'1rem',mb:.5 }}>Watch Demo</Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'",color:'#555',fontSize:'.8rem' }}>Click to play</Typography>
                    </Box>
                  </Box>
              }
            </Box>
          )}

          {/* related */}
          {related.length > 0 && (
            <Box sx={{ animation:'fadeUp .9s .35s ease both' }}>
              <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'1.3rem',color:'#fff',letterSpacing:'-.3px',mb:.5 }}>Related Projects</Typography>
              <Box sx={{ width:36,height:'2px',borderRadius:2,background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))',mb:3 }}/>
              <Box sx={{ display:'flex',flexWrap:'wrap',gap:3 }}>
                {related.map(rp => (
                  <Link key={rp.id} href={`/projects/${rp.id}`} className="related-card" style={{ flex:'0 0 auto', width:'calc(33.33% - 16px)', minWidth:180 }}>
                    <Box sx={{ position:'relative', overflow:'hidden', height:140 }}>
                      {rp.image
                        ? <img src={rp.image} alt={rp.title}/>
                        : <Box sx={{ width:'100%',height:'100%',background:rp.fallbackColor,display:'flex',alignItems:'center',justifyContent:'center' }}>
                            <Typography sx={{ fontFamily:"'Syne'",fontWeight:800,fontSize:'1.6rem',color:'rgba(234,0,42,.2)' }}>{rp.title.slice(0,2).toUpperCase()}</Typography>
                          </Box>
                      }
                      <Box sx={{ position:'absolute',inset:0,background:'linear-gradient(to bottom,transparent,rgba(10,10,10,.7) 100%)' }}/>
                    </Box>
                    <Box sx={{ p:'14px 16px 16px' }}>
                      <Typography sx={{ fontFamily:"'Syne'",fontWeight:700,color:'#fff',fontSize:'.9rem',mb:.3 }}>{rp.title}</Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'",color:'#EA002A',fontSize:'.74rem',fontWeight:600 }}>{rp.category}</Typography>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}