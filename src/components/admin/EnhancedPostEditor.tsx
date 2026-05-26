import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, X, Send, Calendar as CalendarIcon, MapPin, 
  MessageSquare, User, Tag, Link as LinkIcon, 
  ChevronLeft, MoreVertical, Globe, Eye, Trash2,
  Clock, FileText, Settings, Image as ImageIcon,
  LayoutTemplate, Bold, Italic, Heading, Quote, 
  List, Code, AlertCircle, CheckCircle2, Loader2,
  Maximize2, Minimize2, Type, ListOrdered, Minus, 
  Table as TableIcon, Strikethrough, Split, RefreshCw,
  Hash, RotateCcw, PlusCircle, Target, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { format } from 'date-fns'
import { BlogPost } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { parseMarkdown } from '@/lib/markdown'

interface PostEditorProps {
  post: BlogPost | null
  onSave: (data: any) => Promise<void>
  onClose: () => void
  onDelete?: (id: string) => void
}

interface FormData {
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image: string
  tags: string
  published: boolean
  publish_at: string
  allow_comments: boolean
  author_name: string
  location: string
  views_count: number
  likes_count: number
  display_views_count: number
  display_likes_count: number
}

interface ValidationErrors {
  title?: string
  content?: string
  excerpt?: string
  slug?: string
}

// SEO Score calculation
const calculateSEOScore = (data: FormData): { score: number; issues: string[] } => {
  const issues: string[] = []
  let score = 0

  // Title (30 points)
  if (data.title) {
    if (data.title.length >= 10 && data.title.length <= 60) {
      score += 30
    } else {
      issues.push(`Title should be 10-60 characters (currently ${data.title.length})`)
      score += 15
    }
  } else {
    issues.push('Title is missing')
  }

  // Excerpt (25 points)
  if (data.excerpt) {
    if (data.excerpt.length >= 120 && data.excerpt.length <= 160) {
      score += 25
    } else {
      issues.push(`Excerpt should be 120-160 characters (currently ${data.excerpt.length})`)
      score += 12
    }
  } else {
    issues.push('Excerpt is missing')
  }

  // Content length (20 points)
  const wordCount = data.content.trim().split(/\s+/).filter(Boolean).length
  if (wordCount >= 300) {
    score += 20
  } else {
    issues.push(`Content should be at least 300 words (currently ${wordCount})`)
    score += wordCount > 150 ? 10 : 5
  }

  // Tags (10 points)
  const tags = data.tags.split(',').map(t => t.trim()).filter(Boolean)
  if (tags.length >= 3 && tags.length <= 8) {
    score += 10
  } else {
    issues.push(`Add 3-8 tags (currently ${tags.length})`)
    score += 5
  }

  // Featured image (10 points)
  if (data.featured_image) {
    score += 10
  } else {
    issues.push('Featured image recommended')
  }

  // Slug (5 points)
  if (data.slug && /^[a-z0-9-]+$/.test(data.slug)) {
    score += 5
  } else {
    issues.push('URL slug needs improvement')
  }

  return { score, issues }
}

