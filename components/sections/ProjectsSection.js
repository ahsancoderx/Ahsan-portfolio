'use client'

import { useEffect, useState } from 'react'
import { Box, Container, Grid, Button } from '@mui/material'
import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import ProjectCard from '@/components/ui/ProjectCard'

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch('/api/projects')
        const data = await res.json()

        // ✅ ALWAYS ensure array
        if (Array.isArray(data)) {
          setProjects(data)
        } else if (Array.isArray(data.projects)) {
          setProjects(data.projects)
        } else {
          setProjects([])
        }

      } catch (error) {
        console.error('Fetch failed:', error)
        setProjects([]) // ✅ prevent crash
      }
    }

    loadProjects()
  }, [])

  // ✅ SAFE slicing
  const displayed = showAll
    ? projects
    : projects.slice(0, 6)

  return (
    <Box id="projects" className="section" sx={{ background: '#000' }}>
      <Container maxWidth="lg">
        <SectionTitle
          title="My Projects"
          subtitle="Recent work I'm proud of"
        />

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {displayed.map((project, i) => (
            <Grid item xs={12} sm={6} lg={4} key={project._id || i}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: (i % 3) * 0.1,
                  duration: 0.5,
                }}
              >
                <ProjectCard project={project} />
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* ✅ SAFE condition */}
        {projects.length > 6 && (
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              variant="outlined"
              onClick={() => setShowAll(!showAll)}
              sx={{
                color: '#EA002A',
                borderColor: 'rgba(234, 0, 42, 0.4)',
                px: 4,
                py: 1.5,
                fontWeight: 600,
                '&:hover': {
                  background: 'rgba(234, 0, 42, 0.08)',
                  borderColor: '#EA002A',
                },
              }}
            >
              {showAll
                ? 'Show Less'
                : `View All (${projects.length})`}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}