import React, { memo, useState, useCallback } from 'react'
import { BlogComment } from '@/lib/supabase'
import { blogAPI } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Trash2, Search, User, Calendar } from 'lucide-react'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

interface CommentsViewProps {
  comments: (BlogComment & { post_title?: string })[]
  isLoading: boolean
}

export const CommentsView = memo(({ comments, isLoading }: CommentsViewProps) => {
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const filteredComments = comments.filter(c =>
    c.author.toLowerCase().includes(search.toLowerCase()) ||
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    (c.post_title || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Delete this comment? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await blogAPI.deleteComment(id)
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] })
      toast.success('Comment deleted')
    } catch (error: any) {
      toast.error('Failed to delete comment: ' + error.message)
    } finally {
      setDeletingId(null)
    }
  }, [queryClient])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-xl bg-muted/50 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Comments</h2>
          <p className="text-muted-foreground text-sm mt-1">{comments.length} total comments</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search comments..."
          className="pl-9 bg-muted/50 border-border/50"
        />
      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {filteredComments.length > 0 ? filteredComments.map(comment => (
          <Card key={comment.id} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm font-semibold">{comment.author}</span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <span className="text-sm text-primary font-medium truncate">{comment.post_title || 'Unknown Post'}</span>
                  </div>
                  <p className="text-sm text-foreground/80 mt-1">{comment.content}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {comment.created_at ? format(new Date(comment.created_at), 'MMM d, yyyy HH:mm') : 'Unknown date'}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                  onClick={() => handleDelete(comment.id)}
                  disabled={deletingId === comment.id}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>{search ? 'No comments match your search.' : 'No comments yet.'}</p>
          </div>
        )}
      </div>
    </div>
  )
})

CommentsView.displayName = 'CommentsView'
