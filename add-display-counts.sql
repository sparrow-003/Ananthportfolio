-- Migration: Add display count columns for fake views/likes
-- This allows admins to set inflated counts shown to users
-- while keeping real counts for analytics

-- Add display count columns if they don't exist
DO $$ 
BEGIN 
  -- Add display_views_count column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'blog_posts' 
                 AND column_name = 'display_views_count') THEN
    ALTER TABLE public.blog_posts 
    ADD COLUMN display_views_count INTEGER DEFAULT 0;
    
    -- Set initial display counts to match real counts
    UPDATE public.blog_posts 
    SET display_views_count = views_count 
    WHERE display_views_count IS NULL;
  END IF;

  -- Add display_likes_count column
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'blog_posts' 
                 AND column_name = 'display_likes_count') THEN
    ALTER TABLE public.blog_posts 
    ADD COLUMN display_likes_count INTEGER DEFAULT 0;
    
    -- Set initial display counts to match real counts
    UPDATE public.blog_posts 
    SET display_likes_count = likes_count 
    WHERE display_likes_count IS NULL;
  END IF;
END $$;

-- Add comments explaining the columns
COMMENT ON COLUMN public.blog_posts.display_views_count IS 'Fake view count shown to users (admin-controlled)';
COMMENT ON COLUMN public.blog_posts.display_likes_count IS 'Fake like count shown to users (admin-controlled)';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_display_counts 
ON public.blog_posts(display_views_count, display_likes_count);

-- Update RLS policies to allow admin to update display counts
-- (Assuming admin already has full access via existing policies)
