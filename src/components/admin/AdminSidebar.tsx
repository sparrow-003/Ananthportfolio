import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Palette,
  Terminal,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick: () => void
  showLabel: boolean
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick, showLabel }: SidebarItemProps) => (
  <button
    onClick={onClick}
    title={showLabel ? undefined : label}
    className={cn(
      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    )}
  >
    <Icon
      className={cn(
        'w-5 h-5 flex-shrink-0 transition-colors',
        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
      )}
    />
    {showLabel && <span className="font-medium text-sm truncate">{label}</span>}
    {isActive && showLabel && (
      <span className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
    )}
  </button>
)

interface AdminSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onLogout: () => void
  isCollapsed: boolean
  toggleCollapse: () => void
}

const useIsMobile = (breakpoint = 1024) => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

export const AdminSidebar = ({
  activeView,
  setActiveView,
  onLogout,
  isCollapsed,
  toggleCollapse,
}: AdminSidebarProps) => {
  const isMobile = useIsMobile()
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'posts', icon: FileText, label: 'Posts' },
    { id: 'stats', icon: BarChart2, label: 'Analytics' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  // On mobile: drawer that opens when !isCollapsed. On desktop: mini-rail (80) vs full (280).
  const showLabels = isMobile ? true : !isCollapsed
  const drawerOpen = isMobile && !isCollapsed

  const handleSelect = (id: string) => {
    setActiveView(id)
    if (isMobile) toggleCollapse() // close drawer after nav
  }

  // Mobile: hide entirely when collapsed
  if (isMobile && isCollapsed) {
    return null
  }

  return (
    <>
      {/* Backdrop for mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={toggleCollapse}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-nav lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={isMobile ? { x: '-100%' } : false}
        animate={isMobile ? { x: 0 } : { width: isCollapsed ? 80 : 280 }}
        exit={isMobile ? { x: '-100%' } : undefined}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={cn(
          'h-screen bg-card/95 backdrop-blur-md border-r border-border fixed left-0 top-0 flex flex-col shadow-xl',
          isMobile ? 'z-nav w-[280px] max-w-[85vw]' : 'z-nav'
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 shadow-lg shadow-primary/20">
              G
            </div>
            {showLabels && (
              <span className="font-bold text-lg tracking-tight text-foreground">Genesis</span>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            aria-label={isMobile ? 'Close menu' : 'Toggle sidebar'}
            className="w-8 h-8 text-muted-foreground hover:text-foreground hover:bg-muted flex-shrink-0"
          >
            {isMobile ? (
              <X className="w-4 h-4" />
            ) : (
              <svg
                className={cn('w-4 h-4 transition-transform', isCollapsed && 'rotate-180')}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 sm:py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="mb-6 px-1">
            {showLabels && (
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">
                Main
              </p>
            )}
            <div className="space-y-1">
              {menuItems.slice(0, 4).map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeView === item.id}
                  onClick={() => handleSelect(item.id)}
                  showLabel={showLabels}
                />
              ))}
            </div>
          </div>

          <div className="px-1">
            {showLabels && (
              <p className="text-xs font-semibold text-muted-foreground mb-2 px-2 uppercase tracking-wider">
                System
              </p>
            )}
            <div className="space-y-1">
              {menuItems.slice(4).map((item) => (
                <SidebarItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeView === item.id}
                  onClick={() => handleSelect(item.id)}
                  showLabel={showLabels}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 border-t border-border/50 space-y-2">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-muted-foreground hover:text-foreground',
              !showLabels && 'justify-center px-0'
            )}
            onClick={() => {
              setActiveView('cli')
              if (isMobile) toggleCollapse()
            }}
          >
            <Terminal className="w-4 h-4" />
            {showLabels && <span className="ml-2">Terminal</span>}
          </Button>

          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10',
              !showLabels && 'justify-center px-0'
            )}
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            {showLabels && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
