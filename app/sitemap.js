export default function sitemap() {
  const baseUrl = 'https://ahsanali-dev.vercel.app';

  // Static pages
  const staticPages = [
    '',
    '/blog',
    '/projects',
    '/services',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Blog posts
  const blogPosts = [
    'nextjs-seo-guide',
    'react-performance-tips',
    'mongodb-best-practices',
    'tailwind-vs-mui',
    'freelancing-guide',
    'javascript-async-guide'
    // add more here
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
  }));

  // Projects
  const projects = [
    'ecommerce-platform',
    'Full-stack-SkillReel',
    'Full-stack-dental',
    'AI-IVoice-agent',
    'RAG-System',
    'Blog-Application'
    // add more here
  ].map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
  }));

  // Services
  const services = [
    'Full-stack',
    'backend-development',
    'ui-ux-design',
    'frontend-development',
    'ai-ml-engineer',
    'chatbot-development'
    // add more here
  ].map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...blogPosts, ...projects, ...services];
}