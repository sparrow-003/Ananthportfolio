import React, { useState, useCallback, memo, lazy, Suspense, useMemo } from 'react'
import { BlogPost as BlogPostType } from '@/lib/supabase'
import { adminAuth } from '@/lib/auth'
import { useBlogOperations } from '@/hooks/useBlogOperations'
import { useAdminData } from '@/hooks/useAdminData'
import { toast } from 'sonner'
import { AdminHeader } from './admin/AdminHeader'
import { AdminSidebar } from './admin/AdminSidebar'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { AdminTableSkeleton, AdminDashboardSkeleton } from '@/components/skeletons/AdminSkeleton'

// Lazy load heavy components - use enhanced editor
const PostEditor = lazy(() => import('./admin/EnhancedPostEditor').then(module => ({ default: module.PostEditor })))
const CliTerminal = lazy(() => import('./admin/CliTerminal').then(module => ({ default: module.CliTerminal })))
const PostsTable = lazy(() => import('./admin/PostsTable').then(module => ({ default: module.PostsTable })))
const DashboardContent = lazy(() => import('./admin/DashboardContent').then(module => ({ default: module.DashboardContent })))
const AnalyticsView = lazy(() => import('./admin/AnalyticsView').then(module => ({ default: module.AnalyticsView })))
const CommentsView = lazy(() => import('./admin/CommentsView').then(module => ({ default: module.CommentsView })))
const AppearanceView = lazy(() => import('./admin/AppearanceView').then(module => ({ default: module.AppearanceView })))
const SettingsView = lazy(() => import('./admin/SettingsView').then(module => ({ default: module.SettingsView })))

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = memo(({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Use optimized data hook
  const {
    posts,
    postsLoading,
    postsError,
    comments,
    commentsLoading,
    commentsError,
    handleRefresh
  } = useAdminData()

  const { createPost, updatePost, deletePost, isLoading: operationLoading } = useBlogOperations()

  // Filter posts by search query
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts
    const q = searchQuery.toLowerCase()
    return posts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (p.author_name || '').toLowerCase().includes(q)
    )
  }, [posts, searchQuery])

  // --- Editor Logic ---
  const openEditor = useCallback((post?: BlogPostType) => {
    setEditingPost(post || null)
    setShowEditor(true)
  }, [])

  const closeEditor = useCallback(() => {
    setShowEditor(false)
    setEditingPost(null)
  }, [])

  const handleSave = useCallback(async (data: any) => {
    try {
      const isScheduled = data.published && data.publish_at && new Date(data.publish_at) > new Date()

      if (editingPost) {
        await updatePost(editingPost.id, data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post updated!' : 'Draft saved'))
      } else {
        await createPost(data)
        toast.success(isScheduled ? 'Post scheduled!' : (data.published ? 'Post created!' : 'Draft saved'))
      }

      closeEditor()
    } catch (error: any) {
      console.error('Error saving:', error)
      throw error
    }
  }, [editingPost, updatePost, createPost, closeEditor])

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return

    try {
      await deletePost(id)
    } catch (error: any) {
      console.error('Error deleting:', error)
    }
  }, [deletePost])

  const handleViewPost = useCallback((post: BlogPostType) => {
    window.open(`/blog/${post.slug}`, '_blank')
  }, [])

  const handlePublishPost = useCallback(async (id: string) => {
    await updatePost(id, { published: true })
  }, [updatePost])

  const handleDeletePostCli = useCallback(async (id: string) => {
    await deletePost(id)
  }, [deletePost])

  const handleUpdateStats = useCallback(async (id: string, views: number, likes: number, displayViews?: number, displayLikes?: number) => {
    try {
      const updates: any = {}
      
      // Update real counts if provided
      if (views !== undefined) updates.views_count = views
      if (likes !== undefined) updates.likes_count = likes
      
      // Update display counts if provided
      if (displayViews !== undefined) updates.display_views_count = displayViews
      if (displayLikes !== undefined) updates.display_likes_count = displayLikes
      
      await updatePost(id, updates)
      toast.success('Stats updated successfully!')
    } catch (error: any) {
      console.error('Error updating stats:', error)
      toast.error('Failed to update stats')
      throw error
    }
  }, [updatePost])

  const handleLogout = useCallback(() => {
    adminAuth.logout()
    onLogout()
  }, [onLogout])

  // Get view title
  const viewTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    posts: 'All Posts',
    stats: 'Analytics',
    comments: 'Comments',
    appearance: 'Appearance',
    settings: 'Settings',
  }

  // Show editor
  if (showEditor) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-background gap-4">
            <AdminTableSkeleton />
            <span className="text-muted-foreground animate-pulse">Initializing Editor...</span>
          </div>
        }>
          <PostEditor
            post={editingPost}
            onSave={handleSave}
            onClose={closeEditor}
            onDelete={handleDelete}
          />
        </Suspense>
      </div>
    )
  }

  // Show CLI terminal
  if (activeView === 'cli') {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen bg-black text-green-500 font-mono">
            &gt; SYSTEM LOADING...
          </div>
        }>
          <CliTerminal
            posts={posts}
            comments={comments}
            onEditPost={openEditor}
            onPublishPost={handlePublishPost}
            onDeletePost={handleDeletePostCli}
            onRefresh={handleRefresh}
            onExitCli={() => setActiveView('dashboard')}
          />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <AdminSidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div className={`flex-1 flex flex-col transition-all duration-200 ${isSidebarCollapsed ? 'ml-[80px]' : 'ml-[280px]'}`}>
        <AdminHeader
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Background */}
          <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-20" />

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {viewTitles[activeView] || activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {activeView === 'dashboard' && 'Welcome back, Admin. Here\'s what\'s happening today.'}
                  {activeView === 'posts' && `${filteredPosts.length} posts${searchQuery ? ` matching "${searchQuery}"` : ''}`}
                  {activeView === 'stats' && 'Deep dive into your blog metrics'}
                  {activeView === 'comments' && 'Manage reader engagement'}
                  {activeView === 'appearance' && 'Customize your admin experience'}
                  {activeView === 'settings' && 'Manage your account and system'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={postsLoading || commentsLoading || operationLoading}
                  className="hover:bg-muted"
                >
                  <RefreshCw className={`w-4 h-4 ${(postsLoading || commentsLoading || operationLoading) ? 'animate-spin' : ''}`} />
                </Button>
                {(activeView === 'dashboard' || activeView === 'posts') && (
                  <Button
                    onClick={() => openEditor()}
                    disabled={operationLoading}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Create Post
                  </Button>
                )}
              </div>
            </div>

            {/* Error Alerts */}
            {(postsError || commentsError) && (
              <Alert className="border-destructive/50 bg-destructive/10 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {postsError ? `Failed to load posts: ${postsError.message}` : `Failed to load comments: ${commentsError?.message}`}
                  <Button variant="link" className="p-0 h-auto ml-2 text-destructive" onClick={handleRefresh}>
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Content Views */}
            <Suspense fallback={<AdminDashboardSkeleton />}>
              {activeView === 'dashboard' && (
                <DashboardContent
                  posts={posts}
                  comments={comments}
                  isLoading={postsLoading}
                  onEdit={openEditor}
                  onDelete={handleDelete}
                  onView={handleViewPost}
                />
              )}

              {activeView === 'posts' && (
                <div>
                  {postsLoading ? (
                    <AdminTableSkeleton />
                  ) : (
                    <PostsTable
                      posts={filteredPosts}
                      onEdit={openEditor}
                      onDelete={handleDelete}
                      onView={handleViewPost}
                      onUpdateStats={handleUpdateStats}
                    />
                  )}
                </div>
              )}

              {activeView === 'stats' && (
                <AnalyticsView posts={posts} comments={comments} />
              )}

              {activeView === 'comments' && (
                <CommentsView comments={comments} isLoading={commentsLoading} />
              )}

              {activeView === 'appearance' && (
                <AppearanceView />
              )}

              {activeView === 'settings' && (
                <SettingsView onLogout={handleLogout} />
              )}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
})

AdminDashboard.displayName = 'AdminDashboard'

export default AdminDashboard