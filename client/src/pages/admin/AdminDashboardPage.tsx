import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FolderKanban, Cpu, Trophy, Mail, Plus, Pencil, Trash2, LogOut, CheckCircle2, ChevronUp,
} from 'lucide-react'
import PageShell from '@/components/common/PageShell'
import GlassPanel from '@/components/ui/GlassPanel'
import TacticalButton from '@/components/ui/TacticalButton'
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/StateComponents'
import { projectService } from '@/services/projectService'
import { skillService } from '@/services/skillService'
import { achievementService } from '@/services/achievementService'
import { authService, adminService } from '@/services/authService'
import { useNotifications } from '@/store/notifications'
import type { Project, Skill, Achievement, ContactMessage } from '@/types'

type Tab = 'projects' | 'skills' | 'achievements' | 'messages'

export default function AdminDashboardPage() {
  const navigate = useNavigate()
  const { push } = useNotifications()

  const [tab, setTab] = useState<Tab>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const user = useMemo(() => authService.getCurrentUser(), [])

  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [p, s, a, m] = await Promise.all([
        projectService.getAll(),
        skillService.getAll(),
        achievementService.getAll(),
        adminService.getMessages(),
      ])
      setProjects(p)
      setSkills(s)
      setAchievements(a)
      setMessages(m)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'FAILED TO LOAD COMMAND DATA')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    void loadAll()
  }, [user, navigate, loadAll])

  const stats = useMemo(
    () => ({
      projects: projects.length,
      skills: skills.length,
      achievements: achievements.length,
      newMessages: messages.filter((m) => m.status === 'new').length,
    }),
    [projects, skills, achievements, messages],
  )

  const handleLogout = () => {
    authService.clearAuth()
    navigate('/')
  }

  const deleteProject = async (id: string) => {
    await projectService.remove(id)
    setProjects((prev) => prev.filter((p) => p._id !== id))
    push({ title: 'PROJECT DELETED', type: 'system' })
  }

  const handleMessageStatus = async (m: ContactMessage) => {
    const next = m.status === 'new' ? 'read' : m.status === 'read' ? 'archived' : 'read'
    const updated = await adminService.updateMessage(m._id!, next)
    setMessages((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))
  }

  const deleteMessage = async (id: string) => {
    await adminService.deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m._id !== id))
  }

  if (loading) return <div className="pt-20"><LoadingState message="BOOTING COMMAND CENTER..." /></div>

  return (
    <PageShell title="Command Center" subtitle="ADMIN OPERATIONS // AUTHORIZED PERSONNEL ONLY">
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-widest text-gray-500">
          Operator: <span className="text-tactical-accent">{user?.name ?? 'ADMIN'}</span>
        </p>
        <TacticalButton variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="mr-2 inline h-4 w-4" /> Sign Out
        </TacticalButton>
      </div>

      {error && <div className="mb-6"><ErrorState message={error} onRetry={loadAll} /></div>}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'TOTAL PROJECTS', value: stats.projects, icon: FolderKanban, color: 'text-tactical-accent' },
          { label: 'TOTAL SKILLS', value: stats.skills, icon: Cpu, color: 'text-sky-400' },
          { label: 'ACHIEVEMENTS', value: stats.achievements, icon: Trophy, color: 'text-amber-400' },
          { label: 'NEW MESSAGES', value: stats.newMessages, icon: Mail, color: 'text-tactical-danger' },
        ].map((s) => (
          <GlassPanel key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <span className={`font-display text-2xl font-black ${s.color}`}>{s.value}</span>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-gray-500">{s.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1 border-b border-white/10 pb-px">
        {(['projects', 'skills', 'achievements', 'messages'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 font-display text-xs uppercase tracking-widest transition-colors ${
              tab === t ? 'text-tactical-accent' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {t}
            {t === 'messages' && stats.newMessages > 0 && (
              <span className="ml-2 rounded-full bg-tactical-danger px-1.5 text-[9px] text-white">{stats.newMessages}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="space-y-3">
        {tab === 'projects' && (
          <ProjectsTable
            projects={projects}
            onDelete={deleteProject}
            onEdited={() => push({ title: 'MISSION UPDATED', type: 'system' })}
          />
        )}
        {tab === 'skills' && (
          <SkillsTable
            skills={skills}
            onDelete={async (id) => {
              await skillService.remove(id)
              setSkills((prev) => prev.filter((s) => s._id !== id))
            }}
          />
        )}
        {tab === 'achievements' && (
          <AchievementsTable
            achievements={achievements}
            onToggle={async (a) => {
              const updated = await achievementService.update(a._id!, { unlocked: !a.unlocked })
              setAchievements((prev) => prev.map((x) => (x._id === updated._id ? updated : x)))
            }}
            onDelete={async (id) => {
              await achievementService.remove(id)
              setAchievements((prev) => prev.filter((a) => a._id !== id))
            }}
          />
        )}
        {tab === 'messages' && (
          <MessagesTable
            messages={messages}
            onStatus={handleMessageStatus}
            onDelete={deleteMessage}
          />
        )}
      </div>

      {/* Panel open indicator */}
      <div className="mt-8 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-600">
        <ChevronUp className="h-3 w-3 animate-bounce" />
        Full CRUD forms require backend connection. Use the API endpoints documented in README.
      </div>
    </PageShell>
  )
}

function TableShell({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <GlassPanel className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="font-display text-xs uppercase tracking-widest text-tactical-accent">{title}</span>
        {action}
      </div>
      {children}
    </GlassPanel>
  )
}

function ProjectsTable({ projects, onDelete }: { projects: Project[]; onDelete: (id: string) => Promise<void>; onEdited: () => void }) {
  if (projects.length === 0) return <EmptyState title="NO MISSIONS DEPLOYED" message="Create projects through the API." />
  return (
    <TableShell
      title="Deployed Missions"
      action={<PlusMarker text="ADD PROJECT" />}
    >
      <div className="divide-y divide-white/5">
        {projects.map((p) => (
          <div key={p.slug} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold uppercase tracking-wider text-white">{p.title}</p>
              <p className="truncate font-mono text-[10px] text-gray-500">{p.slug} // {p.status}</p>
            </div>
            <span className="hidden font-mono text-[10px] text-gray-600 sm:inline">{p.technologies.join(' · ')}</span>
            <button aria-label={`Delete ${p.title}`} onClick={() => void onDelete(p._id!)} className="p-2 text-gray-600 hover:text-tactical-danger transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </TableShell>
  )
}

function SkillsTable({ skills, onDelete }: { skills: Skill[]; onDelete: (id: string) => Promise<void> }) {
  if (skills.length === 0) return <EmptyState title="NO SKILLS REGISTERED" />
  return (
    <TableShell title="Registered Equipment" action={<PlusMarker text="ADD SKILL" />}>
      <div className="divide-y divide-white/5">
        {skills.map((s) => (
          <div key={s.name} className="flex items-center gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold uppercase tracking-wider text-white">{s.name}</p>
              <p className="font-mono text-[10px] text-gray-500">{s.category} // {s.rarity} // LVL {s.level}</p>
            </div>
            <button aria-label={`Delete ${s.name}`} onClick={() => void onDelete(s._id!)} className="p-2 text-gray-600 hover:text-tactical-danger transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </TableShell>
  )
}

function AchievementsTable({
  achievements,
  onToggle,
  onDelete,
}: {
  achievements: Achievement[]
  onToggle: (a: Achievement) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  if (achievements.length === 0) return <EmptyState title="NO ACHIEVEMENTS" />
  return (
    <TableShell title="Commendations Registry" action={<PlusMarker text="ADD ACHIEVEMENT" />}>
      <div className="divide-y divide-white/5">
        {achievements.map((a) => (
          <div key={a.title} className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => void onToggle(a)}
              className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                a.unlocked ? 'text-emerald-400' : 'text-gray-600 hover:text-gray-400'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              {a.unlocked ? 'UNLOCKED' : 'LOCKED'}
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold uppercase tracking-wider text-white">{a.title}</p>
              <p className="truncate font-mono text-[10px] text-gray-500">+{a.xpReward} XP</p>
            </div>
            <button aria-label={`Delete ${a.title}`} onClick={() => void onDelete(a._id!)} className="p-2 text-gray-600 hover:text-tactical-danger transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </TableShell>
  )
}

function MessagesTable({
  messages,
  onStatus,
  onDelete,
}: {
  messages: ContactMessage[]
  onStatus: (m: ContactMessage) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  if (messages.length === 0) return <EmptyState title="NO INCOMING TRANSMISSIONS" />
  return (
    <TableShell title="Incoming Transmissions">
      <div className="divide-y divide-white/5">
        {messages.map((m) => (
          <div key={m._id} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-bold uppercase tracking-wider text-white">{m.name}</p>
                <p className="font-mono text-[10px] text-gray-500">{m.email}</p>
              </div>
              <button
                onClick={() => void onStatus(m)}
                className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest border transition-colors ${
                  m.status === 'new'
                    ? 'border-tactical-danger/50 text-tactical-danger'
                    : m.status === 'read'
                    ? 'border-gray-500/50 text-gray-500'
                    : 'border-gray-600/50 text-gray-600'
                }`}
              >
                {m.status}
              </button>
              <button aria-label="Delete message" onClick={() => void onDelete(m._id!)} className="p-2 text-gray-600 hover:text-tactical-danger transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{m.message}</p>
          </div>
        ))}
      </div>
    </TableShell>
  )
}

function PlusMarker({ text }: { text: string }) {
  return (
    <span className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-gray-400">
      <Plus className="h-3 w-3" /> {text}
      <Pencil className="ml-1 h-3 w-3 opacity-60" />
    </span>
  )
}