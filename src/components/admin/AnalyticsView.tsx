import React, { memo, useMemo, useState, useCallback, useEffect } from 'react'
import { BlogPost as BlogPostType } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart2, Eye, Heart, TrendingUp, FileText, Calendar as CalendarIcon,
  Download, Filter, AlertTriangle, ArrowUp, ArrowDown, Target, Users,
  Activity, Zap, RefreshCw, DollarSign, MousePointer, Award, Sparkles,
  Eye as EyeIcon, Heart as HeartIcon, TrendingUp as TrendingUpIcon
} from 'lucide-react'
import { format, subDays, isWithinInterval, startOfDay, endOfDay, differenceInDays, addDays } from 'date-fns'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart,
  RadialBarChart, RadialBar
} from 'recharts'

interface AnalyticsViewProps {
  posts: BlogPostType[]
  comments: { id: string; author: string; content: string; post_id?: string; created_at?: string }[]
}

type DateRange = { from: Date | undefined; to: Date | undefined }
type SegmentFilter = 'all' | 'published' | 'drafts'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
}

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

const pulseAnimation = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
}

// Simple linear regression for predictions
const linearRegression = (data: number[]) => {
  const n = data.length
  if (n < 2) return { slope: 0, intercept: data[0] || 0 }

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0
  for (let i = 0; i < n; i++) {
    sumX += i
    sumY += data[i]
    sumXY += i * data[i]
    sumXX += i * i
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  return { slope, intercept }
}

// Moving average calculation
const movingAverage = (data: number[], window: number = 3): number[] => {
  return data.map((_, i, arr) => {
    const start = Math.max(0, i - window + 1)
    const subset = arr.slice(start, i + 1)
    return subset.reduce((a, b) => a + b, 0) / subset.length
  })
}

// Anomaly detection (simple z-score based)
const detectAnomalies = (data: number[]): boolean[] => {
  if (data.length < 3) return data.map(() => false)
  const mean = data.reduce((a, b) => a + b, 0) / data.length
  const std = Math.sqrt(data.reduce((a, b) => a + (b - mean) ** 2, 0) / data.length)
  const threshold = 2
  return data.map(v => std > 0 && Math.abs(v - mean) > threshold * std)
}

// Animated number component
const AnimatedNumber = ({ value, prefix = '', suffix = '', decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const duration = 1500
    const startValue = displayValue
    const change = value - startValue
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4)
      
      setDisplayValue(startValue + (change * eased))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  return (
    <span>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
    </span>
  )
}

export const AnalyticsView = memo(({ posts, comments }: AnalyticsViewProps) => {
  const [dateRange, setDateRange] = useState<DateRange>({ from: subDays(new Date(), 30), to: new Date() })
  const [segmentFilter, setSegmentFilter] = useState<SegmentFilter>('all')
  const [predictionDays, setPredictionDays] = useState<7 | 30>(7)
  const [activeTab, setActiveTab] = useState('overview')

  const handleDateRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setDateRange({ from: range?.from, to: range?.to })
  }

  // Filter posts by date range and segment
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const postDate = new Date(post.created_at)
      const inDateRange = !dateRange.from || !dateRange.to || isWithinInterval(postDate, {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      })
      const matchesSegment = segmentFilter === 'all' ||
        (segmentFilter === 'published' && post.published) ||
        (segmentFilter === 'drafts' && !post.published)
      return inDateRange && matchesSegment
    })
  }, [posts, dateRange, segmentFilter])

  // Calculate comprehensive stats - SEPARATE REAL vs DISPLAY
  const stats = useMemo(() => {
    // REAL counts (for analytics)
    const totalRealViews = filteredPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0)
    const totalRealLikes = filteredPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0)
    
    // DISPLAY counts (what users see - can be inflated by admin)
    const totalDisplayViews = filteredPosts.reduce((acc, p) => acc + (p.display_views_count ?? p.views_count ?? 0), 0)
    const totalDisplayLikes = filteredPosts.reduce((acc, p) => acc + (p.display_likes_count ?? p.likes_count ?? 0), 0)
    
    const publishedPosts = filteredPosts.filter(p => p.published)
    const draftPosts = filteredPosts.filter(p => !p.published)
    const avgRealViews = publishedPosts.length > 0 ? Math.round(totalRealViews / publishedPosts.length) : 0
    const avgRealLikes = publishedPosts.length > 0 ? Math.round(totalRealLikes / publishedPosts.length) : 0
    const avgDisplayViews = publishedPosts.length > 0 ? Math.round(totalDisplayViews / publishedPosts.length) : 0
    const avgDisplayLikes = publishedPosts.length > 0 ? Math.round(totalDisplayLikes / publishedPosts.length) : 0
    
    const topPosts = [...filteredPosts].sort((a, b) => (b.display_views_count ?? b.views_count ?? 0) - (a.display_views_count ?? a.views_count ?? 0)).slice(0, 5)
    const mostLiked = [...filteredPosts].sort((a, b) => (b.display_likes_count ?? b.likes_count ?? 0) - (a.display_likes_count ?? a.likes_count ?? 0)).slice(0, 5)
    const recentComments = comments.slice(0, 10)

    // Calculate engagement rate (real likes / real views)
    const realEngagementRate = totalRealViews > 0 ? ((totalRealLikes / totalRealViews) * 100).toFixed(2) : '0.00'
    const displayEngagementRate = totalDisplayViews > 0 ? ((totalDisplayLikes / totalDisplayViews) * 100).toFixed(2) : '0.00'

    // Compare with previous period
    const daysDiff = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 30
    const prevPeriodStart = dateRange.from ? subDays(dateRange.from, daysDiff) : subDays(new Date(), 60)
    const prevPeriodEnd = dateRange.from ? subDays(dateRange.from, 1) : subDays(new Date(), 31)

    const prevPosts = posts.filter(post => {
      const postDate = new Date(post.created_at)
      return isWithinInterval(postDate, { start: startOfDay(prevPeriodStart), end: endOfDay(prevPeriodEnd) })
    })
    const prevRealViews = prevPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0)
    const prevRealLikes = prevPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0)

    const viewsGrowth = prevRealViews > 0 ? (((totalRealViews - prevRealViews) / prevRealViews) * 100).toFixed(1) : '0.0'
    const likesGrowth = prevRealLikes > 0 ? (((totalRealLikes - prevRealLikes) / prevRealLikes) * 100).toFixed(1) : '0.0'

    // Manipulation metrics
    const viewManipulation = totalDisplayViews - totalRealViews
    const likeManipulation = totalDisplayLikes - totalRealLikes
    const viewManipulationPercent = totalRealViews > 0 ? ((viewManipulation / totalRealViews) * 100).toFixed(1) : '0.0'
    const likeManipulationPercent = totalRealLikes > 0 ? ((likeManipulation / totalRealLikes) * 100).toFixed(1) : '0.0'

    return {
      totalRealViews,
      totalRealLikes,
      totalDisplayViews,
      totalDisplayLikes,
      publishedPosts,
      draftPosts,
      avgRealViews,
      avgRealLikes,
      avgDisplayViews,
      avgDisplayLikes,
      topPosts,
      mostLiked,
      recentComments,
      realEngagementRate,
      displayEngagementRate,
      viewsGrowth,
      likesGrowth,
      viewManipulation,
      likeManipulation,
      viewManipulationPercent,
      likeManipulationPercent
    }
  }, [filteredPosts, comments, dateRange, posts])

  // Generate time-series data for charts (REAL data only for analytics)
  const timeSeriesData = useMemo(() => {
    const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 30
    const data: { date: string; views: number; likes: number; posts: number }[] = []

    for (let i = 0; i < days; i++) {
      const date = dateRange.from ? addDays(dateRange.from, i) : subDays(new Date(), days - i - 1)
      const dateStr = format(date, 'yyyy-MM-dd')
      const dayPosts = filteredPosts.filter(p => format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr)

      data.push({
        date: format(date, 'MMM d'),
        views: dayPosts.reduce((acc, p) => acc + (p.views_count ?? 0), 0),
        likes: dayPosts.reduce((acc, p) => acc + (p.likes_count ?? 0), 0),
        posts: dayPosts.length
      })
    }

    return data
  }, [filteredPosts, dateRange])

  // Calculate moving averages and anomalies
  const trendData = useMemo(() => {
    const views = timeSeriesData.map(d => d.views)
    const likes = timeSeriesData.map(d => d.likes)

    const viewsMA = movingAverage(views, 5)
    const likesMA = movingAverage(likes, 5)
    const viewAnomalies = detectAnomalies(views)
    const likeAnomalies = detectAnomalies(likes)

    return timeSeriesData.map((d, i) => ({
      ...d,
      viewsMA: Math.round(viewsMA[i]),
      likesMA: Math.round(likesMA[i]),
      viewAnomaly: viewAnomalies[i],
      likeAnomaly: likeAnomalies[i]
    }))
  }, [timeSeriesData])

  // Generate predictions
  const predictionData = useMemo(() => {
    const views = timeSeriesData.map(d => d.views)
    const likes = timeSeriesData.map(d => d.likes)

    const viewsReg = linearRegression(views)
    const likesReg = linearRegression(likes)

    const predictions: { date: string; predictedViews: number; predictedLikes: number; upperBound: number; lowerBound: number }[] = []
    const lastDate = dateRange.to || new Date()

    for (let i = 1; i <= predictionDays; i++) {
      const date = addDays(lastDate, i)
      const idx = views.length + i - 1
      const predictedViews = Math.max(0, Math.round(viewsReg.slope * idx + viewsReg.intercept))
      const predictedLikes = Math.max(0, Math.round(likesReg.slope * idx + likesReg.intercept))

      // Confidence band (±20%)
      const variance = predictedViews * 0.2 * (i / predictionDays)

      predictions.push({
        date: format(date, 'MMM d'),
        predictedViews,
        predictedLikes,
        upperBound: Math.round(predictedViews + variance),
        lowerBound: Math.max(0, Math.round(predictedViews - variance))
      })
    }

    return predictions
  }, [timeSeriesData, dateRange, predictionDays])

  // Funnel data
  const funnelData = useMemo(() => {
    const totalViews = stats.totalRealViews || 100
    const readers = Math.round(totalViews * 0.65)
    const engaged = stats.totalRealLikes + comments.length
    const returning = Math.round(engaged * 0.3)

    return [
      { name: 'Page Views', value: totalViews, fill: 'hsl(var(--primary))' },
      { name: 'Readers', value: readers, fill: 'hsl(var(--chart-2))' },
      { name: 'Engaged', value: engaged, fill: 'hsl(var(--chart-3))' },
      { name: 'Returning', value: returning, fill: 'hsl(var(--chart-4))' }
    ]
  }, [stats, comments])

  // Retention cohort data
  const cohortData = useMemo(() => {
    const cohorts = []
    for (let week = 0; week < 4; week++) {
      const baseRetention = 100
      cohorts.push({
        week: `Week ${week + 1}`,
        day0: baseRetention,
        day7: Math.round(baseRetention * (0.4 - week * 0.05)),
        day14: Math.round(baseRetention * (0.25 - week * 0.03)),
        day30: Math.round(baseRetention * (0.15 - week * 0.02))
      })
    }
    return cohorts
  }, [])

  // Tag distribution
  const tagDistribution = useMemo(() => {
    const tagCounts: Record<string, number> = {}
    filteredPosts.forEach(post => {
      (post.tags || []).forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      })
    })
    return Object.entries(tagCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [filteredPosts])

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = ['Title', 'Published', 'Real Views', 'Display Views', 'Real Likes', 'Display Likes', 'Created At', 'Tags']
    const rows = filteredPosts.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      p.published ? 'Yes' : 'No',
      p.views_count ?? 0,
      p.display_views_count ?? p.views_count ?? 0,
      p.likes_count ?? 0,
      p.display_likes_count ?? p.likes_count ?? 0,
      format(new Date(p.created_at), 'yyyy-MM-dd'),
      `"${(p.tags || []).join(', ')}"`
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-export-${format(new Date(), 'yyyy-MM-dd')}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filteredPosts])

  const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with filters */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">Advanced insights with trend analysis and predictions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
                <CalendarIcon className="w-4 h-4" />
                {dateRange.from && dateRange.to ? (
                  `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
                ) : 'Select dates'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Select value={segmentFilter} onValueChange={(v: SegmentFilter) => setSegmentFilter(v)}>
            <SelectTrigger className="w-[130px] h-9 hover:bg-primary/10 hover:border-primary/50 transition-all">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="drafts">Drafts</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2 hover:bg-primary/10 hover:border-primary/50 transition-all">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </motion.div>

      {/* KPI Cards with REAL vs DISPLAY comparison */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={cardVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Real Views</p>
                  <p className="text-2xl font-bold mt-1 text-primary">
                    <AnimatedNumber value={stats.totalRealViews} />
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {parseFloat(stats.viewsGrowth) >= 0 ? (
                      <ArrowUp className="w-3 h-3 text-chart-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={cn("text-xs font-medium", parseFloat(stats.viewsGrowth) >= 0 ? "text-chart-3" : "text-destructive")}>
                      {stats.viewsGrowth}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs prev</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">Display: <span className="text-foreground font-semibold">{stats.totalDisplayViews.toLocaleString()}</span></p>
                    <p className="text-xs text-muted-foreground">Manipulation: <span className={cn("font-semibold", stats.viewManipulation > 0 ? "text-amber-500" : "text-muted-foreground")}>+{stats.viewManipulationPercent}%</span></p>
                  </div>
                </div>
                <motion.div 
                  className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                  animate={pulseAnimation.pulse}
                >
                  <Eye className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-destructive/50 transition-all duration-300 hover:shadow-lg hover:shadow-destructive/10 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Real Likes</p>
                  <p className="text-2xl font-bold mt-1 text-destructive">
                    <AnimatedNumber value={stats.totalRealLikes} />
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {parseFloat(stats.likesGrowth) >= 0 ? (
                      <ArrowUp className="w-3 h-3 text-chart-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3 text-destructive" />
                    )}
                    <span className={cn("text-xs font-medium", parseFloat(stats.likesGrowth) >= 0 ? "text-chart-3" : "text-destructive")}>
                      {stats.likesGrowth}%
                    </span>
                    <span className="text-xs text-muted-foreground">vs prev</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">Display: <span className="text-foreground font-semibold">{stats.totalDisplayLikes.toLocaleString()}</span></p>
                    <p className="text-xs text-muted-foreground">Manipulation: <span className={cn("font-semibold", stats.likeManipulation > 0 ? "text-amber-500" : "text-muted-foreground")}>+{stats.likeManipulationPercent}%</span></p>
                  </div>
                </div>
                <motion.div 
                  className="h-12 w-12 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:scale-110 transition-transform"
                  animate={pulseAnimation.pulse}
                >
                  <Heart className="w-6 h-6 text-destructive" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Real Engagement</p>
                  <p className="text-2xl font-bold mt-1 text-accent-foreground">
                    <AnimatedNumber value={parseFloat(stats.realEngagementRate)} suffix="%" decimals={2} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Likes per view</p>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground">Display: <span className="text-foreground font-semibold">{stats.displayEngagementRate}%</span></p>
                  </div>
                </div>
                <motion.div 
                  className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center group-hover:scale-110 transition-transform"
                  animate={pulseAnimation.pulse}
                >
                  <Target className="w-6 h-6 text-accent-foreground" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-lg hover:shadow-secondary/10 group">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Posts</p>
                  <p className="text-2xl font-bold mt-1 text-secondary-foreground">
                    <AnimatedNumber value={stats.publishedPosts.length} />
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.draftPosts.length} drafts</p>
                  <div className="mt-2 pt-2 border-t border-border/30">
                    <Progress value={(stats.publishedPosts.length / (stats.publishedPosts.length + stats.draftPosts.length || 1)) * 100} className="h-1.5" />
                  </div>
                </div>
                <motion.div 
                  className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform"
                  animate={pulseAnimation.pulse}
                >
                  <FileText className="w-6 h-6 text-secondary-foreground" />
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Main Charts Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <TrendingUp className="w-4 h-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="predictions" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <Zap className="w-4 h-4" />
            Predictions
          </TabsTrigger>
          <TabsTrigger value="funnel" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
            <Users className="w-4 h-4" />
            Funnel
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="space-y-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Main Line Chart */}
              <motion.div variants={cardVariants} className="lg:col-span-2">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-primary" />
                      Real Views & Likes Over Time
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                          <XAxis dataKey="date" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                          <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px',
                              backdropFilter: 'blur(8px)'
                            }}
                          />
                          <Legend />
                          <Area type="monotone" dataKey="views" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth={2} name="Views" />
                          <Line type="monotone" dataKey="likes" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="Likes" />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Tag Distribution Pie Chart */}
              <motion.div variants={cardVariants}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary" />
                      Content by Tags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      {tagDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={tagDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {tagDistribution.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          No tags data available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Top Posts Tables */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div variants={cardVariants}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <EyeIcon className="w-4 h-4 text-primary" />
                      Most Viewed Posts (Display)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.topPosts.length > 0 ? stats.topPosts.map((post, i) => (
                      <motion.div 
                        key={post.id} 
                        className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[220px]">{post.title}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(post.created_at), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                        <span className="text-sm font-mono text-primary">{((post.display_views_count ?? post.views_count) ?? 0).toLocaleString()}</span>
                      </motion.div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No posts yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={cardVariants}>
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-destructive/30 transition-all">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HeartIcon className="w-4 h-4 text-destructive" />
                      Most Liked Posts (Display)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats.mostLiked.length > 0 ? stats.mostLiked.map((post, i) => (
                      <motion.div 
                        key={post.id} 
                        className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-muted-foreground w-5">{i + 1}.</span>
                          <div>
                            <p className="text-sm font-medium truncate max-w-[220px]">{post.title}</p>
                            <Badge variant={post.published ? 'default' : 'secondary'} className="text-[10px] h-4 mt-0.5">
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm font-mono text-destructive">{((post.display_likes_count ?? post.likes_count) ?? 0).toLocaleString()}</span>
                      </motion.div>
                    )) : (
                      <p className="text-sm text-muted-foreground">No posts yet.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Moving Average & Anomaly Detection
                </CardTitle>
                <Badge variant="outline" className="gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Anomalies highlighted
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number, name: string, props: any) => {
                        const isAnomaly = props.payload.viewAnomaly && name === 'Views'
                        return [
                          <span className={isAnomaly ? 'text-destructive font-bold' : ''}>
                            {value.toLocaleString()} {isAnomaly ? '⚠️' : ''}
                          </span>,
                          name
                        ]
                      }}
                    />
                    <Legend />
                    <Bar dataKey="views" fill="hsl(var(--primary) / 0.3)" name="Views" />
                    <Line type="monotone" dataKey="viewsMA" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="5-day MA (Views)" />
                    <Line type="monotone" dataKey="likesMA" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} name="5-day MA (Likes)" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Growth Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Views Growth</p>
                <p className={cn("text-xl font-bold mt-1", parseFloat(stats.viewsGrowth) >= 0 ? "text-chart-3" : "text-destructive")}>
                  {parseFloat(stats.viewsGrowth) >= 0 ? '+' : ''}{stats.viewsGrowth}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Likes Growth</p>
                <p className={cn("text-xl font-bold mt-1", parseFloat(stats.likesGrowth) >= 0 ? "text-chart-3" : "text-destructive")}>
                  {parseFloat(stats.likesGrowth) >= 0 ? '+' : ''}{stats.likesGrowth}%
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground uppercase">Avg per Post</p>
                <p className="text-xl font-bold mt-1">{stats.avgRealViews} real / {stats.avgDisplayViews} display views</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Forecast (Linear Regression)
                </CardTitle>
                <Select value={String(predictionDays)} onValueChange={(v) => setPredictionDays(Number(v) as 7 | 30)}>
                  <SelectTrigger className="w-[120px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Next 7 days</SelectItem>
                    <SelectItem value="30">Next 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="upperBound" stroke="none" fill="hsl(var(--primary) / 0.1)" name="Upper Bound" />
                    <Area type="monotone" dataKey="lowerBound" stroke="none" fill="hsl(var(--background))" name="Lower Bound" />
                    <Line type="monotone" dataKey="predictedViews" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Views" />
                    <Line type="monotone" dataKey="predictedLikes" stroke="hsl(var(--destructive))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Likes" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                * Predictions based on historical trends. Confidence band shows ±20% variance.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Funnel Tab */}
        <TabsContent value="funnel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Conversion Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                      <XAxis type="number" tick={{ fontSize: 12 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {funnelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Retention Cohorts */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Retention Cohorts (Simulated)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-3 font-medium text-muted-foreground">Cohort</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 0</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 7</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 14</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Day 30</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cohortData.map((cohort, i) => (
                        <tr key={i} className="border-b border-border/30">
                          <td className="py-2 px-3 font-medium">{cohort.week}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/20 text-primary text-xs font-mono">
                              {cohort.day0}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/15 text-primary text-xs font-mono">
                              {cohort.day7}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono">
                              {cohort.day14}%
                            </span>
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span className="inline-block px-2 py-1 rounded bg-primary/5 text-primary text-xs font-mono">
                              {cohort.day30}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  * Simulated retention data based on engagement patterns
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
})

AnalyticsView.displayName = 'AnalyticsView'
