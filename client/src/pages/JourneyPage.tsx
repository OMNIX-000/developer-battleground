import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Radar as RadarIcon, Crosshair, Boxes, Castle, ChevronRight } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import { journeyLocations } from '@/data/loadout'
import { useSound } from '@/store/settings'
import { cn } from '@/utils/helpers'
import type { JourneyLocation } from '@/data/loadout'

type SectorStatus = 'ROYAL' | 'ELITE' | 'SCOUTED' | 'LOCKED'

function statusOf(loc: JourneyLocation): SectorStatus {
  if (loc.progress >= 100) return 'ROYAL'
  if (loc.progress >= 60) return 'ELITE'
  if (loc.progress >= 20) return 'SCOUTED'
  return 'LOCKED'
}

const statusColors: Record<SectorStatus, { text: string; dot: string; border: string }> = {
  ROYAL: { text: 'text-amber-300', dot: 'bg-amber-300', border: 'border-amber-300' },
  ELITE: { text: 'text-tactical-accent', dot: 'bg-tactical-accent', border: 'border-tactical-accent' },
  SCOUTED: { text: 'text-tactical-alt', dot: 'bg-tactical-alt', border: 'border-tactical-alt' },
  LOCKED: { text: 'text-gray-500', dot: 'bg-gray-500', border: 'border-gray-500' },
}

