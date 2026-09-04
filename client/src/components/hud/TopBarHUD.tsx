import { memo, useMemo, useState } from 'react'
import { Bell, Volume2, VolumeX, Settings2, SlidersHorizontal, X, RotateCcw } from 'lucide-react'
import { useSettings } from '@/store/settings'
import { useNotifications } from '@/store/notifications'
import { cn } from '@/utils/helpers'
import type { GraphicsQuality } from '@/store/settings'

function TopBarHUD() {
  const {
    soundEnabled,
    toggleSound,
    notificationsEnabled,
    toggleNotifications,
    quality,
    setQuality,
  } = useSettings()
  const { notifications, push } = useNotifications()
  const [showQuality, setShowQuality] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const qualities: GraphicsQuality[] = ['LOW', 'MEDIUM', 'HIGH']

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const handleToggleNotifications = () => {
    toggleNotifications()
    push({
      title: notificationsEnabled ? 'TRANSMISSIONS OFFLINE' : 'TRANSMISSIONS ONLINE',
      subtitle: notificationsEnabled ? 'System toasts muted' : 'You will receive system toasts',
      type: 'system',
    })
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4">
      <div className="pointer-events-auto flex flex-col gap-2">
        <div className="glass-panel px-3 py-1.5 text-[10px] font-display uppercase tracking-[0.3em] text-tactical-accent">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-tactical-accent align-middle" />
          <span className="ml-2">Developer Battleground v1.0</span>
        </div>
        <div className="glass-panel px-3 py-1.5 font-mono text-[10px] text-gray-500">
          {today} // SECTOR: 9-NORTH // NEON GRID ONLINE
        </div>
      </div>

      <div className="pointer-events-auto flex items-center gap-2">
        <IconButton
          label={notificationsEnabled ? 'Notifications: ON' : 'Notifications: OFF'}
          onClick={handleToggleNotifications}
          active={notificationsEnabled}
        >
          <Bell className="h-4 w-4" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-tactical-danger text-[9px] font-bold text-white">
              {notifications.length}
            </span>
          )}
        </IconButton>

        <IconButton label="Sound: ON (Terror Ambience)" onClick={toggleSound} active={soundEnabled}>
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </IconButton>

        <div className="relative">
          <IconButton label="Graphics Settings" onClick={() => setShowQuality((v) => !v)}>
            <SlidersHorizontal className="h-4 w-4" />
          </IconButton>
          {showQuality && (
            <div className="glass-panel absolute right-0 top-full mt-2 flex flex-col gap-1 p-2">
              {qualities.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setQuality(q)
                    setShowQuality(false)
                  }}
                  className={cn(
                    'px-4 py-1.5 text-left font-display text-[10px] uppercase tracking-widest transition-colors',
                    quality === q
                      ? 'bg-tactical-accent/20 text-tactical-accent'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white',
                  )}
                >
                  {q === 'LOW' ? 'LOW (BATTERY SAVER)' : q === 'MEDIUM' ? 'MEDIUM (BALANCED)' : 'HIGH (ULTRA)'}
                </button>
              ))}
            </div>
          )}
        </div>

        <IconButton label="Settings" onClick={() => setShowSettings(true)}>
          <Settings2 className="h-4 w-4" />
        </IconButton>
      </div>

      {showSettings && (
        <SettingsPanel
          soundEnabled={soundEnabled}
          notificationsEnabled={notificationsEnabled}
          quality={quality}
          onToggleSound={toggleSound}
          onToggleNotifications={toggleNotifications}
          onQuality={setQuality}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}

function SettingsPanel({
  soundEnabled,
  notificationsEnabled,
  quality,
  onToggleSound,
  onToggleNotifications,
  onQuality,
  onClose,
}: {
  soundEnabled: boolean
  notificationsEnabled: boolean
  quality: GraphicsQuality
  onToggleSound: () => void
  onToggleNotifications: () => void
  onQuality: (q: GraphicsQuality) => void
  onClose: () => void
}) {
  const setQuality = (q: GraphicsQuality) => {
    onQuality(q)
  }

  return (
    <>
      <div className="pointer-events-auto fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="glass-panel pointer-events-auto fixed right-4 top-4 z-50 w-72 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.25em] text-tactical-accent">
            System Configuration
          </h2>
          <button
            aria-label="Close settings"
            onClick={onClose}
            className="rounded border border-white/10 p-1 text-gray-400 transition-colors hover:border-tactical-danger/50 hover:text-tactical-danger"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-3 font-mono text-xs">
          <SettingToggle label="Audio Terror" hint="Dark ambience, heartbeat, dissonant drones" checked={soundEnabled} onChange={onToggleSound} />
          <SettingToggle label="Transmissions" hint="Toast alerts + alert sound" checked={notificationsEnabled} onChange={onToggleNotifications} />

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Render Quality</span>
            <div className="grid grid-cols-3 gap-1">
              {(['LOW', 'MEDIUM', 'HIGH'] as GraphicsQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={cn(
                    'rounded border px-2 py-1.5 text-[10px] uppercase tracking-widest transition-colors',
                    quality === q
                      ? 'border-tactical-accent bg-tactical-accent/20 text-tactical-accent'
                      : 'border-white/10 text-gray-400 hover:border-tactical-accent/40 hover:text-white',
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              window.localStorage.removeItem('db_settings')
              window.location.reload()
            }}
            className="mt-2 flex items-center justify-center gap-2 rounded border border-tactical-danger/40 px-3 py-2 text-[10px] uppercase tracking-widest text-tactical-danger transition-colors hover:border-tactical-danger hover:bg-tactical-danger/10"
          >
            <RotateCcw className="h-3 w-3" /> Reset All Settings
          </button>
        </div>
      </aside>
    </>
  )
}

function SettingToggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <button onClick={onChange} className="flex items-center justify-between gap-3 rounded border border-white/10 px-3 py-2 text-left transition-colors hover:border-tactical-accent/40">
      <span className="flex flex-col">
        <span className="font-display text-[11px] uppercase tracking-[0.2em] text-gray-200">{label}</span>
        <span className="text-[10px] text-gray-500">{hint}</span>
      </span>
      <span
        className={cn(
          'relative h-4 w-8 shrink-0 rounded-full border transition-colors',
          checked ? 'border-tactical-accent bg-tactical-accent/40' : 'border-white/20 bg-black/40',
        )}
      >
        <span
          className={cn(
            'absolute top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full transition-all',
            checked ? 'left-4 bg-tactical-accent' : 'left-0.5 bg-gray-500',
          )}
        />
      </span>
    </button>
  )
}

const IconButton = memo(function IconButton({
  children,
  label,
  onClick,
  active,
}: {
  children: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
}) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'glass-panel relative flex h-9 w-9 items-center justify-center transition-colors',
        active
          ? 'border-tactical-accent/60 text-tactical-accent'
          : 'text-gray-300 hover:border-tactical-accent/50 hover:text-tactical-accent',
      )}
    >
      {children}
    </button>
  )
})

export default memo(TopBarHUD)