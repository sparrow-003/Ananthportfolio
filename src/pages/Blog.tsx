import { useState, useEffect, Suspense, lazy, memo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import { toast } from 'sonner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

// Lazy load components for better performance
const BlogList = lazy(() => import('@/components/BlogList'))
const BlogPost = lazy(() => import('@/components/BlogPost'))

import { BlogPostSkeleton, BlogListSkeleton } from '@/components/skeletons/BlogSkeleton'

const Blog = memo(() => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [selectedPost, setSelectedPost] = useState<BlogPostType | null>(null)

  // Fetch single post when slug is provided
  const {
    data: fetchedPost,
    isLoading,
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

  // Handle post data and view tracking
  useEffect(() => {
    if (slug && fetchedPost) {
      setSelectedPost(fetchedPost)
      blogAPI.incrementViews(fetchedPost.id).catch(console.error)
    } else if (!slug) {
      setSelectedPost(null)
    }
  }, [slug, fetchedPost])

  // Handle errors and not found cases
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

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <main className="pt-24 pb-12 relative z-10 min-h-[80vh]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading-slug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              <BlogPostSkeleton />
            </motion.div>
          ) : isError ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto px-4 py-12"
            >
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
            </motion.div>
          ) : (
            <motion.div
              key={selectedPost ? `post-${selectedPost.id}` : 'list'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Suspense fallback={slug ? <BlogPostSkeleton /> : <BlogListSkeleton />}>
                {selectedPost ? (
                  <BlogPost post={selectedPost} onBack={handleBackToBlog} />
                ) : (
                  <BlogList onPostSelect={handlePostSelect} />
                )}
              </Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
})

Blog.displayName = 'Blog'

export default Blog
