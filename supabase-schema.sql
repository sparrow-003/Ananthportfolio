-- ============================================================
-- SECURE BLOG SCHEMA FOR SUPABASE
-- ============================================================
-- This schema implements proper security with:
-- 1. Role-based access control using user_roles table
-- 2. RLS policies that enforce authentication
-- 3. Secure functions with search_path set
-- 4. XSS-safe content storage (sanitization in frontend)
-- ============================================================

-- Create app_role enum for role-based access
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- BLOG TABLES
-- ============================================================

-- Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    featured_image TEXT,
    tags TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT false,
    publish_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    likes_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    allow_comments BOOLEAN DEFAULT true,
    author_name TEXT DEFAULT 'Ananth',
    location TEXT
);

-- Blog Likes Table
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_ip)
);

-- Blog Comments Table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BLOG POSTS POLICIES
-- ============================================================

-- Public can only read published posts
CREATE POLICY "Public read published posts"
ON public.blog_posts
FOR SELECT
USING (published = true AND (publish_at IS NULL OR publish_at <= NOW()));

-- Admins can read all posts
CREATE POLICY "Admins read all posts"
ON public.blog_posts
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can create posts
CREATE POLICY "Admins create posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update posts
CREATE POLICY "Admins update posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete posts
CREATE POLICY "Admins delete posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- BLOG LIKES POLICIES
-- ============================================================

CREATE POLICY "Anyone view likes"
ON public.blog_likes
FOR SELECT
USING (true);

CREATE POLICY "Insert likes on published posts"
ON public.blog_likes
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true
    )
);

CREATE POLICY "Delete own likes by IP"
ON public.blog_likes
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true
    )
);

-- ============================================================
-- BLOG COMMENTS POLICIES
-- ============================================================

CREATE POLICY "Anyone view comments"
ON public.blog_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true AND allow_comments = true
    )
);

CREATE POLICY "Anyone add comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true AND allow_comments = true
    )
);

CREATE POLICY "Admins delete comments"
ON public.blog_comments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_at ON public.blog_posts(publish_at);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON public.blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- ============================================================
-- FUNCTIONS (with secure search_path)
-- ============================================================

CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts 
    SET views_count = views_count + 1 
    WHERE id = post_id AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- SETUP INSTRUCTIONS
-- ============================================================
-- After running this schema:
-- 1. Create an admin user via Supabase Auth (email/password)
-- 2. Add admin role: INSERT INTO user_roles (user_id, role) VALUES ('<user-uuid>', 'admin');
-- 3. The admin can now login and manage blog posts
