import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface GlassPanelProps {
  children: ReactNode
  className?: string
  corners?: boolean
}

export default function GlassPanel({ children, className, corners = true }: GlassPanelProps) {
  return (
    <div className={cn('glass-panel relative', corners && 'tactical-corners', className)}>
      {children}
    </div>
  )
}