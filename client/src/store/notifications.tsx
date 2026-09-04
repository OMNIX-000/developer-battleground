import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export interface GameNotification {
  id: string
  title: string
  subtitle?: string
  xp?: number
  type: 'achievement' | 'mission' | 'system' | 'info'
}

interface NotificationContextValue {
  notifications: GameNotification[]
  push: (n: Omit<GameNotification, 'id'>) => void
  dismiss: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

let idCounter = 0

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<GameNotification[]>([])

  const push = useCallback((n: Omit<GameNotification, 'id'>) => {
    const id = `ntf-${++idCounter}`
    setNotifications((prev) => [...prev.slice(-3), { ...n, id }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((x) => x.id !== id))
    }, 4000)
  }, [])

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const value = useMemo(() => ({ notifications, push, dismiss }), [notifications, push, dismiss])

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}