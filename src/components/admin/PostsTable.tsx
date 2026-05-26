import React, { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import {
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Globe,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  MessageSquare,
  Heart,
  Edit3,
  Check,
  X,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { BlogPost } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PostsTableProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
  onView: (post: BlogPost) => void
  onUpdateStats?: (id: string, views: number, likes: number) => Promise<void>
}

const StatusBadge = memo(({ post }: { post: BlogPost }) => {
  if (post.published) {
    if (post.publish_at && new Date(post.publish_at) > new Date()) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Clock className="w-3 h-3 mr-1" /> Scheduled
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
        <CheckCircle className="w-3 h-3 mr-1" /> Published
      </Badge>
    )
  }
  return (
    <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
      <AlertCircle className="w-3 h-3 mr-1" /> Draft
    </Badge>
  )
})

StatusBadge.displayName = 'StatusBadge'

// Enhanced Stats Editor with Real vs Display separation
const StatsEditor = memo(({ post, onUpdate }: { post: BlogPost; onUpdate?: (id: string, views: number, likes: number, displayViews?: number, displayLikes?: number) => Promise<void> }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'real' | 'display'>('display')
  
  // Real counts
  const [realViews, setRealViews] = useState(post.views_count ?? 0)
  const [realLikes, setRealLikes] = useState(post.likes_count ?? 0)
  
  // Display counts (what users see)
  const [displayViews, setDisplayViews] = useState(post.display_views_count ?? post.views_count ?? 0)
  const [displayLikes, setDisplayLikes] = useState(post.display_likes_count ?? post.likes_count ?? 0)
  
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSave = async () => {
    if (!onUpdate) return

    try {
      setIsUpdating(true)
      // Pass both real and display counts
      await onUpdate(post.id, realViews, realLikes, displayViews, displayLikes)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update stats:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancel = () => {
    setRealViews(post.views_count ?? 0)
    setRealLikes(post.likes_count ?? 0)
    setDisplayViews(post.display_views_count ?? post.views_count ?? 0)
    setDisplayLikes(post.display_likes_count ?? post.likes_count ?? 0)
    setIsOpen(false)
  }

  const realViewsDiff = realViews !== (post.views_count ?? 0)
  const realLikesDiff = realLikes !== (post.likes_count ?? 0)
  const displayViewsDiff = displayViews !== (post.display_views_count ?? post.views_count ?? 0)
  const displayLikesDiff = displayLikes !== (post.display_likes_count ?? post.likes_count ?? 0)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-end gap-4 text-sm cursor-pointer">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group">
                <Eye className="w-3 h-3" />
                <span>{((post.display_views_count ?? post.views_count) ?? 0).toLocaleString()}</span>
                {onUpdate && <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Display: {((post.display_views_count ?? post.views_count) ?? 0).toLocaleString()}</p>
              <p>Real: {(post.views_count ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Click to edit</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors group">
                <Heart className="w-3 h-3" />
                <span>{((post.display_likes_count ?? post.likes_count) ?? 0).toLocaleString()}</span>
                {onUpdate && <Edit3 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" />}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Display: {((post.display_likes_count ?? post.likes_count) ?? 0).toLocaleString()}</p>
              <p>Real: {(post.likes_count ?? 0).toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Click to edit</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </PopoverTrigger>

      {onUpdate && (
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Edit Stats
              </h4>
            </div>

            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'real' | 'display')}>
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="real" className="gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Real
                </TabsTrigger>
                <TabsTrigger value="display" className="gap-1">
                  <Eye className="w-3 h-3" />
                  Display
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="real" className="space-y-3 mt-3">
                  <Alert className="bg-blue-500/10 border-blue-500/20 py-2">
                    <TrendingUp className="w-3 h-3 text-blue-500" />
                    <AlertDescription className="text-xs text-blue-500 mt-1">
                      Real counts are used for analytics only
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-1">
                    <Label htmlFor="real-views" className="text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Real Views
                    </Label>
                    <Input
                      id="real-views"
                      type="number"
                      min="0"
                      value={realViews}
                      onChange={(e) => setRealViews(parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                    {realViewsDiff && (
                      <p className="text-xs text-amber-500">Changed from {(post.views_count ?? 0).toLocaleString()}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="real-likes" className="text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Real Likes
                    </Label>
                    <Input
                      id="real-likes"
                      type="number"
                      min="0"
                      value={realLikes}
                      onChange={(e) => setRealLikes(parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                    {realLikesDiff && (
                      <p className="text-xs text-amber-500">Changed from {(post.likes_count ?? 0).toLocaleString()}</p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="display" className="space-y-3 mt-3">
                  <Alert className="bg-amber-500/10 border-amber-500/20 py-2">
                    <Eye className="w-3 h-3 text-amber-500" />
                    <AlertDescription className="text-xs text-amber-500 mt-1">
                      Display counts are shown to users on the blog
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-1">
                    <Label htmlFor="display-views" className="text-xs flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      Display Views
                    </Label>
                    <Input
                      id="display-views"
                      type="number"
                      min="0"
                      value={displayViews}
                      onChange={(e) => setDisplayViews(parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                    {displayViewsDiff && (
                      <p className="text-xs text-amber-500">Changed from {((post.display_views_count ?? post.views_count) ?? 0).toLocaleString()}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="display-likes" className="text-xs flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      Display Likes
                    </Label>
                    <Input
                      id="display-likes"
                      type="number"
                      min="0"
                      value={displayLikes}
                      onChange={(e) => setDisplayLikes(parseInt(e.target.value) || 0)}
                      className="h-8"
                    />
                    {displayLikesDiff && (
                      <p className="text-xs text-amber-500">Changed from {((post.display_likes_count ?? post.likes_count) ?? 0).toLocaleString()}</p>
                    )}
                  </div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={isUpdating}
              >
                <X className="w-3 h-3 mr-1" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-primary hover:bg-primary/90"
              >
                <Check className="w-3 h-3 mr-1" />
                {isUpdating ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </PopoverContent>
      )}
    </Popover>
  )
})

StatsEditor.displayName = 'StatsEditor'

const PostRow = memo(({ post, onEdit, onDelete, onView, onUpdateStats }: {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
  onView: (post: BlogPost) => void
  onUpdateStats?: (id: string, views: number, likes: number, displayViews?: number, displayLikes?: number) => Promise<void>
}) => {
  const isScheduled = post.published && post.publish_at && new Date(post.publish_at) > new Date()
  const publishDate = post.publish_at ? new Date(post.publish_at) : new Date(post.created_at)

  return (
    <TableRow className="group hover:bg-muted/50 transition-colors">
      <TableCell>
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {post.excerpt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-mono bg-muted/50 px-2 py-1 rounded">
              /{post.slug}
            </span>
            {post.tags && post.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 2 && (
                  <span className="text-muted-foreground">+{post.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <StatusBadge post={post} />
      </TableCell>

      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span>{format(publishDate, 'MMM d, yyyy')}</span>
          </div>
          {isScheduled && (
            <div className="flex items-center gap-1 text-xs text-blue-500">
              <Clock className="w-3 h-3" />
              <span>{format(publishDate, 'h:mm a')}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            <span>{post.author_name}</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-right">
        <StatsEditor post={post} onUpdate={onUpdateStats} />
      </TableCell>

      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(post)} className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit Post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onView(post)} className="cursor-pointer">
              <Globe className="mr-2 h-4 w-4" /> View Live
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
                  onDelete(post.id)
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
})

PostRow.displayName = 'PostRow'

export const PostsTable = memo(({ posts, onEdit, onDelete, onView, onUpdateStats }: PostsTableProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm"
    >
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[45%]">Post Details</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[20%]">Publication</TableHead>
            <TableHead className="w-[10%] text-right">Stats (Display/Real)</TableHead>
            <TableHead className="w-[10%] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-8 h-8" />
                  <p>No posts found</p>
                  <p className="text-sm">Create your first post to get started</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post, index) => (
              <motion.tr key={post.id} variants={item}>
                <PostRow
                  post={post}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onView={onView}
                  onUpdateStats={onUpdateStats}
                />
              </motion.tr>
            ))
          )}
        </TableBody>
      </Table>
    </motion.div>
  )
})

PostsTable.displayName = 'PostsTable'
