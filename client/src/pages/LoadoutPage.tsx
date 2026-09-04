import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import { loadoutSlots, loadoutCategories } from '@/data/loadout'
import { getSkillIcon } from '@/components/inventory/SkillIcon'
import { useSound } from '@/store/settings'
import type { LoadoutSlot } from '@/data/loadout'

export default function LoadoutPage() {
  const [selected, setSelected] = useState<LoadoutSlot['skill'] | null>(null)
  const play = useSound()

  return (
    <PageShell title="Developer Loadout" subtitle="EQUIPMENT SELECTION // PRE-MISSION PREPARATION">
      <p className="mb-6 max-w-2xl font-mono text-xs leading-relaxed text-gray-500">
        Prepare your skills before entering a mission. Every capability is loaded into its designated
        equipment slot. Select a slot to inspect the equipment in detail.
      </p>

      {/* Equipment slots */}
      <div className="grid gap-4 sm:grid-cols-2">
        {loadoutSlots.map((slot, idx) => (
          <motion.button
            key={slot.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08 }}
            onClick={() => {
              play('panel')
              setSelected(slot.skill)
            }}
            whileHover={{ scale: 1.02 }}
            className="glass-panel tactical-corners group relative flex items-center gap-4 p-5 text-left transition-all hover:border-tactical-accent/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.12)]"
          >
            <div className="flex h-16 w-16 shrink-0 items-center justify-center border border-tactical-accent/40 bg-tactical-accent/5 transition-colors group-hover:bg-tactical-accent/15">
              {getSkillIcon(slot.icon, 'h-8 w-8')}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-tactical-accent">
                {slot.slotName}
              </p>
              <h3 className="mt-1 truncate font-display text-lg font-bold uppercase tracking-wider text-white">
                {slot.skill.name}
              </h3>
              <p className="mt-1 truncate text-xs text-gray-500">
                LEVEL {slot.skill.level} // {slot.skill.xp.toLocaleString()} XP
              </p>
            </div>
            <motion.span
              className="font-mono text-xs uppercase tracking-widest text-tactical-accent opacity-0 transition-opacity group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
            >
              MU
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* Category loadout matrix */}
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-tactical-accent" />
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
            Combat <span className="text-tactical-accent">Toolkit</span>
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {loadoutCategories.map((cat) => (
            <GlassPanel key={cat.id} className="p-5">
              <div className="mb-3 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-tactical-accent">
                {getSkillIcon(cat.icon, 'h-4 w-4')}
                {cat.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span key={item} className="border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-gray-300">
                    {item}
                  </span>
                ))}
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel tactical-corners relative w-full max-w-md p-6"
            >
              <button
                aria-label="Close"
                onClick={() => setSelected(null)}
                className="absolute right-3 top-3 text-gray-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">{selected.name}</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between border-b border-white/10 pb-2 font-mono text-xs">
                  <span className="text-gray-500">SKILL LEVEL</span>
                  <span className="text-tactical-accent">{selected.level} / 10</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2 font-mono text-xs">
                  <span className="text-gray-500">EXPERIENCE</span>
                  <span className="text-tactical-accent">{selected.xp.toLocaleString()} XP</span>
                </div>
                <p className="leading-relaxed text-gray-300">{selected.description}</p>
                <div className="flex flex-wrap gap-2">
                  {selected.relatedProjects.map((p) => (
                    <span key={p} className="border border-tactical-accent/30 bg-tactical-accent/5 px-2 py-1 font-mono text-[10px] text-tactical-accent">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}