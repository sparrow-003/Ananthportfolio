import React, { memo } from 'react'
import { motion } from 'framer-motion'
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
  Heart
} from 'lucide-react'
import { BlogPost } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
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

interface PostsTableProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
  onView: (post: BlogPost) => void
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

const PostRow = memo(({ post, onEdit, onDelete, onView }: {
  post: BlogPost
  onEdit: (post: BlogPost) => void
  onDelete: (id: string) => void
  onView: (post: BlogPost) => void
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
        <div className="flex items-center justify-end gap-4 text-sm">
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Eye className="w-3 h-3" />
                <span>{post.views_count.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Views</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                <Heart className="w-3 h-3" />
                <span>{post.likes_count.toLocaleString()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Likes</p>
            </TooltipContent>
          </Tooltip>
        </div>
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

export const PostsTable = memo(({ posts, onEdit, onDelete, onView }: PostsTableProps) => {
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
            <TableHead className="w-[10%] text-right">Stats</TableHead>
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
