import { useState, useEffect, useCallback, useRef } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'
import MatrixLoader from '@/components/MatrixLoader'
import { AnimatePresence } from 'framer-motion'

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showMatrix, setShowMatrix] = useState(false) // Start false, show only if needed
  const [matrixDuration, setMatrixDuration] = useState(4000) // Default 4s instead of 10s
  const lastUserIdRef = useRef<string | null>(null)
  const initialCheckDone = useRef(false)

  const checkAdminRole = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin',
      })
      if (error) return false
      return Boolean(data)
    } catch {
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const resolveFromSession = async (
      session: Session | null,
      options?: { force?: boolean; showLoader?: boolean }
    ) => {
      if (!mounted) return

      const userId = session?.user?.id ?? null

      if (!userId) {
        lastUserIdRef.current = null
        setIsAuthenticated(false)
        setLoading(false)
        // Show matrix only if not already checked and not authenticated
        if (!initialCheckDone.current) {
          setShowMatrix(true)
          initialCheckDone.current = true
        }
        return
      }

      const isAdmin = await checkAdminRole(userId)
      if (!mounted) return

      lastUserIdRef.current = userId
      setIsAuthenticated(isAdmin)
      setLoading(false)
      
      // If already authenticated, we don't need the matrix loader
      if (isAdmin && !initialCheckDone.current) {
        setShowMatrix(false)
        initialCheckDone.current = true
      } else if (!initialCheckDone.current) {
        setShowMatrix(true)
        initialCheckDone.current = true
      }
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        await resolveFromSession(session)
      } catch (error) {
        if (mounted) {
          setIsAuthenticated(false)
          setLoading(false)
          setShowMatrix(true)
        }
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setLoading(false)
        lastUserIdRef.current = null
        setShowMatrix(true)
        return
      }

      if (event === 'SIGNED_IN') {
        setMatrixDuration(2000) // Faster transition on successful login
        setShowMatrix(true)
      }

      if (event !== 'TOKEN_REFRESHED' && event !== 'INITIAL_SESSION') {
        await resolveFromSession(session, {
          force: event === 'USER_UPDATED',
          showLoader: event === 'SIGNED_IN' || event === 'USER_UPDATED',
        })
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [checkAdminRole])

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true)
    setMatrixDuration(2000)
    setShowMatrix(true)
  }, [])

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setShowMatrix(true)
    setMatrixDuration(3000)
  }, [])

  return (
    <>
      <AnimatePresence>
        {showMatrix && (
          <div className="relative z-[100]">
            <MatrixLoader 
              duration={matrixDuration} 
              onComplete={() => setShowMatrix(false)} 
            />
            <button 
              onClick={() => setShowMatrix(false)}
              className="fixed bottom-8 right-8 z-[110] px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-full text-emerald-500 text-xs font-mono tracking-widest uppercase transition-all"
            >
              Skip Initialization
            </button>
          </div>
        )}
      </AnimatePresence>

      <div className={showMatrix ? "fixed inset-0 -z-10 opacity-0 pointer-events-none" : "animate-in fade-in zoom-in-95 duration-700 ease-out"}>
        {loading ? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-6">
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)] -z-10" />
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-2 border-emerald-500/10" />
              <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
              <div className="absolute inset-4 rounded-full border-b-2 border-teal-500/50 animate-reverse-spin" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-emerald-500 font-mono text-xs tracking-[0.3em] uppercase animate-pulse">Establishing Secure Node</p>
              <div className="h-0.5 w-32 bg-emerald-500/10 overflow-hidden rounded-full">
                <div className="h-full bg-emerald-500 animate-loading-bar" />
              </div>
            </div>
          </div>
        ) : isAuthenticated ? (
          <AdminDashboard onLogout={handleLogout} />
        ) : (
          <AdminLogin onLogin={handleLogin} />
        )}
      </div>
    </>
  )
}

export default AdminPanel
