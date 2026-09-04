import { cn } from '@/utils/helpers'

interface StatusPillProps {
  status: 'ONLINE' | 'OFFLINE' | 'IN MISSION' | 'COMPLETED' | 'IN PROGRESS' | 'PLANNED' | 'NEW' | 'READ' | 'ARCHIVED'
  className?: string
}

const styles: Record<StatusPillProps['status'], string> = {
  ONLINE: 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10',
  OFFLINE: 'border-gray-400/50 text-gray-400 bg-gray-400/10',
  'IN MISSION': 'border-amber-400/50 text-amber-400 bg-amber-400/10',
  COMPLETED: 'border-emerald-400/50 text-emerald-400 bg-emerald-400/10',
  'IN PROGRESS': 'border-amber-400/50 text-amber-400 bg-amber-400/10',
  PLANNED: 'border-sky-400/50 text-sky-400 bg-sky-400/10',
  NEW: 'border-tactical-danger/50 text-tactical-danger bg-tactical-danger/10',
  READ: 'border-gray-400/50 text-gray-400 bg-gray-400/10',
  ARCHIVED: 'border-gray-500/50 text-gray-500 bg-gray-500/10',
}

export default function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border px-2.5 py-0.5 font-display text-[10px] uppercase tracking-widest',
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
      {status}
    </span>
  )
}