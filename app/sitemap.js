export default function sitemap() {
  const baseUrl = "https://ahsanali-dev.vercel.app";

  return [
    // Static Pages
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
    },

    // Blog Posts
    {
      url: `${baseUrl}/blog/nextjs-seo-guide`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/react-performance-tips`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/mongodb-best-practices`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/tailwind-vs-mui`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/freelancing-guide`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/blog/javascript-async-guide`,
      lastModified: new Date(),
    },

    // Projects
    {
      url: `${baseUrl}/projects/ecommerce-platform`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects/Full-stack-SkillReel`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects/Full-stack-dental`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects/AI-IVoice-agent`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects/RAG-System`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects/Blog-Application`,
      lastModified: new Date(),
    },

    // Services
    {
      url: `${baseUrl}/services/Full-stack`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services/backend-development`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services/ui-ux-design`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services/frontend-development`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services/ai-ml-engineer`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/services/chatbot-development`,
      lastModified: new Date(),
    },
  ];
}