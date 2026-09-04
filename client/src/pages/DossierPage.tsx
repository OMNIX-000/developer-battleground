import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Fingerprint, User } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import ProgressBar from '@/components/ui/ProgressBar'
import TacticalButton from '@/components/ui/TacticalButton'
import { skillStats } from '@/data/loadout'
import { playerStats } from '@/data/player'
import { useSound } from '@/store/settings'
import { useNotifications } from '@/store/notifications'

const dossierTabs = ['PROFILE', 'SPECIALIZATIONS', 'BRIEFING']

export default function DossierPage() {
  const play = useSound()
  const { push } = useNotifications()
  const [activeTab, setActiveTab] = useState(0)
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + 1))
    }, 40)
    return () => clearInterval(timer)
  }, [])

  const handleDownload = () => {
    play('mission')
    push({
      title: 'DOSSIER EXPORT',
      subtitle: 'Preparing resume export...',
      type: 'system',
    })
    // Resume download is wired by updating link href to the actual PDF when available.
    window.location.href = '/resume/Suprît_Panda_Resume.pdf'
  }

  return (
    <PageShell title="Player Dossier" subtitle="CLASSIFIED // SUPRIT PANDA // FULL STACK DIVISION">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Identity card */}
        <GlassPanel className="p-5">
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center border-2 border-tactical-accent/50 bg-tactical-accent/5">
              <Fingerprint className="h-12 w-12 text-tactical-accent" />
              <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-tactical-accent/10 to-transparent" />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold tracking-widest text-white">SUPRIT PANDA</h2>
            <p className="mt-1 font-mono text-xs uppercase tracking-widest text-tactical-accent">
              Call sign: {playerStats.callsign}
            </p>
            <p className="mt-3 font-body text-sm uppercase tracking-widest text-gray-300">B.Tech Student</p>
            <p className="mt-1 font-body text-xs uppercase tracking-widest text-gray-500">
              Full Stack Developer // AI/ML Enthusiast
            </p>

            <div className="mt-5 w-full space-y-2 border-t border-white/10 pt-4 text-left font-mono text-xs text-gray-400">
              <div className="flex justify-between"><span>STATUS</span><span className="text-emerald-400">{playerStats.status}</span></div>
              <div className="flex justify-between"><span>LEVEL</span><span className="text-tactical-accent">{playerStats.level}</span></div>
              <div className="flex justify-between"><span>RANK</span><span className="text-tactical-accent">{playerStats.rank}</span></div>
              <div className="flex justify-between"><span>CLEARANCE</span><span className="text-tactical-accent">LEVEL-5</span></div>
            </div>

            <TacticalButton className="mt-6" fullWidth onClick={handleDownload}>
              <Download className="mr-2 inline h-4 w-4" />
              Download Dossier
            </TacticalButton>
          </div>
        </GlassPanel>

        {/* Main briefing */}
        <div>
          {/* Tabs */}
          <div className="mb-5 flex gap-1 border-b border-white/10 pb-px">
            {dossierTabs.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => {
                  play('click')
                  setActiveTab(idx)
                }}
                className={`relative px-5 py-2.5 font-display text-xs uppercase tracking-widest transition-colors ${
                  activeTab === idx ? 'text-tactical-accent' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
                {activeTab === idx && (
                  <motion.span layoutId="dossier-tab" className="absolute inset-x-0 bottom-0 h-0.5 bg-tactical-accent" />
                )}
              </button>
            ))}
          </div>

          {activeTab === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <GlassPanel className="p-5">
                <div className="mb-3 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-tactical-accent">
                  <User className="h-4 w-4" /> Operator Statement
                </div>
                <p className="leading-relaxed text-gray-300">
                  I am Suprît Panda, a B.Tech student and full-stack developer with a deep passion for
                  building complete products — from pixel to database. My weapon of choice spans Python
                  for data and AI, React and Node.js for the front-to-back pipeline, and MongoDB for
                  persistence. I live in the intersection of web development and machine learning,
                  where data drives decisions and clean code ships features.
                </p>
              </GlassPanel>

              <GlassPanel className="p-5">
                <div className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">
                  Core Competencies
                </div>
                <div className="grid gap-x-6 gap-y-2 font-mono text-xs text-gray-400 sm:grid-cols-2">
                  {['Python', 'Java', 'C', 'React', 'Node.js', 'MongoDB', 'Machine Learning', 'DSA', 'Web Development'].map((c) => (
                    <span key={c} className="flex items-center gap-2">
                      <span className="h-1 w-1 bg-tactical-accent" /> {c}
                    </span>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-4">
              {[
                { name: 'FULL STACK DEVELOPMENT', desc: 'React · Node.js · Express · MongoDB' },
                { name: 'ARTIFICIAL INTELLIGENCE', desc: 'ML models, prediction systems, data pipelines' },
                { name: 'MACHINE LEARNING', desc: 'Training and shipping predictive models' },
              ].map((s) => (
                <GlassPanel key={s.name} className="p-4">
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest text-white">{s.name}</h3>
                  <p className="mt-1 font-mono text-xs text-gray-500">{s.desc}</p>
                </GlassPanel>
              ))}
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-2 font-mono text-xs text-gray-400">
              <GlassPanel className="p-4">
                <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">// OPERATION OBJECTIVE</p>
                <p>
                  Deliver production-quality software that combines intuitive user experience with
                  intelligent data processing — building the bridge between clean UI and smart systems.
                </p>
              </GlassPanel>
              <GlassPanel className="p-4">
                <p className="mb-2 font-display text-xs uppercase tracking-widest text-tactical-accent">// VOICE LOG</p>
                <p>"Code is a weapon. Deploy it responsibly." — Suprît Panda</p>
              </GlassPanel>
            </motion.div>
          )}
        </div>
      </div>

      {/* Skill statistics */}
      <div className="mt-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px w-6 bg-tactical-accent" />
          <h2 className="font-display text-lg font-bold uppercase tracking-[0.2em] text-white">
            Skill <span className="text-tactical-accent">Statistics</span>
          </h2>
        </div>
        <GlassPanel className="relative overflow-hidden p-6">
          {/* scan line overlay */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-tactical-accent/5 to-transparent" />
          </div>
          <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {skillStats.map((stat) => (
              <ProgressBar
                key={stat.name}
                label={stat.name}
                value={stat.percentage}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600">
              <span className="text-tactical-accent">ANALYSIS COMPLETE</span> // {Math.round(pct / 20)} PROFICIENCY BANDS MAPPED
            </p>
          </div>
        </GlassPanel>
      </div>
    </PageShell>
  )
}