// src/components/ui/ServiceCard.js
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CodeIcon from '@mui/icons-material/Code'

export default function ServiceCard({ service }) {
  return (
    <Box
      sx={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 3,
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.35s ease',
        cursor: 'default',
        '&:hover': {
          borderColor: 'rgba(234, 0, 42, 0.4)',
          transform: 'translateY(-4px)',
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
          background: '#111',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 2,
          background: 'linear-gradient(90deg, #EA002A, transparent)',
          opacity: 0,
          transition: 'opacity 0.3s',
        },
        '&:hover::before': { opacity: 1 },
      }}
    >
      {/* Icon */}
      <Box sx={{
        width: 52, height: 52, borderRadius: 2,
        background: 'rgba(234, 0, 42, 0.1)',
        border: '1px solid rgba(234, 0, 42, 0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mb: 2,
        fontSize: 24,
      }}>
        {service.icon || <CodeIcon sx={{ color: '#EA002A' }} />}
      </Box>

      <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mb: 1 }}>
        {service.title}
      </Typography>

      <Typography variant="body2" sx={{ color: '#888', mb: 2, flex: 1, lineHeight: 1.7 }}>
        {service.description}
      </Typography>

      {/* Features */}
      {service.features?.length > 0 && (
        <List dense sx={{ p: 0 }}>
          {service.features.slice(0, 3).map((f) => (
            <ListItem key={f} sx={{ px: 0, py: 0.3 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 14, color: ' #EA002A' }} />
              </ListItemIcon>
              <ListItemText
                primary={f}
                primaryTypographyProps={{ sx: { color: '#aaa', fontSize: 13 } }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}