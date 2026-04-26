// src/components/layout/Navbar.js
'use client';

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Service', href: '#services' },
  { label: 'Resume', href: '#about' },
  { label: 'Project', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? 'rgba(10,10,10,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          borderBottom: scrolled ? '1px solid #1a1a1a' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
          
          {/* Logo */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#EA002A',
              fontFamily: 'Poppins',
              letterSpacing: 1,
            }}
          >
            Ahsan
          </Typography>

          {/* Desktop Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                href={link.href}
                sx={{
                  color: '#ccc',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': { color: '#EA002A' },
                }}
              >
                {link.label}
              </Button>
            ))}
          </Box>

          {/* Mobile Menu Icon */}
          <IconButton
            sx={{ display: { md: 'none' }, color: '#EA002A' }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <Box sx={{ width: 260, bgcolor: '#0a0a0a', height: '100%', pt: 2 }}>
          
          {/* Close Button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2 }}>
            <IconButton
              onClick={() => setMobileOpen(false)}
              sx={{ color: '#EA002A' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Links */}
          <List>
            {navLinks.map((link) => (
              <ListItem
                key={link.label}
                component="a"
                href={link.href}
                onClick={() => setMobileOpen(false)}
                sx={{ '&:hover': { bgcolor: '#1a1a1a' } }}
              >
                <ListItemText primary={link.label} sx={{ color: '#fff' }} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}