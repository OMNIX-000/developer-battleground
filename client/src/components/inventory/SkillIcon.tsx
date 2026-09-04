import {
  FileCode,
  GitBranch,
  Globe,
  Brain,
  Cloud,
  Code,
  Database,
  Github,
  Terminal,
  Sparkles,
  Wind,
  Wrench,
  Crosshair,
  Target,
  Zap,
  Cpu,
  Coffee,
  Atom,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const map: Record<string, LucideIcon> = {
  python: Code,
  java: Coffee,
  c: Terminal,
  react: Atom,
  node: Cloud,
  mongodb: Database,
  brain: Brain,
  sparkles: Sparkles,
  'git-branch': GitBranch,
  git: GitBranch,
  github: Github,
  wind: Wind,
  'file-code': FileCode,
  wrench: Wrench,
  crosshair: Crosshair,
  target: Target,
  zap: Zap,
  globe: Globe,
  cpu: Cpu,
}

export function getSkillIcon(name: string, className = 'h-10 w-10'): React.ReactElement {
  const Icon = map[name] ?? Cpu
  return <Icon className={`${className} text-tactical-accent`} strokeWidth={1.6} />
}