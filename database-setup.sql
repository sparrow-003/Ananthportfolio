-- Blog System Database Setup
-- Run this in your Supabase SQL editor to ensure proper table structure

-- Create blog_posts table with proper defaults
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  featured_image TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT FALSE,
  publish_at TIMESTAMP WITH TIME ZONE,
  allow_comments BOOLEAN DEFAULT TRUE,
  author_name TEXT DEFAULT 'Ananth',
  location TEXT,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_likes table for anonymous likes
CREATE TABLE IF NOT EXISTS blog_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_ip)
);

-- Create user_roles table for admin access
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_post_id ON blog_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to increment post views
CREATE OR REPLACE FUNCTION increment_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE blog_posts 
  SET views_count = views_count + 1 
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to like a post
CREATE OR REPLACE FUNCTION like_post(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like already exists
  SELECT EXISTS(
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip
  ) INTO like_exists;
  
  IF NOT like_exists THEN
    -- Insert like
    INSERT INTO blog_likes (post_id, user_ip) 
    VALUES (p_post_id, p_user_ip);
    
    -- Increment likes count
    UPDATE blog_posts 
    SET likes_count = likes_count + 1 
    WHERE id = p_post_id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unlike a post
CREATE OR REPLACE FUNCTION unlike_post(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  like_exists BOOLEAN;
BEGIN
  -- Check if like exists
  SELECT EXISTS(
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip
  ) INTO like_exists;
  
  IF like_exists THEN
    -- Remove like
    DELETE FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip;
    
    -- Decrement likes count (ensure it doesn't go below 0)
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = p_post_id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a post
CREATE OR REPLACE FUNCTION has_user_liked(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check user role (MISSING IN ORIGINAL SETUP)
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_posts
DROP POLICY IF EXISTS "Public can view published posts" ON blog_posts;
CREATE POLICY "Public can view published posts" ON blog_posts
  FOR SELECT USING (
    published = true AND 
    (publish_at IS NULL OR publish_at <= NOW())
  );

DROP POLICY IF EXISTS "Admins can manage all posts" ON blog_posts;
CREATE POLICY "Admins can manage all posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for blog_comments
DROP POLICY IF EXISTS "Public can view comments" ON blog_comments;
CREATE POLICY "Public can view comments" ON blog_comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can create comments" ON blog_comments;
CREATE POLICY "Public can create comments" ON blog_comments
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage comments" ON blog_comments;
CREATE POLICY "Admins can manage comments" ON blog_comments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for blog_likes
DROP POLICY IF EXISTS "Public can view likes" ON blog_likes;
CREATE POLICY "Public can view likes" ON blog_likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can manage their likes" ON blog_likes;
CREATE POLICY "Public can manage their likes" ON blog_likes
  FOR ALL USING (true);

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
CREATE POLICY "Users can view their own roles" ON user_roles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample admin user (replace with your actual user ID)
-- You can get your user ID from the Supabase Auth dashboard
-- INSERT INTO user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Sample blog post for testing (optional)
INSERT INTO blog_posts (
  title, 
  content, 
  excerpt, 
  slug, 
  published, 
  author_name,
  tags
) VALUES (
  'Welcome to My Blog',
  '# Welcome to My Blog

This is a sample blog post to test the system. You can write content in **Markdown** format.

## Features

- Rich text editing
- Like system
- Comments
- Real-time updates
- Mobile responsive

Feel free to explore and create your own posts!',
  'Welcome to my new blog! This is a sample post to demonstrate the features of our blog system.',
  'welcome-to-my-blog',
  true,
  'Ananth',
  ARRAY['welcome', 'blog', 'sample']
) ON CONFLICT (slug) DO NOTHING;

-- Verify setup
SELECT 'Blog posts table created' as status, count(*) as posts_count FROM blog_posts;
SELECT 'Blog comments table created' as status, count(*) as comments_count FROM blog_comments;
SELECT 'Blog likes table created' as status, count(*) as likes_count FROM blog_likes;
SELECT 'User roles table created' as status, count(*) as roles_count FROM user_roles;
