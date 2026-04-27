'use client';

import { useEffect, useRef } from 'react';
import { Box, Container, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import StorageIcon from '@mui/icons-material/Storage';
import WebIcon from "@mui/icons-material/Web";
import Link from 'next/link';
import ChatIcon from "@mui/icons-material/Chat";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const SERVICES_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

  @keyframes shimmerText  { 0%{ background-position:0% 50%; } 100%{ background-position:200% 50%; } }
  @keyframes particleDrift{ 0%,100%{ transform:translate(0,0); opacity:.5; } 50%{ transform:translate(10px,-14px); opacity:1; } }
  @keyframes glowPulse    { 0%,100%{ opacity:.5; } 50%{ opacity:1; } }
  @keyframes iconSpin     { 0%{ transform:rotate(0deg) scale(1); } 50%{ transform:rotate(8deg) scale(1.12); } 100%{ transform:rotate(0deg) scale(1); } }
  @keyframes borderFlow   { 0%{ background-position:0% 50%; } 100%{ background-position:300% 50%; } }
  @keyframes scanLine     { 0%{ top:-5%; opacity:0; } 10%{ opacity:1; } 90%{ opacity:1; } 100%{ top:105%; opacity:0; } }
  @keyframes floatTag     { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
  @keyframes pulseNumber  { 0%,100%{ text-shadow:0 0 8px rgba(234,0,42,.4); } 50%{ text-shadow:0 0 20px rgba(234,0,42,.9); } }
  @keyframes iconGlow     { 0%,100%{ filter:drop-shadow(0 0 6px rgba(234,0,42,.5)); } 50%{ filter:drop-shadow(0 0 16px rgba(234,0,42,.9)); } }

  .sv-sr    { opacity:0; transform:translateY(44px); transition:opacity .8s ease, transform .8s ease; }
  .sv-sr-l  { opacity:0; transform:translateX(-44px);transition:opacity .8s ease, transform .8s ease; }
  .sv-sr-r  { opacity:0; transform:translateX(44px); transition:opacity .8s ease, transform .8s ease; }
  .sv-sr.in,.sv-sr-l.in,.sv-sr-r.in { opacity:1; transform:none; }
  .sv-d1{ transition-delay:.05s; } .sv-d2{ transition-delay:.15s; }
  .sv-d3{ transition-delay:.25s; } .sv-d4{ transition-delay:.35s; }
  .sv-d5{ transition-delay:.45s; } .sv-d6{ transition-delay:.55s; }

  .svc-card {
    position:relative; border-radius:18px; padding:2px;
    background:linear-gradient(135deg,rgba(234,0,42,.5) 0%,rgba(255,255,255,.08) 50%,rgba(234,0,42,.3) 100%);
    background-size:300% 300%;
    transition:transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s;
    cursor:pointer; overflow:hidden; text-decoration:none; display:block;
  }
  .svc-card::before {
    content:''; position:absolute; inset:0; border-radius:18px;
    background:linear-gradient(135deg,#EA002A 0%,rgba(255,255,255,.12) 50%,#EA002A 100%);
    background-size:300% 300%; opacity:0; transition:opacity .4s;
  }
  .svc-card:hover { transform:translateY(-10px) scale(1.025); box-shadow:0 24px 60px rgba(234,0,42,.35),0 0 0 1px rgba(234,0,42,.5); }
  .svc-card:hover::before { opacity:1; animation:borderFlow 2s linear infinite; }
  .svc-card:hover .svc-scan { animation:scanLine 2s linear infinite; }
  .svc-card:hover .svc-icon-wrap { animation:iconSpin 1s ease-in-out infinite; }
  .svc-card:hover .svc-number { animation:pulseNumber 1s ease-in-out infinite; }
  .svc-card:hover .svc-mui-icon { animation:iconGlow 1s ease-in-out infinite; }
  .svc-card:hover .svc-arrow { opacity:1; transform:translateX(0); }

  .svc-inner {
    background:linear-gradient(145deg,#111 0%,#0d0d0d 100%);
    border-radius:16px; padding:32px 28px 28px;
    position:relative; overflow:hidden; height:100%;
  }

  .svc-scan {
    position:absolute; left:0; right:0; height:2px;
    background:linear-gradient(90deg,transparent,rgba(234,0,42,.55),transparent);
    top:-5%; pointer-events:none; z-index:2;
  }

  .svc-icon-wrap {
    width:56px; height:56px; border-radius:14px;
    background:linear-gradient(135deg,rgba(234,0,42,.18),rgba(234,0,42,.06));
    border:1px solid rgba(234,0,42,.3);
    display:flex; align-items:center; justify-content:center;
    margin-bottom:18px;
    box-shadow:0 0 20px rgba(234,0,42,.15);
    transition:all .35s;
  }
  .svc-card:hover .svc-icon-wrap {
    background:linear-gradient(135deg,rgba(234,0,42,.3),rgba(234,0,42,.12));
    border-color:rgba(234,0,42,.6);
    box-shadow:0 0 30px rgba(234,0,42,.35);
  }

  .svc-mui-icon { color:#EA002A; font-size:1.7rem !important; transition:all .35s; }

  .svc-number {
    position:absolute; top:20px; right:22px;
    font-family:'Syne',sans-serif; font-weight:800;
    font-size:3.5rem; color:rgba(234,0,42,.08);
    line-height:1; letter-spacing:-2px; user-select:none; transition:color .35s;
  }

  .svc-tag {
    display:inline-block; font-family:'DM Sans',sans-serif;
    font-size:.7rem; font-weight:600;
    padding:3px 10px; border-radius:20px;
    border:1px solid rgba(234,0,42,.35); background:rgba(234,0,42,.08); color:#EA002A;
    margin:4px 4px 0 0; transition:all .3s;
    animation:floatTag 3s ease-in-out infinite;
  }
  .svc-card:hover .svc-tag { background:rgba(234,0,42,.18); box-shadow:0 0 10px rgba(234,0,42,.3); }

  .svc-arrow {
    position:absolute; bottom:28px; right:24px;
    font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:700;
    color:#EA002A; opacity:0; transform:translateX(-8px);
    transition:all .35s; letter-spacing:1px;
  }
    // CSS mein add karo (SERVICES_CSS string mein):
.view-all-btn {
  font-family:'Syne',sans-serif; font-weight:800; font-size:.88rem;
  padding:12px 32px; border-radius:12px;
  border:1px solid rgba(234,0,42,.4); background:transparent; color:#EA002A;
  cursor:pointer; transition:all .3s; letter-spacing:.5px; text-transform:uppercase;
  position:relative; overflow:hidden; text-decoration:none; display:inline-block;
}
.view-all-btn::before {
  content:''; position:absolute; inset:0;
  background:#EA002A; transform:scaleX(0); transform-origin:left;
  transition:transform .35s cubic-bezier(.4,0,.2,1);
}
.view-all-btn:hover { color:#fff; box-shadow:0 0 28px rgba(234,0,42,.5); border-color:#EA002A; }
.view-all-btn:hover::before { transform:scaleX(1); }
.view-all-btn span { position:relative; z-index:1; }

  @keyframes marqueeScroll { from{ transform:translateX(0); } to{ transform:translateX(-50%); } }
  .marquee-track { display:flex; animation:marqueeScroll 22s linear infinite; }
  .marquee-track:hover { animation-play-state:paused; }
`;

// ─── Services data ────────────────────────────────────────────────────────────
export const ALL_SERVICES = [
  {
    id: 'Full-stack',
    Icon: DeveloperModeIcon,
    title: 'Full Stack Web Development',
    desc: 'Fast, modern, and scalable websites built with Next.js and React — optimized for performance from day one.',
    tags: ['Next.js', 'React', 'Nodejs', 'Mongodb', 'expressjs',],
    fullDesc: 'End-to-end web development from architecture to deployment. I build lightning-fast, SEO-friendly websites using Next.js App Router, React Server Components, and TypeScript. Every project is optimized for Core Web Vitals, mobile-first, and production-ready.',
    features: ['Next.js 14 App Router','React Server Components','TypeScript & ESLint','Performance Optimization','CI/CD Deployment','Responsive Design'],
    process: ['Discovery & Planning','UI/UX Wireframes','Development Sprints','Testing & QA','Deployment & Launch','Post-launch Support'],
  },
  {
    id: 'frontend-development',
    Icon: WebIcon,
    title: 'Frontend Development',
    desc: 'Pixel-perfect, fully responsive UIs that look stunning on every screen size and device.',
    tags: ['Reactjs','Nextjs','Tailwind CSS', 'MUI', 'Framer Motion'],
    fullDesc: 'Crafting beautiful, interactive interfaces that users love. From complex dashboards to landing pages, I turn Figma designs into pixel-perfect, animated React components with smooth micro-interactions and flawless responsiveness across all breakpoints.',
    features: ['Figma to Code','Tailwind CSS & MUI','Framer Motion Animations','Cross-browser Compatible','WCAG Accessibility','Dark/Light Themes'],
    process: ['Design Analysis','Component Architecture','Responsive Build','Animation Layer','Accessibility Audit','Handoff & Docs'],
  },
  {
    id: 'backend-development',
    Icon: StorageIcon,
    title: 'Backend Development',
    desc: 'Robust REST APIs and serverless functions — secure, fast, and ready to scale with your business.',
    tags: ['Node.js', 'MongoDB', 'REST APIs', 'django', 'expressjs'],
    fullDesc: 'Scalable backend systems built for the real world. I architect and build REST APIs, authentication systems, database schemas, and serverless functions using Node.js, Express, and MongoDB. Secure by default, documented thoroughly, and ready to handle growth.',
    features: ['REST API Design','JWT Authentication','MongoDB & PostgreSQL','Serverless Functions','Rate Limiting & Security','API Documentation'],
    process: ['Requirements Analysis','Database Schema Design','API Architecture','Development & Testing','Security Review','Deployment & Monitoring'],
  },
  
  {
    id: 'ui-ux-design',
    Icon: AutoAwesomeIcon,
    title: 'UI/UX Design',
    desc: 'Beautiful, intuitive interfaces designed to convert — from wireframe to high-fidelity prototype.',
    tags: ['Figma', 'Prototyping', 'User Research'],
    fullDesc: 'Design that converts. I create user-centered digital experiences through research, wireframing, and high-fidelity prototyping in Figma. Every design decision is backed by UX principles — clear hierarchy, intuitive flows, and visual delight that keeps users engaged.',
    features: ['User Research & Personas','Information Architecture','Low/High-fi Wireframes','Interactive Prototypes','Design Systems','Usability Testing'],
    process: ['Research & Discovery','User Journey Mapping','Wireframing','Visual Design','Prototype & Test','Developer Handoff'],
  },
  
  {
  id: 'ai-ml-engineer',
  Icon: PsychologyIcon,
  title: 'AI / ML Engineer',
  desc: 'Intelligent AI solutions that automate workflows, generate content, and enhance product capabilities using modern LLMs and ML models.',
  tags: ['LLMs', 'Prompt Engineering', 'AI APIs'],
  fullDesc: 'I build and integrate AI-powered systems using modern LLMs and machine learning models. From RAG systems to intelligent chatbots and automation pipelines — I design solutions that improve accuracy, efficiency, and user experience through AI.',
  features: [
    'RAG System Development',
    'AI Chatbot Integration',
    'Prompt Engineering',
    'API Integration (OpenAI, Groq)',
    'Model Optimization',
    'Workflow Automation'
  ],
  process: [
    'Requirement Analysis',
    'Data & Use Case Study',
    'Model Selection',
    'System Design',
    'Implementation & Integration',
    'Testing & Optimization'
  ],
},
  {
  id: 'chatbot-development',
  Icon: ChatIcon,
  title: 'Chatbot Development',
  desc: 'Intelligent AI chatbots that automate conversations, support users, and boost engagement 24/7.',
  tags: ['AI Chatbots', 'Automation', 'LLM Integration'],
  fullDesc: 'I build advanced AI-powered chatbots that enhance user interaction and automate customer support. From simple FAQ bots to intelligent assistants using LLMs like OpenAI and Groq, I create scalable solutions that improve engagement, reduce workload, and provide instant responses.',
  features: [
    'AI Chatbot Development',
    'OpenAI / Groq Integration',
    'Custom Prompt Engineering',
    'Website & API Integration',
    'Automated Customer Support',
    'Multi-platform Deployment'
  ],
  process: [
    'Requirement Analysis',
    'Conversation Flow Design',
    'AI Model Integration',
    'Bot Development',
    'Testing & Optimization',
    'Deployment & Monitoring'
  ],
},
  // Extra services shown only on /services page
  {
    id: 'ai-integration',
    Icon: AutoAwesomeIcon,
    title: 'AI Integration',
    desc: 'Embed powerful AI features — chatbots, recommendations, and automation — into your existing product.',
    tags: ['OpenAI', 'LangChain', 'Python'],
    fullDesc: 'Supercharge your product with AI. I integrate OpenAI, Anthropic, and open-source LLMs into web apps — building chatbots, RAG systems, semantic search, and intelligent automation pipelines that save time and delight users.',
    features: ['OpenAI & Claude APIs','RAG Pipelines','Chatbot Development','Semantic Search','Prompt Engineering','LangChain Workflows'],
    process: ['Use Case Definition','Model Selection','Integration Build','Evaluation & Testing','Fine-tuning','Monitoring & Iteration'],
  },
  {
    id: 'ecommerce',
    Icon: RocketLaunchIcon,
    title: 'E-Commerce Development',
    desc: 'High-converting online stores built on Shopify, WooCommerce, or custom Next.js storefronts.',
    tags: ['Shopify', 'WooCommerce', 'Stripe'],
    fullDesc: 'Full-featured e-commerce solutions from product catalog to checkout. I build custom storefronts with Shopify Hydrogen, WooCommerce, or headless Next.js — integrated with Stripe, inventory systems, and analytics for maximum conversion.',
    features: ['Custom Storefronts','Stripe & Payment Gateways','Inventory Management','Cart & Checkout Flows','Order Dashboard','Conversion Optimization'],
    process: ['Store Strategy','Design & Branding','Development','Payment Integration','Testing','Launch & Growth'],
  },
];

const PARTICLES = [
  { id:0,  top:'5%',  left:'8%',  size:'3px', delay:'0s',   dur:'6s'  },
  { id:1,  top:'12%', left:'72%', size:'2px', delay:'1.2s', dur:'8s'  },
  { id:2,  top:'22%', left:'45%', size:'4px', delay:'0.5s', dur:'7s'  },
  { id:3,  top:'38%', left:'88%', size:'2px', delay:'2.1s', dur:'9s'  },
  { id:4,  top:'45%', left:'15%', size:'3px', delay:'0.8s', dur:'5s'  },
  { id:5,  top:'55%', left:'60%', size:'5px', delay:'1.7s', dur:'11s' },
  { id:6,  top:'62%', left:'32%', size:'2px', delay:'3.0s', dur:'8s'  },
  { id:7,  top:'70%', left:'90%', size:'3px', delay:'0.3s', dur:'6s'  },
  { id:8,  top:'78%', left:'20%', size:'4px', delay:'2.5s', dur:'10s' },
  { id:9,  top:'85%', left:'55%', size:'2px', delay:'1.0s', dur:'7s'  },
  { id:10, top:'90%', left:'40%', size:'3px', delay:'0.6s', dur:'9s'  },
  { id:11, top:'18%', left:'28%', size:'2px', delay:'4.0s', dur:'13s' },
  { id:12, top:'30%', left:'75%', size:'4px', delay:'1.5s', dur:'8s'  },
  { id:13, top:'50%', left:'82%', size:'2px', delay:'2.8s', dur:'6s'  },
  { id:14, top:'65%', left:'12%', size:'3px', delay:'3.5s', dur:'7s'  },
  { id:15, top:'75%', left:'50%', size:'2px', delay:'1.9s', dur:'12s' },
];

const MARQUEE_ITEMS = ['Web Development','Frontend Development','SEO Expert','UI/UX Design','Backend Development','Local SEO','React','Next.js','Node.js','MongoDB','Figma','Tailwind CSS'];

// ─── Single card ─────────────────────────────────────────────────────────────
function ServiceCard({ service, index }) {
  const { Icon } = service;
  return (
    <Box
      component={Link}
      href={`/services/${service.id}`}
      className={`svc-card sv-sr sv-d${Math.min(index + 1, 6)}`}
      sx={{ flex:'0 0 auto', width:{ xs:'100%', sm:'calc(50% - 12px)', lg:'calc(33.33% - 16px)' } }}
    >
      <Box className="svc-inner">
        <Box className="svc-scan" />
        <Box className="svc-number">{String(index + 1).padStart(2, '0')}</Box>

        {/* MUI icon */}
        <Box className="svc-icon-wrap">
          <Icon className="svc-mui-icon" />
        </Box>

        <Box sx={{ width:36, height:3, borderRadius:2, mb:2, background:'linear-gradient(90deg,#EA002A,rgba(234,0,42,.3))', boxShadow:'0 0 8px rgba(234,0,42,.5)' }}/>

        <Typography sx={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:'1.15rem', color:'#fff', mb:1.5, letterSpacing:'-.3px' }}>
          {service.title}
        </Typography>

        <Typography sx={{ fontFamily:"'DM Sans'", color:'#888', fontSize:'.88rem', lineHeight:1.75, mb:2.5 }}>
          {service.desc}
        </Typography>

        <Box sx={{ display:'flex', flexWrap:'wrap' }}>
          {service.tags.map((t, i) => (
            <span key={t} className="svc-tag" style={{ animationDelay:`${i * 0.4}s` }}>{t}</span>
          ))}
        </Box>

        <span className="svc-arrow">View Details →</span>

        <Box sx={{ position:'absolute', bottom:-24, right:-24, width:90, height:90, borderRadius:'50%', background:'rgba(234,0,42,.12)', filter:'blur(28px)', transition:'opacity .35s' }}/>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ServicesSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const targets = document.querySelectorAll('.sv-sr,.sv-sr-l,.sv-sr-r');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.1 }
    );
    targets.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Show only first 6 on homepage
  const homeServices = ALL_SERVICES.slice(0, 6);

  return (
    <>
      <style>{SERVICES_CSS}</style>

      <Box id="services" sx={{
        position:'relative', bgcolor:'#0a0a0a',
        pt:{ xs:12, md:14 }, pb:{ xs:6, md:8 },
        overflow:'hidden', fontFamily:"'DM Sans',sans-serif",
      }}>

        <Box sx={{ position:'absolute', inset:0, zIndex:0, background:`radial-gradient(ellipse 60% 50% at 80% 40%, rgba(234,0,42,.1) 0%, transparent 60%),radial-gradient(ellipse 40% 40% at 10% 70%, rgba(234,0,42,.07) 0%, transparent 55%)` }}/>
        <Box sx={{ position:'absolute', inset:0, zIndex:0, opacity:.025, backgroundImage:`linear-gradient(rgba(234,0,42,1) 1px,transparent 1px),linear-gradient(90deg,rgba(234,0,42,1) 1px,transparent 1px)`, backgroundSize:'48px 48px' }}/>

        {PARTICLES.map(p => (
          <Box key={p.id} sx={{ position:'absolute', borderRadius:'50%', zIndex:0, top:p.top, left:p.left, width:p.size, height:p.size, bgcolor:'rgba(234,0,42,.4)', animation:`particleDrift ${p.dur} ${p.delay} ease-in-out infinite` }}/>
        ))}

        <Box sx={{ position:'absolute', right:{ xs:16, md:40 }, top:'10%', bottom:'10%', width:'1px', zIndex:0, background:'linear-gradient(to bottom,transparent,rgba(234,0,42,.35) 30%,rgba(234,0,42,.35) 70%,transparent)' }}/>

        <Container sx={{ position:'relative', zIndex:2, maxWidth:'1200px !important' }}>

          <Box className="sv-sr" sx={{ mb:{ xs:7, md:9 }, textAlign:'center' }}>
            <Typography sx={{ fontFamily:"'DM Sans'", fontWeight:600, fontSize:'.8rem', letterSpacing:'4px', textTransform:'uppercase', color:'#EA002A', mb:1.5 }}>
              — What I Offer —
            </Typography>
            <Typography sx={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:{ xs:'2.4rem', md:'3.2rem' }, letterSpacing:'-1px', lineHeight:1.05, background:'linear-gradient(90deg,#fff 40%,#EA002A 90%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmerText 5s linear infinite' }}>
              My Services
            </Typography>
            <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', gap:1.5, mt:2 }}>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,transparent,#EA002A)' }}/>
              <Box sx={{ width:8, height:8, borderRadius:'50%', bgcolor:'#EA002A', boxShadow:'0 0 10px #EA002A' }}/>
              <Box sx={{ width:40, height:'2px', background:'linear-gradient(90deg,#EA002A,transparent)' }}/>
            </Box>
            <Typography sx={{ color:'#666', fontFamily:"'DM Sans'", fontSize:'.95rem', mt:2.5, maxWidth:460, mx:'auto', lineHeight:1.7 }}>
              End-to-end digital solutions — from design to deployment, built to impress and built to last.
            </Typography>
          </Box>

          <Box ref={sectionRef} sx={{ display:'flex', flexWrap:'wrap', gap:3, justifyContent:'center' }}>
            {homeServices.map((s, i) => (
              <ServiceCard key={s.id} service={s} index={i} />
            ))}
          </Box>

          {/* View All Services CTA */}
          <Box className="sv-sr" sx={{ mt:{ xs:6, md:7 }, textAlign:'center' }}>
            <Link href="/services" className="view-all-btn">
  <span>View All Services →</span>
</Link>
          </Box>

          {/* Bottom CTA strip */}
          <Box className="sv-sr" sx={{ mt:{ xs:7, md:9 }, textAlign:'center', p:{ xs:3, md:4 }, borderRadius:'16px', border:'1px solid rgba(234,0,42,.2)', background:'linear-gradient(135deg,rgba(234,0,42,.07) 0%,rgba(255,255,255,.02) 100%)', position:'relative', overflow:'hidden' }}>
            <Box sx={{ position:'absolute', top:-40, left:'50%', transform:'translateX(-50%)', width:300, height:80, background:'rgba(234,0,42,.12)', filter:'blur(40px)' }}/>
            <Typography sx={{ fontFamily:"'Syne'", fontWeight:800, color:'#fff', fontSize:{ xs:'1.3rem', md:'1.6rem' }, mb:1, position:'relative' }}>
              Need something custom?
            </Typography>
            <Typography sx={{ color:'#777', fontFamily:"'DM Sans'", fontSize:'.92rem', mb:2.5, position:'relative' }}>
              Let's talk about your project and build something great together.
            </Typography>
            <Box
              component="a"
              href="/#contact"
              sx={{
                display:'inline-block', fontFamily:"'DM Sans'", fontWeight:700, fontSize:'1rem',
                px:4, py:1.4, borderRadius:'10px', border:'none', cursor:'pointer',
                background:'#EA002A', color:'#fff', textDecoration:'none',
                boxShadow:'0 0 24px rgba(234,0,42,.45)', transition:'all .3s', position:'relative',
                '&:hover':{ background:'#c0392b', boxShadow:'0 0 40px rgba(234,0,42,.7)', transform:'translateY(-3px)' },
              }}
            >
              Get In Touch →
            </Box>
          </Box>
        </Container>

        {/* Marquee strip */}
        <Box sx={{ mt:{ xs:7, md:9 }, py:2.5, borderTop:'1px solid rgba(255,255,255,.06)', borderBottom:'1px solid rgba(255,255,255,.06)', overflow:'hidden', position:'relative', zIndex:2, background:'rgba(234,0,42,.04)' }}>
          <Box className="marquee-track" sx={{ whiteSpace:'nowrap' }}>
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <Box key={i} component="span" sx={{ display:'inline-flex', alignItems:'center', gap:2, fontFamily:"'Syne'", fontWeight:700, fontSize:'.8rem', letterSpacing:'2px', textTransform:'uppercase', color: i % 3 === 0 ? '#EA002A' : 'rgba(255,255,255,.25)', mx:3 }}>
                {i % 3 === 0 ? '★' : '·'} {item}
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ position:'absolute', bottom:-1, left:0, width:'100%', overflow:'hidden', lineHeight:0, zIndex:3 }}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ height:60, width:'100%' }}>
            <polygon points="0,60 1440,0 1440,60" fill="#0a0a0a"/>
          </svg>
        </Box>
      </Box>
    </>
  );
}