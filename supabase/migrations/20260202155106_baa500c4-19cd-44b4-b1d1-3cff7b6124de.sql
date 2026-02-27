-- Add rate limiting to RPC functions for defense against automated abuse

-- Drop and recreate increment_post_views with rate limiting
CREATE OR REPLACE FUNCTION public.increment_post_views(post_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_last_view TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Only increment if post is published
  -- Rate limiting: Allow max 1 view increment per second per post (prevents spam)
  UPDATE public.blog_posts 
  SET views_count = views_count + 1,
      updated_at = NOW()
  WHERE id = post_id 
    AND published = true
    AND (updated_at IS NULL OR updated_at < NOW() - INTERVAL '1 second');
END;
$$;

-- Drop and recreate like_post with enhanced validation
CREATE OR REPLACE FUNCTION public.like_post(p_post_id uuid, p_user_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_post_exists BOOLEAN;
  v_already_liked BOOLEAN;
  v_hashed_ip TEXT;
  v_recent_likes INT;
BEGIN
  -- Validate input
  IF p_post_id IS NULL OR p_user_ip IS NULL OR trim(p_user_ip) = '' THEN
    RETURN FALSE;
  END IF;

  -- Hash the user identifier for privacy
  v_hashed_ip := hash_user_identifier(p_user_ip);
  
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
  
  -- Check if already liked (using hashed identifier)
  SELECT EXISTS (
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = v_hashed_ip
  ) INTO v_already_liked;
  
  IF v_already_liked THEN
    RETURN FALSE; -- Already liked
  END IF;
  
  -- Rate limiting: Max 10 likes per user per hour across all posts
  SELECT COUNT(*) INTO v_recent_likes
  FROM blog_likes
  WHERE user_ip = v_hashed_ip
    AND created_at > NOW() - INTERVAL '1 hour';
    
  IF v_recent_likes >= 10 THEN
    RETURN FALSE; -- Rate limit exceeded
  END IF;
  
  -- Insert the like with hashed identifier
  INSERT INTO blog_likes (post_id, user_ip) 
  VALUES (p_post_id, v_hashed_ip);
  
  -- Increment the counter
  UPDATE blog_posts 
  SET likes_count = likes_count + 1 
  WHERE id = p_post_id;
  
  RETURN TRUE;
END;
$$;

-- Drop and recreate unlike_post with input validation
CREATE OR REPLACE FUNCTION public.unlike_post(p_post_id uuid, p_user_ip text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted INTEGER;
  v_hashed_ip TEXT;
BEGIN
  -- Validate input
  IF p_post_id IS NULL OR p_user_ip IS NULL OR trim(p_user_ip) = '' THEN
    RETURN FALSE;
  END IF;

  -- Hash the user identifier for privacy
  v_hashed_ip := hash_user_identifier(p_user_ip);
  
  -- Delete only if the hashed identifier matches
  DELETE FROM blog_likes 
  WHERE post_id = p_post_id AND user_ip = v_hashed_ip;
  
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

-- Add comment about security model
COMMENT ON FUNCTION public.like_post IS 'Handles post likes with rate limiting (10/hour) and privacy-preserving hashed identifiers';
COMMENT ON FUNCTION public.unlike_post IS 'Handles post unlikes with input validation and privacy-preserving hashed identifiers';
COMMENT ON FUNCTION public.increment_post_views IS 'Increments view count with 1-second rate limiting to prevent spam';