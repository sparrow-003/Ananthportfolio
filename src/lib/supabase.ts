// Use the single Supabase client from integrations to avoid duplicate instances
import { supabase } from '@/integrations/supabase/client'
import { mockBlogAPI } from './mockData'

// Re-export the supabase client for backward compatibility
export { supabase }

// Supabase is always configured
export const isSupabaseConfigured = true

// Edge function URL for admin operations
const EDGE_FUNCTION_URL = 'https://ahdxviaqamejzvtbsicg.supabase.co/functions/v1/admin-blog'

// Helper to get auth headers for edge function (JWT only - no fallback)
const getAdminHeaders = async () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`
  }
  
  return headers
}

// Helper to sanitize post data before sending to Supabase
const sanitizePostData = (post: any) => {
  const { 
    id, created_at, updated_at, likes_count, views_count, comments_count, blog_comments, 
    ...cleanData 
  } = post
  
  // Ensure required fields have default values
  return {
    ...cleanData,
    likes_count: 0, // Always start with 0 likes
    views_count: 0, // Always start with 0 views
    allow_comments: cleanData.allow_comments ?? true,
    author_name: cleanData.author_name || 'Ananth',
    published: cleanData.published ?? false,
    tags: Array.isArray(cleanData.tags) ? cleanData.tags : []
  }
}

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string | null
  tags: string[]
  published: boolean
  publish_at?: string | null
  created_at: string
  updated_at: string
  likes_count: number
  views_count: number
  comments_count?: number
  allow_comments: boolean
  author_name: string
  location?: string | null
}

export interface BlogComment {
  id: string
  post_id: string
  author: string
  content: string
  created_at: string
}

export interface BlogLike {
  id: string
  post_id: string
  user_ip: string
  created_at: string
}

// Blog API functions - will use mock data if Supabase is not configured
export const blogAPI = {
  // Get all published blog posts (public)
  async getPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPosts()
    }

    try {
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .or(`publish_at.lte.${nowIso},publish_at.is.null`)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching posts:', error)
        throw error
      }
      return data || []
    } catch (error) {
      console.error('Error in getPosts:', error)
      throw error
    }
  },

  // Get ALL posts (admin) - attempts direct DB first, falls back to edge function
  async getAllPosts(): Promise<BlogPost[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllPosts()
    }

    try {
      // Try direct database access first
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        return data
      }

      console.warn('Direct fetch failed, falling back to edge function:', error)

      // Use edge function for admin operations with JWT auth
      const headers = await getAdminHeaders()
      const response = await fetch(`${EDGE_FUNCTION_URL}/posts`, { headers })
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to fetch posts' }))
        throw new Error(error.error || 'Failed to fetch posts')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error in getAllPosts:', error)
      // Fallback to mock data if everything fails to prevent "stuck" state
      console.warn('All fetch methods failed, using mock data as fallback')
      return mockBlogAPI.getAllPosts()
    }
  },

  // Get single blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getPostBySlug(slug)
    }

    try {
      const nowIso = new Date().toISOString()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .or(`publish_at.lte.${nowIso},publish_at.is.null`)
        .single()
      
      if (error) {
        console.error('Error fetching post by slug:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error in getPostBySlug:', error)
      return null
    }
  },

  // Create new blog post (admin only) - uses edge function with JWT
  async createPost(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createPost(post)
    }

    try {
      // Auto-generate slug if not provided
      const postData = {
        ...post,
        slug: post.slug || generateSlug(post.title),
        author_name: post.author_name || 'Ananth',
        allow_comments: post.allow_comments ?? true,
        published: post.published ?? false,
        tags: Array.isArray(post.tags) ? post.tags : []
      }

      const cleanPost = sanitizePostData(postData)

      // Try direct database insert first (faster for simple operations)
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([cleanPost])
        .select()
        .single()

      if (error) {
        console.error('Direct insert failed, trying edge function:', error)
        
        // Fallback to edge function for admin operations
        const headers = await getAdminHeaders()
        const response = await fetch(`${EDGE_FUNCTION_URL}/posts`, {
          method: 'POST',
          headers,
          body: JSON.stringify(cleanPost)
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to create post' }))
          throw new Error(errorData.error || 'Failed to create post')
        }
        
        return await response.json()
      }

      return data
    } catch (error) {
      console.error('Error in createPost:', error)
      throw error
    }
  },

  // Update blog post (admin only) - uses edge function with JWT
  async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.updatePost(id, updates)
    }

    try {
      const cleanUpdates = sanitizePostData(updates)

      // Try direct database update first
      const { data, error } = await supabase
        .from('blog_posts')
        .update(cleanUpdates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Direct update failed, trying edge function:', error)
        
        // Fallback to edge function for admin operations
        const headers = await getAdminHeaders()
        const response = await fetch(`${EDGE_FUNCTION_URL}/posts/${id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(cleanUpdates)
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to update post' }))
          throw new Error(errorData.error || 'Failed to update post')
        }
        
        return await response.json()
      }

      return data
    } catch (error) {
      console.error('Error in updatePost:', error)
      throw error
    }
  },

  // Delete blog post (admin only) - uses edge function with JWT
  async deletePost(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.deletePost(id)
    }

    try {
      // Try direct database delete first
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Direct delete failed, trying edge function:', error)
        
        // Fallback to edge function for admin operations
        const headers = await getAdminHeaders()
        const response = await fetch(`${EDGE_FUNCTION_URL}/posts/${id}`, {
          method: 'DELETE',
          headers
        })
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to delete post' }))
          throw new Error(errorData.error || 'Failed to delete post')
        }
      }
    } catch (error) {
      console.error('Error in deletePost:', error)
      throw error
    }
  },

  // Increment view count
  async incrementViews(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.incrementViews(id)
    }

    try {
      const { error } = await supabase.rpc('increment_post_views', { post_id: id })
      if (error) {
        console.error('Error incrementing views:', error)
      }
    } catch (error) {
      console.error('Error in incrementViews:', error)
    }
  },

  // Like/unlike post (uses secure RPC functions)
  async toggleLike(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.toggleLike(postId, userIp)
    }

    try {
      // Check if user already liked this post using secure RPC
      const { data: hasLiked, error: checkError } = await supabase.rpc('has_user_liked', { 
        p_post_id: postId, 
        p_user_ip: userIp 
      })

      if (checkError) {
        console.error('Error checking like status:', checkError)
        throw checkError
      }

      if (hasLiked) {
        // Unlike using secure RPC
        const { error: unlikeError } = await supabase.rpc('unlike_post', { 
          p_post_id: postId, 
          p_user_ip: userIp 
        })
        
        if (unlikeError) {
          console.error('Error unliking post:', unlikeError)
          throw unlikeError
        }
        
        return false
      } else {
        // Like using secure RPC
        const { error: likeError } = await supabase.rpc('like_post', { 
          p_post_id: postId, 
          p_user_ip: userIp 
        })
        
        if (likeError) {
          console.error('Error liking post:', likeError)
          throw likeError
        }
        
        return true
      }
    } catch (error) {
      console.error('Error in toggleLike:', error)
      
      // RPC functions should always be used - no fallback to direct table access
      // This ensures IP hashing is always applied server-side
      throw error
    }
  },

  // Check if user liked post (uses secure RPC - no IP exposure)
  async hasUserLiked(postId: string, userIp: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.hasUserLiked(postId, userIp)
    }

    try {
      const { data, error } = await supabase.rpc('has_user_liked', { 
        p_post_id: postId, 
        p_user_ip: userIp 
      })
      
      if (error) {
        console.error('Error checking like status via RPC:', error)
        // No fallback - RPC functions must be used to protect IP privacy
        // Direct table access is blocked by RLS policies
        return false
      }
      
      return !!data
    } catch (error) {
      console.error('Error in hasUserLiked:', error)
      return false
    }
  },

  // Get comments for a post
  async getComments(postId: string): Promise<BlogComment[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getComments(postId)
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching comments:', error)
        return []
      }
      return data || []
    } catch (error) {
      console.error('Error in getComments:', error)
      return []
    }
  },

  // Get ALL comments (admin)
  async getAllComments(): Promise<(BlogComment & { post_title?: string })[]> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.getAllComments()
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*, blog_posts(title)')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching all comments:', error)
        return []
      }
      
      // Map the joined data to a flatter structure
      return data?.map(item => ({
        ...item,
        post_title: (item as any).blog_posts?.title
      })) || []
    } catch (error) {
      console.error('Error in getAllComments:', error)
      return []
    }
  },

  // Create a comment
  async createComment(postId: string, author: string, content: string): Promise<BlogComment | null> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.createComment(postId, author, content)
    }

    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert([{ post_id: postId, author, content }])
        .select()
        .single()
      
      if (error) {
        console.error('Error creating comment:', error)
        return null
      }
      return data
    } catch (error) {
      console.error('Error in createComment:', error)
      return null
    }
  },

  // Delete a comment (admin only)
  async deleteComment(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      return mockBlogAPI.deleteComment(id)
    }

    try {
      const { error } = await supabase
        .from('blog_comments')
        .delete()
        .eq('id', id)
      
      if (error) {
        console.error('Error deleting comment:', error)
        throw error
      }
    } catch (error) {
      console.error('Error in deleteComment:', error)
      throw error
    }
  },

  // Get total comments count (for admin stats)
  async getTotalCommentsCount(): Promise<number> {
    if (!isSupabaseConfigured) {
        return mockBlogAPI.getTotalCommentsCount()
    }
    
    try {
      const { count, error } = await supabase
        .from('blog_comments')
        .select('*', { count: 'exact', head: true })
        
      if (error) {
        console.error('Error getting comments count:', error)
        return 0
      }
      return count || 0
    } catch (error) {
      console.error('Error in getTotalCommentsCount:', error)
      return 0
    }
  }
}
