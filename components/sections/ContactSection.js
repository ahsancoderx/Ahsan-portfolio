'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material'

import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'

import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import SectionTitle from '@/components/ui/SectionTitle'

const CONTACT_INFO = [
  {
    icon: <PhoneIcon />,
    label: 'Phone',
    value: '+923271348097',
    href: 'tel:+923271348097',
  },
  {
    icon: <EmailIcon />,
    label: 'Email',
    value: 'ahsanaliwebdeveloper@gmail.com',
    href: 'mailto:ahsanaliwebdeveloper@gmail.com',
  },
  {
    icon: <LocationOnIcon />,
    label: 'Location',
    value: 'Lahore, Pakistan',
    href: null,
  },
]

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
}

export default function ContactSection() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      toast.success('Message sent successfully!')
      setForm(EMPTY)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* 🔥 NEON INPUT STYLE */
  const neonInput = {
    mb: 2,
    flex: 1,

    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      background: '#111',
      boxShadow: '0 0 15px rgba(234,0,42,0.6)',

      '& fieldset': {
        borderColor: 'transparent',
      },

      '&:hover': {
        boxShadow: '0 0 25px rgba(234,0,42,0.9)',
      },

      '&.Mui-focused': {
        boxShadow: '0 0 30px rgba(234,0,42,1)',
      },
    },

    '& input, & textarea': {
      color: '#fff',
    },

    '& input::placeholder, & textarea::placeholder': {
      color: '#888',
      opacity: 1,
    },
  }

  return (
    <Box id="contact" sx={{ bgcolor: '#000', py: 10 }}>
      <Container maxWidth="lg">

        <SectionTitle title="Contact Me" subtitle="Let's work together" />

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 4,
            mt: 5,
          }}
        >

          {/* LEFT SIDE (UNCHANGED) */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2 }}>
                Let’s Work Together
              </Typography>

              <Typography sx={{ color: '#aaa', mb: 4 }}>
                I help businesses build modern websites, improve SEO, and grow online presence.
              </Typography>

              {CONTACT_INFO.map((item) => (
                <Box
                  key={item.label}
                  sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      width: 45,
                      height: 45,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#EA002A',
                      background: 'rgba(234, 0, 42, 0.1)',
                      border: '1px solid rgba(234, 0, 42, 0.2)',
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Box>
                    <Typography sx={{ color: '#EA002A', fontSize: 12 }}>
                      {item.label}
                    </Typography>

                    {item.href ? (
                      <Typography
                        component="a"
                        href={item.href}
                        sx={{ color: '#ccc', textDecoration: 'none' }}
                      >
                        {item.value}
                      </Typography>
                    ) : (
                      <Typography sx={{ color: '#ccc' }}>
                        {item.value}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </motion.div>
          </Box>

          {/* RIGHT SIDE FORM (UPDATED) */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <Paper
                sx={{
                  p: 4,
                  bgcolor: '#0d0d0d',
                  borderRadius: '20px',
                  border: '1px solid rgba(234,0,42,0.4)',
                  boxShadow: '0 0 40px rgba(234,0,42,0.6)',
                }}
              >
                <Typography sx={{ color: '#fff', mb: 3, fontWeight: 700, fontSize: 28 }}>
                  Contact <span style={{ color: '#EA002A' }}>Me!</span>
                </Typography>

                <form onSubmit={handleSubmit}>

                  {/* ROW 1 */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Full Name"
                      value={form.name}
                      onChange={handleChange('name')}
                      required
                      sx={neonInput}
                    />

                    <TextField
                      fullWidth
                      placeholder="Email Address"
                      value={form.email}
                      onChange={handleChange('email')}
                      required
                      sx={neonInput}
                    />
                  </Box>

                  {/* ROW 2 */}
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Phone Number"
                      value={form.phone}
                      onChange={handleChange('phone')}
                      sx={neonInput}
                    />

                    <TextField
                      fullWidth
                      placeholder="Email Subject"
                      value={form.subject}
                      onChange={handleChange('subject')}
                      sx={neonInput}
                    />
                  </Box>

                  {/* MESSAGE */}
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange('message')}
                    required
                    sx={neonInput}
                  />

                  {/* BUTTON */}
                  <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    sx={{
                      mt: 2,
                      py: 1.8,
                      borderRadius: '10px',
                      fontSize: '18px',
                      fontWeight: 600,
                      color: '#fff',
                      background: '#EA002A',
                      boxShadow: '0 0 25px rgba(234,0,42,0.9)',
                      transition: '0.3s',

                      '&:hover': {
                        boxShadow: '0 0 40px rgba(234,0,42,1)',
                        background: '#ff0033',
                      },
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={22} sx={{ color: '#fff' }} />
                    ) : (
                      'Send Message'
                    )}
                  </Button>

                </form>
              </Paper>
            </motion.div>
          </Box>

        </Box>
      </Container>
    </Box>
  )
}