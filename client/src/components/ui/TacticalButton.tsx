import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { useSound } from '@/store/settings'

interface TacticalButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  ariaLabel?: string
  type?: 'button' | 'submit' | 'reset'
}

export default function TacticalButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  fullWidth = false,
  ariaLabel,
  type = 'button',
}: TacticalButtonProps) {
  const play = useSound()

  const variants: Record<string, string> = {
    primary:
      'border-tactical-accent/60 bg-tactical-accent/10 text-tactical-accent hover:bg-tactical-accent/20',
    secondary:
      'border-cyan-400/50 bg-cyan-400/5 text-cyan-400 hover:bg-cyan-400/15',
    danger:
      'border-tactical-danger/60 bg-tactical-danger/10 text-tactical-danger hover:bg-tactical-danger/20',
    ghost:
      'border-white/15 bg-white/5 text-gray-300 hover:bg-white/10',
  }

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  }

  return (
    <motion.button
      type={type}
      aria-label={ariaLabel}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      onClick={() => {
        play('click')
        onClick?.()
      }}
      disabled={disabled}
      className={cn(
        'relative clip-corner border font-display uppercase tracking-widest transition-colors duration-200 select-none',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-40 cursor-not-allowed',
        className,
      )}
    >
      {children}
    </motion.button>
  )
}