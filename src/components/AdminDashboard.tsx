import React, { useState, useCallback, memo, lazy, Suspense } from 'react'
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

// Lazy load heavy components
const PostEditor = lazy(() => import('./admin/PostEditor').then(module => ({ default: module.PostEditor })))
const CliTerminal = lazy(() => import('./admin/CliTerminal').then(module => ({ default: module.CliTerminal })))
const PostsTable = lazy(() => import('./admin/PostsTable').then(module => ({ default: module.PostsTable })))
const DashboardContent = lazy(() => import('./admin/DashboardContent').then(module => ({ default: module.DashboardContent })))

interface AdminDashboardProps {
  onLogout: () => void
}

const AdminDashboard = memo(({ onLogout }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState('dashboard')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPostType | null>(null)

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

  const handleLogout = useCallback(() => {
    adminAuth.logout()
    onLogout()
  }, [onLogout])

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
        />

        <main className="flex-1 overflow-y-auto p-8 relative">
          {/* Background - simplified for performance */}
          <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 -z-20" />

          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {activeView === 'dashboard' ? 'Dashboard' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, Admin. Here's what's happening today.
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
                <Button
                  onClick={() => openEditor()}
                  disabled={operationLoading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create Post
                </Button>
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

            {/* Content - no heavy animations */}
            {activeView === 'dashboard' && (
              <Suspense fallback={<AdminDashboardSkeleton />}>
                <DashboardContent
                  posts={posts}
                  comments={comments}
                  isLoading={postsLoading}
                  onEdit={openEditor}
                  onDelete={handleDelete}
                  onView={handleViewPost}
                />
              </Suspense>
            )}

            {activeView === 'posts' && (
              <div>
                {postsLoading ? (
                  <AdminTableSkeleton />
                ) : (
                  <Suspense fallback={<AdminTableSkeleton />}>
                    <PostsTable
                      posts={posts}
                      onEdit={openEditor}
                      onDelete={handleDelete}
                      onView={handleViewPost}
                    />
                  </Suspense>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
})

AdminDashboard.displayName = 'AdminDashboard'

export default AdminDashboard
