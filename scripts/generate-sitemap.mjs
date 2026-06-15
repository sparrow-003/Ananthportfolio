import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = 'https://ananthdev.lovable.app'
const SUPABASE_URL = 'https://ahdxviaqamejzvtbsicg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZHh2aWFxYW1lanp2dGJzaWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjY3MDAsImV4cCI6MjA4NTEwMjcwMH0.ekoCAaOd6WVrdWT3AnTsYshcPVsQVte2wqlsdvXGXLQ'

const staticEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/blog', changefreq: 'daily', priority: '0.9' },
  { path: '/python-developer', changefreq: 'monthly', priority: '0.8' },
  { path: '/react-developer', changefreq: 'monthly', priority: '0.8' },
  { path: '/ai-engineer', changefreq: 'monthly', priority: '0.8' },
  { path: '/typescript-developer', changefreq: 'monthly', priority: '0.8' },
  { path: '/prompt-engineering', changefreq: 'monthly', priority: '0.8' },
  { path: '/web-development', changefreq: 'monthly', priority: '0.8' },
  { path: '/ui-ux-design', changefreq: 'monthly', priority: '0.8' },
  { path: '/full-stack-developer', changefreq: 'monthly', priority: '0.8' },
  { path: '/ai-solutions', changefreq: 'monthly', priority: '0.8' },
  { path: '/consulting', changefreq: 'monthly', priority: '0.8' },
  { path: '/portfolio', changefreq: 'monthly', priority: '0.8' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/hire-me', changefreq: 'monthly', priority: '0.8' },
  { path: '/skills', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
]

const fallbackBlogEntries = [
  { path: '/blog/ai-coding-tools-vs-human-developers-will-ai-replace-programmers', lastmod: '2026-05-13', changefreq: 'weekly', priority: '0.85' },
  { path: '/blog/ananth-n-self-taught-software-developer-building-custom-business-software-meta-description-meet-ananth-n-a-self-taught-software-developer-who-builds-custom-software-solutions-and-freelance-projects-to-help-businesses-grow-using-the-power-of-technology', lastmod: '2026-04-17', changefreq: 'weekly', priority: '0.85' },
  { path: '/blog/gpt-vs-claude-ai', lastmod: '2026-05-13', changefreq: 'weekly', priority: '0.85' },
  { path: '/blog/building-modern-web-apps-with-react', lastmod: '2026-05-13', changefreq: 'weekly', priority: '0.85' },
  { path: '/blog/welcome-to-my-blog', lastmod: '2026-05-13', changefreq: 'weekly', priority: '0.85' },
]

const escapeXml = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const toDateOnly = (value) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

const getPublishedBlogEntries = async () => {
  const now = new Date().toISOString()
  const url = new URL(`${SUPABASE_URL}/rest/v1/blog_posts`)
  url.searchParams.set('select', 'slug,updated_at,created_at,publish_at')
  url.searchParams.set('published', 'eq.true')
  url.searchParams.set('or', `(publish_at.lte.${now},publish_at.is.null)`)
  url.searchParams.set('order', 'created_at.desc')

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3500)
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })
    clearTimeout(timeout)

    if (!response.ok) throw new Error(`Status ${response.status}`)
    const posts = await response.json()

    return posts
      .filter((post) => post.slug)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        lastmod: toDateOnly(post.updated_at || post.created_at),
        changefreq: 'weekly',
        priority: '0.85',
      }))
  } catch (error) {
    console.warn('[sitemap] Blog post fetch failed; using checked-in blog URL fallback.')
    return fallbackBlogEntries
  }
}

const generateSitemap = (entries) => {
  const urls = entries.map((entry) => [
    '  <url>',
    `    <loc>${escapeXml(`${BASE_URL}${entry.path}`)}</loc>`,
    entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
    `    <changefreq>${entry.changefreq}</changefreq>`,
    `    <priority>${entry.priority}</priority>`,
    '  </url>',
  ].filter(Boolean).join('\n'))

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

const blogEntries = await getPublishedBlogEntries()
const uniqueEntries = Array.from(
  new Map([...staticEntries, ...blogEntries].map((entry) => [entry.path, entry])).values()
)

writeFileSync(resolve('public/sitemap.xml'), generateSitemap(uniqueEntries))
console.log(`[sitemap] Wrote public/sitemap.xml with ${uniqueEntries.length} URLs`)