import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const BASE_URL = 'https://ananthdev.vercel.app'
const SUPABASE_URL = 'https://ahdxviaqamejzvtbsicg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1cCI6ImF1ZCI6ImF1dGhlbnRpY2F0ZWQiLCJyZWYiOiJhaGR4dmlhcWFtZWpadnRic2ljZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NTI2NzAwLCJleHAiOjIwODUxMDI3MDB9.ekoCAaOd6WVrdWT3AnTsYshcPVsQVte2wqlsdvXGXLQ'

type ChangeFreq = 'daily' | 'weekly' | 'monthly'

interface SitemapEntry {
  path: string
  lastmod?: string
  changefreq: ChangeFreq
  priority: string
}

const staticEntries: SitemapEntry[] = [
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

  // Services pages (redirect to /home — indexed for crawlers)
  { path: '/services/full-stack-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/ai-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/web-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/saas-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/erp-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/crm-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/hrm-development', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/logistics-software', changefreq: 'monthly', priority: '0.7' },
  { path: '/services/business-automation', changefreq: 'monthly', priority: '0.7' },

  // About pages (redirect to /home — indexed for crawlers)
  { path: '/about1.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about2.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about3.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about4.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about5.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about6.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/about7.html', changefreq: 'monthly', priority: '0.7' },

  // Home pages (redirect to /home — indexed for crawlers)
  { path: '/home/myself.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/creator.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/freelancer.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/tamil-nadu.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/chennai.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/coimbatore.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/madurai.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/india.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/ai-solutions.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/enterprise.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/technology.html', changefreq: 'monthly', priority: '0.7' },
  { path: '/home/long-tail.html', changefreq: 'monthly', priority: '0.7' },
]

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

const toDateOnly = (value?: string) => {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

const getPublishedBlogEntries = async (): Promise<SitemapEntry[]> => {
  const now = new Date().toISOString()
  const url = new URL(`${SUPABASE_URL}/rest/v1/blog_posts`)
  url.searchParams.set('select', 'slug,updated_at,created_at,publish_at')
  url.searchParams.set('published', 'eq.true')
  url.searchParams.set('or', `(publish_at.lte.${now},publish_at.is.null)`)
  url.searchParams.set('order', 'created_at.desc')

  try {
    const response = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    })

    if (!response.ok) throw new Error(`Status ${response.status}`)
    const posts = await response.json() as Array<{ slug?: string; updated_at?: string; created_at?: string }>

    return posts
      .filter((post) => post.slug)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        lastmod: toDateOnly(post.updated_at || post.created_at),
        changefreq: 'weekly',
        priority: '0.85',
      }))
  } catch (error) {
    console.warn('[sitemap] Blog post fetch failed; writing static sitemap only.')
    return []
  }
}

const generateSitemap = (entries: SitemapEntry[]) => {
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