'use client';

import { useRef } from 'react';
import { Box, Container, Typography, Chip } from '@mui/material';
import SchoolIcon        from '@mui/icons-material/School';
import AutoStoriesIcon   from '@mui/icons-material/AutoStories';
import ApartmentIcon     from '@mui/icons-material/Apartment';
import LightbulbIcon     from '@mui/icons-material/Lightbulb';
import LanguageIcon      from '@mui/icons-material/Language';
import PsychologyIcon    from '@mui/icons-material/Psychology';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PhoneAndroidIcon  from '@mui/icons-material/PhoneAndroid';
import SmartToyIcon      from '@mui/icons-material/SmartToy';
import GTranslateIcon    from '@mui/icons-material/GTranslate';
import { motion, useInView } from 'framer-motion';

/* ─── DATA ─────────────────────────────────────────────── */
const EDUCATION = [
  {
    icon:   <SchoolIcon sx={{ fontSize: 32 }} />,
    degree: 'Bachelor of Computer Science',
    inst:   'University of the Punjab',
    period: '2023 – Present',
    loc:    'Lahore, Punjab, Pakistan',
    status: 'Currently Enrolled',
  },
  {
    icon:   <AutoStoriesIcon sx={{ fontSize: 32 }} />,
    degree: 'Intermediate (FSc)',
    inst:   'Government Graduate College kot radha kishan',
    period: '2020 – 2022',
    loc:    'kot radha kishan, Punjab, Pakistan',
    status: 'complete',
  },
  {
    icon:   <ApartmentIcon sx={{ fontSize: 32 }} />,
    degree: 'Matriculation – Science',
    inst:   'Government hight School ',
    period: '2018 – 2020',
    loc:    'kot radha kishan, Punjab, Pakistan',
    status: 'complete',
  },
];

const INTERESTS = [
  { icon: <LanguageIcon      sx={{ fontSize: 20 }} />, label: 'Full stack development'   },
  { icon: <PsychologyIcon    sx={{ fontSize: 20 }} />, label: 'Problem Solving'          },
  { icon: <DeveloperModeIcon sx={{ fontSize: 20 }} />, label: 'Software Development'     },
  { icon: <PhoneAndroidIcon  sx={{ fontSize: 20 }} />, label: 'Mobile App Development'   },
  { icon: <SmartToyIcon      sx={{ fontSize: 20 }} />, label: 'AI & Machine Learning'    },
];

const LANGUAGES = [
  { code: '🇬🇧', name: 'English', level: 'Proficient'     },
  { code: '🇵🇰', name: 'Urdu',    level: 'Native'         },
  { code: '🌐',  name: 'Punjabi', level: 'Conversational' },
];

