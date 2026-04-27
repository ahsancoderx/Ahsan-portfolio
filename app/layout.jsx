// src/app/layout.js
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme/theme';
import CustomCursor from '@/components/layout/CustomCursor';
import WhatsAppButton from '@/components/sections/WhatsAppButton';   

export const metadata = {
  title: "Ahsan Ali | MERN Stack Developer | AI Engineer | Frontend Developer & Backend developer",
  
  description:
    "Ahsan Ali is a Full Stack MERN Developer, AI Enthusiast, and SEO Expert based in Lahore, Pakistan. Specialized in Next.js, React.js, Node.js, MongoDB, AI Chatbots, Voice Agents, OpenAI API, Gemini API, and technical SEO. Building scalable, high-performance web applications and intelligent AI-powered digital solutions.",
  
  keywords: [
    "Ahsan Ali",
    "MERN Stack Developer",
    "Full Stack Developer Pakistan",
    "Frontend Developer Lahore",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "MongoDB Developer",
    "AI Engineer",
    "AI Chatbot Developer",
    "Voice Agent Developer",
    "OpenAI API Developer",
    "Gemini API Integration",
    "Prompt Engineer",
    "SEO Expert Pakistan",
    "Technical SEO",
    "Web Developer Lahore",
    "JavaScript Developer",
    "Python Developer",
    "Portfolio Website"
  ],

  authors: [{ name: "Ahsan Ali" }],
  creator: "Ahsan Ali",
  publisher: "Ahsan Ali",

  metadataBase: new URL("https://ahsanali-dev.vercel.app/"),

  alternates: {
    canonical: "https://ahsanali-dev.vercel.app/",
  },

  openGraph: {
    title: "Ahsan Ali | MERN Stack Developer & AI Engineer",
    description:
      "Portfolio of Ahsan Ali — Full Stack MERN Developer, AI Engineer, and SEO Expert. Building scalable web apps, AI chatbots, voice agents, and SEO-optimized digital experiences.",
    url: "https://ahsanali-dev.vercel.app/",
    siteName: "Ahsan Ali Portfolio",
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Ahsan Ali | MERN Stack Developer & AI Engineer",
    description:
      "Full Stack MERN Developer specializing in AI chatbots, voice agents, Next.js applications, and SEO optimization.",
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  category: "Technology",
};

export default function RootLayout({ children }) {
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

        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CustomCursor />

            {/* ALL PAGES */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              {children}
            </div>

            {/* WhatsApp floating button — shows on every page */}
            <WhatsAppButton
              phone="923271348097"
              message="Hi Ahsan! I visited your portfolio and would like to get in touch."
            />

          </ThemeProvider>
        </AppRouterCacheProvider>

      </body>
    </html>
  );
}