// src/components/sections/BlogSection.js
'use client'
import { useEffect, useState } from 'react'
import { Box, Container, Grid, Button } from '@mui/material'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import SectionTitle from '@/components/ui/SectionTitle'
import BlogCard from '@/components/ui/BlogCard'

export default function BlogSection() {
  const [blogs, setBlogs] = useState([])

  useEffect(() => {
    fetch('/api/blogs')
      .then((r) => r.json())
      .then((data) => {
        // Guard: always use an array — API may return {} on error
        const arr = Array.isArray(data) ? data : []
        setBlogs(arr.slice(0, 3))
      })
      .catch(() => setBlogs([]))
  }, [])

  if (blogs.length === 0) return null

  return (
    <Box id="blog" className="section" sx={{ background: 'linear-gradient(180deg, #050505 0%, #000 100%)' }}>
      <Container maxWidth="lg">
        <SectionTitle title="Latest Blog" subtitle="Thoughts & tutorials" />
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {blogs.map((blog, i) => (
            <Grid item xs={12} sm={6} md={4} key={blog._id}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            component={Link} href="/blog" variant="outlined" endIcon={<ArrowForwardIcon />}
            sx={{ color: '#E63946', borderColor: 'rgba(230,57,70,0.4)', px: 4, py: 1.5, fontWeight: 600,
              '&:hover': { background: 'rgba(230,57,70,0.08)', borderColor: '#E63946' } }}
          >
            View All Articles
          </Button>
        </Box>
      </Container>
    </Box>
  )
}