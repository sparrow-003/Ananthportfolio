import React, { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Save, X, Send, Calendar as CalendarIcon, MapPin, 
  MessageSquare, User, Tag, Link as LinkIcon, 
  ChevronLeft, MoreVertical, Globe, Eye, Trash2,
  Clock, FileText, Settings, Image as ImageIcon,
  LayoutTemplate, Bold, Italic, Heading, Quote, 
  List, Code, AlertCircle, CheckCircle2, Loader2,
  Maximize2, Minimize2, Type, ListOrdered, Minus, 
  Table as TableIcon, Strikethrough, Split, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { format } from 'date-fns'
import { BlogPost } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { parseMarkdown } from '@/lib/markdown'

interface PostEditorProps {
  post: BlogPost | null
  onSave: (data: any, shouldPublish: boolean) => Promise<void>
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
}

interface ValidationErrors {
  title?: string
  content?: string
  excerpt?: string
  slug?: string
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
    location: ''
  })

  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined)
  const [publishTime, setPublishTime] = useState<string>('')
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [activeTab, setActiveTab] = useState('write')
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showPreviewSplit, setShowPreviewSplit] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        location: post.location || ''
      })
      
      if (post.publish_at) {
        setScheduleEnabled(true)
        setPublishDate(new Date(post.publish_at))
        setPublishTime(format(new Date(post.publish_at), 'HH:mm'))
      }
    }
    setHasUnsavedChanges(false)
  }, [post])

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
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [formData])

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
  const handleFieldChange = useCallback((field: keyof FormData, value: string | boolean) => {
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

      await onSave(dataToSave, shouldPublish)
      setHasUnsavedChanges(false)
      
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
      const newCursorPos = start + prefix.length + (selection ? selection.length : 0) + (selection ? suffix.length : 0) // Place cursor after prefix+selection
      // Ideally if no selection, place cursor between tags
      const finalPos = selection ? newCursorPos + suffix.length : start + prefix.length
      textarea.setSelectionRange(finalPos, finalPos)
    }, 0)
  }, [formData.content])

  // Statistics
  const wordCount = formData.content.trim().split(/\s+/).filter(Boolean).length
  const charCount = formData.content.length
  const readTime = Math.ceil(wordCount / 200)

  // Render post settings
  const renderPostSettings = () => (
    <Accordion type="multiple" defaultValue={['publish', 'meta']} className="w-full">
      {/* Publish Settings */}
      <AccordionItem value="publish" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>Publishing</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Schedule</span>
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
            <label className="text-xs font-medium text-muted-foreground">Excerpt *</label>
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
            <label className="text-xs font-medium text-muted-foreground">Tags</label>
            <Input 
              value={formData.tags}
              onChange={e => handleFieldChange('tags', e.target.value)}
              placeholder="Tech, Design, Life..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Slug *</label>
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
            <span>Media</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Featured Image URL</label>
            <Input 
              value={formData.featured_image}
              onChange={e => handleFieldChange('featured_image', e.target.value)}
              placeholder="https://..."
              className="text-xs font-mono"
            />
          </div>
          {formData.featured_image && (
            <div className="mt-2 rounded-lg overflow-hidden border border-border">
              <img 
                src={formData.featured_image} 
                alt="Preview" 
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          )}
        </AccordionContent>
      </AccordionItem>

      {/* Advanced */}
      <AccordionItem value="advanced" className="border-border">
        <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
          <div className="flex items-center gap-2 text-sm">
            <MoreVertical className="w-4 h-4 text-orange-500" />
            <span>Advanced</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Allow Comments</span>
            <Switch 
              checked={formData.allow_comments}
              onCheckedChange={c => handleFieldChange('allow_comments', c)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Author</label>
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
              placeholder="e.g. Bangalore"
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  const EditorToolbar = () => (
    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm py-2 border-b border-border flex flex-wrap gap-1 mb-4">
      <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('# ')} title="H1">
          <Heading className="w-4 h-4" />
          <span className="text-[10px] ml-1">1</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('## ')} title="H2">
          <Heading className="w-4 h-4" />
          <span className="text-[10px] ml-1">2</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('### ')} title="H3">
          <Heading className="w-4 h-4" />
          <span className="text-[10px] ml-1">3</span>
        </Button>
      </div>

      <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('**', '**')} title="Bold (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('*', '*')} title="Italic (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('~~', '~~')} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('> ')} title="Quote">
          <Quote className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('```\n', '\n```')} title="Code Block">
          <Code className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('`', '`')} title="Inline Code">
          <Type className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center border-r border-border pr-2 mr-2 gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('- ')} title="Bulleted List">
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('1. ')} title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('[', '](url)')} title="Link">
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('![alt](', ')')} title="Image">
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('\n---\n')} title="Divider">
          <Minus className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertMarkdown('| Header | Header |\n| --- | --- |\n| Cell | Cell |')} title="Table">
          <TableIcon className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-4 duration-300",
      isFullscreen ? "z-[100]" : ""
    )}>
      {/* Top Bar */}
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-4 lg:px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleClose} className="hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {post ? 'Edit Post' : 'New Post'}
            </span>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                formData.published ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
              )}>
                {formData.published ? 'Published' : 'Draft'}
              </span>
              {hasUnsavedChanges && (
                <span className="text-xs text-orange-500 flex items-center gap-1 animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  Unsaved
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
              title="Split View"
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
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>

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
          
          <Button 
            variant="outline" 
            onClick={() => handleSave(false)} 
            disabled={isSaving}
            className="hidden sm:flex"
            title="Ctrl+S"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Draft
          </Button>
          
          <Button 
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
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
      {Object.keys(validationErrors).length > 0 && (
        <Alert className="mx-4 mt-4 border-red-200 bg-red-50 text-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please fix the following errors: {Object.values(validationErrors).join(', ')}
          </AlertDescription>
        </Alert>
      )}

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
                <div className="flex flex-col h-full animate-in fade-in duration-500">
                  <div className="group relative mb-6">
                    <Input
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Post Title"
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
                  
                  <EditorToolbar />

                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={formData.content}
                      onChange={e => handleFieldChange('content', e.target.value)}
                      placeholder="Tell your story..."
                      className={cn(
                        "w-full h-full min-h-[50vh] resize-none border-none px-0 text-lg focus-visible:ring-0 leading-relaxed bg-transparent font-mono text-foreground",
                        validationErrors.content && "border-red-500"
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Preview Column */}
              {(activeTab === 'preview' || showPreviewSplit) && (
                <div className={cn(
                  "prose dark:prose-invert max-w-none animate-in fade-in duration-500 overflow-y-auto h-full pr-4",
                  showPreviewSplit ? "border-l border-border pl-8" : ""
                )}>
                  {activeTab === 'preview' && (
                    <>
                      <h1>{formData.title || 'Untitled Post'}</h1>
                      {formData.featured_image && (
                        <img src={formData.featured_image} alt="Cover" className="w-full h-64 object-cover rounded-xl my-8" />
                      )}
                    </>
                  )}
                  
                  <div 
                    className="min-h-[200px]"
                    dangerouslySetInnerHTML={{ __html: parseMarkdown(formData.content || (showPreviewSplit ? '' : '*Start writing to see preview...*')) }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar - Settings (Desktop) */}
        <div className="w-80 border-l border-border bg-muted/10 overflow-y-auto custom-scrollbar hidden xl:block">
          <div className="p-4 font-semibold text-sm text-muted-foreground border-b border-border flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Post Settings
          </div>
          {renderPostSettings()}
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-8 border-t border-border bg-background flex items-center justify-between px-4 text-xs text-muted-foreground select-none">
        <div className="flex items-center gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} chars</span>
          <span>{readTime} min read</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Last saved: {format(new Date(), 'HH:mm')}</span>
          <span className="hidden sm:inline text-muted-foreground/50">Markdown supported</span>
        </div>
      </div>
    </div>
  )
}
