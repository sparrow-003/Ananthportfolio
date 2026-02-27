// Mock data for testing the blog system without Supabase
import { BlogPost, BlogComment } from './supabase'

// Mock comments data
export const mockBlogComments: BlogComment[] = [
  {
    id: '1',
    post_id: '1',
    author: 'John Doe',
    content: 'Great article! Very helpful for beginners.',
    created_at: '2024-01-21T08:00:00Z'
  },
  {
    id: '2',
    post_id: '1',
    author: 'Jane Smith',
    content: 'Thanks for sharing this. TypeScript really does improve code quality.',
    created_at: '2024-01-20T15:30:00Z'
  },
  {
    id: '3',
    post_id: '3',
    author: 'Dev User',
    content: 'These performance tips are gold!',
    created_at: '2024-01-16T12:00:00Z'
  }
]

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with React and TypeScript',
    content: `# Getting Started with React and TypeScript

React with TypeScript is a powerful combination for building modern web applications. In this post, we'll explore the basics and best practices.

## Why TypeScript?

TypeScript provides several benefits:

- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Improved Code Quality**: Self-documenting code with types

## Setting Up Your Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

## Basic Component Example

\`\`\`typescript
interface Props {
  name: string;
  age?: number;
}

const UserCard: React.FC<Props> = ({ name, age }) => {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      {age && <p>Age: {age}</p>}
    </div>
  );
};
\`\`\`

## Best Practices

1. **Use interfaces for props**
2. **Leverage union types**
3. **Don't use \`any\` type**
4. **Use generic types when appropriate**

> Remember: TypeScript is JavaScript with types. Start simple and gradually add more complex types as you learn.

Happy coding! 🚀`,
    excerpt: 'Learn how to set up and use React with TypeScript for better development experience and code quality.',
    slug: 'getting-started-react-typescript',
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    tags: ['React', 'TypeScript', 'JavaScript', 'Web Development'],
    published: true,
    created_at: '2024-01-20T10:00:00Z',
    updated_at: '2024-01-20T10:00:00Z',
    likes_count: 15,
    views_count: 234,
    allow_comments: true,
    author_name: 'Ananth',
    location: 'Bangalore, India'
  },
  {
    id: '2',
    title: 'Modern CSS Techniques for Better UI',
    content: `# Modern CSS Techniques for Better UI

CSS has evolved significantly over the years. Let's explore some modern techniques that can improve your UI development.

## CSS Grid Layout

CSS Grid is perfect for creating complex layouts:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}
\`\`\`

## Flexbox for Component Layout

Flexbox is ideal for component-level layouts:

\`\`\`css
.flex-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
\`\`\`

## CSS Custom Properties (Variables)

Use CSS variables for consistent theming:

\`\`\`css
:root {
  --primary-color: #9b87f5;
  --secondary-color: #7c3aed;
  --text-color: #f9fafb;
}

.button {
  background-color: var(--primary-color);
  color: var(--text-color);
}
\`\`\`

## Modern Pseudo-selectors

Take advantage of new pseudo-selectors:

- \`:is()\` - Matches any of the selectors in the list
- \`:where()\` - Same as :is() but with zero specificity
- \`:has()\` - Parent selector (limited browser support)

## Container Queries

The future of responsive design:

\`\`\`css
@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

These techniques will help you create more maintainable and flexible CSS. Start incorporating them into your projects today!`,
    excerpt: 'Discover modern CSS techniques including Grid, Flexbox, custom properties, and container queries for better UI development.',
    slug: 'modern-css-techniques-better-ui',
    featured_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    tags: ['CSS', 'Web Development', 'UI/UX', 'Frontend'],
    published: true,
    created_at: '2024-01-18T14:30:00Z',
    updated_at: '2024-01-18T14:30:00Z',
    likes_count: 8,
    views_count: 156,
    allow_comments: true,
    author_name: 'Ananth',
    location: 'Bangalore, India'
  },
  {
    id: '3',
    title: 'Building Performant Web Applications',
    content: `# Building Performant Web Applications

Performance is crucial for user experience. Here are key strategies to build fast, efficient web applications.

## Core Web Vitals

Focus on these metrics:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1

## Optimization Strategies

### 1. Code Splitting

\`\`\`javascript
// Dynamic imports for code splitting
const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

### 2. Image Optimization

- Use modern formats (WebP, AVIF)
- Implement lazy loading
- Serve responsive images

\`\`\`html
<img 
  src="image.webp" 
  alt="Description"
  loading="lazy"
  width="800"
  height="400"
/>
\`\`\`

### 3. Bundle Optimization

- Tree shaking
- Minification
- Compression (Gzip/Brotli)

### 4. Caching Strategies

- Browser caching
- CDN caching
- Service workers

## Performance Monitoring

Use tools like:

- Lighthouse
- Web Vitals extension
- Performance API

\`\`\`javascript
// Measure performance
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry.name, entry.duration);
  }
});

observer.observe({ entryTypes: ['measure'] });
\`\`\`

Remember: **Measure first, optimize second**. Always profile your application before making performance improvements.`,
    excerpt: 'Learn essential strategies for building high-performance web applications, from code splitting to caching.',
    slug: 'building-performant-web-applications',
    featured_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    tags: ['Performance', 'Web Development', 'Optimization', 'JavaScript'],
    published: true,
    created_at: '2024-01-15T09:15:00Z',
    updated_at: '2024-01-15T09:15:00Z',
    likes_count: 23,
    views_count: 445,
    allow_comments: true,
    author_name: 'Ananth',
    location: 'Bangalore, India'
  }
]

