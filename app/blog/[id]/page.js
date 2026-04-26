//app/blog/[id]/page.js
'use client'

import { useParams } from 'next/navigation'
import { Box, Container, Typography } from '@mui/material'
import Link from 'next/link'
import { BLOGS } from '@/data/blogs'

const POST_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap');

  @keyframes shimmerText { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes fadeUp      { from{opacity:0;transform:translateY(24px);} to{opacity:1;transform:none;} }

  /* ── Markdown content styles ── */
  .blog-content { color:#999; font-family:'DM Sans',sans-serif; font-size:1rem; line-height:1.85; }
  .blog-content h1,.blog-content h2,.blog-content h3,.blog-content h4 {
    font-family:'Syne',sans-serif; font-weight:800; color:#fff;
    margin:2.5rem 0 1rem; letter-spacing:-.5px; line-height:1.2;
  }
  .blog-content h2 { font-size:1.7rem; border-left:3px solid #EA002A; padding-left:16px; }
  .blog-content h3 { font-size:1.3rem; color:#ddd; }
  .blog-content p  { margin:0 0 1.4rem; }
  .blog-content ul,.blog-content ol { padding-left:1.8rem; margin:0 0 1.4rem; }
  .blog-content li { margin-bottom:.6rem; }
  .blog-content li::marker { color:#EA002A; }
  .blog-content strong { color:#fff; font-weight:700; }
  .blog-content em { color:#ccc; font-style:italic; }
  .blog-content a  { color:#EA002A; text-decoration:none; border-bottom:1px solid rgba(234,0,42,.3); transition:border-color .2s; }
  .blog-content a:hover { border-color:#EA002A; }
  .blog-content blockquote {
    border-left:3px solid #EA002A; margin:2rem 0;
    padding:1rem 1.5rem; background:rgba(234,0,42,.06);
    border-radius:0 12px 12px 0; color:#aaa; font-style:italic;
  }
  .blog-content hr { border:none; border-top:1px solid rgba(255,255,255,.08); margin:2.5rem 0; }

  /* code blocks */
  .blog-content pre {
    background:#0d0d0d; border:1px solid rgba(234,0,42,.2);
    border-radius:12px; padding:1.5rem; overflow-x:auto;
    margin:1.5rem 0; position:relative;
  }
  .blog-content pre code {
    font-family:'Fira Code',monospace; font-size:.83rem;
    color:#e0e0e0; background:none; padding:0; border-radius:0;
  }
  .blog-content code {
    font-family:'Fira Code',monospace; font-size:.83rem;
    background:rgba(234,0,42,.1); color:#EA002A;
    padding:2px 8px; border-radius:6px;
    border:1px solid rgba(234,0,42,.2);
  }

  .back-btn {
    display:inline-flex; align-items:center; gap:8px;
    font-family:'DM Sans'; font-size:.85rem; font-weight:600;
    color:#666; text-decoration:none; transition:color .2s;
    border:1px solid rgba(255,255,255,.08); padding:8px 16px;
    border-radius:10px; background:rgba(255,255,255,.03);
  }
  .back-btn:hover { color:#EA002A; border-color:rgba(234,0,42,.3); background:rgba(234,0,42,.05); }

  .related-card {
    border-radius:16px; overflow:hidden;
    background:linear-gradient(145deg,#141414,#0d0d0d);
    border:1px solid rgba(234,0,42,.12);
    text-decoration:none; display:block;
    transition:transform .35s, box-shadow .35s, border-color .3s;
  }
  .related-card:hover {
    transform:translateY(-6px);
    box-shadow:0 20px 50px rgba(0,0,0,.6),0 0 0 1px rgba(234,0,42,.35);
    border-color:rgba(234,0,42,.4);
  }
`

// ── Simple markdown to HTML parser ──────────────────────────────────────────
function parseMarkdown(md) {
  if (!md) return ''
  return md
    .trim()
    // code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="lang-${lang}">${code.replace(/</g,'&lt;').replace(/>/g,'&gt;').trim()}</code></pre>`
    )
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // headings
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,  '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,   '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
    // bold & italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,     '<em>$1</em>')
    // blockquote
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // hr
    .replace(/^---$/gm, '<hr/>')
    // unordered list
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // paragraphs — wrap lines not already in tags
    .replace(/^(?!<[a-z])(.*[^\s].*)$/gm, '<p>$1</p>')
    // clean extra blank lines
    .replace(/\n{3,}/g, '\n\n')
}

export default function BlogPostPage() {
  const { id } = useParams()
  const blog = BLOGS.find(b => b.id === id)

  if (!blog) {
    return (
      <Box sx={{ bgcolor:'#0a0a0a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:3 }}>
        <style>{POST_CSS}</style>
        <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'3rem', color:'rgba(234,0,42,.3)' }}>404</Typography>
        <Typography sx={{ fontFamily:"'Syne'", fontWeight:700, color:'#fff', fontSize:'1.5rem' }}>Blog post not found</Typography>
        <Link href="/blog" className="back-btn">← Back to Blog</Link>
      </Box>
    )
  }

  const related = BLOGS.filter(b => b.id !== blog.id && (b.category === blog.category || b.tags.some(t => blog.tags.includes(t)))).slice(0, 3)
  const html = parseMarkdown(blog.content)

  return (
    <>
      <style>{POST_CSS}</style>

      <Box sx={{ bgcolor:'#0a0a0a', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif" }}>

        {/* ── Hero ── */}
        <Box sx={{
          pt:{ xs:13, md:15 }, pb:{ xs:6, md:8 },
          background:'radial-gradient(ellipse 70% 60% at 50% 0%,rgba(234,0,42,.1) 0%,transparent 65%)',
          borderBottom:'1px solid rgba(255,255,255,.05)',
        }}>
          <Container sx={{ maxWidth:'800px !important' }}>

            {/* back button */}
            <Box sx={{ mb:4 }}>
              <Link href="/blog" className="back-btn">← Back to Blog</Link>
            </Box>

            {/* category tag */}
            <Box sx={{ mb:2 }}>
              <Box component="span" sx={{
                fontFamily:"'DM Sans'", fontSize:'.7rem', fontWeight:700,
                px:1.5, py:.5, borderRadius:'20px',
                border:'1px solid rgba(234,0,42,.4)', background:'rgba(234,0,42,.1)',
                color:'#EA002A', letterSpacing:'1px', textTransform:'uppercase',
              }}>
                {blog.category}
              </Box>
            </Box>

            {/* title */}
            <Typography sx={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              fontSize:{ xs:'2rem', md:'3rem' }, letterSpacing:'-1.5px', lineHeight:1.1,
              color:'#fff', mb:1.5,
              animation:'fadeUp .6s ease forwards',
            }}>
              {blog.title}
            </Typography>

            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'1.05rem', color:'#EA002A', mb:3 }}>
              {blog.subtitle}
            </Typography>

            {/* meta row */}
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:2.5, alignItems:'center', mb:4 }}>
              {[
                { label: new Date(blog.date).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' }) },
                { label: blog.readTime },
              ].map((item, i) => (
                <Box key={i} sx={{ display:'flex', alignItems:'center', gap:.8 }}>
                  <Box sx={{ width:5, height:5, borderRadius:'50%', bgcolor:'#EA002A' }}/>
                  <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.82rem', color:'#555', fontWeight:500 }}>
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* tags */}
            <Box sx={{ display:'flex', flexWrap:'wrap', gap:1 }}>
              {blog.tags.map(t => (
                <Box key={t} component="span" sx={{
                  fontFamily:"'DM Sans'", fontSize:'.7rem', fontWeight:600,
                  px:1.2, py:.4, borderRadius:'8px',
                  background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', color:'#555',
                }}>
                  {t}
                </Box>
              ))}
            </Box>
          </Container>
        </Box>

        {/* ── Cover image ── */}
        <Container sx={{ maxWidth:'800px !important', py:0 }}>
          <Box sx={{ height:{ xs:220, md:380 }, borderRadius:'0 0 20px 20px', overflow:'hidden' }}>
            <Box sx={{
              width:'100%', height:'100%',
              background: blog.fallbackColor,
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'5rem', color:'rgba(234,0,42,.15)' }}>
                {blog.title.slice(0,2).toUpperCase()}
              </Typography>
            </Box>
          </Box>
        </Container>

        {/* ── Article content ── */}
        <Container sx={{ maxWidth:'800px !important', py:{ xs:6, md:8 } }}>
          <Box
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Container>

        {/* ── Related articles ── */}
        {related.length > 0 && (
          <Box sx={{ borderTop:'1px solid rgba(255,255,255,.06)', py:{ xs:8, md:10 } }}>
            <Container sx={{ maxWidth:'1100px !important' }}>
              <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.4rem', color:'#fff', mb:4 }}>
                Related Articles
              </Typography>
              <Box sx={{ display:'grid', gridTemplateColumns:{ xs:'1fr', sm:'1fr 1fr', md:'1fr 1fr 1fr' }, gap:3 }}>
                {related.map(rel => (
                  <Link key={rel.id} href={`/blog/${rel.id}`} className="related-card">
                    <Box sx={{ height:130, background:rel.fallbackColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'1.8rem', color:'rgba(234,0,42,.2)' }}>
                        {rel.title.slice(0,2).toUpperCase()}
                      </Typography>
                    </Box>
                    <Box sx={{ p:'16px 18px 18px' }}>
                      <Box component="span" sx={{ fontFamily:"'DM Sans'", fontSize:'.63rem', fontWeight:700, px:1, py:.3, borderRadius:'20px', border:'1px solid rgba(234,0,42,.3)', background:'rgba(234,0,42,.07)', color:'#EA002A', letterSpacing:'1px', textTransform:'uppercase' }}>
                        {rel.category}
                      </Box>
                      <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, fontSize:'.95rem', color:'#fff', mt:1.2, mb:.5, lineHeight:1.25 }}>
                        {rel.title}
                      </Typography>
                      <Typography sx={{ fontFamily:"'DM Sans'", fontSize:'.78rem', color:'#EA002A', fontWeight:600 }}>
                        {rel.readTime} →
                      </Typography>
                    </Box>
                  </Link>
                ))}
              </Box>
            </Container>
          </Box>
        )}

        {/* ── Back to blog ── */}
        <Box sx={{ textAlign:'center', pb:{ xs:10, md:14 } }}>
          <Link href="/blog" className="back-btn" style={{ display:'inline-flex' }}>
            ← Back to All Articles
          </Link>
        </Box>
      </Box>
    </>
  )
}