export const PostEditor = ({ post, onSave, onClose, onDelete }: PostEditorProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    featured_image: '',
    tags: '',
    published: false,
    publish_at: '',
    allow_comments: true,
    author_name: 'Ananth',
    location: '',
    views_count: 0,
    likes_count: 0,
    display_views_count: 0,
    display_likes_count: 0
  })

  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined)
  const [publishTime, setPublishTime] = useState<string>('')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState('write')
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPreviewSplit, setShowPreviewSplit] = useState(false)
  const [focusMode, setFocusMode] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveHistory, setSaveHistory] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const autoSaveRef = useRef<ReturnType<typeof setTimeout>>()

  // SEO Score calculation
  const seoAnalysis = useMemo(() => calculateSEOScore(formData), [formData])

  // Statistics
  const stats = useMemo(() => {
    const words = formData.content.trim().split(/\s+/).filter(Boolean)
    const sentences = formData.content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const paragraphs = formData.content.split('\n\n').filter(p => p.trim().length > 0)
    
    return {
      words: words.length,
      characters: formData.content.length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readTime: Math.ceil(words.length / 200),
      readability: sentences.length > 0 ? Math.round(words.length / sentences.length * 10) / 10 : 0
    }
  }, [formData.content])

  // Initialize form data when post changes
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        slug: post.slug,
        featured_image: post.featured_image || '',
        tags: post.tags ? post.tags.join(', ') : '',
        published: post.published,
        publish_at: post.publish_at || '',
        allow_comments: post.allow_comments ?? true,
        author_name: post.author_name ?? 'Ananth',
        location: post.location || '',
        views_count: post.views_count ?? 0,
        likes_count: post.likes_count ?? 0,
        display_views_count: post.display_views_count ?? post.views_count ?? 0,
        display_likes_count: post.display_likes_count ?? post.likes_count ?? 0
      })
      
      if (post.publish_at) {
        setScheduleEnabled(true)
        setPublishDate(new Date(post.publish_at))
        setPublishTime(format(new Date(post.publish_at), 'HH:mm'))
      }
    }
    setHasUnsavedChanges(false)
  }, [post])

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges && post) {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
      
      autoSaveRef.current = setTimeout(async () => {
        setAutoSaving(true)
        try {
          const dataToSave = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            publish_at: null // Auto-save never publishes
          }
          await onSave(dataToSave)
          setLastSaved(new Date())
          setSaveHistory(prev => [format(new Date(), 'HH:mm:ss'), ...prev.slice(0, 4)])
          setHasUnsavedChanges(false)
          toast.success('Draft auto-saved', { duration: 2000 })
        } catch (error) {
          console.error('Auto-save failed:', error)
        } finally {
          setAutoSaving(false)
        }
      }, 3000)
    }

    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current)
    }
  }, [hasUnsavedChanges, formData, post, onSave])

  // Track unsaved changes
  useEffect(() => {
    if (post) {
      setHasUnsavedChanges(true)
    }
  }, [formData, publishDate, publishTime, scheduleEnabled])

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave(false)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault()
        insertMarkdown('**', '**')
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault()
        insertMarkdown('*', '*')
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'P') {
        e.preventDefault()
        setActiveTab(activeTab === 'preview' ? 'write' : 'preview')
      }
      if (e.key === 'F11') {
        e.preventDefault()
        setIsFullscreen(!isFullscreen)
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        handleSave(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formData, activeTab, isFullscreen])

  // Validation function
  const validateForm = useCallback((): ValidationErrors => {
    const errors: ValidationErrors = {}
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required'
    }
    
    if (!formData.content.trim()) {
      errors.content = 'Content is required'
    }
    
    if (!formData.excerpt.trim()) {
      errors.excerpt = 'Excerpt is required for SEO'
    }
    
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens'
    }
    
    return errors
  }, [formData])

  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }, [])

  // Handle title change with auto-slug generation
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setFormData(prev => ({
      ...prev,
      title: newTitle,
      slug: prev.slug || generateSlug(newTitle)
    }))
  }, [generateSlug])

  // Handle form field changes
  const handleFieldChange = useCallback((field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear validation error for this field
    if (validationErrors[field as keyof ValidationErrors]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [validationErrors])

  // Handle save operation
  const handleSave = async (shouldPublish: boolean) => {
    try {
      setIsSaving(true)
      
      // Validate form
      const errors = validateForm()
      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors)
        toast.error('Please fix the validation errors')
        return
      }

      let finalPublishAt: string | null = null
      if (scheduleEnabled && publishDate) {
        const [hh = '00', mm = '00'] = publishTime.split(':')
        const d = new Date(publishDate)
        d.setHours(parseInt(hh), parseInt(mm), 0, 0)
        finalPublishAt = d.toISOString()
      }

      const dataToSave = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        publish_at: finalPublishAt,
        published: shouldPublish
      }

      await onSave(dataToSave)
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      setSaveHistory(prev => [format(new Date(), 'HH:mm:ss'), ...prev.slice(0, 4)])
      
      const action = scheduleEnabled && publishDate ? 'scheduled' : (shouldPublish ? 'published' : 'saved as draft')
      toast.success(`Post ${action} successfully!`)
      
    } catch (error: any) {
      console.error('Editor save error:', error)
      toast.error(error.message || 'Failed to save post')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle close with unsaved changes warning
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        onClose()
      }
    } else {
      onClose()
    }
  }, [hasUnsavedChanges, onClose])

  // Markdown insert function
  const insertMarkdown = useCallback((prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = formData.content
    const before = text.substring(0, start)
    const selection = text.substring(start, end)
    const after = text.substring(end)

    const newContent = before + prefix + (selection || '') + suffix + after
    
    setFormData(prev => ({ ...prev, content: newContent }))
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + (selection ? selection.length + suffix.length : 0)
      const finalPos = selection ? newCursorPos : start + prefix.length
      textarea.setSelectionRange(finalPos, finalPos)
    }, 0)
  }, [formData.content])

  // Enhanced toolbar with more options
  const EnhancedToolbar = () => (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm py-2 border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          <TooltipProvider>
            {/* Headings */}
            <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('# ')}>
                    <Heading className="w-4 h-4" />
                    <span className="text-[10px] ml-0.5">1</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>H1 Heading</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('## ')}>
                    <Heading className="w-4 h-4" />
                    <span className="text-[10px] ml-0.5">2</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>H2 Heading</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('### ')}>
                    <Heading className="w-4 h-4" />
                    <span className="text-[10px] ml-0.5">3</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>H3 Heading</TooltipContent>
              </Tooltip>
            </div>

            {/* Formatting */}
            <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('**', '**')}>
                    <Bold className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bold (Ctrl+B)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('*', '*')}>
                    <Italic className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Italic (Ctrl+I)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('~~', '~~')}>
                    <Strikethrough className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Strikethrough</TooltipContent>
              </Tooltip>
            </div>

            {/* Blocks */}
            <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('> ')}>
                    <Quote className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Quote</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('```\n', '\n```')}>
                    <Code className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Code Block</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('`', '`')}>
                    <Type className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Inline Code</TooltipContent>
              </Tooltip>
            </div>

            {/* Lists & Media */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('- ')}>
                    <List className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Bullet List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('1. ')}>
                    <ListOrdered className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Numbered List</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('[', '](url)')}>
                    <LinkIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Link</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('![alt](', ')')}>
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Image</TooltipContent>
              </Tooltip>
            </div>

            {/* Tables & Dividers */}
            <div className="flex items-center border-l border-border pl-2 ml-2 gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n| Cell 3 | Cell 4 |')}>
                    <TableIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Table</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={() => insertMarkdown('\n---\n')}>
                    <Minus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Divider</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        {/* Focus Mode Toggle */}
        <div className="flex items-center gap-2">
          <Badge variant={focusMode ? "default" : "outline"} className="text-xs">
            <Target className="w-3 h-3 mr-1" />
            Focus
          </Badge>
          <Switch
            checked={focusMode}
            onCheckedChange={setFocusMode}
          />
        </div>
      </div>
    </div>
  )

  // Render post settings with enhanced UI
  const renderPostSettings = () => (
    <Accordion type="multiple" defaultValue={['seo', 'publish', 'meta']} className="w-full">
      {/* SEO Score */}
      <AccordionItem value="seo" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>SEO Score</span>
            <Badge variant={seoAnalysis.score >= 80 ? "default" : seoAnalysis.score >= 60 ? "secondary" : "destructive"}>
              {seoAnalysis.score}/100
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-3">
            <Progress value={seoAnalysis.score} className="w-full" />
            {seoAnalysis.issues.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Improvements:</p>
                {seoAnalysis.issues.slice(0, 3).map((issue, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {issue}
                  </p>
                ))}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Publishing Settings */}
      <AccordionItem value="publish" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Publishing</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Schedule Publishing</span>
            <Switch 
              checked={scheduleEnabled} 
              onCheckedChange={(checked) => {
                setScheduleEnabled(checked)
                if (!checked) {
                  setPublishDate(undefined)
                  setPublishTime('')
                }
              }}
            />
          </div>
          
          {scheduleEnabled && (
            <div className="space-y-3 pt-2 animate-in fade-in zoom-in-95">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 h-4" />
                    {publishDate ? format(publishDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={setPublishDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Input 
                type="time" 
                value={publishTime}
                onChange={e => setPublishTime(e.target.value)}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Rest of settings... (keeping original structure but with enhanced UI) */}
      {/* Meta Data */}
      <AccordionItem value="meta" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-blue-500" />
            <span>Meta Data</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Excerpt * ({formData.excerpt.length}/160)</label>
            <Textarea 
              value={formData.excerpt}
              onChange={e => handleFieldChange('excerpt', e.target.value)}
              placeholder="Short summary for SEO..."
              className={cn(
                "h-20 text-sm resize-none",
                validationErrors.excerpt && "border-red-500 focus:border-red-500"
              )}
            />
            {validationErrors.excerpt && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.excerpt}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Tags ({formData.tags.split(',').map(t => t.trim()).filter(Boolean).length})
            </label>
            <Input 
              value={formData.tags}
              onChange={e => handleFieldChange('tags', e.target.value)}
              placeholder="Tech, Design, Life..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">URL Slug *</label>
            <div className="flex gap-2">
              <Input 
                value={formData.slug}
                onChange={e => handleFieldChange('slug', e.target.value)}
                placeholder="custom-url-slug"
                className={cn(
                  "font-mono text-xs",
                  validationErrors.slug && "border-red-500 focus:border-red-500"
                )}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleFieldChange('slug', generateSlug(formData.title))}
                title="Regenerate Slug"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
            {validationErrors.slug && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {validationErrors.slug}
              </p>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Featured Image */}
      <AccordionItem value="media" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Featured Image</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Image URL</label>
            <Input 
              value={formData.featured_image}
              onChange={e => handleFieldChange('featured_image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-xs font-mono"
            />
          </div>
          {formData.featured_image && (
            <div className="mt-3 rounded-lg overflow-hidden border border-border">
              <img 
                src={formData.featured_image} 
                alt="Featured image preview" 
                className="w-full h-auto max-h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Stats */}
      <AccordionItem value="stats" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <Eye className="w-4 h-4 text-cyan-500" />
            <span>Engagement Stats</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Views</label>
              <Input 
                type="number"
                min="0"
                value={formData.views_count ?? 0}
                onChange={e => handleFieldChange('views_count', parseInt(e.target.value) || 0)}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Likes</label>
              <Input 
                type="number"
                min="0"
                value={formData.likes_count ?? 0}
                onChange={e => handleFieldChange('likes_count', parseInt(e.target.value) || 0)}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/60">Admin override for engagement metrics</p>
        </AccordionContent>
      </AccordionItem>

      {/* Advanced Settings */}
      <AccordionItem value="advanced" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <MoreVertical className="w-4 h-4 text-orange-500" />
            <span>Advanced</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Allow Comments</span>
              <p className="text-xs text-muted-foreground">Enable reader comments on this post</p>
            </div>
            <Switch 
              checked={formData.allow_comments}
              onCheckedChange={c => handleFieldChange('allow_comments', c)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Author Name</label>
            <Input 
              value={formData.author_name}
              onChange={e => handleFieldChange('author_name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Location</label>
            <Input 
              value={formData.location}
              onChange={e => handleFieldChange('location', e.target.value)}
              placeholder="e.g. Bangalore, India"
            />
          </div>

          {/* Save History */}
          {saveHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Recent Saves</p>
              <div className="space-y-1">
                {saveHistory.map((time, i) => (
                  <p key={i} className="text-[10px] text-muted-foreground/60 font-mono">
                    {time}
                  </p>
                ))}
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300",
      isFullscreen ? "z-[100]" : "",
      focusMode ? "bg-background" : ""
    )}>
      {/* Enhanced Top Bar */}
          <div className={cn(
            "h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10",
            focusMode && "opacity-50 hover:opacity-100 transition-opacity"
          )}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleClose} className="hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {post ? 'Edit Post' : 'New Post'}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant={formData.published ? "default" : "secondary"} className="text-xs">
                {formData.published ? 'Published' : 'Draft'}
              </Badge>
              {(hasUnsavedChanges || autoSaving) && (
                <span className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                  {autoSaving ? <Loader2 className="w-3 h-3 animate-spin" /> : <AlertCircle className="w-3 h-3" />}
                  {autoSaving ? 'Auto-saving...' : 'Unsaved'}
                </span>
              )}
              {lastSaved && (
                <span className="text-xs text-muted-foreground">
                  Saved {format(lastSaved, 'HH:mm')}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Enhanced View Controls */}
          <div className="hidden md:flex items-center border rounded-lg overflow-hidden mr-4">
             <Button 
              variant={activeTab === 'write' && !showPreviewSplit ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => { setActiveTab('write'); setShowPreviewSplit(false) }}
              className="rounded-none h-8"
             >
               Write
             </Button>
             <Button 
              variant={showPreviewSplit ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => { setActiveTab('write'); setShowPreviewSplit(true) }}
              className="rounded-none h-8"
              title="Split View (Ctrl+Shift+P)"
             >
               <Split className="w-4 h-4" />
             </Button>
             <Button 
              variant={activeTab === 'preview' ? "secondary" : "ghost"} 
              size="sm" 
              onClick={() => { setActiveTab('preview'); setShowPreviewSplit(false) }}
              className="rounded-none h-8"
             >
               Preview
             </Button>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="hidden sm:flex"
            title={isFullscreen ? "Exit Fullscreen (F11)" : "Enter Fullscreen (F11)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

          {/* Settings Sheet for Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="xl:hidden">
                <Settings className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0 overflow-y-auto">
              <SheetTitle className="sr-only">Post Settings</SheetTitle>
              <div className="p-4 font-semibold text-sm text-muted-foreground border-b border-border flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Post Settings
              </div>
              {renderPostSettings()}
            </SheetContent>
          </Sheet>

          {/* Delete Button */}
          {post && onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex text-muted-foreground hover:text-red-600 hover:bg-red-500/10"
              onClick={() => {
                if(window.confirm('Delete this post? This action cannot be undone.')) {
                  onDelete(post.id)
                }
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          )}
          
          {/* Save Draft Button */}
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={isSaving}
            className="hidden sm:flex"
            title="Save Draft (Ctrl+S)"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          
          {/* Publish Button */}
          <Button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
            title="Publish (Ctrl+Enter)"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            {scheduleEnabled && publishDate ? 'Schedule' : (formData.published ? 'Update' : 'Publish')}
          </Button>
        </div>
      </div>

      {/* Validation Errors Alert */}
      <AnimatePresence>
        {Object.keys(validationErrors).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert className="mx-4 mt-4 border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please fix the following errors: {Object.values(validationErrors).join(', ')}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="max-w-6xl mx-auto p-4 md:p-8 lg:p-12 h-full flex flex-col">
            <div className={cn(
              "flex-1 grid gap-8 h-full",
              showPreviewSplit ? "grid-cols-2" : "grid-cols-1"
            )}>
              {/* Editor Column */}
              {(activeTab === 'write' || showPreviewSplit) && (
                <motion.div 
                  className="flex flex-col h-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="group relative mb-6">
                    <Input
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Your amazing title..."
                      className={cn(
                        "text-3xl md:text-5xl font-bold border-none px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/30 bg-transparent text-foreground",
                        validationErrors.title && "border-red-500"
                      )}
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.title}
                      </p>
                    )}
                  </div>
                  
                  <EnhancedToolbar />

                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={formData.content}
                      onChange={e => handleFieldChange('content', e.target.value)}
                      placeholder="Start writing your story..."
                      className={cn(
                        "w-full h-full min-h-[50vh] resize-none border-none px-0 text-lg focus-visible:ring-0 leading-relaxed bg-transparent font-mono text-foreground",
                        validationErrors.content && "border-red-500",
                        focusMode && "text-xl leading-loose"
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {/* Preview Column */}
              {(activeTab === 'preview' || showPreviewSplit) && (
                <motion.div
                  className={cn(
                    "prose dark:prose-invert prose-lg max-w-none overflow-y-auto h-full pr-4",
                    showPreviewSplit ? "border-l border-border pl-8" : ""
                  )}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'preview' && (
                    <>
                      <h1 className="text-4xl font-bold">{formData.title || 'Untitled Post'}</h1>
                      {formData.featured_image && (
                        <div className="my-8">
                          <img
                            src={formData.featured_image}
                            alt="Cover"
                            className="w-full h-64 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8">
                        <span>By {formData.author_name}</span>
                        {formData.location && (
                          <>
                            <span>•</span>
                            <span>{formData.location}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{stats.readTime} min read</span>
                      </div>
                    </>
                  )}

                  <div
                    className="blog-content min-h-[200px]"
                    dangerouslySetInnerHTML={{
                      __html: parseMarkdown(formData.content || (showPreviewSplit ? '' : '*Start writing to see preview...*'))
                    }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Right Sidebar - Settings (Desktop) */}
        <div className={cn(
          "w-80 border-l border-border bg-muted/10 overflow-y-auto custom-scrollbar hidden xl:block transition-all duration-300",
          focusMode && "opacity-50 hover:opacity-100"
        )}>
          <div className="p-4 font-semibold text-sm text-muted-foreground border-b border-border flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Post Settings
          </div>
          {renderPostSettings()}
        </div>
      </div>

      {/* Enhanced Footer Status Bar */}
      <div className={cn(
        "h-10 border-t border-border bg-background flex items-center justify-between px-4 text-xs text-muted-foreground select-none",
        focusMode && "opacity-50 hover:opacity-100 transition-opacity"
      )}>
        <div className="flex items-center gap-4">
          <span className="font-mono">{stats.words} words</span>
          <span className="font-mono">{stats.characters} chars</span>
          <span>{stats.readTime} min read</span>
          <span>SEO: {seoAnalysis.score}/100</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Sentences: {stats.sentences}</span>
          <span>Avg: {stats.readability} words/sentence</span>
          <span className="hidden sm:inline text-muted-foreground/50">Markdown enabled</span>
        </div>
      </div>
    </div>
  )
}
