# Socia HRM - UI/UX Design System Documentation

## Overview
This document provides complete specifications for Socia HRM's design system including colors, typography, spacing, components, and patterns. Use this to recreate or extend the theme.

---

## Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Spacing & Layout](#spacing--layout)
4. [Shadows & Effects](#shadows--effects)
5. [Components](#components)
6. [Gradients](#gradients)
7. [Design Patterns](#design-patterns)

---

## Color Palette

### Light Mode (Default)

| Token | HSL | Hex (approx) | Usage |
|-------|-----|------------|-------|
| `--background` | `0 0% 100%` | `#FFFFFF` | Page backgrounds |
| `--foreground` | `240 20% 6%` | `#0F0F14` | Primary text |
| `--card` | `0 0% 100%` | `#FFFFFF` | Card backgrounds |
| `--card-foreground` | `240 20% 6%` | `#0F0F14` | Card text |
| `--popover` | `0 0% 100%` | `#FFFFFF` | Popover backgrounds |
| `--popover-foreground` | `240 20% 6%` | `#0F0F14` | Popover text |
| `--primary` | `199 100% 40%` | `#0077CC` | Primary actions, links |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary |
| `--secondary` | `240 6% 95%` | `#F2F2F5` | Secondary backgrounds |
| `--secondary-foreground` | `240 20% 6%` | `#0F0F14` | Secondary text |
| `--muted` | `240 6% 95%` | `#F2F2F5` | Muted backgrounds |
| `--muted-foreground` | `240 5% 46%` | `#757580` | Muted text |
| `--accent` | `36 100% 57%` | `#E89122` | Accent/ highlights |
| `--accent-foreground` | `240 20% 6%` | `#0F0F14` | Text on accent |
| `--destructive` | `0 72% 51%` | `#DC2626` | Errors, delete actions |
| `--destructive-foreground` | `0 0% 100%` | `#FFFFFF` | Text on destructive |
| `--border` | `240 6% 90%` | `#E5E5EA` | Borders, dividers |
| `--input` | `240 6% 90%` | `#E5E5EA` | Input backgrounds |
| `--ring` | `199 100% 40%` | `#0077CC` | Focus rings |

### Dark Mode

| Token | HSL | Hex (approx) | Usage |
|-------|-----|------------|-------|
| `--background` | `240 20% 4%` | `#0A0A0F` | Page backgrounds |
| `--foreground` | `0 0% 96%` | `#F5F5F5` | Primary text |
| `--card` | `240 20% 7%` | `#131318` | Card backgrounds |
| `--card-foreground` | `0 0% 96%` | `#F5F5F5` | Card text |
| `--primary` | `199 100% 50%` | `#0099FF` | Primary actions |
| `--primary-foreground` | `0 0% 100%` | `#FFFFFF` | Text on primary |
| `--secondary` | `240 12% 14%` | `#252530` | Secondary backgrounds |
| `--secondary-foreground` | `0 0% 96%` | `#F5F5F5` | Secondary text |
| `--muted` | `240 12% 14%` | `#252530` | Muted backgrounds |
| `--muted-foreground` | `240 5% 58%` | `#939399` | Muted text |
| `--destructive` | `0 63% 31%` | `#991B1B` | Errors |
| `--border` | `240 12% 14%` | `#252530` | Borders |
| `--input` | `240 12% 14%` | `#252530` | Input backgrounds |
| `--ring` | `199 100% 50%` | `#0099FF` | Focus rings |

### Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | `#0077CC` | Primary buttons, links, branding |
| Primary Blue Light | `#0099FF` | Hover states (dark mode) |
| Accent Orange | `#E89122` | Highlights, badges, accents |
| Accent Orange Light | `#F5A623` | Hover states |
| Success | `#10B981` | Success states (green) |
| Warning | `#F59E0B` | Warning states (amber) |
| Error | `#DC2626` | Error states (red) |

---

## Typography

### Font Families

| Family | Font Stack | Usage |
|--------|-----------|-------|
| Display | `Space Grotesk`, `DM Sans`, `sans-serif` | Headings, titles |
| Body | `DM Sans`, `system-ui`, `sans-serif` | Body text, UI elements |
| Mono | `JetBrains Mono`, `monospace` | Code, numbers |

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text |
| Medium | 500 | Emphasized text |
| Semibold | 600 | Buttons, labels |
| Bold | 700 | Headings |

### Font Sizes (Tailwind)

```css
/* Base: 16px */
xs: 0.75rem      /* 12px */
sm: 0.875rem    /* 14px */
base: 1rem      /* 16px */
lg: 1.125rem    /* 18px */
xl: 1.25rem     /* 20px */
2xl: 1.5rem     /* 24px */
3xl: 1.875rem   /* 30px */
4xl: 2.25rem    /* 36px */
5xl: 3rem       /* 48px */
```

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| tighter | 1.1 | Large headings |
| tight | 1.25 | Headings |
| normal | 1.5 | Body text |
| relaxed | 1.625 | Large body text |
| loose | 2 | Lists |

---

## Spacing & Layout

### Spacing Scale

```css
/* Tailwind spacing */
0: 0px
px: 1px
0.5: 2px
1: 4px
1.5: 6px
2: 8px
2.5: 10px
3: 12px
3.5: 14px
4: 16px
5: 20px
6: 24px
7: 28px
8: 32px
9: 36px
10: 40px
12: 48px
14: 56px
16: 64px
20: 80px
24: 96px
```

### Container

```css
.container {
  max-width: 1400px;
  padding: 2rem;
  center: true;
}
```

### Border Radius

| Token | Value |
|-------|-------|
| none | 0 |
| sm | 4px |
| DEFAULT | 8px (calc(0.625rem - 2px)) |
| md | 6px (calc(0.625rem - 4px)) |
| lg | 10px (0.625rem) |
| xl | 12px |
| 2xl | 16px |
| full | 9999px |

### Sidebar Width

```css
--sidebar-width: 280px;
--sidebar-width-collapsed: 80px;
```

---

## Shadows & Effects

### Box Shadows

```css
/* Card shadow (light) */
--shadow-card: 0 1px 2px hsl(240 20% 6% / 0.04), 0 4px 16px hsl(240 20% 6% / 0.04);

/* Elevated shadow */
--shadow-elevated: 0 4px 12px hsl(240 20% 6% / 0.06), 0 16px 40px hsl(199 100% 40% / 0.08);
```

### Utility Classes

```css
.shadow-card {
  box-shadow: var(--shadow-card);
}

.shadow-elevated {
  box-shadow: var(--shadow-elevated);
}
```

---

## Gradients

### Primary Gradient

```css
--gradient-primary: linear-gradient(135deg, hsl(199, 100%, 40%), hsl(210, 100%, 45%));
/* #0077CC → #0D87CC */
```

### Accent Gradient

```css
--gradient-accent: linear-gradient(135deg, hsl(36, 100%, 57%), hsl(28, 100%, 55%)));
/* #E89122 → #DB6E1C */
```

### Hero Gradient

```css
--gradient-hero: linear-gradient(160deg, hsl(0, 0%, 100%) 0%, hsl(199, 60%, 97%) 50%, hsl(0, 0%, 100%) 100%);
/* White → Light blue tint → White */
```

### Glass Effect

```css
--gradient-glass: linear-gradient(135deg, hsl(199, 100%, 40% / 0.03), hsl(210, 100%, 45% / 0.03));
```

### Utility Classes

```css
.gradient-primary { background: var(--gradient-primary); }
.gradient-accent { background: var(--gradient-accent); }
.gradient-hero { background: var(--gradient-hero); }
.gradient-glass { background: var(--gradient-glass); }
```

---

## Components

### Buttons

**Primary Button**
```jsx
<Button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</Button>
/* Background: #0077CC, Text: white */
```

**Secondary Button**
```jsx
<Button variant="secondary">
  Secondary
</Button>
/* Background: #F2F2F5, Text: #0F0F14 */
```

**Outline Button**
```jsx
<Button variant="outline">
  Outline
</Button>
/* Border: #E5E5EA, Text: #0F0F14 */
```

**Ghost Button**
```jsx
<Button variant="ghost">
  Ghost
</Button>
/* Background: transparent, Text: #0F0F14 */
```

**Destructive Button**
```jsx
<Button variant="destructive">
  Delete
</Button>
/* Background: #DC2626, Text: white */
```

**Gradient Button**
```jsx
<Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
  Gradient
</Button>
```

### Input Fields

```jsx
<Input 
  placeholder="Enter text..."
  className="border-border bg-background"
/>
/* Background: white, Border: #E5E5EA */
```

### Cards

```jsx
<Card className="shadow-card">
  <CardHeader>Title</CardHeader>
  <CardContent>Content</CardContent>
</Card>
/* Shadow: var(--shadow-card) */
```

### Badges

```jsx
<Badge>Label</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Alert</Badge>
<Badge variant="outline">Outline</Badge>
```

### Dialog/Modal

```jsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    <DialogFooter>Actions</DialogFooter>
  </DialogContent>
</Dialog>
```

### Select

```jsx
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option">Option</SelectItem>
  </SelectContent>
</Select>
```

### Tabs

```jsx
<Tabs defaultValue="tab">
  <TabsList>
    <TabsTrigger value="tab">Tab</TabsTrigger>
  </TabsList>
  <TabsContent value="tab">Content</TabsContent>
</Tabs>
```

---

## Design Patterns

### Dashboard Card

```jsx
<Card className="shadow-card">
  <CardHeader>
    <CardTitle className="text-lg font-display flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

### Stat Card

```jsx
<div className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl border">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Label</p>
      <p className="text-2xl font-bold">Value</p>
    </div>
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="h-5 w-5 text-primary" />
    </div>
  </div>
</div>
```

### Employee List Item

```jsx
<div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted">
  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-sm font-medium">
    {initials}
  </div>
  <div className="flex-1 min-w-0">
    <p className="font-medium truncate">Name</p>
    <p className="text-sm text-muted-foreground">Role • Department</p>
  </div>
  <Badge>{status}</Badge>
</div>
```

### Sidebar Item

```jsx
<Link 
  to="/path"
  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
    isActive 
      ? "bg-primary/10 text-primary" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground"
  }`}
>
  <Icon className="h-5 w-5" />
  <span>Label</span>
</Link>
```

### Notification Item

```jsx
<div className="flex items-start gap-3 py-3">
  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
    <Icon className="h-4 w-4 text-primary" />
  </div>
  <div className="flex-1">
    <p className="text-sm font-medium">Title</p>
    <p className="text-sm text-muted-foreground">Message</p>
  </div>
</div>
```

---

## Animations

### Keyframes

```css
@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Animation Classes

```css
.animate-accordion-down { animation: accordion-down 0.2s ease-out; }
.animate-accordion-up { animation: accordion-up 0.2s ease-out; }
.animate-float { animation: float 6s ease-in-out infinite; }
.animate-shimmer { animation: shimmer 3s ease-in-out infinite; }
```

---

## Responsive Breakpoints

```css
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1400px /* Large desktops */
```

---

## CSS Variables (Complete Set)

### Light Mode

```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 20% 6%;
  --card: 0 0% 100%;
  --card-foreground: 240 20% 6%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 20% 6%;
  --primary: 199 100% 40%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 6% 95%;
  --secondary-foreground: 240 20% 6%;
  --muted: 240 6% 95%;
  --muted-foreground: 240 5% 46%;
  --accent: 36 100% 57%;
  --accent-foreground: 240 20% 6%;
  --destructive: 0 72% 51%;
  --destructive-foreground: 0 0% 100%;
  --border: 240 6% 90%;
  --input: 240 6% 90%;
  --ring: 199 100% 40%;
  --radius: 0.625rem;
  --sidebar-background: 0 0% 100%;
  --sidebar-foreground: 240 20% 6%;
  --sidebar-primary: 199 100% 40%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 6% 95%;
  --sidebar-accent-foreground: 240 20% 6%;
  --sidebar-border: 240 6% 90%;
  --sidebar-ring: 199 100% 40%;
}
```

### Dark Mode

```css
.dark {
  --background: 240 20% 4%;
  --foreground: 0 0% 96%;
  --card: 240 20% 7%;
  --card-foreground: 0 0% 96%;
  --popover: 240 20% 7%;
  --popover-foreground: 0 0% 96%;
  --primary: 199 100% 50%;
  --primary-foreground: 0 0% 100%;
  --secondary: 240 12% 14%;
  --secondary-foreground: 0 0% 96%;
  --muted: 240 12% 14%;
  --muted-foreground: 240 5% 58%;
  --accent: 36 100% 57%;
  --accent-foreground: 240 20% 6%;
  --destructive: 0 63% 31%;
  --destructive-foreground: 0 0% 96%;
  --border: 240 12% 14%;
  --input: 240 12% 14%;
  --ring: 199 100% 50%;
  --sidebar-background: 240 20% 7%;
  --sidebar-foreground: 0 0% 96%;
  --sidebar-primary: 199 100% 50%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 12% 14%;
  --sidebar-accent-foreground: 0 0% 96%;
  --sidebar-border: 240 12% 14%;
  --sidebar-ring: 199 100% 50%;
}
```

---

## Implementation Checklist

To recreate this theme:

1. **Setup Tailwind** with `tailwindcss-animate` plugin
2. **Define CSS variables** in `index.css` under `@layer base :root`
3. **Configure fonts** - import DM Sans and Space Grotesk from Google Fonts
4. **Apply colors** using HSL values or create utility classes
5. **Add gradients** as utility classes
6. **Use shadows** from the shadows section

---

## Quick Reference

| Element | Value |
|---------|-------|
| Primary | `#0077CC` |
| Accent | `#E89122` |
| Radius | `0.625rem` (10px) |
| Font Display | Space Grotesk |
| Font Body | DM Sans |
| Container | 1400px max |
| Sidebar | 280px |

---

*Generated for Socia HRM Design System*