// src/components/ui/SectionTitle.js
import { Box, Typography } from '@mui/material'

export default function SectionTitle({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: 'center', mb: 6 }}>
      <Typography
        variant="overline"
        sx={{ color: ' #EA002A', letterSpacing: 4, fontWeight: 600, display: 'block', mb: 1 }}
      >
        {subtitle}
      </Typography>
      <Typography variant="h2" sx={{ fontWeight: 800, color: '#fff', mb: 2 }}>
        {title}
      </Typography>
      {/* Underline accent */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <Box sx={{ width: 48, height: 3, background: ' #EA002A', borderRadius: 2 }} />
        <Box sx={{ width: 12, height: 3, background: 'rgba(234, 0, 42, 0.4)', borderRadius: 2 }} />
        <Box sx={{ width: 6, height: 3, background: 'rgba(234, 0, 42, 0.2)', borderRadius: 2 }} />
      </Box>
    </Box>
  )
}