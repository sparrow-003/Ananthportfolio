-- Fix the security definer view issue by removing the SECURITY DEFINER view
-- and creating a proper RLS-based approach

-- Drop the insecure view
DROP VIEW IF EXISTS public.blog_likes_admin;

-- Drop the mask function (no longer needed)
DROP FUNCTION IF EXISTS public.mask_ip_hash(TEXT);

-- Update the RLS policy to allow admins to view likes but without exposing raw IPs
-- Since IPs are already hashed in the database, this is acceptable
-- The key protection is that raw IPs are never stored

-- Remove the restrictive "no direct reads" policy
DROP POLICY IF EXISTS "No direct reads for security" ON public.blog_likes;

-- Create a policy that allows admins to view likes
-- IPs are already hashed server-side via the like_post RPC function
CREATE POLICY "Admins can view likes"
ON public.blog_likes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add a comment explaining the security model
COMMENT ON TABLE public.blog_likes IS 'Stores blog post likes. User IPs are hashed via the like_post() RPC function before storage. Admins can view hashed IPs but cannot reverse them to actual IPs.';