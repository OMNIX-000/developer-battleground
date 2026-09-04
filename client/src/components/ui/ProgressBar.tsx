import { motion } from 'framer-motion'
import { cn } from '@/utils/helpers'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  className?: string
  colorClass?: string
  animated?: boolean
  showValue?: boolean
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  className,
  colorClass = 'bg-tactical-accent',
  animated = true,
  showValue = true,
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-1 flex items-center justify-between font-display text-xs uppercase tracking-widest text-gray-400">
          <span>{label}</span>
          {showValue && <span className="text-tactical-accent">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="relative h-2.5 w-full overflow-hidden border border-white/10 bg-black/40">
        <motion.div
          className={cn('relative h-full', colorClass)}
          initial={animated ? { width: 0 } : false}
          whileInView={animated ? { width: `${percentage}%` } : undefined}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </motion.div>
      </div>
    </div>
  )
}