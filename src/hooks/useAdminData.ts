import { useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { blogAPI, BlogPost, BlogComment } from '@/lib/supabase'
import { toast } from 'sonner'

export const useAdminData = () => {
  const queryClient = useQueryClient()

  // Fetch posts with optimized settings for fast initial load
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = useQuery({
    queryKey: ['admin-posts'],
    queryFn: blogAPI.getAllPosts,
    staleTime: 60000, // 1 minute - reduce refetches
    gcTime: 300000, // 5 minutes cache
    refetchInterval: 60000, // Refetch every 60 seconds (reduced from 30s)
    retry: 1,
    retryDelay: 500
  })

  // Fetch comments with optimized settings
  const {
    data: comments = [],
    isLoading: commentsLoading,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: blogAPI.getAllComments,
    staleTime: 120000, // 2 minutes
    gcTime: 600000, // 10 minutes cache
    refetchInterval: 120000, // Refetch every 2 minutes (reduced from 60s)
    retry: 1,
    retryDelay: 500
  })

  // Manual refresh function
  const handleRefresh = useCallback(async () => {
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      ])
      toast.success('Data refreshed successfully')
    } catch {
      toast.error('Failed to refresh data')
    }
  }, [queryClient])

  return {
    posts,
    postsLoading,
    postsError,
    refetchPosts,
    comments,
    commentsLoading,
    commentsError,
    refetchComments,
    handleRefresh,
    isLoading: postsLoading || commentsLoading
  }
}
