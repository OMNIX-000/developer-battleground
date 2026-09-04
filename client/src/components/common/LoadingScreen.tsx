import { motion } from 'framer-motion'
import { Crosshair } from 'lucide-react'

const bootSequence = [
  'INITIALIZING DEVELOPER BATTLEGROUND',
  'LOADING PLAYER PROFILE...',
  'LOADING MISSIONS...',
  'LOADING INVENTORY...',
  'LOADING ACHIEVEMENTS...',
  'INITIALIZING ENVIRONMENT...',
  'SYSTEM READY',
]

export default function LoadingScreen() {
  const total = bootSequence.length
  const stepDuration = 0.34

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-[100] bg-tactical-bg"
    >
      <div className="tactical-grid absolute inset-0" />
      <div className="scanlines absolute inset-0" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-8 px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <Crosshair className="h-16 w-16 text-tactical-accent" strokeWidth={1.2} />
            <span className="absolute inset-0 -m-4 animate-radar rounded-full border border-tactical-accent/20" />
          </div>
          <h1 className="mt-6 text-center font-display text-xl font-bold uppercase tracking-[0.3em] text-white sm:text-2xl">
            Developer <span className="text-tactical-accent text-glow">Battleground</span>
          </h1>
          <p className="mt-2 font-mono text-xs tracking-widest text-gray-500">SUPRIT PANDA // OP-CODE: FULLSTACK</p>
        </motion.div>

        <div className="w-full max-w-md">
          <div className="mb-2 flex justify-between font-mono text-[10px] tracking-widest text-gray-500">
            <span>BOOT SEQUENCE</span>
            <span>{total}/{total}</span>
          </div>
          <div className="relative h-3 overflow-hidden border border-tactical-accent/40 bg-black/50">
            <motion.div
              className="h-full bg-gradient-to-r from-tactical-accent/40 via-tactical-accent to-tactical-accent/60"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: total * stepDuration, ease: 'linear' }}
            >
              <div className="h-full w-full animate-scan bg-gradient-to-b from-transparent via-white/50 to-transparent" />
            </motion.div>
          </div>
        </div>

        <div className="flex h-28 w-full max-w-md flex-col justify-start overflow-hidden font-mono text-xs tracking-widest">
          {bootSequence.map((line, idx) => (
            <motion.p
              key={line}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: idx + 1 >= total ? 1 : 0, x: 0 }}
              transition={{ delay: idx * stepDuration, duration: 0.15 }}
              className={
                idx + 1 >= total
                  ? 'text-tactical-accent'
                  : 'text-gray-500'
              }
            >
              <span className="mr-2 text-tactical-accent">&gt;</span>
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}