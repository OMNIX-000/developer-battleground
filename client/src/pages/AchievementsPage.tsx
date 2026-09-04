import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import { LoadingState, ErrorState } from '@/components/ui/StateComponents'
import { achievementService } from '@/services/achievementService'
import { achievements as fallbackAchievements, TOTAL_XP } from '@/data/achievements'
import { getSkillIcon } from '@/components/inventory/SkillIcon'
import { useNotifications } from '@/store/notifications'
import { useSettings } from '@/store/settings'
import type { Achievement } from '@/types'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>(fallbackAchievements)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { push } = useNotifications()
  const { soundEnabled } = useSettings()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await achievementService.getAll()
      setAchievements(data.length > 0 ? data : fallbackAchievements)
    } catch {
      setAchievements(fallbackAchievements)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const handleSelect = (a: Achievement) => {
    if (a.unlocked && soundEnabled) {
      push({ title: a.title, subtitle: a.description, xp: a.xpReward, type: 'achievement' })
    }
  }

  const unlocked = achievements.filter((a) => a.unlocked)
  const locked = achievements.filter((a) => !a.unlocked)
  const earnedXp = unlocked.reduce((sum, a) => sum + a.xpReward, 0)

  return (
    <PageShell title="Achievements" subtitle="BATTLE RECORD // HONORS AND COMMENDATIONS">
      {error && <div className="mb-6"><ErrorState message={error} onRetry={load} /></div>}
      {loading ? (
        <LoadingState message="LOADING ACHIEVEMENTS..." />
      ) : (
        <>
          {/* XP Summary */}
          <div className="glass-panel tactical-corners mb-8 flex flex-wrap items-center justify-between gap-4 p-5">
            <div>
              <p className="font-display text-xs uppercase tracking-widest text-gray-400">Total XP Earned</p>
              <p className="mt-1 font-display text-3xl font-black text-tactical-accent text-glow">
                {earnedXp.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
                {unlocked.length} / {achievements.length} UNLOCKED // {TOTAL_XP.toLocaleString()} XP AVAILABLE
              </p>
              <div className="mt-2 h-2 w-56 overflow-hidden border border-white/10 bg-black/40">
                <motion.div
                  className="h-full bg-gradient-to-r from-tactical-accent/40 to-tactical-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(unlocked.length / Math.max(achievements.length, 1)) * 100}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>

          <h2 className="mb-4 font-display text-sm uppercase tracking-[0.25em] text-tactical-accent">
            // UNLOCKED COMMENDATIONS
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((a, idx) => (
              <motion.button
                key={a.title}
                onClick={() => handleSelect(a)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                whileHover={{ scale: 1.03 }}
                className="glass-panel group relative flex items-start gap-3 p-4 text-left transition-all hover:border-amber-400/50 hover:shadow-[0_0_28px_rgba(251,191,36,0.15)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-amber-400/40 bg-amber-400/10">
                  {getSkillIcon(a.icon, 'h-6 w-6 text-amber-400')}
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">{a.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-400">{a.description}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-tactical-accent">
                    +{a.xpReward} XP
                  </p>
                </div>
                <span className="ml-auto shrink-0 rounded-sm border border-emerald-400/40 bg-emerald-400/10 px-1.5 py-0.5 font-mono text-[9px] text-emerald-400">
                  UNLOCKED
                </span>
              </motion.button>
            ))}
          </div>

          <h2 className="mb-4 mt-10 font-display text-sm uppercase tracking-[0.25em] text-gray-500">
            // CLASSIFIED OPERATIONS
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {locked.map((a, idx) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06 }}
                className="relative flex items-start gap-3 border border-white/10 bg-black/30 p-4 opacity-60"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-gray-700 bg-black/40">
                  <Lock className="h-5 w-5 text-gray-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gray-500">{a.title}</h3>
                  <p className="mt-1 text-xs text-gray-600">{a.description}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-gray-600">
                    +{a.xpReward} XP // LOCKED
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}