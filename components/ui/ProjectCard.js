// src/components/ui/ProjectCard.js
'use client'
import { Box, Typography, Chip, IconButton } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import GitHubIcon from '@mui/icons-material/GitHub'
import Image from 'next/image'

export default function ProjectCard({ project }) {
  const handleClick = async () => {
    // Track project click
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'project_click', metadata: { projectId: project._id, projectTitle: project.title } }),
    })
  }

  return (
    <Box
      sx={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 3,
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: 'rgba(234, 0, 42, 0.3)',
          transform: 'translateY(-6px)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
        },
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
          />
        ) : (
          <Box sx={{ height: '100%', background: 'linear-gradient(135deg, #1a0a0b, #2d0f12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 60, opacity: 0.4 }}>🖥️</Typography>
          </Box>
        )}
        {/* Overlay on hover */}
        <Box sx={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,
          transition: 'all 0.3s ease',
          '&:hover': { background: 'rgba(0,0,0,0.6)' },
          '& .action-btns': { opacity: 0, transform: 'translateY(10px)', transition: 'all 0.3s' },
          '&:hover .action-btns': { opacity: 1, transform: 'translateY(0)' },
        }}>
          <Box className="action-btns" sx={{ display: 'flex', gap: 1 }}>
            {project.liveUrl && (
              <IconButton href={project.liveUrl} target="_blank" onClick={handleClick}
                sx={{ background: ' #EA002A', color: '#fff', '&:hover': { background: '#c1121f' } }}>
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            )}
            {project.githubUrl && (
              <IconButton href={project.githubUrl} target="_blank" onClick={handleClick}
                sx={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(10px)' }}>
                <GitHubIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>
        {project.featured && (
          <Chip label="Featured" size="small"
            sx={{ position: 'absolute', top: 12, right: 12, background: ' #EA002A', color: '#fff', fontWeight: 600, fontSize: 10 }} />
        )}
      </Box>

      {/* Content */}
      <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>{project.title}</Typography>
        <Typography variant="body2" sx={{ color: '#888', mb: 2, flex: 1, lineHeight: 1.6 }}>{project.description}</Typography>
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
          {project.technologies?.slice(0, 5).map((tech) => (
            <Chip key={tech} label={tech} size="small"
              sx={{ background: 'rgba(234, 0, 42, 0.08)', color: ' #EA002A', border: '1px solid rgba(234, 0, 42, 0.15)', fontSize: 10 }} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}