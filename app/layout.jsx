// src/app/layout.js
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import CustomCursor from '@/components/layout/CustomCursor';
import ParticlesBackground from '@/components/particles/ParticlesBackground';
import connectDB from '@/lib/mongodb'

export const metadata = {
  title: 'Ahsan Ali | Frontend Developer & SEO Expert',
  description:
    'I design and build modern, responsive websites that bring ideas to life. Clean code, creative design, user-friendly experiences.',
  keywords: 'Ahsan Ali, Frontend Developer, React, Next.js, SEO, Web Development, Lahore',
  openGraph: {
    title: 'Ahsan Ali | Frontend Developer',
    description: 'Portfolio of Ahsan Ali – Frontend Developer & SEO Expert based in Lahore.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  connectDB()
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ backgroundColor: '#0a0a0a' }}>
  
  {/* ✅ GLOBAL PARTICLES (ONE TIME ONLY) */}
  <ParticlesBackground />

  <AppRouterCacheProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CustomCursor />

      {/* ALL PAGES */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>

    </ThemeProvider>
  </AppRouterCacheProvider>

</body>
    </html>
  );
}