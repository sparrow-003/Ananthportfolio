import React from 'react'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  BarChart2,
  MessageSquare,
  Settings,
  LogOut,
  Palette,
  Globe,
  Terminal
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon: React.ElementType
  label: string
  isActive: boolean
  onClick: () => void
  isCollapsed: boolean
}

const SidebarItem = ({ icon: Icon, label, isActive, onClick, isCollapsed }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
        isActive 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {!isCollapsed && (
        <span className="font-medium text-sm truncate">
          {label}
        </span>
      )}
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="activeTab"
          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </button>
  )
}

interface AdminSidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  onLogout: () => void
  isCollapsed: boolean
  toggleCollapse: () => void
}

export const AdminSidebar = ({ activeView, setActiveView, onLogout, isCollapsed, toggleCollapse }: AdminSidebarProps) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'posts', icon: FileText, label: 'Posts' },
    { id: 'stats', icon: BarChart2, label: 'Analytics' },
    { id: 'comments', icon: MessageSquare, label: 'Comments' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-card/50 backdrop-blur-xl border-r border-border fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 shadow-xl"
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-primary-foreground font-bold flex-shrink-0 shadow-lg shadow-primary/20">
            G
          </div>
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70"
            >
              Genesis
            </motion.span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="mb-6 px-3">
          {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Main</p>}
          <div className="space-y-1">
            {menuItems.slice(0, 4).map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => setActiveView(item.id)}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>

        <div className="px-3">
          {!isCollapsed && <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">System</p>}
          <div className="space-y-1">
            {menuItems.slice(4).map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeView === item.id}
                onClick={() => {
                  if (item.id === 'view-site') {
                    window.open('/', '_blank');
                  } else {
                    setActiveView(item.id);
                  }
                }}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border/50 space-y-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground hover:text-foreground", isCollapsed && "justify-center px-0")}
          onClick={() => setActiveView('cli')}
        >
          <Terminal className="w-4 h-4 mr-2" />
          {!isCollapsed && "Terminal"}
        </Button>
        
        <Button
          variant="ghost"
          className={cn("w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10", isCollapsed && "justify-center px-0")}
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {!isCollapsed && "Logout"}
        </Button>
      </div>
    </motion.div>
  )
}
