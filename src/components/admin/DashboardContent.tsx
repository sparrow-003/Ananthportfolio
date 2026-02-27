import React, { memo } from 'react'
import { BlogPost as BlogPostType, BlogComment } from '@/lib/supabase'
import { DashboardStats } from './DashboardStats'
import { PostsTable } from './PostsTable'
import { Loader2 } from 'lucide-react'

interface DashboardContentProps {
  posts: BlogPostType[]
  comments: (BlogComment & { post_title?: string })[]
  isLoading: boolean
  onEdit: (post: BlogPostType) => void
  onDelete: (id: string) => void
  onView: (post: BlogPostType) => void
}

import { AdminDashboardSkeleton } from "@/components/skeletons/AdminSkeleton"

export const DashboardContent = memo(({
  posts,
  comments,
  isLoading,
  onEdit,
  onDelete,
  onView
}: DashboardContentProps) => {
  if (isLoading) {
    return <AdminDashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <DashboardStats
        stats={{
          totalPosts: posts.length,
          totalViews: posts.reduce((acc, p) => acc + p.views_count, 0),
          totalComments: comments.length,
          activeNow: 12
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Recent Posts</h2>
          <PostsTable
            posts={posts.slice(0, 5)}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        </div>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-4 h-[400px] overflow-y-auto">
            {comments.length > 0 ? (
              <div className="space-y-3">
                {comments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="text-sm border-b border-border/30 pb-2">
                    <p className="font-medium text-foreground">{comment.author}</p>
                    <p className="text-muted-foreground text-xs truncate">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      on {comment.post_title || 'Unknown Post'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity to display.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})

DashboardContent.displayName = 'DashboardContent'
