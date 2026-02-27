import { useCallback } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { blogAPI, BlogPost } from '@/lib/supabase'
import { toast } from 'sonner'

export const useBlogOperations = () => {
  const queryClient = useQueryClient()

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>) =>
      blogAPI.createPost(data),
    onSuccess: (newPost) => {
      // Update admin posts cache
      queryClient.setQueryData(['admin-posts'], (old: BlogPost[] = []) => [newPost, ...old])

      // If published, update public posts cache
      if (newPost.published) {
        queryClient.setQueryData(['posts'], (old: BlogPost[] = []) => [newPost, ...old])
      }

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      if (newPost.published) {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
      }
    },
    onError: (error: any) => {
      console.error('Create post error:', error)
      toast.error(`Failed to create post: ${error.message}`)
    }
  })

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) =>
      blogAPI.updatePost(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-posts'] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      // Snapshot previous values
      const previousAdminPosts = queryClient.getQueryData(['admin-posts'])
      const previousPublicPosts = queryClient.getQueryData(['posts'])

      // Optimistically update admin posts
      queryClient.setQueryData(['admin-posts'], (old: BlogPost[] = []) =>
        old.map(post => post.id === id ? { ...post, ...data } : post)
      )

      // Handle public posts cache
      if (data.published === false) {
        // If unpublishing, remove from public list
        queryClient.setQueryData(['posts'], (old: BlogPost[] = []) =>
          old.filter(post => post.id !== id)
        )
      } else if (data.published === true || (previousPublicPosts as BlogPost[] | undefined)?.find((p: BlogPost) => p.id === id)) {
        // If publishing or already published, update
        queryClient.setQueryData(['posts'], (old: BlogPost[] = []) =>
          old.map(post => post.id === id ? { ...post, ...data } : post)
        )
      }

      return { previousAdminPosts, previousPublicPosts }
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousAdminPosts) {
        queryClient.setQueryData(['admin-posts'], context.previousAdminPosts)
      }
      if (context?.previousPublicPosts) {
        queryClient.setQueryData(['posts'], context.previousPublicPosts)
      }

      console.error('Update post error:', error)
      toast.error(`Failed to update post: ${error.message}`)
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: (id: string) => blogAPI.deletePost(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['admin-posts'] })
      await queryClient.cancelQueries({ queryKey: ['posts'] })

      // Snapshot previous values
      const previousAdminPosts = queryClient.getQueryData(['admin-posts'])
      const previousPublicPosts = queryClient.getQueryData(['posts'])

      // Optimistically remove from both caches
      queryClient.setQueryData(['admin-posts'], (old: BlogPost[] = []) =>
        old.filter(post => post.id !== id)
      )
      queryClient.setQueryData(['posts'], (old: BlogPost[] = []) =>
        old.filter(post => post.id !== id)
      )

      return { previousAdminPosts, previousPublicPosts }
    },
    onError: (error: any, variables, context) => {
      // Rollback on error
      if (context?.previousAdminPosts) {
        queryClient.setQueryData(['admin-posts'], context.previousAdminPosts)
      }
      if (context?.previousPublicPosts) {
        queryClient.setQueryData(['posts'], context.previousPublicPosts)
      }

      console.error('Delete post error:', error)
      toast.error(`Failed to delete post: ${error.message}`)
    },
    onSuccess: () => {
      toast.success('Post deleted successfully')
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['admin-posts'] })
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  // Convenience functions
  const createPost = useCallback((data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'views_count'>) => {
    return createPostMutation.mutateAsync(data)
  }, [createPostMutation])

  const updatePost = useCallback((id: string, data: Partial<BlogPost>) => {
    return updatePostMutation.mutateAsync({ id, data })
  }, [updatePostMutation])

  const deletePost = useCallback((id: string) => {
    return deletePostMutation.mutateAsync(id)
  }, [deletePostMutation])

  return {
    createPost,
    updatePost,
    deletePost,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending,
    isLoading: createPostMutation.isPending || updatePostMutation.isPending || deletePostMutation.isPending
  }
}