// Mock API functions that simulate Supabase calls
export const mockBlogAPI = {
  async getPosts(): Promise<BlogPost[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))
    const now = new Date()
    return mockBlogPosts.filter(post => 
      post.published && (!post.publish_at || new Date(post.publish_at) <= now)
    )
  },

  async getAllPosts(): Promise<BlogPost[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockBlogPosts.map(post => ({
      ...post,
      comments_count: mockBlogComments.filter(c => c.post_id === post.id).length
    }))
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const now = new Date()
    return mockBlogPosts.find(post => 
      post.slug === slug && 
      post.published && 
      (!post.publish_at || new Date(post.publish_at) <= now)
    ) || null
  },

  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>): Promise<BlogPost> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      likes_count: 0,
      views_count: 0,
      allow_comments: post.allow_comments ?? true,
      author_name: post.author_name ?? 'Ananth',
      location: post.location
    }
    mockBlogPosts.unshift(newPost)
    return newPost
  },

  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockBlogPosts.findIndex(post => post.id === id)
    if (index === -1) throw new Error('Post not found')
    
    mockBlogPosts[index] = {
      ...mockBlogPosts[index],
      ...updates,
      updated_at: new Date().toISOString()
    }
    return mockBlogPosts[index]
  },

  async deletePost(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500))
    const index = mockBlogPosts.findIndex(post => post.id === id)
    if (index === -1) throw new Error('Post not found')
    mockBlogPosts.splice(index, 1)
  },

  async incrementViews(id: string): Promise<void> {
    const post = mockBlogPosts.find(p => p.id === id)
    if (post) {
      post.views_count += 1
    }
  },

  async toggleLike(postId: string, userIp: string): Promise<boolean> {
    // Simple mock - in real app this would check if user already liked
    const post = mockBlogPosts.find(p => p.id === postId)
    if (post) {
      const liked = Math.random() > 0.5 // Random for demo
      if (liked) {
        post.likes_count += 1
      } else {
        post.likes_count = Math.max(0, post.likes_count - 1)
      }
      return liked
    }
    return false
  },

  async hasUserLiked(postId: string, userIp: string): Promise<boolean> {
    // Random for demo - in real app this would check database
    return Math.random() > 0.7
  },

  async getComments(postId: string): Promise<BlogComment[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockBlogComments
      .filter(c => c.post_id === postId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async getAllComments(): Promise<(BlogComment & { post_title?: string })[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockBlogComments.map(comment => {
      const post = mockBlogPosts.find(p => p.id === comment.post_id)
      return {
        ...comment,
        post_title: post ? post.title : 'Unknown Post'
      }
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  },

  async createComment(postId: string, author: string, content: string): Promise<BlogComment> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const newComment: BlogComment = {
      id: Date.now().toString(),
      post_id: postId,
      author,
      content,
      created_at: new Date().toISOString()
    }
    mockBlogComments.unshift(newComment)
    return newComment
  },

  async deleteComment(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    const index = mockBlogComments.findIndex(c => c.id === id)
    if (index !== -1) {
      mockBlogComments.splice(index, 1)
    }
  },

  async getTotalCommentsCount(): Promise<number> {
    return mockBlogComments.length
  }
}