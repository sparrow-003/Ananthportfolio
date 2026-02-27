import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Users, Eye, FileText, Activity, TrendingUp, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DashboardStatsProps {
  stats: {
    totalPosts: number
    totalViews: number
    totalComments: number
    activeNow: number
  }
}

const StatCard = memo(({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color, 
  bg,
  index 
}: {
  title: string
  value: string
  change: string
  trend: 'up' | 'down'
  icon: React.ElementType
  color: string
  bg: string
  index: number
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
  >
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
      {/* Background gradient */}
      <div className={`absolute inset-0 ${bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <motion.div 
          className={`p-2 rounded-lg ${bg} ${color} transition-all duration-300`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon className="w-4 h-4" />
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div 
          className="text-2xl font-bold"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
        >
          {value}
        </motion.div>
        <div className="flex items-center gap-1 mt-1">
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.3 }}
            className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {trend === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            <span className="font-medium">{change}</span>
          </motion.div>
          <span className="text-xs text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
))

StatCard.displayName = 'StatCard'

export const DashboardStats = memo(({ stats }: DashboardStatsProps) => {
  // Calculate some derived metrics
  const avgViewsPerPost = stats.totalPosts > 0 ? Math.round(stats.totalViews / stats.totalPosts) : 0
  const engagementRate = stats.totalViews > 0 ? ((stats.totalComments / stats.totalViews) * 100).toFixed(1) : '0.0'

  const statItems = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Total Posts",
      value: stats.totalPosts.toLocaleString(),
      change: "+4",
      trend: "up" as const,
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    {
      title: "Comments",
      value: stats.totalComments.toLocaleString(),
      change: "+18%",
      trend: "up" as const,
      icon: MessageSquare,
      color: "text-green-500",
      bg: "bg-green-500/10"
    },
    {
      title: "Engagement Rate",
      value: `${engagementRate}%`,
      change: stats.totalComments > 50 ? "+2.1%" : "-0.8%",
      trend: stats.totalComments > 50 ? "up" as const : "down" as const,
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          index={index}
        />
      ))}
    </div>
  )
})

DashboardStats.displayName = 'DashboardStats'
