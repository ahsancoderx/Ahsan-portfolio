// src/app/blog/page.js
'use client'
import { useState, useEffect } from 'react'
import { Container, Grid, Typography, Box, Chip, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { motion } from 'framer-motion'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import BlogCard from '@/components/ui/BlogCard'
import SectionTitle from '@/components/ui/SectionTitle'

export default function BlogPage() {
  const [blogs, setBlogs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => {
        setBlogs(data)
        setFiltered(data)
        setLoading(false)
      })
  }, [])

  // Collect all unique tags
  const allTags = ['All', ...new Set(blogs.flatMap((b) => b.tags || []))]

  useEffect(() => {
    let result = blogs
    if (activeTag !== 'All') result = result.filter((b) => b.tags?.includes(activeTag))
    if (search) result = result.filter((b) => b.title.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
  }, [search, activeTag, blogs])

  return (
    <>
      <Navbar />
      <Box sx={{ pt: 12, pb: 10, minHeight: '100vh', background: '#000' }}>
        <Container maxWidth="lg">
          <SectionTitle title="Blog" subtitle="Thoughts, tutorials & insights" />

          {/* Search */}
          <Box sx={{ my: 4, maxWidth: 500, mx: 'auto' }}>
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#E63946' }} />
                  </InputAdornment>
                ),
                sx: {
                  background: '#111',
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                },
              }}
            />
          </Box>

          {/* Tag filter */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 5, justifyContent: 'center' }}>
            {allTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                onClick={() => setActiveTag(tag)}
                sx={{
                  background: activeTag === tag ? '#E63946' : 'rgba(255,255,255,0.05)',
                  color: '#fff',
                  border: activeTag === tag ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  '&:hover': { background: '#E63946' },
                  transition: 'all 0.2s',
                }}
              />
            ))}
          </Box>

          {loading ? (
            <Typography align="center" sx={{ color: '#aaa', py: 10 }}>
              Loading...
            </Typography>
          ) : filtered.length === 0 ? (
            <Typography align="center" sx={{ color: '#aaa', py: 10 }}>
              No articles found.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filtered.map((blog, i) => (
                <Grid item xs={12} sm={6} md={4} key={blog._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <BlogCard blog={blog} />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      <Footer />
    </>
  )
}