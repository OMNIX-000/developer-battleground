import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crosshair } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import { LoadingState, ErrorState } from '@/components/ui/StateComponents'
import { skillService } from '@/services/skillService'
import { skills as fallbackSkills, rarityOrder } from '@/data/skills'
import { useSound } from '@/store/settings'
import { cn } from '@/utils/helpers'
import type { Skill, SkillRarity } from '@/types'
import { getSkillIcon } from '@/components/inventory/SkillIcon'

const rarityStyles: Record<SkillRarity, { text: string; border: string; glow: string; bg: string }> = {
  COMMON: { text: 'text-gray-400', border: 'border-gray-500/50', glow: '', bg: 'from-gray-500/10' },
  RARE: { text: 'text-sky-400', border: 'border-sky-400/50', glow: 'hover:shadow-[0_0_24px_rgba(56,189,248,0.25)]', bg: 'from-sky-500/15' },
  EPIC: { text: 'text-purple-400', border: 'border-purple-400/50', glow: 'hover:shadow-[0_0_24px_rgba(168,85,247,0.3)]', bg: 'from-purple-500/15' },
  LEGENDARY: { text: 'text-amber-400', border: 'border-amber-400/60', glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.4)]', bg: 'from-amber-500/15' },
}

const rarityTooltip: Record<SkillRarity, string> = {
  COMMON: 'BASIC LOADOUT MODULE',
  RARE: 'OPERATIONAL ASSET',
  EPIC: 'ELITE COMBAT EQUIPMENT',
  LEGENDARY: 'STRATEGIC FORCE MULTIPLIER',
}

export default function InventoryPage() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Skill | null>(null)
  const play = useSound()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await skillService.getAll()
      setSkills(data.length > 0 ? data : fallbackSkills)
    } catch {
      setSkills(fallbackSkills)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const sorted = [...skills].sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])

  const counts = useMemo(() => {
    const c: Record<SkillRarity, number> = { COMMON: 0, RARE: 0, EPIC: 0, LEGENDARY: 0 }
    for (const s of skills) c[s.rarity] += 1
    return c
  }, [skills])

  const openSkill = (skill: Skill) => {
    play('panel')
    setSelected(skill)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <PageShell title="Inventory" subtitle="OPERATOR EQUIPMENT // MANAGED BY PLAYER">
      {error && <div className="mb-6"><ErrorState message={error} onRetry={load} /></div>}
      {loading ? (
        <LoadingState message="LOADING INVENTORY..." />
      ) : (
        <>
          {/* Sticky top block: stats readout + info panel */}
          <div className="sticky top-[4.5rem] z-20 mb-6 flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {(Object.keys(rarityStyles) as SkillRarity[]).map((r) => (
                <div key={r} className={cn('flex items-center justify-between gap-2 border bg-black/40 px-3 py-2 backdrop-blur-sm', rarityStyles[r].border)}>
                  <span className={cn('font-mono text-[10px] uppercase tracking-widest', rarityStyles[r].text)}>{r}</span>
                  <span className="font-display text-sm font-bold text-white">{counts[r]}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-2 border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-sm">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">TOTAL</span>
                <span className="font-display text-sm font-bold text-tactical-accent">{skills.length}</span>
              </div>
            </div>
            <div className="min-h-[108px]">
              <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.name}
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className={cn(
                    'glass-panel tactical-corners relative flex flex-col gap-4 overflow-hidden p-4 sm:flex-row sm:items-center',
                    rarityStyles[selected.rarity].border,
                  )}
                >
                  <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent opacity-40', rarityStyles[selected.rarity].bg)} />
                  <button
                    aria-label="Close info"
                    onClick={() => setSelected(null)}
                    className="absolute right-3 top-3 z-10 text-gray-500 transition-colors hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className={cn('shrink-0 rounded border bg-black/40 p-2.5', rarityStyles[selected.rarity].border)}>
                    {getSkillIcon(selected.icon, 'h-11 w-11')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                      <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">{selected.name}</h3>
                      <span className={cn('font-mono text-[10px] uppercase tracking-[0.25em]', rarityStyles[selected.rarity].text)}>
                        {selected.rarity} // {rarityTooltip[selected.rarity]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-gray-300">{selected.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">
                        PROFICIENCY {selected.level} / 10
                      </span>
                      <div className="h-2 w-full max-w-[220px] overflow-hidden border border-white/10 bg-black/40">
                        <motion.div
                          className={cn('h-full bg-gradient-to-r to-transparent', rarityStyles[selected.rarity].text === 'text-gray-400' ? 'from-gray-400' : 'from-tactical-accent')}
                          initial={{ width: 0 }}
                          animate={{ width: `${(selected.level / 10) * 100}%` }}
                          transition={{ duration: 0.7, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn('glass-panel flex items-center gap-3 border-dashed p-4', 'border-white/15')}
                >
                  <Crosshair className="h-5 w-5 shrink-0 text-tactical-accent" />
                  <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
                    SELECT AN ITEM TO DISPLAY ITS OPERATIONAL DATA — STICKY BRIEFING.
                  </p>
                </motion.div>
              )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sorted.map((skill, idx) => {
              const style = rarityStyles[skill.rarity]
              const isSelected = selected?.name === skill.name
              return (
                <motion.button
                  key={skill.name}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => openSkill(skill)}
                  whileHover={{ y: -4 }}
                  className={cn(
                    'glass-panel tactical-corners group relative flex flex-col items-center gap-2 p-4 text-center transition-all',
                    style.border,
                    style.glow,
                    isSelected && 'border-tactical-accent bg-tactical-accent/5',
                  )}
                  aria-label={`Open ${skill.name} details`}
                >
                  <span className="absolute transition-opacity"><Crosshair className="h-3 w-3 text-tactical-accent" /></span>
                  <div className="relative">
                    {getSkillIcon(skill.icon)}
                    <span className="absolute -bottom-1 -right-1 rounded-sm bg-black/80 px-1 font-mono text-[9px] text-tactical-accent">
                      LVL {skill.level}
                    </span>
                  </div>
                  <span className="font-display text-xs font-bold uppercase tracking-wider text-white">
                    {skill.name}
                  </span>
                  <span className={cn('font-mono text-[9px] uppercase tracking-[0.25em]', style.text)}>
                    {skill.rarity}
                  </span>
                  <span className="hidden font-mono text-[9px] text-gray-600 group-hover:block">
                    CLICK TO INSPECT
                  </span>
                </motion.button>
              )
            })}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(Object.keys(rarityStyles) as SkillRarity[]).map((r) => (
          <div key={r} className={cn('flex items-center gap-2 border bg-white/5 px-3 py-2', rarityStyles[r].border)}>
            <span className={cn('font-mono text-[10px] uppercase tracking-widest', rarityStyles[r].text)}>{r}</span>
            <span className="ml-auto font-mono text-[9px] text-gray-600">{rarityTooltip[r]}</span>
          </div>
        ))}
      </div>
    </PageShell>
  )
}