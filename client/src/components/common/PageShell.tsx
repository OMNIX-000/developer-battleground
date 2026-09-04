import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface PageShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  className?: string
}

export default function PageShell({ title, subtitle, children, className }: PageShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className={cn('mx-auto w-full max-w-6xl px-4', className)}
    >
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-tactical-accent" />
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.25em] text-white sm:text-3xl">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="mt-2 pl-11 font-mono text-xs uppercase tracking-widest text-gray-500">
            {subtitle}
          </p>
        )}
      </header>
      {children}
    </motion.div>
  )
}