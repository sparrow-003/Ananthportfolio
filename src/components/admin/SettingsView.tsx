import React, { memo, useState, useCallback, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  Settings, Shield, Globe, Bell, Database, CheckCircle2,
  Moon, Sun, Monitor, Palette, Key, LogOut, Trash2,
  Save, User, Mail, Lock, Eye, EyeOff, Sparkles, Zap,
  BarChart3, FileText, MessageSquare, Heart, Clock,
  ChevronRight, AlertCircle, Info
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useTheme } from '@/components/theme-provider'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SettingsViewProps {
  onLogout: () => void
}

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
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } }
}

export const SettingsView = memo(({ onLogout }: SettingsViewProps) => {
  const { theme, setTheme } = useTheme()
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false })
  const [userEmail, setUserEmail] = useState('')
  const [notifications, setNotifications] = useState({
    newComment: true,
    newLike: true,
    scheduledPost: true,
    systemUpdates: true
  })
  const [defaultViewCount, setDefaultViewCount] = useState([1000])
  const [defaultLikeCount, setDefaultLikeCount] = useState([100])
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')

  // Load user email
  useEffect(() => {
    const loadUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || '')
      }
    }
    loadUser()
  }, [])

  const handleChangePassword = useCallback(async () => {
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordData.new.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setIsChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.new })
      if (error) throw error
      toast.success('Password updated successfully')
      setPasswordData({ current: '', new: '', confirm: '' })
    } catch (error: any) {
      toast.error('Failed to update password: ' + error.message)
    } finally {
      setIsChangingPassword(false)
    }
  }, [passwordData])

  const handleSaveDefaults = useCallback(() => {
    localStorage.setItem('default_display_views', String(defaultViewCount[0]))
    localStorage.setItem('default_display_likes', String(defaultLikeCount[0]))
    toast.success('Default counts saved! New posts will use these values.')
  }, [defaultViewCount, defaultLikeCount])

  const handleNotificationChange = useCallback((key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Notification preference updated')
  }, [])

  const handleExportData = useCallback(() => {
    const data = {
      userEmail,
      notifications,
      defaultViewCount: defaultViewCount[0],
      defaultLikeCount: defaultLikeCount[0],
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Settings exported successfully')
  }, [userEmail, notifications, defaultViewCount, defaultLikeCount])

  const handleClearCache = useCallback(() => {
    localStorage.clear()
    toast.success('Cache cleared successfully')
  }, [])

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary animate-spin-slow" />
              Settings
            </h2>
            <p className="text-muted-foreground text-sm mt-1">Manage your admin account and system preferences</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Premium
          </Badge>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  Email Address
                </Label>
                <Input value={userEmail} readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Account Type
                </Label>
                <Input value="Administrator" readOnly className="bg-muted/50 cursor-not-allowed" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-500" />
              Security & Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-xs font-medium text-muted-foreground">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.current}
                  onChange={e => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-xs font-medium text-muted-foreground">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.new}
                  onChange={e => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                  placeholder="Enter new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-xs font-medium text-muted-foreground">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirm}
                  onChange={e => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                  placeholder="Confirm new password"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={isChangingPassword || !passwordData.new || !passwordData.confirm}
              size="sm"
              className="w-full md:w-auto"
            >
              {isChangingPassword ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-500" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the admin panel looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                <Monitor className="w-3 h-3" />
                Theme Mode
              </Label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={theme === 'light' ? 'default' : 'outline'}
                  onClick={() => setTheme('light')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Sun className="w-5 h-5" />
                  <span className="text-xs">Light</span>
                </Button>
                <Button
                  variant={theme === 'dark' ? 'default' : 'outline'}
                  onClick={() => setTheme('dark')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Moon className="w-5 h-5" />
                  <span className="text-xs">Dark</span>
                </Button>
                <Button
                  variant={theme === 'system' ? 'default' : 'outline'}
                  onClick={() => setTheme('system')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs">System</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Default Display Counts */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-500" />
              Default Display Counts
            </CardTitle>
            <CardDescription>Set default fake view/like counts for new posts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Eye className="w-3 h-3" />
                  Default Display Views
                </Label>
                <span className="text-sm font-bold text-primary">{defaultViewCount[0].toLocaleString()}</span>
              </div>
              <Slider
                value={defaultViewCount}
                onValueChange={setDefaultViewCount}
                min={0}
                max={100000}
                step={100}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>50K</span>
                <span>100K</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Heart className="w-3 h-3" />
                  Default Display Likes
                </Label>
                <span className="text-sm font-bold text-destructive">{defaultLikeCount[0].toLocaleString()}</span>
              </div>
              <Slider
                value={defaultLikeCount}
                onValueChange={setDefaultLikeCount}
                min={0}
                max={10000}
                step={10}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>5K</span>
                <span>10K</span>
              </div>
            </div>

            <Button onClick={handleSaveDefaults} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Default Counts
            </Button>

            <Alert className="bg-amber-500/10 border-amber-500/20">
              <Info className="w-4 h-4 text-amber-500" />
              <AlertDescription className="text-amber-500 text-xs mt-1">
                These values will be automatically applied to new posts as display counts. Real analytics will still track actual views and likes.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-500" />
              Notifications
            </CardTitle>
            <CardDescription>Choose what notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">New Comments</p>
                  <p className="text-xs text-muted-foreground">Get notified when someone comments</p>
                </div>
              </div>
              <Switch
                checked={notifications.newComment}
                onCheckedChange={() => handleNotificationChange('newComment')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">New Likes</p>
                  <p className="text-xs text-muted-foreground">Get notified about like activity</p>
                </div>
              </div>
              <Switch
                checked={notifications.newLike}
                onCheckedChange={() => handleNotificationChange('newLike')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Scheduled Posts</p>
                  <p className="text-xs text-muted-foreground">Reminders for scheduled publications</p>
                </div>
              </div>
              <Switch
                checked={notifications.scheduledPost}
                onCheckedChange={() => handleNotificationChange('scheduledPost')}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">System Updates</p>
                  <p className="text-xs text-muted-foreground">Important system announcements</p>
                </div>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={() => handleNotificationChange('systemUpdates')}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Info */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Platform', value: 'Genesis Blog Admin', icon: FileText },
              { label: 'Backend', value: 'Supabase', icon: Database },
              { label: 'Auth', value: 'JWT + RBAC (admin role)', icon: Shield },
              { label: 'Edge Functions', value: 'admin-blog', icon: Zap },
              { label: 'RLS', value: 'Enabled on all tables', icon: Lock },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-3">
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {item.value}
                  <ChevronRight className="w-3 h-3 text-muted-foreground" />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-500" />
              Data Management
            </CardTitle>
            <CardDescription>Export or clear your local data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button variant="outline" onClick={handleExportData} className="justify-start">
                <Save className="w-4 h-4 mr-2" />
                Export Settings
              </Button>
              <Button variant="outline" onClick={handleClearCache} className="justify-start">
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={itemVariants}>
        <Card className="bg-card/50 backdrop-blur-sm border-destructive/30 hover:border-destructive/50 transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-destructive/70">
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-destructive/20">
              <div>
                <p className="text-sm font-medium">Sign Out</p>
                <p className="text-xs text-muted-foreground">Log out of your admin account</p>
              </div>
              <Button variant="destructive" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account and remove all your data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
            <Input
              id="confirm-delete"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              disabled={deleteConfirm !== 'DELETE'}
              onClick={() => {
                toast.error('Account deletion is not implemented')
                setShowDeleteDialog(false)
              }}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
})

SettingsView.displayName = 'SettingsView'
