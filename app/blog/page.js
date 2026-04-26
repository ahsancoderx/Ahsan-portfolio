'use client'

import { useState, useEffect } from 'react'
import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { BLOGS } from '@/data/blogs'

// ─── CSS ─────────────────────────────────────────────────────────────────────
const BLOG_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText   { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift { 0%,100%{ transform:translate(0,0);opacity:.5; } 50%{ transform:translate(10px,-14px);opacity:1; } }
  @keyframes scanLine      { 0%{top:-5%;opacity:0;} 10%{opacity:1;} 90%{opacity:1;} 100%{top:105%;opacity:0;} }
  @keyframes tagFloat      { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-4px);} }
  @keyframes fadeUp        { from{opacity:0;transform:translateY(32px);} to{opacity:1;transform:none;} }
  @keyframes glowPulse     { 0%,100%{box-shadow:0 0 0 0 rgba(234,0,42,0);} 50%{box-shadow:0 0 0 6px rgba(234,0,42,.18);} }
  @keyframes marqueeScroll { from{transform:translateX(0);} to{transform:translateX(-50%);} }

  /* ── scroll reveal — starts visible so cards always show ── */
  .bl-sr {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity .7s ease, transform .7s ease;
  }
  .bl-sr.in {
    opacity: 1 !important;
    transform: none !important;
  }
  /* stagger delays */
  .bl-d0{transition-delay:.04s} .bl-d1{transition-delay:.12s}
  .bl-d2{transition-delay:.20s} .bl-d3{transition-delay:.28s}
  .bl-d4{transition-delay:.36s} .bl-d5{transition-delay:.44s}

  /* ── blog card ── */
  .blog-card {
    position:relative; border-radius:20px; overflow:hidden;
    background:linear-gradient(145deg,#141414,#0d0d0d);
    border:1px solid rgba(234,0,42,.16);
    transition:transform .4s cubic-bezier(.34,1.3,.64,1), box-shadow .4s, border-color .3s;
    text-decoration:none; display:flex; flex-direction:column; height:100%;
  }
  .blog-card:hover {
    transform:translateY(-10px) scale(1.018);
    box-shadow:0 28px 70px rgba(0,0,0,.7),0 0 0 1px rgba(234,0,42,.45),0 0 50px rgba(234,0,42,.14);
    border-color:rgba(234,0,42,.5);
  }
  .blog-card:hover .blog-img      { transform:scale(1.08); }
  .blog-card:hover .blog-scan     { opacity:1; animation:scanLine 2.5s linear infinite; }
  .blog-card:hover .blog-arrow    { transform:translateX(5px); }
  .blog-card:hover .blog-corner   { opacity:1; }

  .blog-img {
    width:100%; height:100%; object-fit:cover;
    transition:transform .65s ease; display:block;
  }
  .blog-scan {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(234,0,42,.6),transparent);
    top:-5%; pointer-events:none; z-index:3; opacity:0; transition:opacity .3s;
  }
  .blog-tag-cat {
    font-family:'DM Sans'; font-size:.65rem; font-weight:700;
    padding:4px 11px; border-radius:20px;
    border:1px solid rgba(234,0,42,.4); background:rgba(234,0,42,.1);
    color:#EA002A; display:inline-block; letter-spacing:.5px;
    text-transform:uppercase; animation:tagFloat 3s ease-in-out infinite;
  }
  .blog-tag-tech {
    font-family:'DM Sans'; font-size:.63rem; font-weight:600;
    padding:2px 9px; border-radius:6px;
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07);
    color:#555; display:inline-block;
  }
  .blog-arrow { transition:transform .3s ease; display:inline-block; }
  .blog-corner {
    position:absolute; bottom:-22px; right:-22px;
    width:80px; height:80px; border-radius:50%;
    background:rgba(234,0,42,.1); filter:blur(26px);
    opacity:.5; transition:opacity .35s;
  }

  /* ── number badge ── */
  .blog-number {
    position:absolute; top:10px; right:14px; z-index:4;
    font-family:'Syne'; font-weight:800; font-size:2.8rem;
    color:rgba(234,0,42,.1); line-height:1; pointer-events:none;
    transition:color .35s;
  }
  .blog-card:hover .blog-number { color:rgba(234,0,42,.2); }

  /* ── filter tabs ── */
  .filter-pill {
    font-family:'DM Sans'; font-weight:600; font-size:.75rem;
    padding:7px 18px; border-radius:30px;
    border:1px solid rgba(255,255,255,.08); background:transparent;
    color:#555; cursor:pointer; transition:all .25s;
    letter-spacing:.5px; text-transform:uppercase; white-space:nowrap;
  }
  .filter-pill:hover { color:#fff; border-color:rgba(234,0,42,.35); background:rgba(234,0,42,.07); }
  .filter-pill.active { background:#EA002A; border-color:#EA002A; color:#fff; box-shadow:0 0 16px rgba(234,0,42,.45); animation:glowPulse 2s infinite; }

  /* ── search ── */
  .blog-search {
    background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1);
    border-radius:12px; padding:11px 20px;
    font-family:'DM Sans'; font-size:.92rem; color:#fff;
    outline:none; width:100%; max-width:360px;
    transition:border .28s, box-shadow .28s;
  }
  .blog-search:focus { border-color:rgba(234,0,42,.5); box-shadow:0 0 0 3px rgba(234,0,42,.12); }
  .blog-search::placeholder { color:#444; }

  /* featured card — wider */
  .blog-featured-wrap { grid-column: span 2; }
  @media(max-width:768px){ .blog-featured-wrap { grid-column: span 1; } }
`

// ─── Particles ────────────────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  top:   `${Math.random() * 100}%`,
  left:  `${Math.random() * 100}%`,
  size:  `${2 + Math.random() * 3}px`,
  delay: `${Math.random() * 7}s`,
  dur:   `${5 + Math.random() * 9}s`,
}))

// ─── Blog Card ────────────────────────────────────────────────────────────────
function BlogCard({ blog, index, featured = false }) {
  const [imgErr, setImgErr] = useState(false)

  return (
    <Link
      href={`/blog/${blog.id}`}
      className={`blog-card bl-sr bl-d${Math.min(index, 5)}${featured ? ' blog-featured-wrap' : ''}`}
    >
      {/* ── image ── */}
      <Box sx={{ position:'relative', height: featured ? 260 : 210, overflow:'hidden', bgcolor:'#111', flexShrink:0 }}>
        {!imgErr && blog.image
          ? <img src={blog.image} alt={blog.title} className="blog-img" onError={() => setImgErr(true)}/>
          : <Box sx={{
              width:'100%', height:'100%',
              background: blog.fallbackColor,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize: featured ? '3rem' : '2.2rem', color:'rgba(234,0,42,.18)', userSelect:'none' }}>
                {blog.title.slice(0,2).toUpperCase()}
              </Typography>
            </Box>
        }

        {/* overlay */}
        <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 45%,rgba(10,10,10,.85) 100%)' }}/>
        <Box className="blog-scan"/>

        {/* featured badge */}
        {blog.featured && (
          <Box sx={{
            position:'absolute', top:12, left:12, zIndex:4,
            px:1.5, py:.5, borderRadius:'20px',
            background:'linear-gradient(90deg,rgba(234,0,42,.9),rgba(180,0,20,.9))',
            boxShadow:'0 0 14px rgba(234,0,42,.5)',
          }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.62rem', fontWeight:700, color:'#fff', letterSpacing:'1px', textTransform:'uppercase' }}>
              ★ Featured
            </Typography>
          </Box>
        )}

        {/* read time */}
        <Box sx={{
          position:'absolute', bottom:12, right:12, zIndex:4,
          px:1.2, py:.4, borderRadius:'20px',
          background:'rgba(10,10,10,.85)', border:'1px solid rgba(255,255,255,.08)',
          backdropFilter:'blur(8px)',
        }}>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.62rem', fontWeight:700, color:'#aaa' }}>
            ⏱ {blog.readTime}
          </Typography>
        </Box>

        {/* ghost number */}
        <Box className="blog-number">{String(index + 1).padStart(2, '0')}</Box>
      </Box>

      {/* ── content ── */}
      <Box sx={{ p:'20px 22px 22px', display:'flex', flexDirection:'column', flex:1 }}>

        {/* category + date */}
        <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:1.5 }}>
          <span className="blog-tag-cat">{blog.category}</span>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.72rem', color:'#444', fontWeight:500 }}>
            {new Date(blog.date).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}
          </Typography>
        </Box>

        {/* red accent line */}
        <Box sx={{ width:28, height:'2px', borderRadius:2, background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.2))', mb:1.5 }}/>

        {/* title */}
        <Typography sx={{
          fontFamily:"'Syne'", fontWeight:800,
          fontSize: featured ? '1.2rem' : '1.05rem',
          color:'#fff', letterSpacing:'-.3px', lineHeight:1.25, mb:.8,
        }}>
          {blog.title}
        </Typography>

        {/* subtitle */}
        <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#EA002A', fontWeight:600, mb:1.2 }}>
          {blog.subtitle}
        </Typography>

        {/* excerpt */}
        <Typography sx={{
          fontFamily:"'DM Sans'", color:'#666', fontSize:'.83rem', lineHeight:1.75,
          mb:2, flex:1,
          display:'-webkit-box', WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient:'vertical', overflow:'hidden',
        }}>
          {blog.excerpt}
        </Typography>

        {/* tech tags */}
        <Box sx={{ display:'flex', flexWrap:'wrap', gap:.6, mb:2.5 }}>
          {blog.tags.slice(0, 3).map(t => (
            <span key={t} className="blog-tag-tech">{t}</span>
          ))}
          {blog.tags.length > 3 && (
            <span className="blog-tag-tech">+{blog.tags.length - 3}</span>
          )}
        </Box>

        {/* read more */}
        <Box sx={{ display:'flex', alignItems:'center', gap:.8 }}>
          <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', fontWeight:700, color:'#EA002A' }}>
            Read Article
          </Typography>
          <Typography className="blog-arrow" sx={{ color:'#EA002A', fontSize:'1rem', lineHeight:1 }}>→</Typography>
        </Box>
      </Box>

      <Box className="blog-corner"/>
    </Link>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const [category, setCategory] = useState('All')
  const [search,   setSearch]   = useState('')

  const CATEGORIES = ['All', ...Array.from(new Set(BLOGS.map(b => b.category)))]

  const filtered = BLOGS.filter(b => {
    const matchCat    = category === 'All' || b.category === category
    const matchSearch = !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    return matchCat && matchSearch
  })

  const featuredBlogs = BLOGS.filter(b => b.featured)

  // ── scroll reveal ──────────────────────────────────────────────────────────
  useEffect(() => {
    // Immediately reveal anything already in viewport
    const revealAll = () => {
      document.querySelectorAll('.bl-sr').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 100) {
          el.classList.add('in')
        }
      })
    }

    revealAll() // run immediately on mount

    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in') }),
      { threshold: 0.05, rootMargin: '0px 0px 80px 0px' }
    )
    document.querySelectorAll('.bl-sr').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [filtered.length, category]) // re-run when filter changes

  return (
    <>
      <style>{BLOG_CSS}</style>

      <Box sx={{ bgcolor:'#0a0a0a', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif", overflow:'hidden', position:'relative' }}>

        {/* ── Particles ── */}
        {PARTICLES.map(p => (
          <Box key={p.id} sx={{
            position:'fixed', borderRadius:'50%', zIndex:0, pointerEvents:'none',
            top:p.top, left:p.left, width:p.size, height:p.size,
            bgcolor:'rgba(234,0,42,.35)',
            animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite`,
          }}/>
        ))}

        {/* grid texture */}
        <Box sx={{
          position:'fixed', inset:0, zIndex:0, opacity:.022, pointerEvents:'none',
          backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`,
          backgroundSize:'48px 48px',
        }}/>

        {/* ── Hero ── */}
        <Box sx={{
          pt:{ xs:14, md:16 }, pb:{ xs:8, md:10 },
          textAlign:'center', position:'relative', zIndex:1,
          background:'radial-gradient(ellipse 65% 55% at 50% 0%,rgba(234,0,42,.13) 0%,transparent 65%)',
        }}>
          <Typography sx={{
            fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem',
            letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5,
            animation:'fadeUp .5s ease both',
          }}>
            — Thoughts & Tutorials —
          </Typography>

          <Typography sx={{
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:{ xs:'2.8rem', md:'4.2rem' },
            letterSpacing:'-2px', lineHeight:1,
            background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',
            backgroundSize:'200% auto',
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            animation:'shimmerText 5s linear infinite, fadeUp .6s .1s ease both',
            mb:2,
          }}>
            My Blog
          </Typography>

          <Typography sx={{
            fontFamily:"'DM Sans'", color:'#555', fontSize:'1rem',
            maxWidth:460, mx:'auto', lineHeight:1.75, mb:4,
            animation:'fadeUp .65s .2s ease both',
          }}>
            Web development tips, SEO strategies, and career advice from real project experience.
          </Typography>

          {/* decorative line */}
          <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mb:4, animation:'fadeUp .7s .25s ease both' }}>
            <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
            <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
            <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
          </Box>

          {/* search */}
          <Box sx={{ display:'flex', justifyContent:'center', animation:'fadeUp .75s .3s ease both' }}>
            <input
              className="blog-search"
              placeholder="Search articles or technologies…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </Box>
        </Box>

        {/* ── Main content ── */}
        <Container sx={{ position:'relative', zIndex:1, maxWidth:'1200px !important', pb:{ xs:10, md:14 } }}>

          {/* ── Featured section ── */}
          {category === 'All' && !search && featuredBlogs.length > 0 && (
            <Box sx={{ mb:{ xs:7, md:9 } }}>
              <Box sx={{ display:'flex', alignItems:'center', gap:1.5, mb:3 }}>
                <Box sx={{ width:4, height:24, borderRadius:2, bgcolor:'#EA002A', boxShadow:'0 0 10px rgba(234,0,42,.6)' }}/>
                <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.15rem', color:'#fff' }}>
                  Featured Articles
                </Typography>
              </Box>
              <Box sx={{
                display:'grid',
                gridTemplateColumns:{ xs:'1fr', md:'repeat(2, 1fr)' },
                gap:3,
              }}>
                {featuredBlogs.slice(0, 2).map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i} featured/>
                ))}
              </Box>
            </Box>
          )}

          {/* ── Filters ── */}
          <Box sx={{ display:'flex', gap:1.5, flexWrap:'wrap', mb:3 }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-pill${category === cat ? ' active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </Box>

          {/* count */}
          <Typography sx={{ fontFamily:"'DM Sans'", color:'#444', fontSize:'.8rem', mb:4 }}>
            {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
          </Typography>

          {/* ── Grid ── */}
          {filtered.length === 0
            ? <Box sx={{ textAlign:'center', py:14, border:'1px dashed rgba(255,255,255,.06)', borderRadius:'16px' }}>
                <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.5rem', color:'#333', mb:1 }}>No articles found</Typography>
                <Typography sx={{ fontFamily:"'DM Sans'", color:'#444', fontSize:'.9rem' }}>Try a different search or category</Typography>
              </Box>
            : <Box sx={{
                display:'grid',
                gridTemplateColumns:{ xs:'1fr', sm:'repeat(2, 1fr)', lg:'repeat(3, 1fr)' },
                gap:3,
              }}>
                {filtered.map((blog, i) => (
                  <BlogCard key={blog.id} blog={blog} index={i}/>
                ))}
              </Box>
          }
        </Container>

        {/* ── Marquee ── */}
        <Box sx={{
          borderTop:'1px solid rgba(255,255,255,.06)',
          borderBottom:'1px solid rgba(255,255,255,.06)',
          py:2.5, overflow:'hidden',
          background:'rgba(234,0,42,.04)', position:'relative', zIndex:1,
        }}>
          <Box sx={{ display:'flex', animation:'marqueeScroll 28s linear infinite', whiteSpace:'nowrap' }}>
            {[...BLOGS, ...BLOGS].map((b, i) => (
              <Box key={i} component="span" sx={{
                display:'inline-flex', alignItems:'center', gap:1.5, mx:4,
                fontFamily:"'Syne'", fontWeight:700, fontSize:'.75rem',
                letterSpacing:'2px', textTransform:'uppercase',
                color: i % 3 === 0 ? '#EA002A' : 'rgba(255,255,255,.18)',
              }}>
                {i % 3 === 0 ? '◆' : '·'} {b.title}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}