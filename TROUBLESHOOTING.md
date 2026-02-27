# Portfolio & Blog Troubleshooting Guide 🔧

## Overview
This document outlines the common issues found in this project and their solutions.

---

## 🚨 Known Issues & Fixes

### 1. **Select.Item Empty Value Error**

**Error Message:**
```
A <Select.Item /> must have a value prop that is not an empty string.
This is because the Select value can be set to an empty string to clear the selection and show the placeholder.
```

**Cause:**
In `src/components/BlogList.tsx`, the tag filter Select component had a `<SelectItem value="">` which is not allowed by Radix UI's Select component.

**Solution:**
Use a non-empty placeholder value like `"all"` and convert it back to empty string in the handler:

```tsx
// ❌ WRONG - Empty string value
<SelectItem value="">All tags</SelectItem>

// ✅ CORRECT - Use a placeholder value
<Select 
  value={selectedTag || "all"} 
  onValueChange={(value) => setSelectedTag(value === "all" ? "" : value)}
>
  <SelectItem value="all">All tags</SelectItem>
</Select>
```

**Files Affected:**
- `src/components/BlogList.tsx` (Line 145-160)

---

### 2. **Supabase Dependency Missing**

**Error Message:**
```
Module not found: @supabase/supabase-js
```

**Cause:**
The `@supabase/supabase-js` package was referenced in `src/lib/supabase.ts` but not installed.

**Solution:**
Install the package:
```bash
npm install @supabase/supabase-js
```

**Status:** ✅ Fixed

---

### 3. **Framer Motion Version Mismatch Warning**

**Console Warning:**
```
Attempting to mix Motion versions 12.9.1 with 12.9.2 may not work as expected.
```

**Cause:**
Multiple components or dependencies may be using different versions of framer-motion.

**Solution:**
This is a warning and doesn't break functionality. To resolve:
```bash
npm update framer-motion
```

---

### 4. **Tailwind CDN Warning (Development Only)**

**Console Warning:**
```
cdn.tailwindcss.com should not be used in production
```

**Cause:**
This warning appears in development. The production build uses the proper PostCSS setup.

**Solution:**
No action needed - this only appears in development preview.

---

## 📋 Blog System Architecture

### File Structure
```
src/
├── pages/
│   └── Blog.tsx              # Main blog page with routing
├── components/
│   ├── BlogList.tsx          # Post listing with filters
│   ├── BlogCard.tsx          # Individual post preview card
│   ├── BlogPost.tsx          # Full post view
│   └── AdminDashboard.tsx    # Admin panel for managing posts
├── lib/
│   ├── supabase.ts           # Supabase client & blog API
│   ├── mockData.ts           # Mock data for development
│   ├── markdown.ts           # Markdown parser
│   └── auth.ts               # Admin authentication
```

### Data Flow
1. **Mock Mode** (default): Uses `mockData.ts` when Supabase isn't configured
2. **Supabase Mode**: Automatically switches when env variables are set

### Routes
- `/blog` - Blog listing page
- `/blog/:slug` - Individual post page
- `/admin-secret-panel-alex2004` - Admin panel

---

## 🔧 Environment Variables

Create a `.env` file for Supabase integration:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ Common Fixes Checklist

| Issue | Status | Solution |
|-------|--------|----------|
| Select.Item empty value | ✅ Fixed | Use placeholder value "all" |
| Supabase dependency | ✅ Fixed | Package installed |
| Motion version warning | ✅ Fixed | Aligned to exact version 12.9.2 |
| Tailwind CDN warning | ℹ️ Dev Only | Ignore in development |

---

## 📞 Need More Help?

1. Check browser console for specific error messages
2. Review the component throwing the error
3. Ensure all dependencies are installed: `npm install`
4. Clear browser cache and restart dev server

---

*Last Updated: January 2026*