/* ─── TIMELINE CARD ─────────────────────────────────────── */
function EduCard({ edu, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -60 }}
      transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
    >
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        {/* Dot + line */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <motion.div
            animate={inView
              ? { scale: 1, boxShadow: '0 0 0 6px #EA002A' }
              : { scale: 0.5, boxShadow: 'none' }}
            transition={{ duration: 0.4, delay: index * 0.12 }}
            style={{
              width: 20, height: 20,
              borderRadius: '50%',
              background: index === 0 ? '#EA002A' : '#1a1a1a',
              border: '2px solid #EA002A',
              flexShrink: 0,
              marginTop: 6,
            }}
          />
          <Box sx={{ width: '2px', flex: 1, bgcolor: '#EA002A', mt: 1 }} />
        </Box>

        {/* Card */}
        <Box
          sx={{
            flex: 1,
            bgcolor: '#111',
            border: '1px solid #EA002A',
            borderRadius: 3,
            p: 3,
            mb: 1,
            transition: 'border-color 0.3s, transform 0.3s',
            '&:hover': { borderColor: '#EA002A', transform: 'translateX(6px)' },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, mb: 1.5, alignItems: 'flex-start' }}>
            <Box sx={{ color: '#EA002A', mt: 0.3 }}>{edu.icon}</Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Poppins', fontSize: '1rem' }}>
                {edu.degree}
              </Typography>
              <Typography sx={{ color: '#EA002A', fontWeight: 500, fontSize: '0.85rem', mt: 0.2 }}>
                {edu.inst}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>🕐 {edu.period}</Typography>
            <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>📍 {edu.loc}</Typography>
          </Box>

          {edu.status && (
            <Chip
              label={`● ${edu.status}`}
              size="small"
              sx={{
                mt: 1.5,
                bgcolor: 'rgba(34,197,94,0.12)',
                color: '#22c55e',
                border: '1px solid rgba(34,197,94,0.3)',
                fontWeight: 600,
                fontSize: '0.72rem',
                height: 26,
              }}
            />
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

/* ─── INTEREST CHIP ─────────────────────────────────────── */
function InterestChip({ item, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          bgcolor: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: 2,
          p: '10px 16px',
          transition: 'border-color 0.3s, background 0.3s',
          '&:hover': { borderColor: '#EA002A', bgcolor: 'rgba(234,0,42,0.06)' },
        }}
      >
        <Box sx={{ color: '#EA002A' }}>{item.icon}</Box>
        <Typography sx={{ color: '#ccc', fontFamily: 'Poppins', fontSize: '0.88rem', fontWeight: 500 }}>
          {item.label}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ─── LANGUAGE ROW ──────────────────────────────────────── */
function LangRow({ lang, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 30 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
      transition={{ duration: 0.45, delay: index * 0.1 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: 2,
          p: '12px 18px',
          mb: 1.5,
          transition: 'border-color 0.3s',
          '&:hover': { borderColor: '#EA002A' },
        }}
      >
        <Typography sx={{ fontSize: '1.3rem' }}>{lang.code}</Typography>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: '#fff', fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.9rem' }}>
            {lang.name}
          </Typography>
          <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>{lang.level}</Typography>
        </Box>
      </Box>
    </motion.div>
  );
}

/* ─── PANEL HEADER ──────────────────────────────────────── */
function PanelHeader({ icon, title, index }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box sx={{ p: '6px', border: '1px solid #1e1e1e', borderRadius: 1.5, color: '#EA002A', display: 'flex' }}>
          {icon}
        </Box>
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700, fontFamily: 'Poppins' }}>
          {title}
        </Typography>
      </Box>
    </motion.div>
  );
}

/* ─── MAIN SECTION ──────────────────────────────────────── */
export default function EducationSection() {
  const titleRef    = useRef(null);
  const titleInView = useInView(titleRef, { once: false, margin: '-80px' });

  return (
    <Box
      id="education"
      sx={{
        position: 'relative',
        bgcolor: '#0a0a0a',
        py: 10,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">

          {/* Section Title */}
          <motion.div
            ref={titleRef}
            initial={{ opacity: 0, y: -30 }}
            animate={titleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 8 }}>
              <Box sx={{ width: 4, height: 36, bgcolor: '#EA002A', borderRadius: 2, flexShrink: 0 }} />
              <Typography variant="h4" sx={{
                fontFamily:"'Syne',sans-serif", fontWeight:800,
                fontSize:{ xs:'2.4rem', md:'3.2rem' },
                letterSpacing:'-1px', lineHeight:1.05,
                background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)',
                backgroundSize:'200% auto',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                animation:'shimmerText 5s linear infinite',
              }}>
                Academic Journey
              </Typography>
            </Box>
          </motion.div>

          {/* Two-column flex layout */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>

            {/* ── Left: Timeline ── */}
            <Box sx={{ flex: '1 1 55%', minWidth: 300 }}>
              {EDUCATION.map((edu, i) => (
                <EduCard key={edu.degree} edu={edu} index={i} />
              ))}
            </Box>

            {/* ── Right: Interests + Languages ── */}
            <Box sx={{ flex: '1 1 35%', minWidth: 280 }}>

              {/* Interests */}
              <Box sx={{ bgcolor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, p: 3, mb: 3 }}>
                <PanelHeader icon={<LightbulbIcon sx={{ fontSize: 20 }} />} title="Interests" index={0} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {INTERESTS.map((item, i) => (
                    <InterestChip key={item.label} item={item} index={i} />
                  ))}
                </Box>
              </Box>

              {/* Languages */}
              <Box sx={{ bgcolor: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: 3, p: 3 }}>
                <PanelHeader icon={<GTranslateIcon sx={{ fontSize: 20 }} />} title="Languages" index={1} />
                {LANGUAGES.map((lang, i) => (
                  <LangRow key={lang.name} lang={lang} index={i} />
                ))}
              </Box>

            </Box>
          </Box>

        </Container>
      </Box>
    </Box>
  );
}