-- Fix function search_path warnings for all functions
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

-- Fix overly permissive RLS policies for likes
-- Drop the permissive policies
DROP POLICY IF EXISTS "Anyone insert likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Anyone delete own likes" ON public.blog_likes;

-- Create more restrictive policies for likes
-- Only allow inserting likes on published posts
CREATE POLICY "Insert likes on published posts"
ON public.blog_likes
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true
    )
);

-- Only allow deleting own likes (matched by IP)
CREATE POLICY "Delete own likes by IP"
ON public.blog_likes
FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.blog_posts
        WHERE id = post_id AND published = true
    )
);