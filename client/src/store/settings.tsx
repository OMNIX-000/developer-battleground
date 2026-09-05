import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { soundSystem } from '@/utils/sound'

export type GraphicsQuality = 'LOW' | 'MEDIUM' | 'HIGH'

interface SettingsState {
  soundEnabled: boolean
  soundVolume: number
  quality: GraphicsQuality
  notificationsEnabled: boolean
}

interface SettingsContextValue extends SettingsState {
  toggleSound: () => void
  toggleNotifications: () => void
  setQuality: (q: GraphicsQuality) => void
  setSoundVolume: (v: number) => void
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined)

const STORAGE_KEY = 'db_settings'

function loadSettings(): SettingsState {
  const defaults: SettingsState = {
    soundEnabled: false,
    soundVolume: 100,
    quality: detectQuality(),
    notificationsEnabled: true,
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    return { ...defaults, ...(JSON.parse(raw) as Partial<SettingsState>) }
  } catch {
    return defaults
  }
}

function detectQuality(): GraphicsQuality {
  const cores = navigator.hardwareConcurrency || 4
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory || 4
  if (cores <= 4 || memory <= 4) return 'LOW'
  if (cores <= 8 || memory <= 8) return 'MEDIUM'
  return 'HIGH'
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsState>(loadSettings)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (settings.soundEnabled) soundSystem.enable()
    else soundSystem.disable()
  }, [settings.soundEnabled])

  useEffect(() => {
    soundSystem.setVolume(settings.soundVolume / 100)
  }, [settings.soundVolume])

  const toggleSound = useCallback(() => {
    setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }))
  }, [])

  const toggleNotifications = useCallback(() => {
    setSettings((s) => ({ ...s, notificationsEnabled: !s.notificationsEnabled }))
  }, [])

  const setQuality = useCallback((quality: GraphicsQuality) => {
    setSettings((s) => ({ ...s, quality }))
  }, [])

  const setSoundVolume = useCallback((volume: number) => {
    setSettings((s) => ({ ...s, soundVolume: Math.min(100, Math.max(0, volume)) }))
  }, [])

  const value = useMemo(
    () => ({ ...settings, toggleSound, toggleNotifications, setQuality, setSoundVolume }),
    [settings, toggleSound, toggleNotifications, setQuality, setSoundVolume],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider')
  return ctx
}

export function useSound(): (name: 'click' | 'panel' | 'achievement' | 'mission' | 'notification') => void {
  const { soundEnabled } = useSettings()
  return useCallback(
    (name) => {
      if (!soundEnabled) return
      soundSystem.play(name)
    },
    [soundEnabled],
  )
}

export function useReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}