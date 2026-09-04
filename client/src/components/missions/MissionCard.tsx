import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight, Github, Globe, Target, Flag, Boxes, KeyRound } from 'lucide-react'
import type { Project } from '@/types'
import StatusPill from '@/components/ui/StatusPill'
import { useSound } from '@/store/settings'
import { cn } from '@/utils/helpers'

const difficultyStyle: Record<Project['difficulty'], string> = {
  easy: 'text-emerald-400 border-emerald-400/40',
  medium: 'text-amber-400 border-amber-400/40',
  hard: 'text-tactical-danger border-tactical-danger/40',
}

interface MissionCardProps {
  project: Project
  featured?: boolean
  index: number
}

export default function MissionCard({ project, featured = false, index }: MissionCardProps) {
  const play = useSound()
  const statusLabel = project.status.toUpperCase().replace('-', ' ')

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className={cn(
        'glass-panel tactical-corners group relative flex flex-col p-5 transition-all hover:border-tactical-accent/50 hover:shadow-[0_0_30px_rgba(45,212,191,0.12)]',
        featured && 'lg:col-span-2 border-tactical-accent/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-tactical-accent">
            MISSION {String(project.missionNumber ?? index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-1 font-display text-lg font-bold uppercase tracking-wider text-white group-hover:text-tactical-accent transition-colors">
            {project.title}
          </h3>
        </div>
        <StatusPill status={statusLabel as 'COMPLETED'} />
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-400">
        {project.shortDescription}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.technologies.slice(0, featured ? 6 : 4).map((tech) => (
          <span
            key={tech}
            className="border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-gray-400"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > (featured ? 6 : 4) && (
          <span className="px-2 py-0.5 font-mono text-[10px] text-tactical-accent">
            +{project.technologies.length - (featured ? 6 : 4)}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className={cn('border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider', difficultyStyle[project.difficulty])}>
          Difficulty: {project.difficulty}
        </span>
        <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-gray-600">
          // SEVERITY {project.featured ? 'HIGH' : 'STANDARD'}
        </span>
      </div>

      <div className="mt-4 border-t border-white/10 pt-4">
        <Link
          to={`/missions/${project.slug}`}
          onClick={() => play('panel')}
          className="inline-flex items-center gap-2 font-display text-xs uppercase tracking-widest text-tactical-accent transition-colors hover:text-white"
        >
          <Flag className="h-4 w-4" /> Mission Briefing <ChevronRight className="h-3 w-3" />
        </Link>
        {featured && (
          <div className="mt-3 flex flex-wrap gap-2">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 font-display text-[10px] uppercase tracking-widest text-gray-300 hover:text-tactical-accent hover:border-tactical-accent/50 transition-colors">
                <Github className="h-3.5 w-3.5" /> Source Code
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer"
                 className="inline-flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-1.5 font-display text-[10px] uppercase tracking-widest text-gray-300 hover:text-tactical-accent hover:border-tactical-accent/50 transition-colors">
                <Globe className="h-3.5 w-3.5" /> Live Deployment
              </a>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

export function BriefingSection({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel p-5"
    >
      <div className="mb-3 flex items-center gap-2 font-display text-xs uppercase tracking-widest text-tactical-accent">
        <Icon className="h-4 w-4" /> {title}
      </div>
      {children}
    </motion.section>
  )
}

export function TechStackSection({ technologies }: { technologies: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span key={tech} className="border border-tactical-accent/30 bg-tactical-accent/5 px-3 py-1 font-mono text-xs text-tactical-accent">
          {tech}
        </span>
      ))}
    </div>
  )
}

export function ArchitectureList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 font-mono text-sm text-gray-300">
          <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 bg-tactical-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function KeyFeaturesList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
          <KeyRound className="h-3.5 w-3.5 shrink-0 text-tactical-accent" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export function EmptyInfo({ message = 'No data recorded for this sector.' }: { message?: string }) {
  return (
    <div className="flex items-center gap-2 border border-white/10 bg-black/30 p-4 font-mono text-xs text-gray-500">
      <Boxes className="h-4 w-4 text-gray-600" />
      {message}
    </div>
  )
}