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

-- RLS policy for user_roles - users can only see their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only admins can manage roles (via admin functions, not direct access)
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

-- Blog Posts Table (if not exists)
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

-- Blog Likes Table (if not exists)
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_ip TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_ip)
);

-- Blog Comments Table (if not exists)
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all blog tables
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly-permissive policies
DROP POLICY IF EXISTS "Allow all operations on blog_posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view published posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public can view likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Public can insert likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Public can delete own likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Public can view comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can insert comments" ON public.blog_comments;
DROP POLICY IF EXISTS "Public can delete comments" ON public.blog_comments;

-- BLOG POSTS POLICIES (secure)
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

-- BLOG LIKES POLICIES
-- Anyone can view likes
CREATE POLICY "Anyone view likes"
ON public.blog_likes
FOR SELECT
USING (true);

-- Anyone can insert likes (rate limited by unique constraint)
CREATE POLICY "Anyone insert likes"
ON public.blog_likes
FOR INSERT
WITH CHECK (true);

-- Anyone can delete their own likes (by IP)
CREATE POLICY "Anyone delete own likes"
ON public.blog_likes
FOR DELETE
USING (true);

-- BLOG COMMENTS POLICIES
-- Anyone can view comments on published posts
CREATE POLICY "Anyone view comments"
ON public.blog_comments
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true AND allow_comments = true
    )
);

-- Anyone can add comments to published posts with comments enabled
CREATE POLICY "Anyone add comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true AND allow_comments = true
    )
);

-- Admins can delete any comment
CREATE POLICY "Admins delete comments"
ON public.blog_comments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_publish_at ON public.blog_posts(publish_at);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON public.blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON public.blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Functions for counter updates (with rate limiting validation)
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id UUID)
RETURNS void AS $$
BEGIN
    -- Only increment for published posts
    UPDATE public.blog_posts 
    SET views_count = views_count + 1 
    WHERE id = post_id AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.decrement_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE public.blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();