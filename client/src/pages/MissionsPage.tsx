import { useCallback, useEffect, useState } from 'react'
import { Crosshair } from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import MissionCard from '@/components/missions/MissionCard'
import { ErrorState, LoadingState, EmptyState } from '@/components/ui/StateComponents'
import { projectService } from '@/services/projectService'
import { projects as fallbackProjects } from '@/data/projects'
import type { Project } from '@/types'

export default function MissionsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await projectService.getAll()
      const sorted = [...data].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      setProjects(sorted.length > 0 ? sorted : fallbackProjects)
    } catch {
      // Fall back to seeded static missions until backend is reachable.
      setProjects(fallbackProjects)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  return (
    <PageShell title="Mission Control" subtitle="OPERATION SELECT // ALL ACTIVE MISSIONS">
      {error && <div className="mb-6"><ErrorState message={error} onRetry={load} /></div>}

      {loading ? (
        <LoadingState message="LOADING MISSIONS..." />
      ) : projects.length === 0 ? (
        <EmptyState title="NO ACTIVE MISSIONS" message="The mission board is empty. New operations will be deployed soon." />
      ) : (
        <div className="space-y-8">
          {featured.length > 0 && (
            <section aria-label="Featured missions">
              <div className="mb-4 flex items-center gap-2 font-display text-xs uppercase tracking-[0.25em] text-tactical-accent">
                <Crosshair className="h-4 w-4" /> Priority Operations
              </div>
              <div className="grid gap-5 lg:grid-cols-2">
                {featured.map((project, idx) => (
                  <MissionCard key={project.slug} project={project} featured index={idx} />
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section aria-label="All missions">
              <div className="mb-4 font-display text-xs uppercase tracking-[0.25em] text-gray-500">
                Full Deployment Roster
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {others.map((project, idx) => (
                  <MissionCard key={project.slug} project={project} index={featured.length + idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </PageShell>
  )
}