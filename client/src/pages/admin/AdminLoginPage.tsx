import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldAlert, User, Lock, Loader2 } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import TacticalButton from '@/components/ui/TacticalButton'
import { authService } from '@/services/authService'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const auth = await authService.login(email, password)
      authService.saveAuth(auth)
      if (auth.user.role !== 'admin') {
        authService.clearAuth()
        setError('ACCESS DENIED // REQUESTS ADMIN CLEARANCE')
        setLoading(false)
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(typeof err === 'object' && err !== null && 'message' in err ? String((err as { message: string }).message) : 'LOGIN FAILED')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full border border-white/15 bg-black/40 px-4 py-3 font-mono text-sm text-gray-200 placeholder-gray-600 outline-none transition-colors focus:border-tactical-accent/60'

  return (
    <PageShell title="Command Center Login" subtitle="SECURE SHELL // AUTHORIZED PERSONNEL ONLY">
      <div className="flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <GlassPanel className="p-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center border border-tactical-danger/50 bg-tactical-danger/10">
                <ShieldAlert className="h-6 w-6 text-tactical-danger" />
              </div>
              <div>
                <p className="font-display text-sm font-bold uppercase tracking-widest text-white">Admin Authentication</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Level-5 clearance required</p>
              </div>
            </div>

            {error && (
              <div className="mb-4 border border-tactical-danger/50 bg-tactical-danger/10 px-4 py-3 font-mono text-xs text-tactical-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="admin-email" className="mb-1.5 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-gray-400">
                  <User className="h-3.5 w-3.5" /> Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={inputClass}
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="mb-1.5 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-gray-400">
                  <Lock className="h-3.5 w-3.5" /> Access Key
                </label>
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputClass}
                  autoComplete="current-password"
                  required
                />
              </div>
              <TacticalButton type="submit" fullWidth disabled={loading} variant="danger">
                {loading ? <Loader2 className="mr-2 inline h-4 w-4 animate-spin" /> : <Lock className="mr-2 inline h-4 w-4" />}
                {loading ? 'Verifying...' : 'Authenticate'}
              </TacticalButton>
            </form>

            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-gray-600">
              First-run setup: create the admin user via the seed script
            </p>
          </GlassPanel>
        </motion.div>
      </div>
    </PageShell>
  )
}