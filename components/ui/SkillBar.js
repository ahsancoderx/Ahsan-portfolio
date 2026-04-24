// src/components/ui/SkillBar.js
'use client'
import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'

export default function SkillBar({ skill }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Box
      ref={ref}
      sx={{
        p: 2.5,
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 2,
        '&:hover': { borderColor: 'rgba(234, 0, 42, 0.2)' },
        transition: 'border-color 0.2s',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600 }}>
          {skill.name}
        </Typography>
        <Typography variant="body2" sx={{ color: ' #EA002A', fontWeight: 700 }}>
          {skill.proficiency}%
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ background: 'rgba(255,255,255,0.06)', borderRadius: 2, height: 6, overflow: 'hidden' }}>
        <Box
          sx={{
            height: '100%',
            width: visible ? `${skill.proficiency}%` : '0%',
            background: 'linear-gradient(90deg, #EA002A, #FF6B6B)',
            borderRadius: 2,
            transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 8px rgba(234, 0, 42, 0.5)',
          }}
        />
      </Box>
    </Box>
  )
}