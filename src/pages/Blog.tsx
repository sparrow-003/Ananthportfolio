import { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Seo from '@/components/Seo'
import { Helmet } from 'react-helmet-async'

const BlogList = lazy(() => import('@/components/BlogList'))
const BlogPost = lazy(() => import('@/components/BlogPost'))

import { BlogPostSkeleton, BlogListSkeleton } from '@/components/skeletons/BlogSkeleton'

const Blog = memo(() => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null)

  const {
    data: fetchedPost,
    isFetching,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => blogAPI.getPostBySlug(slug!),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    retry: 1,
    retryDelay: 1000
  })

  const isLoading = !!slug && isFetching && !fetchedPost

  useEffect(() => {
    if (slug && fetchedPost) {
      setSelectedPost(fetchedPost)
      blogAPI.incrementViews(fetchedPost.id).catch(console.error)
    } else if (!slug) {
      setSelectedPost(null)
    }
  }, [slug, fetchedPost])

  useEffect(() => {
    if (isError && slug) {
      console.error('Error loading post:', error)
    }
    if (slug && !isLoading && !fetchedPost && !isError) {
      toast.error('Post not found')
      navigate('/blog')
    }
  }, [isError, slug, isLoading, fetchedPost, navigate, error])

  const handlePostSelect = useCallback((post: BlogPostType) => {
    setSelectedPost(post)
    navigate(`/blog/${post.slug}`)
  }, [navigate])

  const handleBackToBlog = useCallback(() => {
    setSelectedPost(null)
    navigate('/blog')
  }, [navigate])

  const handleRetry = useCallback(() => {
    refetch()
  }, [refetch])

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="relative w-full">
          <BlogPostSkeleton />
        </div>
      )
    }

    if (isError) {
      return (
        <div className="max-w-2xl mx-auto px-4 py-12 w-full">
          <Alert className="border-destructive/20 bg-destructive/5 text-destructive backdrop-blur-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex flex-col gap-4">
              <span className="font-medium text-lg">Failed to load the blog post.</span>
              <span className="text-sm opacity-70">This might be due to a network issue or the post may not exist.</span>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  className="border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/blog')}
                  className="border-destructive/30 hover:bg-destructive/10 transition-colors"
                >
                  Back to Blog
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    return (
      <Suspense fallback={slug ? <BlogPostSkeleton /> : <BlogListSkeleton />}>
        {selectedPost ? (
          <BlogPost post={selectedPost} onBack={handleBackToBlog} />
        ) : (
          <BlogList onPostSelect={handlePostSelect} />
        )}
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {!slug && (
        <>
          <Seo
            title="Blog | ANANTH.DEV — AI, Web Development & Engineering Insights"
            description="Articles by Ananth N on AI engineering, full-stack web development, Python, React, TypeScript, and prompt engineering. Tutorials, deep dives, and project notes."
            path="/blog"
            type="website"
          />
          <Helmet>
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "ANANTH.DEV Blog",
              "url": "https://ananthdev.lovable.app/blog",
              "author": { "@type": "Person", "name": "Ananth N" },
              "description": "Articles on AI, web development, and engineering by Ananth N."
            })}</script>
            <script type="application/ld+json">{JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ananthdev.lovable.app/" },
                { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://ananthdev.lovable.app/blog" }
              ]
            })}</script>
          </Helmet>
        </>
      )}
      <main className="pt-24 pb-12 w-full min-h-[80vh]">
        {renderContent()}
      </main>
    </div>
  )
})

Blog.displayName = 'Blog'

export default Blog
