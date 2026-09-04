import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home,
  User,
  Crosshair,
  Box,
  Package,
  Trophy,
  Map,
  Radio,
} from 'lucide-react'
import { useSound } from '@/store/settings'
import { cn } from '@/utils/helpers'

const navItems = [
  { to: '/', label: 'HOME', icon: Home, tooltip: 'Game Lobby' },
  { to: '/profile', label: 'PROFILE', icon: User, tooltip: 'Player Dossier' },
  { to: '/missions', label: 'MISSIONS', icon: Crosshair, tooltip: 'Mission Control' },
  { to: '/inventory', label: 'INVENTORY', icon: Box, tooltip: 'Skills Inventory' },
  { to: '/loadout', label: 'LOADOUT', icon: Package, tooltip: 'Developer Loadout' },
  { to: '/achievements', label: 'ACHIEVEMENTS', icon: Trophy, tooltip: 'Battle Record' },
  { to: '/journey', label: 'JOURNEY', icon: Map, tooltip: 'Journey Map' },
  { to: '/contact', label: 'CONTACT', icon: Radio, tooltip: 'Communication Terminal' },
]

export default function BottomNav() {
  const play = useSound()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-tactical-accent/20 bg-black/60 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-stretch justify-between gap-1 px-2 py-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            title={item.tooltip}
            aria-label={item.label}
            onClick={() => play('click')}
            className={({ isActive }) =>
              cn(
                'group relative flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-2 font-display text-[9px] uppercase tracking-widest transition-colors',
                isActive
                  ? 'text-tactical-accent'
                  : 'text-gray-500 hover:text-gray-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 border border-tactical-accent/40 bg-tactical-accent/10"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <item.icon className="relative z-10 h-5 w-5 transition-transform group-hover:scale-110" strokeWidth={1.8} />
                <span className="relative z-10 hidden sm:inline">{item.label}</span>
                <span className="relative z-10 sm:hidden">{item.tooltip.split(' ')[0]}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}