export default function JourneyPage() {
  const [selected, setSelected] = useState<JourneyLocation | null>(null)
  const [showRadar, setShowRadar] = useState(true)
  const play = useSound()

  const secured = journeyLocations.filter((l) => statusOf(l) === 'ROYAL').length
  const techCount = journeyLocations.reduce((n, l) => n + l.technologies.length, 0)
  const current = journeyLocations.find((l) => statusOf(l) !== 'ROYAL') ?? journeyLocations[journeyLocations.length - 1]

  const openModal = (loc: JourneyLocation) => {
    play('panel')
    setSelected(loc)
  }

  return (
    <PageShell title="Developer Journey Map" subtitle="TACTICAL EXPANSION MAP // SECTOR PROGRESSION">
      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatBox icon={<Castle className="h-4 w-4" />} label="Sectors Secured" value={`${secured}/${journeyLocations.length}`} accent="text-amber-300" />
        <StatBox icon={<Boxes className="h-4 w-4" />} label="Technologies Recovered" value={String(techCount)} accent="text-tactical-accent" />
        <StatBox icon={<Crosshair className="h-4 w-4" />} label="Active Sector" value={current.name} accent="text-tactical-alt" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* The map */}
        <div className="relative h-[540px] overflow-hidden border border-tactical-accent/25 bg-[radial-gradient(ellipse_at_center,#120b26_0%,#07050f_75%)] shadow-[inset_0_0_80px_rgba(34,211,238,0.08)]">
          {/* neon grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.09)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.09)_1px,transparent_1px)] bg-size-[38px_38px]" />
          {/* magenta over-grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(232,121,249,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(232,121,249,0.05)_1px,transparent_1px)] bg-size-[190px_190px]" />
          {/* fog of war */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_60%,transparent_0%,rgba(3,2,10,0.65)_78%)]" />
          {/* horizon glow */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-tactical-alt/10 to-transparent" />

          {/* corner brackets */}
          <CornerBrackets />

          {/* Radar sweep */}
          {showRadar && (
            <div className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute left-1/2 top-1/2 h-[200%] w-[200%] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.12) 18deg, transparent 40deg)',
                }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}

          {/* Route path — soft base + glowing dash */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <polyline
              points={journeyLocations.map((l) => `${l.x},${l.y}`).join(' ')}
              fill="none"
              stroke="rgba(232,121,249,0.16)"
              strokeWidth="1.1"
            />
            <motion.polyline
              points={journeyLocations.map((l) => `${l.x},${l.y}`).join(' ')}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="0.55"
              strokeDasharray="2 1.6"
              style={{ filter: 'drop-shadow(0 0 3px rgba(34,211,238,0.9))' }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
            />
          </svg>

          {/* Locations */}
          {journeyLocations.map((loc, idx) => (
            <Marker
              key={loc.id}
              loc={loc}
              status={statusOf(loc)}
              isCurrent={loc.id === current.id}
              delay={idx * 0.12}
              onClick={() => openModal(loc)}
            />
          ))}

          {/* Map header */}
          <div className="absolute left-3 top-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
            <MapPin className="h-3.5 w-3.5 text-tactical-accent" />
            SECTOR GRID // LAT 9-N // PRESS MARKER TO INVESTIGATE
          </div>
          <button
            onClick={() => setShowRadar((v) => !v)}
            className="absolute right-3 top-3 flex items-center gap-1.5 border border-tactical-accent/30 bg-black/50 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-tactical-accent transition-colors hover:bg-tactical-accent/10"
          >
            <RadarIcon className="h-3.5 w-3.5" />
            {showRadar ? 'Radar ON' : 'Radar OFF'}
          </button>
        </div>

        {/* Sector list */}
        <GlassPanel className="flex flex-col p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-xs uppercase tracking-widest text-tactical-accent">// SECTOR LOG</p>
            <span className="font-mono text-[10px] text-gray-500">{journeyLocations.length} ENTRIES</span>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {journeyLocations.map((loc) => {
              const sc = statusColors[statusOf(loc)]
              return (
                <button
                  key={loc.id}
                  onClick={() => openModal(loc)}
                  className="group flex items-center gap-3 border border-white/5 bg-white/[0.02] px-3 py-2 text-left transition-colors hover:border-tactical-accent/40 hover:bg-tactical-accent/5"
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${sc.dot} shadow-[0_0_6px_currentColor]`} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-[10px] uppercase tracking-wider text-gray-200">{loc.name}</span>
                    <span className="block font-mono text-[9px] text-gray-500">{loc.year}</span>
                  </span>
                  <span className={`hidden sm:inline font-mono text-[9px] uppercase tracking-widest ${sc.text}`}>{statusOf(loc)}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-600 transition-colors group-hover:text-tactical-accent" />
                </button>
              )
            })}
          </div>
        </GlassPanel>
      </div>

      {/* Debriefing modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.88, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel tactical-corners relative max-h-[86vh] w-full max-w-lg overflow-y-auto border-tactical-accent/30 p-6"
            >
              <button
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 z-10 text-gray-500 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <p className="font-mono text-[10px] uppercase tracking-widest text-tactical-alt">{selected.year} // SECTOR DEBRIEF</p>
              <h3 className="mt-1 font-display text-xl font-bold uppercase tracking-wider text-white">{selected.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">{selected.description}</p>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">Acquired Knowledge</p>
                  <ul className="space-y-1">
                    {selected.learned.map((l) => (
                      <li key={l} className="flex items-center gap-2 font-mono text-xs text-gray-400">
                        <span className="h-1 w-1 bg-tactical-accent" /> {l}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">Technologies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.technologies.map((t) => (
                      <span
                        key={t}
                        className="border border-tactical-accent/25 bg-tactical-accent/5 px-2 py-0.5 font-mono text-[10px] text-tactical-accent"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">Missions</p>
                  <ul className="space-y-1">
                    {selected.projects.map((p) => (
                      <li key={p} className="font-mono text-xs text-gray-300">
                        <span className="mr-1 text-tactical-alt">&gt;</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="mb-2 flex items-center justify-between font-display text-xs uppercase tracking-widest text-tactical-accent">
                    Sector Progress
                    <span className="font-mono text-[10px] text-gray-400">{selected.progress}%</span>
                  </p>
                  <div className="h-2.5 w-full overflow-hidden border border-white/10 bg-black/50">
                    <motion.div
                      className="h-full bg-gradient-to-r from-tactical-accent/40 via-tactical-accent to-tactical-alt"
                      initial={{ width: 0 }}
                      animate={{ width: `${selected.progress}%` }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}

function StatBox({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <GlassPanel className="flex items-center gap-3 p-4">
      <span className={`flex h-9 w-9 items-center justify-center rounded border border-white/10 bg-white/5 ${accent}`}>{icon}</span>
      <span className="min-w-0">
        <span className="block font-display text-lg font-bold leading-none text-white">{value}</span>
        <span className="mt-1 block truncate font-mono text-[9px] uppercase tracking-widest text-gray-500">{label}</span>
      </span>
    </GlassPanel>
  )
}

function CornerBrackets() {
  const base = 'pointer-events-none absolute h-8 w-8 border-tactical-accent/50'
  return (
    <>
      <div className={`${base} left-2 top-2 border-l-2 border-t-2`} />
      <div className={`${base} right-2 top-2 border-r-2 border-t-2`} />
      <div className={`${base} bottom-2 left-2 border-b-2 border-l-2`} />
      <div className={`${base} bottom-2 right-2 border-b-2 border-r-2`} />
    </>
  )
}

function Marker({
  loc,
  status,
  isCurrent,
  delay,
  onClick,
}: {
  loc: JourneyLocation
  status: SectorStatus
  isCurrent: boolean
  delay: number
  onClick: () => void
}) {
  const sc = statusColors[status]
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      aria-label={loc.name}
      className="group absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
    >
      {/* pulse ring */}
      <motion.span
        animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.15, 0.7] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        className={`pointer-events-none absolute inset-0 rounded-full border ${sc.border}`}
        style={{ left: -13, top: -13, width: 26, height: 26 }}
      />
      {/* hex marker */}
      <span
        className={cn(
          'relative flex h-6 w-6 items-center justify-center border bg-black/70 text-white transition-transform group-hover:scale-110',
          sc.border,
        )}
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
      </span>
      {/* label */}
      <span className={`absolute left-7 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[9px] uppercase tracking-wider ${sc.text}`}>
        {loc.name}
        {isCurrent && <span className="ml-1 hidden text-tactical-alt sm:inline">// ACTIVE</span>}
      </span>
    </motion.button>
  )
}