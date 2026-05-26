-- ============================================================
-- FIX: blog_likes_ip_privacy - User IP Addresses Publicly Readable
-- FIX: blog_likes_delete_bypass - Anyone Can Delete Any Like
-- ============================================================

-- 1. Drop the insecure policies
DROP POLICY IF EXISTS "Anyone view likes" ON public.blog_likes;
DROP POLICY IF EXISTS "Delete own likes by IP" ON public.blog_likes;
DROP POLICY IF EXISTS "Insert likes on published posts" ON public.blog_likes;

-- 2. Create restrictive policies - only admins can directly access the table
CREATE POLICY "Admins can view all likes"
ON public.blog_likes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Block direct INSERT - must use RPC
CREATE POLICY "No direct inserts"
ON public.blog_likes
FOR INSERT
WITH CHECK (false);

-- Block direct DELETE - must use RPC
CREATE POLICY "No direct deletes"
ON public.blog_likes
FOR DELETE
USING (false);

-- 3. Create secure RPC functions for like operations

-- Like a post (secure - validates post is published)
CREATE OR REPLACE FUNCTION public.like_post(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_exists BOOLEAN;
  v_already_liked BOOLEAN;
BEGIN
  -- Check post exists and is published
  SELECT EXISTS (
    SELECT 1 FROM blog_posts 
    WHERE id = p_post_id 
      AND published = true 
      AND (publish_at IS NULL OR publish_at <= NOW())
  ) INTO v_post_exists;
  
  IF NOT v_post_exists THEN
    RETURN FALSE;
  END IF;
  
  -- Check if already liked
  SELECT EXISTS (
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip
  ) INTO v_already_liked;
  
  IF v_already_liked THEN
    RETURN FALSE; -- Already liked
  END IF;
  
  -- Insert the like
  INSERT INTO blog_likes (post_id, user_ip) 
  VALUES (p_post_id, p_user_ip);
  
  -- Increment the counter
  UPDATE blog_posts 
  SET likes_count = likes_count + 1 
  WHERE id = p_post_id;
  
  RETURN TRUE;
END;
$$;

-- Unlike a post (secure - only removes if IP matches)
CREATE OR REPLACE FUNCTION public.unlike_post(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
BEGIN
  -- Delete only if the IP matches (ownership verification)
  DELETE FROM blog_likes 
  WHERE post_id = p_post_id AND user_ip = p_user_ip;
  
  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  
  IF v_deleted > 0 THEN
    -- Decrement the counter
    UPDATE blog_posts 
    SET likes_count = GREATEST(likes_count - 1, 0)
    WHERE id = p_post_id;
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- Check if user has liked (secure - returns boolean only, no IP exposure)
CREATE OR REPLACE FUNCTION public.has_user_liked(p_post_id UUID, p_user_ip TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = p_user_ip
  );
$$;