//data/blogs.js
export const BLOGS = [
  {
    id: 'nextjs-seo-guide',
    title: 'Complete Next.js SEO Guide 2024',
    subtitle: 'Rank #1 on Google with Next.js',
    excerpt: 'Learn how to optimize your Next.js application for search engines with these proven techniques that helped my clients rank on page one.',
    content: `
## Introduction

Next.js is one of the best frameworks for SEO because of its server-side rendering capabilities. In this guide, I'll show you exactly how to dominate search rankings.

## 1. Meta Tags Setup

Every page needs proper meta tags. Here's how to do it in Next.js 14:

\`\`\`js
export const metadata = {
  title: 'Your Page Title | Brand',
  description: 'Your description here — keep it under 160 characters.',
  keywords: 'keyword1, keyword2, keyword3',
  openGraph: {
    title: 'Your Page Title',
    description: 'Your description',
    type: 'website',
  },
}
\`\`\`

## 2. Core Web Vitals

Google uses Core Web Vitals as a ranking factor. Focus on:

- **LCP** (Largest Contentful Paint) — keep under 2.5s
- **FID** (First Input Delay) — keep under 100ms  
- **CLS** (Cumulative Layout Shift) — keep under 0.1

## 3. Image Optimization

Always use Next.js Image component:

\`\`\`js
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Descriptive alt text"
  width={800}
  height={600}
  priority
/>
\`\`\`

## 4. Sitemap Generation

Create a dynamic sitemap at \`app/sitemap.js\`:

\`\`\`js
export default function sitemap() {
  return [
    { url: 'https://yoursite.com', lastModified: new Date() },
    { url: 'https://yoursite.com/blog', lastModified: new Date() },
  ]
}
\`\`\`

## Conclusion

Following these steps will dramatically improve your Next.js site's SEO. Start with meta tags, then focus on performance, and watch your rankings climb.
    `,
    category: 'SEO',
    tags: ['Next.js', 'SEO', 'Performance', 'Google'],
    date: '2024-03-15',
    readTime: '8 min read',
    image: '/blogs/nextjs-seo.png',
    fallbackColor: 'linear-gradient(135deg,#050f1a 0%,#0d1f2d 100%)',
    featured: true,
  },
  {
    id: 'react-performance-tips',
    title: '10 React Performance Tips That Actually Work',
    subtitle: 'Speed up your React apps today',
    excerpt: 'These 10 battle-tested performance optimizations will make your React application lightning fast. No fluff — just real techniques.',
    content: `
## Why Performance Matters

A 1-second delay in page load can reduce conversions by 7%. Let's fix that.

## 1. useMemo for Expensive Calculations

\`\`\`js
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])
\`\`\`

## 2. useCallback for Functions

\`\`\`js
const handleClick = useCallback(() => {
  doSomething(id)
}, [id])
\`\`\`

## 3. React.memo for Components

\`\`\`js
const MyComponent = React.memo(({ data }) => {
  return <div>{data.title}</div>
})
\`\`\`

## 4. Lazy Loading Components

\`\`\`js
const HeavyComponent = lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
\`\`\`

## 5. Virtual Lists for Long Data

Use \`react-window\` for rendering thousands of items efficiently.

## 6. Avoid Anonymous Functions in JSX

\`\`\`js
// ❌ Bad
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good  
<button onClick={handleClick}>Click</button>
\`\`\`

## 7. Code Splitting

Split your bundle with dynamic imports to reduce initial load time.

## 8. Debounce Input Handlers

\`\`\`js
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
)
\`\`\`

## 9. Optimize Images

Always compress and use modern formats like WebP.

## 10. Profile with React DevTools

Use the Profiler tab to find what's actually slow before optimizing.

## Final Thoughts

Apply these one by one, measure each change, and only keep what actually improves your metrics.
    `,
    category: 'React',
    tags: ['React', 'Performance', 'JavaScript', 'Optimization'],
    date: '2024-02-20',
    readTime: '6 min read',
    image: '/blogs/react-performance.png',
    fallbackColor: 'linear-gradient(135deg,#0a0a1a 0%,#1a0a2d 100%)',
    featured: true,
  },
  {
    id: 'mongodb-best-practices',
    title: 'MongoDB Best Practices for Production',
    subtitle: 'Database tips every developer needs',
    excerpt: 'After running MongoDB in production for 3+ years, here are the mistakes I see developers make and how to avoid them.',
    content: `
## Introduction

MongoDB is powerful but easy to misuse. Here's what actually matters in production.

## 1. Always Use Indexes

Without indexes, every query does a full collection scan.

\`\`\`js
// Create index on frequently queried fields
db.users.createIndex({ email: 1 }, { unique: true })
db.posts.createIndex({ userId: 1, createdAt: -1 })
\`\`\`

## 2. Use Projection to Limit Fields

\`\`\`js
// ❌ Bad — fetches everything
const user = await User.findById(id)

// ✅ Good — only what you need
const user = await User.findById(id).select('name email avatar')
\`\`\`

## 3. Paginate Everything

Never return unlimited documents:

\`\`\`js
const posts = await Post
  .find({ published: true })
  .sort({ createdAt: -1 })
  .limit(10)
  .skip((page - 1) * 10)
\`\`\`

## 4. Use Aggregation Pipeline

For complex queries, aggregation is much faster than multiple queries.

## 5. Connection Pooling

Always use a singleton connection pattern — never create new connections per request.

## 6. Validate Data with Mongoose

\`\`\`js
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  age:   { type: Number, min: 0, max: 120 },
})
\`\`\`

## Conclusion

These practices will make your MongoDB database reliable, fast, and maintainable at scale.
    `,
    category: 'Database',
    tags: ['MongoDB', 'Database', 'Node.js', 'Backend'],
    date: '2024-01-10',
    readTime: '7 min read',
    image: '/blogs/mongodb.png',
    fallbackColor: 'linear-gradient(135deg,#051a0a 0%,#0d2d10 100%)',
    featured: false,
  },
  {
    id: 'tailwind-vs-mui',
    title: 'Tailwind CSS vs MUI — Which Should You Choose?',
    subtitle: 'An honest comparison for 2024',
    excerpt: 'I have built production apps with both. Here is my honest take on when to use Tailwind CSS and when Material UI is the better choice.',
    content: `
## The Question Everyone Asks

Both are great. The answer depends on your project. Let me break it down.

## Tailwind CSS

**Pros:**
- Full design freedom
- Smaller bundle size
- No design system constraints
- Perfect for custom designs

**Cons:**
- Longer class names in JSX
- Need to build components from scratch
- Steeper learning curve for designers

\`\`\`jsx
// Tailwind example
<button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
  Click me
</button>
\`\`\`

## Material UI (MUI)

**Pros:**
- Pre-built components
- Consistent design system
- Great for dashboards and admin panels
- Excellent accessibility

**Cons:**
- Heavier bundle
- Harder to customize deeply
- Material Design look can feel generic

\`\`\`jsx
// MUI example
<Button variant="contained" color="primary">
  Click me
</Button>
\`\`\`

## My Recommendation

- **Marketing sites / landing pages** → Tailwind
- **Admin dashboards / internal tools** → MUI
- **Complex web apps** → Tailwind + custom components
- **Rapid prototyping** → MUI

## Final Answer

Neither is objectively better. Choose based on your team, timeline, and design requirements.
    `,
    category: 'CSS',
    tags: ['Tailwind', 'MUI', 'CSS', 'Frontend'],
    date: '2023-12-05',
    readTime: '5 min read',
    image: '/blogs/tailwind-mui.png',
    fallbackColor: 'linear-gradient(135deg,#1a0a05 0%,#2d1505 100%)',
    featured: false,
  },
  {
    id: 'freelancing-guide',
    title: 'How I Got My First Freelancing Client',
    subtitle: 'From zero to paid in 30 days',
    excerpt: 'My exact step-by-step process for landing the first freelancing client as a web developer — no experience required.',
    content: `
## My Story

Six months after learning web development, I had zero clients and zero income. Here is exactly what changed that.

## Step 1 — Build a Portfolio (Even Fake Projects)

Nobody cares if the projects are real. They care if the work looks good.

I built 3 fake projects:
- A restaurant website
- An e-commerce store  
- A local business landing page

## Step 2 — Optimize Your LinkedIn

Your LinkedIn headline should be:
**"Frontend Developer | I help businesses get more customers online"**

Not: "Looking for opportunities"

## Step 3 — Local Businesses First

Cold email local businesses with bad websites. Here's my template:

> Hi [Name], I noticed your website on Google. I help businesses like yours get more customers through better web design. I'd love to show you what I'd do differently — no obligation. Reply if interested.

## Step 4 — Do the First Project Cheap

My first project was a restaurant website for $150. Worth it — they gave me 3 referrals.

## Step 5 — Ask for Referrals

After every project: "Do you know anyone else who might need a website?"

## Results

Month 1: $150
Month 2: $800
Month 3: $2,400
Month 6: $5,000+

## Key Lesson

Stop waiting to be ready. Start with what you have.
    `,
    category: 'Career',
    tags: ['Freelancing', 'Career', 'Business', 'Tips'],
    date: '2023-11-18',
    readTime: '4 min read',
    image: '/blogs/freelancing.png',
    fallbackColor: 'linear-gradient(135deg,#0a0510 0%,#150a20 100%)',
    featured: false,
  },
  {
    id: 'javascript-async-guide',
    title: 'JavaScript Async/Await — The Complete Guide',
    subtitle: 'Master asynchronous JavaScript once and for all',
    excerpt: 'Promises, async/await, error handling — everything you need to know about asynchronous JavaScript explained simply.',
    content: `
## Why Async Matters

JavaScript is single-threaded. Without async, one slow operation blocks everything.

## Callbacks (Old Way)

\`\`\`js
fetchData(function(error, data) {
  if (error) {
    handleError(error)
    return
  }
  processData(data, function(error, result) {
    // Callback hell begins...
  })
})
\`\`\`

## Promises (Better)

\`\`\`js
fetchData()
  .then(data => processData(data))
  .then(result => saveResult(result))
  .catch(error => handleError(error))
\`\`\`

## Async/Await (Best)

\`\`\`js
async function handleData() {
  try {
    const data   = await fetchData()
    const result = await processData(data)
    await saveResult(result)
  } catch (error) {
    handleError(error)
  }
}
\`\`\`

## Parallel Execution

\`\`\`js
// ❌ Sequential — slow
const user  = await getUser(id)
const posts = await getPosts(id)

// ✅ Parallel — fast
const [user, posts] = await Promise.all([
  getUser(id),
  getPosts(id),
])
\`\`\`

## Error Handling Best Practices

Always wrap await calls in try/catch. Never swallow errors silently.

## Conclusion

Async/await makes asynchronous code look synchronous. Master it and you'll write cleaner, more maintainable JavaScript.
    `,
    category: 'JavaScript',
    tags: ['JavaScript', 'Async', 'Programming', 'ES6'],
    date: '2023-10-22',
    readTime: '9 min read',
    image: '/blogs/javascript-async.png',
    fallbackColor: 'linear-gradient(135deg,#1a1a05 0%,#2d2d0d 100%)',
    featured: true,
  },
]