import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Globe, Target, AlertTriangle, Lightbulb, Boxes, KeyRound, LayoutGrid } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import StatusPill from '@/components/ui/StatusPill'
import { LoadingState, ErrorState } from '@/components/ui/StateComponents'
import { BriefingSection, TechStackSection, ArchitectureList, KeyFeaturesList, EmptyInfo } from '@/components/missions/MissionCard'
import { projectService } from '@/services/projectService'
import { getFeaturedProject } from '@/data/projects'
import type { Project } from '@/types'

export default function MissionBriefingPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getBySlug(slug)
      setProject(data)
    } catch {
      const fallback = getFeaturedProject()
      if (fallback?.slug === slug) {
        setProject(fallback)
      } else {
        setError('MISSION BRIEFING COULD NOT BE RETRIEVED')
      }
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  if (loading) {
    return <div className="pt-24"><LoadingState message="DECRYPTING MISSION BRIEFING..." /></div>
  }

  if (error || !project) {
    return (
      <PageShell title="Mission Briefing" subtitle="BRIEFING ACCESS DENIED">
        <ErrorState title="BRIEFING LOST" message={error ?? 'Unknown error'} onRetry={load} />
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Mission Briefing"
      subtitle={`OPERATION: ${project.title.toUpperCase()}`}
    >
      <Link
        to="/missions"
        className="mb-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 hover:text-tactical-accent transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Return to Mission Control
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 lg:grid-cols-3"
      >
        {/* Main briefing column */}
        <div className="space-y-5 lg:col-span-2">
          <GlassPanel className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-tactical-accent">
                  MISSION {String(project.missionNumber ?? 1).padStart(2, '0')} // {project.slug}
                </p>
                <h2 className="mt-2 font-display text-2xl font-bold uppercase tracking-wider text-white">
                  {project.title}
                </h2>
              </div>
              <StatusPill status={project.status.toUpperCase() as 'COMPLETED'} />
            </div>
            <p className="mt-4 font-mono text-sm leading-relaxed text-gray-400">{project.longDescription}</p>
          </GlassPanel>

          <BriefingSection icon={Target} title="Mission Objective">
            <p className="text-gray-300">{project.objective}</p>
          </BriefingSection>

          <BriefingSection icon={AlertTriangle} title="The Problem">
            <p className="text-gray-300">{project.problem}</p>
          </BriefingSection>

          <BriefingSection icon={Lightbulb} title="The Solution">
            <p className="text-gray-300">{project.solution}</p>
          </BriefingSection>

          <BriefingSection icon={LayoutGrid} title="System Architecture">
            {project.architecture.length > 0
              ? <ArchitectureList items={project.architecture} />
              : <EmptyInfo message="Architecture schematics not deployed in this sector." />}
          </BriefingSection>

          <BriefingSection icon={KeyRound} title="Key Features">
            {project.keyFeatures.length > 0
              ? <KeyFeaturesList items={project.keyFeatures} />
              : <EmptyInfo message="No feature data detected." />}
          </BriefingSection>
        </div>

        {/* Side column */}
        <div className="space-y-5">
          <GlassPanel className="p-5">
            <p className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">Technology Stack</p>
            <TechStackSection technologies={project.technologies} />
          </GlassPanel>

          <GlassPanel className="p-5">
            <p className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">Mission Deploy</p>
            <div className="flex flex-col gap-2">
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noreferrer"
                   className="flex items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 font-display text-xs uppercase tracking-widest text-gray-200 hover:border-tactical-accent/50 hover:text-tactical-accent transition-colors">
                  <Github className="h-4 w-4" /> Source Code
                </a>
              )}
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer"
                   className="flex items-center justify-center gap-2 border border-tactical-accent/40 bg-tactical-accent/10 px-4 py-3 font-display text-xs uppercase tracking-widest text-tactical-accent hover:bg-tactical-accent/20 transition-colors">
                  <Globe className="h-4 w-4" /> Live Deployment
                </a>
              )}
            </div>
          </GlassPanel>

          <GlassPanel className="p-5">
            <p className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">Mission Metadata</p>
            <dl className="space-y-2 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd className="text-emerald-400">{project.status}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Difficulty</dt><dd className="text-tactical-accent">{project.difficulty}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Featured</dt><dd className="text-tactical-accent">{project.featured ? 'YES' : 'NO'}</dd></div>
            </dl>
          </GlassPanel>

          {project.images.length > 0 && (
            <GlassPanel className="p-5">
              <p className="mb-3 font-display text-xs uppercase tracking-widest text-tactical-accent">Project Screenshots</p>
              <div className="grid gap-2">
                {project.images.map((img, i) => (
                  <a key={i} href={img} target="_blank" rel="noreferrer" className="border border-white/10 bg-black/40 p-2 text-center">
                    <Boxes className="mx-auto h-8 w-8 text-gray-500" />
                    <span className="mt-1 block font-mono text-[10px] text-gray-500">SCREENSHOT_{i + 1}</span>
                  </a>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>
      </motion.div>
    </PageShell>
  )
}