import { AnimatePresence, motion } from 'framer-motion'
import { Award, Crosshair, Terminal, Info, X } from 'lucide-react'
import { useNotifications } from '@/store/notifications'
import { useSettings, useSound } from '@/store/settings'
import { useEffect, useRef } from 'react'
import { cn } from '@/utils/helpers'
import type { GameNotification } from '@/store/notifications'

const toastStyle: Record<GameNotification['type'], { icon: React.ReactNode; accent: string; bar: string }> = {
  achievement: { icon: <Award className="h-4 w-4" />, accent: 'text-amber-300 border-amber-300/40', bar: 'bg-amber-300' },
  mission: { icon: <Crosshair className="h-4 w-4" />, accent: 'text-tactical-accent border-tactical-accent/40', bar: 'bg-tactical-accent' },
  system: { icon: <Terminal className="h-4 w-4" />, accent: 'text-tactical-alt border-tactical-alt/40', bar: 'bg-tactical-alt' },
  info: { icon: <Info className="h-4 w-4" />, accent: 'text-sky-400 border-sky-400/40', bar: 'bg-sky-400' },
}

const TTL = 4200

export default function NotificationToasts() {
  const { notifications, dismiss } = useNotifications()
  const { notificationsEnabled } = useSettings()
  const play = useSound()

  const prevCount = useRef(0)
  useEffect(() => {
    const len = notifications.length
    if (len > prevCount.current && notificationsEnabled && len > 0) {
      const last = notifications[len - 1]
      play(last.type === 'achievement' ? 'achievement' : 'notification')
    }
    prevCount.current = len
  }, [notifications, notificationsEnabled, play])

  if (notifications.length === 0) return null

  return (
    <div className="pointer-events-none fixed right-4 top-16 z-50 flex w-80 flex-col gap-2">
      <AnimatePresence>
        {notifications.slice(-3).map((n) => {
          const s = toastStyle[n.type]
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 90, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 90, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={cn(
                'glass-panel pointer-events-auto relative overflow-hidden border-l-2 p-3',
                s.accent.split(' ')[1],
              )}
            >
              {/* auto-dismiss countdown */}
              <motion.span
                className={cn('absolute bottom-0 left-0 h-0.5', s.bar)}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: TTL / 1000, ease: 'linear' }}
              />
              <div className="flex items-start gap-2.5">
                <span className={cn('shrink-0 rounded border bg-black/40 p-1.5', s.accent.split(' ')[0], s.accent.split(' ')[1])}>
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn('font-display text-[10px] uppercase tracking-widest', s.accent.split(' ')[0])}>{n.title}</p>
                  {n.subtitle && <p className="mt-0.5 text-xs text-gray-300">{n.subtitle}</p>}
                  {n.xp !== undefined && (
                    <p className="mt-1 font-mono text-[10px] text-tactical-accent">+{n.xp} XP</p>
                  )}
                </div>
                <button
                  aria-label="Dismiss notification"
                  onClick={() => dismiss(n.id)}
                  className="text-gray-500 transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}