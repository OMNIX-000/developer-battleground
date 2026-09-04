import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useSettings } from '@/store/settings'

const ParticleField = memo(function ParticleField({ count }: { count: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 2 + Math.random() * 3,
        duration: 4 + Math.random() * 6,
        delay: Math.random() * 6,
      })),
    [count],
  )

  return (
    <>
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-tactical-accent/40 shadow-[0_0_6px_rgba(34,211,238,0.6)]"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{ y: [0, -40], opacity: [0, 0.8, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}
    </>
  )
})

const MountainLayer = memo(function MountainLayer() {
  const mountains = useMemo(() => [10, 14, 8, 12, 18, 9, 15, 11, 7, 13], [])
  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between">
      {mountains.map((height, i) => (
        <div
          key={i}
          className="w-[12%] bg-gradient-to-t from-black/80 to-slate-900/40"
          style={{
            height: `${height * 6}vh`,
            clipPath: 'polygon(0 100%, 50% 0, 100% 100%)',
          }}
        />
      ))}
    </div>
  )
})

const Searchlights = memo(function Searchlights() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 w-24 bg-gradient-to-t from-tactical-accent/15 via-tactical-accent/5 to-transparent"
          style={{ clipPath: 'polygon(45% 0, 55% 0, 100% 100%, 0 100%)' }}
          initial={{ left: '20%', opacity: 0.3, rotate: i === 0 ? -12 : 12 }}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 6 + i * 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
})

function BackgroundLayers() {
  const { quality } = useSettings()
  const particleCount = quality === 'HIGH' ? 40 : quality === 'MEDIUM' ? 24 : 10
  const starCount = quality === 'HIGH' ? 46 : 30

  const stars = useMemo(
    () =>
      Array.from({ length: starCount }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 55,
        opacity: 0.3 + Math.random() * 0.6,
      })),
    [starCount],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden bg-tactical-bg">
      {/* Cyberpunk sky */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-10%,#2b1b4d_0%,#0d0720_45%,#05050c_100%)]" />

      {/* Neon horizon glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(34,211,238,0.12)_0%,transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_85%_100%,rgba(232,121,249,0.1)_0%,transparent_50%)]" />
      <div className="absolute left-0 right-0 bottom-[28%] h-px bg-gradient-to-r from-transparent via-tactical-accent/50 to-transparent" />

      {/* Stars */}
      <div className="absolute inset-0">
        {stars.map((s, i) => (
          <span
            key={i}
            className="absolute h-px w-px bg-white/60"
            style={{ left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          />
        ))}
      </div>

      {/* Distant mountains */}
      <MountainLayer />

      {/* Neon city silhouettes */}
      <div className="absolute bottom-0 left-[5%] h-64 w-40 border-t-2 border-l-2 border-tactical-accent/25 bg-black/40" style={{ clipPath: 'polygon(0 100%,15% 20%,20% 100%)' }} />
      <div className="absolute bottom-0 right-[8%] h-40 w-32 border-t-2 border-tactical-accent/25 bg-black/40" />
      {/* Hologram tower */}
      <div className="absolute bottom-0 right-[12%] h-72 w-8">
        <div className="h-full w-full border-x border-t border-tactical-alt/20 bg-black/50" />
        <div className="absolute -top-6 left-1/2 h-6 w-0.5 -translate-x-1/2 bg-tactical-accent/70" />
        <span className="absolute -top-9 left-1/2 h-2 w-2 -translate-x-1/2 animate-pulse rounded-full bg-tactical-accent shadow-[0_0_8px_rgba(34,211,238,0.9)]" />
      </div>

      <Searchlights />
      <ParticleField count={particleCount} />

      {/* Neon grid floor */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-size-[48px_48px]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(rgba(232,121,249,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(232,121,249,0.035)_1px,transparent_1px)] bg-size-[24px_24px]" />
    </div>
  )
}

export default memo(BackgroundLayers)