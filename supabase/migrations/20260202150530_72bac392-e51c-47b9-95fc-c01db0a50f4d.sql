-- Create a secure view for admin access to blog_likes that masks the IP hashes
-- This prevents admins from seeing full IP hashes that could be used for tracking

-- First, create a function to mask the IP hash (show only first 8 chars)
CREATE OR REPLACE FUNCTION public.mask_ip_hash(ip_hash TEXT)
RETURNS TEXT
LANGUAGE sql
IMMUTABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN ip_hash IS NULL THEN NULL
    ELSE LEFT(ip_hash, 8) || '...[masked]'
  END;
$$;

-- Create a secure view for admin access that masks IP hashes
CREATE OR REPLACE VIEW public.blog_likes_admin AS
SELECT 
  id,
  post_id,
  created_at,
  mask_ip_hash(user_ip) AS user_ip_masked
FROM public.blog_likes;

-- Grant access to the view
GRANT SELECT ON public.blog_likes_admin TO authenticated;

-- Drop the old admin policy on blog_likes that exposes full IPs
DROP POLICY IF EXISTS "Admins can view all likes" ON public.blog_likes;

-- Create a new policy that only allows admins to access likes through the secure RPC functions
-- Admins should use the blog_likes_admin view instead of querying blog_likes directly
-- This ensures they never see the full hashed IPs
CREATE POLICY "No direct reads for security"
ON public.blog_likes
FOR SELECT
USING (false);

-- Comment explaining the security change
COMMENT ON VIEW public.blog_likes_admin IS 'Secure view for admin access to blog likes. IP hashes are masked to prevent tracking even if admin account is compromised.';