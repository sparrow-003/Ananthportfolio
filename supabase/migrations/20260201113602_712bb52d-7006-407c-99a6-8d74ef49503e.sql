-- ===========================================
-- SECURITY FIX: Comment Content Validation & Rate Limiting
-- ===========================================

-- 1. Create function to validate and sanitize comment content
CREATE OR REPLACE FUNCTION public.validate_comment()
RETURNS TRIGGER AS $$
DECLARE
  v_comment_count INT;
BEGIN
  -- Trim whitespace from content and author
  NEW.content = trim(NEW.content);
  NEW.author = trim(NEW.author);
  
  -- Validate content length (1-5000 characters)
  IF length(NEW.content) < 1 THEN
    RAISE EXCEPTION 'Comment content cannot be empty';
  END IF;
  
  IF length(NEW.content) > 5000 THEN
    RAISE EXCEPTION 'Comment content must be 5000 characters or less';
  END IF;
  
  -- Validate author length (1-100 characters)
  IF length(NEW.author) < 1 THEN
    RAISE EXCEPTION 'Author name cannot be empty';
  END IF;
  
  IF length(NEW.author) > 100 THEN
    RAISE EXCEPTION 'Author name must be 100 characters or less';
  END IF;
  
  -- Validate content is not just whitespace
  IF NEW.content = '' THEN
    RAISE EXCEPTION 'Comment content cannot be only whitespace';
  END IF;
  
  -- Server-side rate limiting: max 5 comments per author per post in 24 hours
  SELECT COUNT(*) INTO v_comment_count
  FROM public.blog_comments
  WHERE post_id = NEW.post_id
    AND author = NEW.author
    AND created_at > NOW() - INTERVAL '24 hours';
  
  IF v_comment_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded: maximum 5 comments per post per 24 hours';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Create trigger to run validation before insert
DROP TRIGGER IF EXISTS validate_comment_trigger ON public.blog_comments;
CREATE TRIGGER validate_comment_trigger
  BEFORE INSERT ON public.blog_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_comment();

-- 3. Create index to optimize rate limit check
CREATE INDEX IF NOT EXISTS idx_comments_rate_limit 
  ON public.blog_comments(post_id, author, created_at);

-- ===========================================
-- SECURITY FIX: Hash IP Addresses for Privacy
-- ===========================================

-- 4. Create function to hash IP addresses
CREATE OR REPLACE FUNCTION public.hash_user_identifier(identifier TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Hash the identifier with a salt for privacy
  RETURN encode(sha256((identifier || 'blog_likes_salt_2024')::bytea), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE SET search_path = public;

-- 5. Update the like_post function to hash IPs before storing
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
BEGIN
  -- Hash the IP address for privacy
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
  
  -- Check if already liked (using hashed IP)
  SELECT EXISTS (
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = v_hashed_ip
  ) INTO v_already_liked;
  
  IF v_already_liked THEN
    RETURN FALSE; -- Already liked
  END IF;
  
  -- Insert the like with hashed IP
  INSERT INTO blog_likes (post_id, user_ip) 
  VALUES (p_post_id, v_hashed_ip);
  
  -- Increment the counter
  UPDATE blog_posts 
  SET likes_count = likes_count + 1 
  WHERE id = p_post_id;
  
  RETURN TRUE;
END;
$$;

-- 6. Update the unlike_post function to use hashed IPs
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
  -- Hash the IP address for privacy
  v_hashed_ip := hash_user_identifier(p_user_ip);
  
  -- Delete only if the hashed IP matches
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

-- 7. Update the has_user_liked function to use hashed IPs
CREATE OR REPLACE FUNCTION public.has_user_liked(p_post_id uuid, p_user_ip text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM blog_likes 
    WHERE post_id = p_post_id AND user_ip = hash_user_identifier(p_user_ip)
  );
$$;

-- 8. Hash existing IP addresses in the database (one-time migration)
UPDATE public.blog_likes 
SET user_ip = hash_user_identifier(user_ip)
WHERE user_ip NOT LIKE '%[a-f0-9]{64}%' 
  AND length(user_ip) < 64;