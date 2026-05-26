-- Add display count columns for fake views/likes shown to users
-- This allows admin to set inflated numbers while tracking real stats separately

-- Add new columns to blog_posts
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS display_views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS display_likes_count INTEGER DEFAULT 0;

-- Update existing posts to have display counts equal to real counts
UPDATE blog_posts 
SET display_views_count = views_count, 
    display_likes_count = likes_count 
WHERE display_views_count IS NULL OR display_likes_count IS NULL;

-- Create index for display counts
CREATE INDEX IF NOT EXISTS idx_blog_posts_display_counts ON blog_posts(display_views_count, display_likes_count);

-- Comment to explain the purpose
COMMENT ON COLUMN blog_posts.display_views_count IS 'Fake view count shown to users (set by admin)';
COMMENT ON COLUMN blog_posts.display_likes_count IS 'Fake like count shown to users (set by admin)';
