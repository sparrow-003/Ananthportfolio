import React, { memo, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/components/theme-provider'
import { Switch } from '@/components/ui/switch'
import { Palette, Sun, Moon, Monitor, Type, Sparkles, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useAnimationPreference } from '@/contexts/AnimationContext'

export const AppearanceView = memo(() => {
  const { theme, setTheme } = useTheme()
  const { userPreference, setUserPreference, effectiveMode } = useAnimationPreference()
  const animationsEnabled = effectiveMode === 'full'

  // Font size (persisted)
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem('admin_font_size') || '16')
  })

  // Compact mode (persisted)
  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem('admin_compact_mode') === 'true'
  })

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`
    localStorage.setItem('admin_font_size', fontSize.toString())
  }, [fontSize])

  // Apply compact mode
  useEffect(() => {
    if (compactMode) {
      document.documentElement.classList.add('compact-mode')
    } else {
      document.documentElement.classList.remove('compact-mode')
    }
    localStorage.setItem('admin_compact_mode', compactMode.toString())
  }, [compactMode])

  const themes = [
    { id: 'light', label: 'Light', icon: Sun, desc: 'Clean bright interface' },
    { id: 'dark', label: 'Dark', icon: Moon, desc: 'Easy on the eyes' },
    { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS setting' },
  ]

  const handleResetDefaults = () => {
    setFontSize(16)
    setCompactMode(false)
    if (!animationsEnabled) setUserPreference('full')
    document.documentElement.style.fontSize = '16px'
    document.documentElement.classList.remove('compact-mode')
    toast.success('Appearance reset to defaults')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
          <p className="text-muted-foreground text-sm mt-1">Customize the look and feel of your admin panel</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetDefaults}>
          Reset to Defaults
        </Button>
      </div>

      {/* Theme Selector */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-500" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); toast.success(`Theme set to ${t.label}`) }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                  theme === t.id
                    ? "border-primary bg-primary/5"
                    : "border-border/50 hover:border-border"
                )}
              >
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center",
                  theme === t.id ? "bg-primary/10" : "bg-muted"
                )}>
                  <t.icon className={cn("w-5 h-5", theme === t.id ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Display Options */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Type className="w-4 h-4 text-blue-500" />
            Display
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Font Size</p>
                <p className="text-xs text-muted-foreground">Adjust base font size ({fontSize}px)</p>
              </div>
              <span className="text-sm font-mono text-muted-foreground">{fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={([v]) => setFontSize(v)}
              min={12}
              max={20}
              step={1}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium">Compact Mode</p>
              <p className="text-xs text-muted-foreground">Reduce padding and spacing throughout the UI</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Animations
              </p>
              <p className="text-xs text-muted-foreground">Toggle motion effects and transitions</p>
            </div>
            <Switch checked={animationsEnabled} onCheckedChange={() => setUserPreference(animationsEnabled ? 'reduced' : 'full')} />
          </div>
        </CardContent>
      </Card>

      {/* Color Preview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-green-500" />
            Color Palette Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {[
              { name: 'Primary', cls: 'bg-primary' },
              { name: 'Secondary', cls: 'bg-secondary' },
              { name: 'Accent', cls: 'bg-accent' },
              { name: 'Muted', cls: 'bg-muted' },
              { name: 'Background', cls: 'bg-background border border-border' },
              { name: 'Card', cls: 'bg-card border border-border' },
              { name: 'Destructive', cls: 'bg-destructive' },
              { name: 'Foreground', cls: 'bg-foreground' },
            ].map(color => (
              <div key={color.name} className="flex flex-col items-center gap-1.5">
                <div className={cn("w-12 h-12 rounded-lg shadow-sm", color.cls)} />
                <span className="text-[10px] text-muted-foreground font-medium">{color.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

AppearanceView.displayName = 'AppearanceView'