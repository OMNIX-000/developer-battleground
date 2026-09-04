import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Star, ShieldCheck } from 'lucide-react'
import PlayerPanel from '@/components/hud/PlayerPanel'
import { playerStats } from '@/data/player'
import { getFeaturedProject } from '@/data/projects'

export default function HomePage() {
  const featured = getFeaturedProject()
  const xpPercent = (playerStats.xp / playerStats.xpRequired) * 100

  return (
    <div className="relative flex min-h-[calc(100vh-12rem)] flex-col items-center justify-center px-4">
      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-2 font-mono text-xs tracking-[0.4em] text-tactical-accent">
          <span className="h-px w-6 bg-tactical-accent" />
          WELCOME TO SECTOR 9-NORTH
          <span className="h-px w-6 bg-tactical-accent" />
        </div>

        <h1 className="mt-4 font-display text-4xl font-black uppercase leading-tight tracking-wider text-white sm:text-6xl">
          Suprît
          <span className="text-tactical-accent text-glow"> Panda</span>
        </h1>

        <p className="mt-3 max-w-xl font-body text-sm uppercase tracking-[0.3em] text-gray-400 sm:text-base">
          Full Stack Developer // AI-ML Enthusiast
        </p>

        <p className="mt-4 max-w-lg font-mono text-xs leading-relaxed text-gray-500">
          This is not a portfolio. This is a <span className="text-tactical-accent">battleground</span>.
          Every project is a mission. Every skill is equipment. You're standing in the lobby —
          choose your destination.
        </p>

        <motion.div
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            { to: '/missions', label: 'BROWSE MISSIONS', primary: true },
            { to: '/inventory', label: 'CHECK LOADOUT', primary: false },
          ].map((btn) => (
            <motion.div key={btn.to} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}>
              <Link
                to={btn.to}
                className={
                  btn.primary
                    ? 'clip-corner inline-flex items-center gap-2 border border-tactical-accent/60 bg-tactical-accent/10 px-8 py-3 font-display text-sm uppercase tracking-widest text-tactical-accent transition-all hover:bg-tactical-accent/25 hover:shadow-[0_0_30px_rgba(45,212,191,0.25)]'
                    : 'clip-corner inline-flex items-center gap-2 border border-white/20 bg-white/5 px-8 py-3 font-display text-sm uppercase tracking-widest text-gray-200 transition-all hover:bg-white/10'
                }
              >
                {btn.label} <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Featured mission card */}
      {featured && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="glass-panel tactical-corners mt-10 w-full max-w-2xl p-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display text-xs uppercase tracking-widest text-tactical-accent">
              <Star className="h-4 w-4 fill-tactical-accent" />
              Featured Mission
            </div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
              MISSION {String(featured.missionNumber ?? 1).padStart(2, '0')} // COMPLETED
            </span>
          </div>

          <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wider text-white">
            {featured.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-400">{featured.shortDescription}</p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {featured.technologies.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-gray-400"
              >
                {tech}
              </span>
            ))}
          </div>

          <Link
            to={`/missions/${featured.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 font-display text-xs uppercase tracking-widest text-tactical-accent transition-colors hover:text-white"
          >
            <ShieldCheck className="h-4 w-4" />
            MISSION BRIEFING <ChevronRight className="h-3 w-3" />
          </Link>
        </motion.div>
      )}

      {/* XP overlay display for lobby */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="glass-panel mt-8 w-full max-w-2xl p-4"
      >
        <div className="flex items-center justify-between font-display text-xs uppercase tracking-widest">
          <span className="text-gray-400">Rank Progress</span>
          <span className="text-tactical-accent">
            {playerStats.rank} // LVL {playerStats.level}
          </span>
        </div>
        <div className="relative mt-2 h-2.5 overflow-hidden border border-white/10 bg-black/40">
          <motion.div
            className="h-full bg-gradient-to-r from-tactical-accent/40 via-tactical-accent to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${xpPercent}%` }}
            transition={{ delay: 1.4, duration: 1.5 }}
          />
          <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-widest text-gray-500">
          <span>XP {playerStats.xp.toLocaleString()} / {playerStats.xpRequired.toLocaleString()}</span>
          <span>{Math.round(xpPercent)}% TO NEXT RANK</span>
        </div>
      </motion.div>

      {/* Left player panel positioned */}
      <div className="absolute left-4 top-1/2 hidden -translate-y-1/2 lg:block">
        <PlayerPanel />
      </div>
    </div>
  )
}