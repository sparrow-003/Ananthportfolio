import React, { useState, useMemo, useCallback, memo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter, Calendar, Tag, RefreshCw, AlertCircle } from 'lucide-react'
import { BlogPost as BlogPostType, blogAPI } from '@/lib/supabase'
import BlogCard from './BlogCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface BlogListProps {
  onPostSelect: (post: BlogPostType) => void
}

import { BlogListSkeleton } from './skeletons/BlogSkeleton'

import { useDebounce } from '@/hooks/useDebounce'

const BlogList = memo(({ onPostSelect }: BlogListProps) => {
  const {
    data: posts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['posts'],
    queryFn: blogAPI.getPosts,
    staleTime: 1000 * 60 * 2, // Data stays fresh for 2 minutes
    gcTime: 1000 * 60 * 10, // Cache for 10 minutes
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false, // Don't refetch on focus
    retry: 2,
    retryDelay: 1000
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')

  // Debounce search and tag filter for smoother filtering on large lists
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const debouncedSelectedTag = useDebounce(selectedTag, 300)
  const [isFiltering, setIsFiltering] = useState(false)

  // Show filtering state when inputs differ from debounced values
  useEffect(() => {
    setIsFiltering(searchTerm !== debouncedSearchTerm || selectedTag !== debouncedSelectedTag)
  }, [searchTerm, debouncedSearchTerm, selectedTag, debouncedSelectedTag])

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    posts.forEach(post => {
      if (post.tags) {
        post.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }, [posts])

  const filteredPosts = useMemo(() => {
    let filtered = [...posts]

    if (debouncedSearchTerm) {
      const term = debouncedSearchTerm.toLowerCase()
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        (post.tags && post.tags.some(tag => tag.toLowerCase().includes(term)))
      )
    }

    if (debouncedSelectedTag) {
      filtered = filtered.filter(post =>
        post.tags && post.tags.includes(debouncedSelectedTag)
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'popular':
          return (b.likes_count + b.views_count) - (a.likes_count + a.views_count)
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [posts, debouncedSearchTerm, debouncedSelectedTag, sortBy])

  const clearFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedTag('')
    setSortBy('newest')
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  const handleTagChange = useCallback((value: string) => {
    setSelectedTag(value === "all" ? "" : value)
  }, [])

  const handleSortChange = useCallback((value: 'newest' | 'oldest' | 'popular') => {
    setSortBy(value)
  }, [])

  const handleRefresh = useCallback(() => {
    refetch()
  }, [refetch])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-64 w-full bg-emerald-500/5 blur-3xl absolute -z-10" />
        <BlogListSkeleton />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-16 md:mb-24 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-primary/5 blur-[100px] rounded-full -z-10" />
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-primary/50" />
          <span className="text-primary font-bold uppercase tracking-[0.4em] text-xs glow-text">The Journal</span>
          <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-primary/50" />
        </div>
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 text-foreground tracking-tighter uppercase relative z-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50">Blog</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light tracking-wide px-4">
          Insights from the <span className="text-primary font-medium">Digital Frontier</span>.
        </p>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <Alert className="mb-8 border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load blog posts. Please try refreshing the page.
            <Button variant="link" className="p-0 h-auto ml-2 text-red-800" onClick={handleRefresh}>
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 items-stretch lg:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary rounded-none focus:ring-0 transition-all h-11"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Tag Filter */}
            <Select value={selectedTag || "all"} onValueChange={handleTagChange}>
              <SelectTrigger className="w-full sm:w-44 bg-card border-border text-foreground hover:border-primary rounded-none transition-all focus:ring-0 h-11">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50 rounded-none">
                <SelectItem value="all">All tags</SelectItem>
                {allTags.map(tag => (
                  <SelectItem key={tag} value={tag}>
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3 text-primary" />
                      {tag}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full sm:w-44 bg-card border-border text-foreground hover:border-primary rounded-none transition-all focus:ring-0 h-11">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border rounded-none">
                <SelectItem value="newest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Newest first
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Oldest first
                  </div>
                </SelectItem>
                <SelectItem value="popular">
                  <div className="flex items-center gap-2">
                    <Filter className="w-3 h-3" />
                    Most popular
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              className="border-border text-muted-foreground hover:text-primary hover:border-primary rounded-none hover:bg-primary/10 h-11 w-11"
              title="Refresh posts"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>

            {/* Clear Filters */}
            {(searchTerm || selectedTag || sortBy !== 'newest') && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-border text-muted-foreground hover:text-primary hover:border-primary rounded-none hover:bg-primary/10 h-11 w-full sm:w-auto"
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(searchTerm || selectedTag) && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary" className="bg-card text-foreground border border-border rounded-none">
                {`Search: "${searchTerm}"`}
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="bg-card text-foreground border border-border rounded-none">
                <Tag className="w-3 h-3 mr-1 text-primary inline-block" />
                {selectedTag}
              </Badge>
            )}
          </div>
        )}

        {/* Results Count */}
        {posts.length > 0 && (
          <div className="text-sm text-muted-foreground">
            {filteredPosts.length === posts.length
              ? `Showing all ${posts.length} posts`
              : `Showing ${filteredPosts.length} of ${posts.length} posts`
            }
          </div>
        )}
      </motion.div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg font-light italic">
            {posts.length === 0
              ? "No blog posts yet. Check back soon!"
              : "No posts match your filters."
            }
          </p>
          {posts.length > 0 && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="mt-4"
            >
              Clear filters
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="space-y-12">
          {/* Featured Post Section */}
          {!searchTerm && !selectedTag && sortBy === 'newest' && filteredPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <BlogCard
                  post={filteredPosts[0]}
                  onClick={() => onPostSelect(filteredPosts[0])}
                  featured={true}
                />
              </div>
            </motion.div>
          )}

          {/* Grid Layout */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
          >
            {filteredPosts.slice(!searchTerm && !selectedTag && sortBy === 'newest' ? 1 : 0).map((post) => (
              <motion.div
                key={post.id}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
                }}
              >
                <BlogCard
                  post={post}
                  onClick={() => onPostSelect(post)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  )
})

BlogList.displayName = 'BlogList'

export default BlogList