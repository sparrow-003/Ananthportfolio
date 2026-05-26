import { supabase } from '@/integrations/supabase/client'

// Admin authentication using Supabase Auth exclusively (secure approach)
export const adminAuth = {
  // Login with email/password via Supabase Auth
  login: async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Login error:', error.message)
        return { success: false, error: error.message }
      }

      if (!data.user) {
        return { success: false, error: 'Login failed' }
      }

      // Check if user has admin role
      const hasAdminRole = await adminAuth.checkAdminRole(data.user.id)
      if (!hasAdminRole) {
        // Sign out if not admin
        await supabase.auth.signOut()
        return { success: false, error: 'Access denied. Admin privileges required.' }
      }
      
      return { success: true }
    } catch (err) {
      console.error('Unexpected login error:', err)
      return { success: false, error: 'An unexpected error occurred' }
    }
  },

  // Logout via Supabase Auth
  logout: async (): Promise<void> => {
    await supabase.auth.signOut()
  },

  // Check if user is authenticated as admin (server-verified)
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return false
      
      // Verify admin role from database
      return await adminAuth.checkAdminRole(user.id)
    } catch {
      return false
    }
  },

  /**
   * Check admin role from database.
   * 
   * SECURITY NOTE: This is a UI hint only, not a security boundary.
   * Actual security is enforced by:
   * 1. RLS policies on all tables (blog_posts, user_roles, etc.)
   * 2. The admin-blog edge function which verifies JWT and admin role server-side
   * 3. Database functions that validate permissions before operations
   * 
   * Never rely on this client-side check for authorization decisions.
   */
  checkAdminRole: async (userId: string): Promise<boolean> => {
    try {
      // 1. Try RPC first (most secure/efficient if function exists)
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin',
      })

      if (!error) {
        return Boolean(data)
      }

      console.warn('RPC has_role check failed, falling back to direct table query:', error.message)

      // 2. Fallback to direct table query (works if RLS allows user to see own roles)
      const { data: roles, error: tableError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle()

      if (tableError) {
        console.error('Table check failed:', tableError.message)
        return false
      }

      return !!roles
    } catch (err) {
      console.error('Unexpected error in checkAdminRole:', err)
      return false
    }
  },

  // Get current session
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Get current user
  getUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Subscribe to auth state changes
  onAuthStateChange: (callback: (isAuthenticated: boolean) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const isAdmin = await adminAuth.checkAdminRole(session.user.id)
        callback(isAdmin)
      } else {
        callback(false)
      }
    })
  }
}

/**
 * Get anonymous user identifier for like tracking.
 * 
 * PRIVACY: Uses localStorage-only anonymous IDs to avoid:
 * - Third-party IP service calls that could track users
 * - Privacy concerns with sending IPs to external services
 * - GDPR/privacy law compliance issues
 * 
 * The identifier is hashed server-side before storage in the database.
 */
export const getUserIdentifier = async (): Promise<string> => {
  try {
    // Check for existing anonymous ID
    const storedId = localStorage.getItem('anonymous_user_id')
    if (storedId) return storedId
    
    // Generate new anonymous ID using crypto API if available
    let newId: string
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      newId = `anon_${crypto.randomUUID()}`
    } else {
      // Fallback for older browsers
      newId = `anon_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
    }
    
    localStorage.setItem('anonymous_user_id', newId)
    return newId
  } catch (error) {
    // Handle private browsing or storage disabled
    console.warn('localStorage unavailable, using session-only ID')
    return `session_${Math.random().toString(36).substr(2, 12)}`
  }
}

// Alias for backward compatibility
export const getUserIP = getUserIdentifier

// Hash function removed - no longer needed since we use localStorage IDs
// Server-side hashing is done by the database function hash_user_identifier()
