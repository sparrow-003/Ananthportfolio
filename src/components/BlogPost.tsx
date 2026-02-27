import React, { useState, useEffect, useCallback, memo } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ArrowLeft, Heart, Eye, Share2, Calendar, Clock, Send, MessageSquare, User, Hash } from 'lucide-react'
import { BlogPost as BlogPostType, BlogComment, blogAPI } from '@/lib/supabase'
import { getUserIP } from '@/lib/auth'
import { parseMarkdown } from '@/lib/markdown'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BlogPostProps {
  post: BlogPostType
  onBack: () => void
}

const BlogPost = memo(({ post, onBack }: BlogPostProps) => {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes_count)
  const [loading, setLoading] = useState(false)
  const [comments, setComments] = useState<BlogComment[]>([])
  const [newComment, setNewComment] = useState('')
  const [commentAuthor, setCommentAuthor] = useState('')
  const [showShareDialog, setShowShareDialog] = useState(false)

  const shareUrl = `${window.location.origin}/blog/${post.slug}`
  const [shortUrl, setShortUrl] = useState(shareUrl)

  useEffect(() => {
    blogAPI.incrementViews(post.id)
    checkIfLiked()
    loadComments()
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Generate short URL
    fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(shareUrl)}`)
      .then(res => res.ok ? res.text() : shareUrl)
      .then(setShortUrl)
      .catch(() => setShortUrl(shareUrl))

    // Update title for SEO
    document.title = `${post.title} | Genesis Blog`
    return () => {
      document.title = 'Genesis Blog'
    }
  }, [post.id, shareUrl, post.title])

  const loadComments = useCallback(async () => {
    try {
      const data = await blogAPI.getComments(post.id)
      setComments(data)
    } catch (error) {
      console.error('Error loading comments:', error)
    }
  }, [post.id])

  const checkIfLiked = useCallback(async () => {
    try {
      const localLiked = localStorage.getItem(`liked_${post.id}`) === 'true'
      if (localLiked) setLiked(true)

      const userIP = await getUserIP()
      const hasLiked = await blogAPI.hasUserLiked(post.id, userIP)

      if (hasLiked !== localLiked) {
        setLiked(hasLiked)
        localStorage.setItem(`liked_${post.id}`, String(hasLiked))
      }
    } catch (error) {
      console.error('Error checking like status:', error)
    }
  }, [post.id])

  const handleLike = useCallback(async () => {
    if (loading) return
    setLoading(true)

    const newLikedState = !liked
    setLiked(newLikedState)
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1)
    localStorage.setItem(`liked_${post.id}`, String(newLikedState))

    try {
      const userIP = await getUserIP()
      const isLiked = await blogAPI.toggleLike(post.id, userIP)

      if (isLiked !== newLikedState) {
        setLiked(isLiked)
        setLikesCount(prev => isLiked ? prev + 1 : prev - 1)
        localStorage.setItem(`liked_${post.id}`, String(isLiked))
      }
      toast.success(newLikedState ? 'Post liked!' : 'Like removed')
    } catch (error) {
      setLiked(!newLikedState)
      setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1)
      toast.error('Failed to update like')
    } finally {
      setLoading(false)
    }
  }, [loading, liked, post.id])

  const handleCommentSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const userCommentsKey = `user_comments_count_${post.id}`
    const userCommentCount = parseInt(localStorage.getItem(userCommentsKey) || '0')

    if (userCommentCount >= 5) {
      toast.error('You have reached the limit of 5 comments per post.')
      return
    }

    try {
      const createdComment = await blogAPI.createComment(post.id, commentAuthor || 'Anonymous', newComment)
      if (createdComment) {
        setComments(prev => [createdComment, ...prev])
        localStorage.setItem(userCommentsKey, (userCommentCount + 1).toString())
        setNewComment('')
        toast.success('Comment posted!')
      }
    } catch (error) {
      toast.error('Failed to post comment')
    }
  }, [newComment, commentAuthor, post.id])

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  const estimateReadingTime = useCallback((content: string) => {
    const wordCount = (content || '').split(/\s+/).length
    return Math.ceil(wordCount / 200) || 1
  }, [])

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <motion.article
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
        className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 font-sans relative"
      >
        {/* Back Button */}
        <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all rounded-full group px-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Button>
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="glass-card p-6 md:p-10 lg:p-12 overflow-hidden relative shadow-xl"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Header */}
          <header className="mb-12 relative z-10 border-b border-border pb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 backdrop-blur-sm uppercase tracking-wider text-[10px] rounded-full px-3 py-1 font-bold"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />

              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(post.created_at)}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground mb-8 leading-tight tracking-tighter">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-[1px]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider opacity-70">Written by</div>
                  <div className="font-bold text-foreground">{post.author_name || 'Ananth'}</div>
                </div>
              </div>

              <div className="w-px h-10 bg-border" />

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{estimateReadingTime(post.content)} min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl mb-12 group">
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent z-10" />
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose md:prose-lg prose-invert max-w-none mb-12 
          prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground 
          prose-h1:text-gradient prose-h1:font-black
          prose-a:text-primary hover:prose-a:text-primary/80 prose-a:no-underline hover:prose-a:underline
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-strong:text-foreground prose-strong:font-bold
          prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black/50 prose-pre:backdrop-blur-sm prose-pre:border prose-pre:border-white/10 prose-pre:shadow-xl
          prose-img:rounded-xl prose-img:shadow-2xl prose-img:border prose-img:border-white/10
          prose-hr:border-white/10"
          >
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(post.content) }}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-8 border-t border-border">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                className={cn(
                  "flex-1 sm:flex-none gap-2 h-12 px-6 rounded-full transition-all border-border bg-card hover:bg-primary/10",
                  liked ? "text-red-500 border-red-500/50 bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:border-red-500/50"
                )}
                onClick={handleLike}
                disabled={loading}
              >
                <Heart className={cn("w-5 h-5", liked && "fill-current")} />
                <span className="font-bold">{likesCount}</span>
              </Button>

              <Button
                variant="outline"
                className="flex-1 sm:flex-none gap-2 h-12 px-6 text-muted-foreground border-border bg-card hover:bg-primary/10 hover:text-primary hover:border-primary/50 rounded-full transition-all"
                onClick={() => setShowShareDialog(true)}
              >
                <Share2 className="w-5 h-5" />
                <span className="font-bold uppercase tracking-wider text-xs">Share</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        {post.allow_comments && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              Comments <span className="text-muted-foreground text-lg font-normal">({comments.length})</span>
            </h3>

            <div className="glass-card p-6 md:p-8 mb-8">
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name (Optional)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-lg h-12"
                />
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-card border-border text-foreground placeholder:text-muted-foreground min-h-[120px] focus:border-primary focus:ring-primary/20 rounded-lg resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 rounded-full h-12 shadow-lg shadow-primary/20"
                    disabled={!newComment.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-6">
              {comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-wide flex items-center gap-2">
                          {comment.author}
                          {comment.author === post.author_name && (
                            <Badge variant="secondary" className="text-[10px] bg-primary/20 text-primary border-none">Author</Badge>
                          )}
                        </h4>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-base leading-relaxed pl-[52px]">{comment.content}</p>
                </motion.div>
              ))}

              {comments.length === 0 && (
                <div className="text-center py-16 glass-card border-dashed border-border">
                  <MessageSquare className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg font-medium">No comments yet</p>
                  <p className="text-muted-foreground/60 text-sm">Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.article>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="glass-card text-foreground sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">Share this post</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Scan the QR code or copy the link below
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6 space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-xl">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}&color=10B981&bgcolor=ffffff`}
                alt="QR Code"
                className="w-48 h-48"
                loading="lazy"
              />
            </div>

            <div className="w-full space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Short Link</label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={shortUrl}
                  className="bg-card border-border text-muted-foreground font-mono text-xs rounded-lg h-10"
                />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shortUrl)
                    toast.success('Link copied!')
                  }}
                  size="icon"
                  className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 w-10"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
})

BlogPost.displayName = 'BlogPost'

export default BlogPost