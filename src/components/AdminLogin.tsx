import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { adminAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface AdminLoginProps {
  onLogin: () => void
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<{ success: boolean; error?: string }>((_, reject) => {
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      })

      // Race between login and timeout
      const result = await Promise.race([
        adminAuth.login(credentials.email, credentials.password),
        timeoutPromise
      ])

      if (result.success) {
        toast.success('Welcome back, Admin!')
        onLogin()
      } else {
        toast.error(result.error || 'Invalid credentials. Please try again.')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message === 'Request timed out' ? 'Login timed out. Please check your connection.' : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-950/20 via-black to-teal-950/20 -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05),transparent_50%)] -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-25" />

        <Card className="bg-black/40 border-emerald-500/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
              <Lock className="w-8 h-8 text-emerald-400" />
            </div>
            <CardTitle className="text-3xl font-black text-white tracking-tighter mb-2">
              Genesis Control
            </CardTitle>
            <p className="text-emerald-400/60 font-medium text-sm px-6 leading-relaxed">
              Authenticate to manage your 3D Genesis Blog environment.
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-10 mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-400/40 uppercase tracking-[0.2em] ml-1">
                  Admin Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/40 w-4 h-4 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    className="pl-10 bg-black/50 border-emerald-500/10 text-white placeholder:text-gray-600 h-12 focus:border-emerald-500/40 transition-all rounded-xl"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-emerald-400/40 uppercase tracking-[0.2em] ml-1">
                  Security Phrase
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400/40 w-4 h-4 group-focus-within:text-emerald-400 transition-colors" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter passphrase"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10 bg-black/50 border-emerald-500/10 text-white placeholder:text-gray-600 h-12 focus:border-emerald-500/40 transition-all rounded-xl"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-400/40 hover:text-emerald-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest h-12 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Initiate Session'}
              </Button>
            </form>

            <div className="mt-8 text-center border-t border-emerald-500/5 pt-6">
              <p className="text-[10px] text-emerald-400/20 font-black uppercase tracking-tighter">
                Genesis Protocol v2.0 &bull; Secure Authentication
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminLogin
