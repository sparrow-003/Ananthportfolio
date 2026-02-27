-- Insert a test blog post to verify the system works
INSERT INTO public.blog_posts (
  title,
  content,
  excerpt,
  slug,
  published,
  tags,
  author_name,
  allow_comments,
  likes_count,
  views_count
) VALUES (
  'Welcome to My Blog',
  '# Welcome to My Blog

This is my first blog post! Here I share my thoughts on technology, design, and development.

## What to Expect

- **Tech tutorials** - Deep dives into modern web development
- **Design insights** - UI/UX best practices and trends
- **Personal projects** - Showcasing what I''m building

## Code Example

```javascript
const greeting = "Hello, World!";
console.log(greeting);
```

Stay tuned for more content coming soon!

---

*Thanks for reading!*',
  'Welcome to my blog where I share thoughts on technology, design, and development. Stay tuned for tutorials, insights, and personal project showcases.',
  'welcome-to-my-blog',
  true,
  ARRAY['welcome', 'introduction', 'blog'],
  'Ananth',
  true,
  0,
  0
);