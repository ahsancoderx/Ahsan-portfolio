'use client'

import { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Box, IconButton, Drawer } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Home',    href: '/#home',     section: 'home'     },
  { label: 'Service', href: '/#services', section: 'services' },
  { label: 'Resume',  href: '/#about',    section: 'about'    },
  { label: 'Project', href: '/#projects', section: 'projects' },
  { label: 'Blog',    href: '/blog',      section: 'blog'     },
  { label: 'Contact', href: '/#contact',  section: 'contact'  },
]

const NAV_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes glowPulse {
    0%,100% { box-shadow: 0 0 8px rgba(234,0,42,.4); }
    50%      { box-shadow: 0 0 18px rgba(234,0,42,.8); }
  }

  .nav-link {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: .92rem;
    color: #888;
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 8px;
    transition: all .25s;
    position: relative;
    letter-spacing: .3px;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: 2px;
    left: 50%;
    right: 50%;
    height: 1.5px;
    background: #EA002A;
    border-radius: 2px;
    transition: left .3s, right .3s;
  }
  .nav-link:hover { color: #fff; }
  .nav-link:hover::after { left: 14px; right: 14px; }
  .nav-link.active { color: #EA002A; }
  .nav-link.active::after { left: 14px; right: 14px; }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 24px;
    color: #aaa;
    text-decoration: none;
    font-family: 'DM Sans';
    font-weight: 500;
    font-size: .95rem;
    transition: all .25s;
    border-left: 2px solid transparent;
  }
  .mobile-link:hover {
    color: #fff;
    background: rgba(234,0,42,.06);
    border-left-color: #EA002A;
  }
  .mobile-link.active {
    color: #EA002A;
    border-left-color: #EA002A;
    background: rgba(234,0,42,.08);
  }
`

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled,   setScrolled]   = useState(false)
  const [active,     setActive]     = useState('home')
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      for (const sec of [...NAV_LINKS.map(l => l.section)].reverse()) {
        const el = document.getElementById(sec)
        if (el && window.scrollY >= el.offsetTop - 120) { setActive(sec); break }
      }
    }
    onScroll() // run once on mount
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (pathname === '/blog' || pathname?.startsWith('/blog/')) setActive('blog')
  }, [pathname])

  const handleNavClick = (e, link) => {
    if (link.href.startsWith('/#')) {
      e.preventDefault()
      setMobileOpen(false)
      if (pathname !== '/') { window.location.href = link.href; return }
      const el = document.getElementById(link.section)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      setMobileOpen(false)
    }
  }

  return (
    <>
      <style>{NAV_CSS}</style>

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          // ✅ Always visible — semi-transparent at top, solid when scrolled
          background: scrolled
            ? 'rgba(10,10,10,0.97)'
            : 'rgba(10,10,10,0.55)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(234,0,42,.12)'
            : '1px solid rgba(255,255,255,.04)',
          transition: 'background 0.35s ease, border-color 0.35s ease',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, minHeight: { xs: 64, md: 72 } }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }} onClick={e => handleNavClick(e, { href: '/#home', section: 'home' })}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'linear-gradient(135deg,#EA002A,#c0001f)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'glowPulse 3s ease-in-out infinite',
              }}>
                <Typography sx={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: '.85rem', color: '#fff' }}>A</Typography>
              </Box>
              <Typography sx={{
                fontFamily: "'Syne'", fontWeight: 800, fontSize: '1.3rem',
                color: '#fff', letterSpacing: '-.5px',
              }}>
                hsan<Box component="span" sx={{ color: '#EA002A' }}>.</Box>
              </Typography>
            </Box>
          </Link>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: .5 }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link${active === link.section ? ' active' : ''}`}
                onClick={e => handleNavClick(e, link)}
              >
                {link.label}
              </Link>
            ))}
          </Box>

          {/* Hire Me — desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Box
              component="a"
              href="/#contact"
              onClick={e => handleNavClick(e, { href: '/#contact', section: 'contact' })}
              sx={{
                fontFamily: "'DM Sans'", fontWeight: 700, fontSize: '.82rem',
                px: 2.5, py: 1, borderRadius: '10px',
                background: 'linear-gradient(135deg,#EA002A,#c0001f)',
                color: '#fff', textDecoration: 'none', letterSpacing: '.5px',
                boxShadow: '0 0 18px rgba(234,0,42,.35)',
                transition: 'all .3s',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 0 28px rgba(234,0,42,.6)' },
              }}
            >
              Hire Me ✦
            </Box>
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { md: 'none' }, color: '#EA002A', border: '1px solid rgba(234,0,42,.3)', borderRadius: '10px', p: .8 }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{ sx: { background: '#0a0a0a', width: 280, borderLeft: '1px solid rgba(234,0,42,.15)' } }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,.06)' }}>
            <Typography sx={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
              Ahsan<Box component="span" sx={{ color: '#EA002A' }}>.</Box>
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#666', border: '1px solid rgba(255,255,255,.08)', borderRadius: '8px', p: .6 }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ flex: 1, pt: 2 }}>
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.label}
                href={link.href}
                className={`mobile-link${active === link.section ? ' active' : ''}`}
                onClick={e => handleNavClick(e, link)}
              >
                <Box sx={{
                  width: 28, height: 28, borderRadius: '7px',
                  background: active === link.section ? 'rgba(234,0,42,.15)' : 'rgba(255,255,255,.04)',
                  border: active === link.section ? '1px solid rgba(234,0,42,.3)' : '1px solid rgba(255,255,255,.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '.7rem', flexShrink: 0,
                }}>
                  {['🏠', '⚙️', '📄', '💼', '✍️', '📩'][i]}
                </Box>
                {link.label}
              </Link>
            ))}
          </Box>

          <Box sx={{ p: 3, borderTop: '1px solid rgba(255,255,255,.06)' }}>
            <Box
              component="a"
              href="/#contact"
              onClick={e => handleNavClick(e, { href: '/#contact', section: 'contact' })}
              sx={{
                display: 'block', textAlign: 'center',
                fontFamily: "'DM Sans'", fontWeight: 700, fontSize: '.9rem',
                py: 1.5, borderRadius: '12px',
                background: 'linear-gradient(135deg,#EA002A,#c0001f)',
                color: '#fff', textDecoration: 'none',
                boxShadow: '0 0 20px rgba(234,0,42,.4)',
              }}
            >
              ✦ Hire Me
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}