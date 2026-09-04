import { motion } from 'framer-motion'
import { Shield, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { playerStats } from '@/data/player'
import ProgressBar from '@/components/ui/ProgressBar'

export default function PlayerPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="glass-panel tactical-corners w-64 p-3"
    >
      <div className="flex items-center gap-3">
        <div className="relative flex h-12 w-12 items-center justify-center border border-tactical-accent/50 bg-tactical-accent/10">
          <Shield className="h-6 w-6 text-tactical-accent" />
          <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
            <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" />
          </span>
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-sm font-bold tracking-widest text-white">{playerStats.name}</p>
          <p className="truncate text-[10px] uppercase tracking-wider text-tactical-accent">{playerStats.role}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-gray-400">
        <span>Level {playerStats.level}</span>
        <span className="text-tactical-accent">{playerStats.rank}</span>
      </div>

      <div className="mt-1">
        <ProgressBar value={playerStats.xp} max={playerStats.xpRequired} className="h-2" showValue={false} />
        <div className="mt-1 flex justify-between text-[9px] uppercase tracking-widest text-gray-500">
          <span>XP {playerStats.xp.toLocaleString()}</span>
          <span>{playerStats.xpRequired.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-3 text-right">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1 font-display text-[10px] uppercase tracking-widest text-tactical-accent hover:text-white transition-colors"
        >
          View Dossier <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  )
}